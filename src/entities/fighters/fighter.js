import { FIGHTER_START_DISTANCE, FighterDirection, FighterState, FrameDelay, PUSH_FRICTION, FighterAttackType} from "../../constants/fighter.js";
import { STAGE_FLOOR, STAGE_MID_POINT, STAGE_PADDING } from "../../constants/stage.js";
import * as control from "../../InputHandler.js";
import { boxOverlap, getActualBoxDimensions, rectsOverlap } from "../../utils/collisions.js";
import { isControlDown } from "../../InputHandler.js";

export class Fighter {
    constructor(name, playerId) {
        this.name = name;
        this.playerId = playerId;
        this.position = { 
            x: STAGE_MID_POINT + STAGE_PADDING + (playerId == 0 ? -FIGHTER_START_DISTANCE : FIGHTER_START_DISTANCE), 
            y: STAGE_FLOOR 
        };
        this.velocity = { x: 0, y: 0 };
        this.initialVelocity = {};
        this.direction = playerId == 0 ? FighterDirection.RIGHT : FighterDirection.LEFT;
        this.gravity = 0;

        this.frames = new Map();
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.animations = {};

        this.image = new Image();

        this.opponent;

        this.boxes = {
            push: { x: 0, y: 0, width: 0, height: 0 },
            hurt: [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
            hit: { x: 0, y: 0, width: 0, height: 0 },
        };

        this.states = {
            [FighterState.IDLE]: {
                init: this.handleIdleInit.bind(this),
                update: this.handleIdleState.bind(this),
                validFrom: [undefined,
                    FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD,
                    FighterState.JUMP_UP, FighterState.JUMP_FORWARD, FighterState.JUMP_BACKWARD,
                    FighterState.CROUCH_UP, FighterState.IDLE_TURN, FighterState.LIGHT_PUNCH,
                    FighterState.MEDIUM_PUNCH, FighterState.HEAVY_PUNCH, FighterState.LIGHT_KICK,
                    FighterState.MEDIUM_KICK, FighterState.HEAVY_KICK,
                ],
            },
            [FighterState.WALK_FORWARD]: {
                init: this.handleMoveInit.bind(this),
                update: this.handleWalkForwardState.bind(this),
                validFrom: [FighterState.IDLE, FighterState.WALK_BACKWARD,],
            },
            [FighterState.WALK_BACKWARD]: {
                init: this.handleMoveInit.bind(this),
                update: this.handleWalkBackwardsState.bind(this),
                validFrom: [FighterState.IDLE, FighterState.WALK_FORWARD,],
            },
            [FighterState.JUMP_UP]: {
                init: this.handleJumpInit.bind(this),
                update: this.handleJumpState.bind(this),
                validFrom: [FighterState.IDLE, FighterState.JUMP_UP],
            },
            [FighterState.JUMP_FORWARD]: {
                init: this.handleJumpInit.bind(this),
                update: this.handleJumpState.bind(this),
                validFrom: [FighterState.IDLE, FighterState.WALK_FORWARD],
            },
            [FighterState.JUMP_BACKWARD]: {
                init: this.handleJumpInit.bind(this),
                update: this.handleJumpState.bind(this),
                validFrom: [FighterState.IDLE, FighterState.WALK_BACKWARD],
            },
            [FighterState.CROUCH]: {
                init: () => { },
                update: this.handleCrouchState.bind(this),
                validFrom: [FighterState.CROUCH_DOWN, FighterState.CROUCH_TURN],
            },
            [FighterState.CROUCH_DOWN]: {
                init: this.handleCrouchDownInit.bind(this),
                update: this.handleCrouchDownState.bind(this),
                validFrom: [FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD],
            },
            [FighterState.CROUCH_UP]: {
                init: () => { },
                update: this.handleCrouchUpState.bind(this),
                validFrom: [FighterState.CROUCH],
            },
            [FighterState.IDLE_TURN]: {
            init: () => { },
            update: this.handleIdleTurnState.bind(this),
            validFrom: [FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD],
            },
            [FighterState.CROUCH_TURN]: {
            init: () => { },
            update: this.handleCrouchTurnState.bind(this),
            validFrom: [FighterState.CROUCH],
            },
            [FighterState.LIGHT_PUNCH]: {
                attackType: FighterAttackType.PUNCH,
                init: this.handleStandardLightAttackInit.bind(this),
                update: this.handleStandardLightPunchState.bind(this),
                validFrom: [FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD],
            },
            [FighterState.MEDIUM_PUNCH]: {
                attackType: FighterAttackType.PUNCH,
                init: this.handleStandardMediumAttackInit.bind(this),
                update: this.handleStandardMediumPunchState.bind(this),
                validFrom: [FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD],
            },
            [FighterState.HEAVY_PUNCH]: {
                attackType: FighterAttackType.PUNCH,
                init: this.handleStandardHeavyAttackInit.bind(this),
                update: this.handleStandardMediumPunchState.bind(this),
                validFrom: [FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD],
            },
            [FighterState.LIGHT_KICK]: {
                attackType: FighterAttackType.KICK,
                init: this.handleStandardLightAttackInit.bind(this),
                update: this.handleStandardLightKickState.bind(this),
                validFrom: [FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD],
            },
            [FighterState.MEDIUM_KICK]: {
                attackType: FighterAttackType.KICK,
                init: this.handleStandardMediumAttackInit.bind(this),
                update: this.handleStandardMediumKickState.bind(this),
                validFrom: [FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD],
            },
            [FighterState.HEAVY_KICK]: {
                attackType: FighterAttackType.KICK,
                init: this.handleStandardHeavyAttackInit.bind(this),
                update: this.handleStandardMediumKickState.bind(this),
                validFrom: [FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD],
            },
        };

        this.changeState(FighterState.IDLE);
    }

    hasCollidedWithOpponent = () => rectsOverlap(
        this.position.x + this.boxes.push.x, this.position.y + this.boxes.push.y,
        this.boxes.push.width, this.boxes.push.height,
        this.opponent.position.x + this.opponent.boxes.push.x,
        this.opponent.position.y + this.opponent.boxes.push.y,
        this.opponent.boxes.push.width, this.opponent.boxes.push.height, 
    );

    getDirection () { 
        if (this.position.x + this.boxes.push.x + this.boxes.push.width >= this.opponent.position.x + this.opponent.boxes.push.x) {
            return FighterDirection.LEFT;
        } else if (this.position.x + this.boxes.push.x <= this.opponent.position.x + this.opponent.boxes.push.x + this.opponent.boxes.push.width) {
            return FighterDirection.RIGHT;
        }
        return this.direction;
    }

    getBoxes(frameKey) {
        const [, 
            [pushX = 0, pushY = 0, pushWidth = 0, pushHeight = 0] = [],
            [head = [0, 0, 0, 0], body = [0, 0, 0, 0], feet = [0, 0, 0, 0]] = [],
            [hitX = 0, hitY = 0, hitWidth = 0, hitHeight = 0] = [],
        ] = this.frames.get(frameKey);

        return {
            push: { x: pushX, y: pushY, width: pushWidth, height: pushHeight },
            hurt: [head, body, feet],
            hit: { x: hitX, y: hitY, width: hitWidth, height: hitHeight },
        };
    }

    changeState(newState) { 
        console.log ("Coming2", newState)
        if (newState == this.currentState
            || !this.states[newState].validFrom.includes(this.currentState)) {
                console.warn(`Illegal transition from "${this.currentState}" to "${newState}"`);
                return;
            }

        this.currentState = newState;
        this.animationFrame = 0;

        this.states[this.currentState].init();
    }
    handleIdleInit() {
        this.velocity.x = 0;
        this.velocity.y = 0;
    }

    handleMoveInit() {
        this.velocity.x = this.initialVelocity.x[this.currentState] ?? 0;
    }

    handleJumpInit() {
        this.velocity.y = this.initialVelocity.jump;
        this.handleMoveInit();
    }

    handleCrouchDownInit() {
        this.handleIdleInit();
    }

    handleStandardLightAttackInit() {
        this.handleIdleInit();
    }

     handleStandardMediumAttackInit() {
        this.handleIdleInit();
    }

     handleStandardHeavyAttackInit() {
        this.handleIdleInit();
    }

    handleIdleState() {
        if (control.isUp(this.playerId)) this.changeState(FighterState.JUMP_UP);
        if (control.isDown(this.playerId)) this.changeState(FighterState.CROUCH_DOWN);
        if (control.isBackward(this.playerId, this.direction)) this.changeState(FighterState.WALK_BACKWARD);
        if (control.isForward(this.playerId, this.direction)) this.changeState(FighterState.WALK_FORWARD);
        if (control.isLightPunch(this.playerId)) {
            this.changeState(FighterState.LIGHT_PUNCH);
        }
        if (control.isMediumPunch(this.playerId)) {
            this.changeState(FighterState.MEDIUM_PUNCH);
        }
        if (control.isHeavyPunch(this.playerId)) {
            this.changeState(FighterState.HEAVY_PUNCH);
        }
        if (control.isLightKick(this.playerId)) {
            this.changeState(FighterState.LIGHT_KICK);
        }
        if (control.isMediumKick(this.playerId)) {
            this.changeState(FighterState.MEDIUM_KICK);
        }
        if (control.isHeavyKick(this.playerId)) {
            this.changeState(FighterState.HEAVY_KICK);
        }

        const newDirection = this.getDirection();

        if (newDirection != this.direction) {
            this.direction = newDirection;
            this.changeState(FighterState.IDLE_TURN);
        }
    }

    handleWalkForwardState() {
        if (!control.isForward(this.playerId, this.direction)) this.changeState(FighterState.IDLE);
        if (control.isUp(this.playerId)) this.changeState(FighterState.JUMP_FORWARD);
        if (control.isDown(this.playerId)) this.changeState(FighterState.CROUCH_DOWN);

        if (control.isLightPunch(this.playerId)) {
            this.changeState(FighterState.LIGHT_PUNCH);
        }
        if (control.isMediumPunch(this.playerId)) {
            this.changeState(FighterState.MEDIUM_PUNCH);
        }
        if (control.isHeavyPunch(this.playerId)) {
            this.changeState(FighterState.HEAVY_PUNCH);
        }
        if (control.isLightKick(this.playerId)) {
            this.changeState(FighterState.LIGHT_KICK);
        }
        if (control.isMediumKick(this.playerId)) {
            this.changeState(FighterState.MEDIUM_KICK);
        }
        if (control.isHeavyKick(this.playerId)) {
            this.changeState(FighterState.HEAVY_KICK);
        }

        this.direction = this.getDirection();
    }

    handleWalkBackwardsState() {
        if (!control.isBackward(this.playerId, this.direction)) this.changeState(FighterState.IDLE);
        if (control.isUp(this.playerId)) this.changeState(FighterState.JUMP_BACKWARD);
        if (control.isDown(this.playerId)) this.changeState(FighterState.CROUCH_DOWN);

        if (control.isLightPunch(this.playerId)) {
            this.changeState(FighterState.LIGHT_PUNCH);
        }
        if (control.isMediumPunch(this.playerId)) {
            this.changeState(FighterState.MEDIUM_PUNCH);
        }
        if (control.isHeavyPunch(this.playerId)) {
            this.changeState(FighterState.HEAVY_PUNCH);
        }
        if (control.isLightKick(this.playerId)) {
            this.changeState(FighterState.LIGHT_KICK);
        }
        if (control.isMediumKick(this.playerId)) {
            this.changeState(FighterState.MEDIUM_KICK);
        }
        if (control.isHeavyKick(this.playerId)) {
            this.changeState(FighterState.HEAVY_KICK);
        }

        this.direction = this.getDirection();
    }

    handleCrouchDownState() {
        console.log("unga bunga",{FighterState,this:this,animations:this.animations,currentState:this.currentState,animationFrame:this.animationFrame})
        if (this.animations[this.currentState][this.animationFrame][1] == FrameDelay.TRANSITION) {
            this.changeState(FighterState.CROUCH);
        }
    }

    handleCrouchUpState() {
        if (this.animations[this.currentState][this.animationFrame][1] == FrameDelay.TRANSITION) {
            this.changeState(FighterState.IDLE);
        }
    }

    handleJumpState(time) {
        this.velocity.y += this.gravity * time.secondsPassed;

        if(this.position.y > STAGE_FLOOR) {
            this.position.y = STAGE_FLOOR;
            this.changeState(FighterState.IDLE);
        }
    }

    handleCrouchState() {
        console.log ("coming", {control,isDown:control.isDown(this.playerId), this:this})
        if (!control.isDown(this.playerId)) {this.changeState(FighterState.CROUCH_UP); this.changeState(FighterState.IDLE);}

        const newDirection = this.getDirection();

        if (newDirection != this.direction) {
            this.direction = newDirection;
            this.changeState(FighterState.CROUCH_TURN);
        } 
    }

    
    handleIdleTurnState() {
        this.handleIdleState();
        
        if (this.animations[this.currentState][this.animationFrame][1] != FrameDelay.TRANSITION) return;
        this.changeState(FighterState.IDLE);
    }
    
    handleCrouchTurnState() {
        this.handleCrouchState();
        
        if (this.animations[this.currentState][this.animationFrame][1] != FrameDelay.TRANSITION) return;
        this.changeState(FighterState.CROUCH);
    }

    handleStandardLightPunchState () {
        if (this.animationFrame < 2) return;
        if (control.isLightPunch(this.playerId)) this.animationFrame = 0;
        if(this.animations[this.currentState][this.animationFrame][1] != FrameDelay.TRANSITION) return;
        this.changeState(FighterState.IDLE);
    }

    handleStandardMediumPunchState () {
        if (this.animations[this.currentState][this.animationFrame][1] != FrameDelay.TRANSITION) return;
        this.changeState(FighterState.IDLE);
    }
    handleStandardLightKickState () {
        if (this.animationFrame < 2) return;
        if (control.isLightKick(this.playerId)) this.animationFrame = 0;
        if(this.animations[this.currentState][this.animationFrame][1] != FrameDelay.TRANSITION) return;
        this.changeState(FighterState.IDLE);
    }

    handleStandardMediumKickState () {
        if (this.animations[this.currentState][this.animationFrame][1] != FrameDelay.TRANSITION) return;
        this.changeState(FighterState.IDLE);
    }

    updateStageConstraints(time, context, camera) {
        if(this.position.x > camera.position.x + context.canvas.width - this.boxes.push.width) {
            this.position.x = camera.position.x + context.canvas.width - this.boxes.push.width;
        }

        if(this.position.x < camera.position.x + this.boxes.push.width) {           
            this.position.x = camera.position.x + this.boxes.push.width;
        }

        if (this.hasCollidedWithOpponent()) {
            if (this.position.x <= this.opponent.position.x) {
                this.position.x = Math.max(
                    (this.opponent.position.x + this.opponent.boxes.push.x) - (this.boxes.push.x + this.boxes.push.width),
                    camera.position.x + this.boxes.push.width,
                );

                if ([
                    FighterState.IDLE, FighterState.CROUCH, FighterState.JUMP_UP,
                    FighterState.JUMP_FORWARD, FighterState.JUMP_BACKWARD,
                ].includes(this.opponent.currentState)) {
                    this.opponent.position.x += PUSH_FRICTION * time.secondsPassed;
                }
            }

            if (this.position.x >= this.opponent.position.x) {
                this.position.x = Math.min(
                    (this.opponent.position.x + this.opponent.boxes.push.x + this.opponent.boxes.push.width) 
                    + (this.boxes.push.width + this.boxes.push.x),
                    camera.position.x + context.canvas.width - this.boxes.push.width,
                );

            if ([
                FighterState.IDLE, FighterState.CROUCH, FighterState.JUMP_UP,
                FighterState.JUMP_FORWARD, FighterState.JUMP_BACKWARD,
            ].includes(this.opponent.currentState)) {
                this.opponent.position.x -= PUSH_FRICTION * time.secondsPassed;
            }
            }
        }
    }
    
    updateAnimation(time) {
        const animation = this.animations[this.currentState];
        const [, frameDelay] = animation[this.animationFrame];
   
        if(time.previous <= this.animationTimer + frameDelay) return;
            this.animationTimer = time.previous;
            
        if (frameDelay <= FrameDelay.FREEZE) return;

        this.animationFrame ++;   
        if (this.animationFrame >= animation.length) this.animationFrame = 0;

        this.boxes = this.getBoxes(animation[this.animationFrame][0]);
    }

    updateAttackBoxCollided(time) {
        if (!this.states[this.currentState].attackType) return;

        const actualHitBox = getActualBoxDimensions(this.position, this.direction, this.boxes.hit);
        for (const hurt of this.opponent.boxes.hurt) {
            const [x, y, width, height] = hurt;
            const actualOpponentHurtBox = getActualBoxDimensions(
                this.opponent.position,
                this.opponent.direction,
                { x, y, width, height },
            );

            if(!boxOverlap(actualHitBox, actualOpponentHurtBox)) return;

            const hurtIndex = this.opponent.boxes.hurt.indexOf(hurt);
            const hurtName = ['head', 'body', 'feet'];

            console.log("Attack",`${this.name} has hit ${this.opponent.name}'s ${hurtName[hurtIndex]}`);
        }
    }

    update(time, context, camera) {
        this.position.x += (this.velocity.x * this.direction) * time.secondsPassed;
        this.position.y += this.velocity.y * time.secondsPassed;

        this.states[this.currentState].update(time, context);
        this.updateAnimation(time);
        this.updateStageConstraints(time, context, camera);
        this.updateAttackBoxCollided(time);
    }

    drawDebugBox(context, camera, dimensions, baseColor) {
        if (!Array.isArray(dimensions)) return;

        const [x = 0, y = 0, width = 0, height = 0] = dimensions;

        context.beginPath();
        context.strokeStyle = baseColor + 'AA';
        context.fillStyle = baseColor + '44';
        context.fillRect(
            Math.floor(this.position.x + (x * this.direction) - camera.position.x) + 0.5,
            Math.floor(this.position.y + y - camera.position.y) + 0.5,
            width * this.direction,
            height,
        );
        context.rect(
            Math.floor(this.position.x + (x * this.direction) - camera.position.x) + 0.5,
            Math.floor(this.position.y + y - camera.position.y) + 0.5,
            width * this.direction,
            height,
        );
        context.stroke();
    }

    drawDebug(context, camera) {
        const [frameKey] = this.animations[this.currentState][this.animationFrame];
        const boxes = this.getBoxes(frameKey);

        context.lineWidth = 1;

        // Push Box
        this.drawDebugBox(context, camera, Object.values(boxes.push), '#55FF55');

        //Hurt Boxes
        for (const hurtBox of boxes.hurt) {
            this.drawDebugBox(context, camera, hurtBox, '#7777FF')
        }

        // Hit Box
        this.drawDebugBox(context, camera, Object.values(boxes.hit), '#FF0000');

        //Origin
        context.beginPath();
        context.strokeStyle = 'white';
        context.moveTo(Math.floor(this.position.x - camera.position.x) - 4.5, Math.floor(this.position.y));
        context.lineTo(Math.floor(this.position.x - camera.position.x) + 4.5, Math.floor(this.position.y));
        context.moveTo(Math.floor(this.position.x - camera.position.x), Math.floor(this.position.y) - 4.5);
        context.lineTo(Math.floor(this.position.x - camera.position.x), Math.floor(this.position.y) + 4.5);
        context.stroke();
    }

    draw(context, camera) {
        const [frameKey] = this.animations[this.currentState][this.animationFrame];
        const [[
            [x, y, width, height],
            [originX,originY],
        ]] = this.frames.get(frameKey);

        context.scale(this.direction, 1);
        context.drawImage(
            this.image, 
            x, y, 
            width, height, 
            Math.floor((this.position.x - camera.position.x) * this.direction) - originX, 
            Math.floor(this.position.y - camera.position.y) - originY, 
            width, height
        );
        context.setTransform(1,0,0,1,0,0);

        this.drawDebug(context, camera);
    }
}