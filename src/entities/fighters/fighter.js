import { Control } from "../../constants/control.js";
import { FIGHTER_START_DISTANCE, FighterDirection, FighterState, FrameDelay, PUSH_FRICTION} from "../../constants/fighter.js";
import { STAGE_FLOOR, STAGE_MID_POINT, STAGE_PADDING } from "../../constants/stage.js";
import * as control from "../../InputHandler.js";
import { rectsOverlap } from "../../utils/Collisions.js";
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

        this.pushBox = { x: 0, y: 0, width: 0, height: 0 };

        this.states = {
            [FighterState.IDLE]: {
                init: this.handleIdleInit.bind(this),
                update: this.handleIdleState.bind(this),
                validFrom: [undefined,
                    FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD,
                    FighterState.JUMP_UP, FighterState.JUMP_FORWARD, FighterState.JUMP_BACKWARD,
                    FighterState.CROUCH_UP, FighterState.IDLE_TURN, FighterState.LIGHT_PUNCH,
                    FighterState.MEDIUM_PUNCH, FighterState.HEAVY_PUNCH,
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
                init: this.handleStandardLightAttackInit.bind(this),
                update: this.handleStandardLightPunchState.bind(this),
                validFrom: [FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD],
            },
            [FighterState.MEDIUM_PUNCH]: {
                init: this.handleStandardMediumAttackInit.bind(this),
                update: this.handleStandardMediumPunchState.bind(this),
                validFrom: [FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD],
            },
            [FighterState.HEAVY_PUNCH]: {
                init: this.handleStandardHeavyAttackInit.bind(this),
                update: this.handleStandardMediumPunchState.bind(this),
                validFrom: [FighterState.IDLE, FighterState.WALK_FORWARD, FighterState.WALK_BACKWARD],
            },
        };

        this.changeState(FighterState.IDLE);
    }

    hasCollidedWithOpponent = () => rectsOverlap(
        this.position.x + this.pushBox.x, this.position.y + this.pushBox.y,
        this.pushBox.width, this.pushBox.height,
        this.opponent.position.x + this.opponent.pushBox.x,
        this.opponent.position.y + this.opponent.pushBox.y,
        this.opponent.pushBox.width, this.opponent.pushBox.height, 
    );

    getDirection () { 
        if (this.position.x + this.pushBox.x + this.pushBox.width >= this.opponent.position.x + this.pushBox.x) {
            return FighterDirection.LEFT;
        } else if (this.pushBox.x + this.pushBox.x <= this.opponent.position.x + this.opponent.pushBox.x + this.opponent.pushBox.width) {
            return FighterDirection.RIGHT;
        }
        return this.direction;
    }

    getPushBox(frameKey) {
        const [, [x, y, width, height] = [0,0,0,0]] = this.frames.get(frameKey);

        return{ x, y, width, height };
    }

    changeState(newState) { 
        console.log ("Coming2", newState)
        if (newState == this.currentState
            || !this.states[newState].validFrom.includes(this.currentState)) return;

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

        this.direction = this.getDirection();
    }

    handleWalkBackwardsState() {
        if (!control.isBackward(this.playerId, this.direction)) this.changeState(FighterState.IDLE);
        if (control.isUp(this.playerId)) this.changeState(FighterState.JUMP_BACKWARD);
        if (control.isDown(this.playerId)) this.changeState(FighterState.CROUCH_DOWN);

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

    updateStageConstraints(time, context, camera) {
        if(this.position.x > camera.position.x + context.canvas.width - this.pushBox.width) {
            this.position.x = camera.position.x + context.canvas.width - this.pushBox.width;
        }

        if(this.position.x < camera.position.x + this.pushBox.width) {           
            this.position.x = camera.position.x + this.pushBox.width;
        }

        if (this.hasCollidedWithOpponent()) {
            if (this.position.x <= this.opponent.position.x) {
                this.position.x = Math.max(
                    (this.opponent.position.x + this.opponent.pushBox.x) - (this.pushBox.x + this.pushBox.width),
                    camera.position.x + this.pushBox.width,
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
                    (this.opponent.position.x + this.opponent.pushBox.x + this.opponent.pushBox.width) 
                    + (this.pushBox.width + this.pushBox.x),
                    camera.position.x + context.canvas.width - this.pushBox.width,
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
        const [frameKey, frameDelay] = animation[this.animationFrame];
   
        if(time.previous > this.animationTimer + frameDelay) {
            this.animationTimer = time.previous;
            
            if (frameDelay > FrameDelay.FREEZE) {
                this.animationFrame ++;
                this.pushBox = this.getPushBox(frameKey);
            }
            if (this.animationFrame >= animation.length) {
                this.animationFrame = 0;
            }
        }
    }

    update(time, context, camera) {
        this.position.x += (this.velocity.x * this.direction) * time.secondsPassed;
        this.position.y += this.velocity.y * time.secondsPassed;

        this.states[this.currentState].update(time, context);
        this.updateAnimation(time);
        this.updateStageConstraints(time, context, camera);
    }

    drawDebug(context, camera) {
        const [frameKey] = this.animations[this.currentState][this.animationFrame];
        const pushBox = this.getPushBox(frameKey);

        context.lineWidth = 1;

        // Push Box
        context.beginPath();
        context.strokeStyle = '#55FF55';
        context.fillStyle = '#55FF5555';
        context.fillRect(
            Math.floor(this.position.x + (pushBox.x * this.direction) - camera.position.x) + 0.5,
            Math.floor(this.position.y + pushBox.y - camera.position.y) + 0.5,
            pushBox.width * this.direction,
            pushBox.height,
        );
        context.rect(
            Math.floor(this.position.x + (pushBox.x * this.direction) - camera.position.x) + 0.5,
            Math.floor(this.position.y + pushBox.y - camera.position.y) + 0.5,
            pushBox.width * this.direction,
            pushBox.height,
        );
        context.stroke();

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