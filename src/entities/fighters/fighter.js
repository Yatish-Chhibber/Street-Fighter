import { FighterDirection, FighterState } from "../../constants/fighter.js";

export class Fighter {
    constructor(name, x, y, direction) {
        this.name = name;
        this.image = new Image();
        this.frames = new Map();
        this.position = { x, y };
        this.direction = direction;
        this.velocity = 150 * direction;
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.currentState = FighterState.WALK_FORWARD;
        this.animations = {};

        this.states = {
            [FighterState.WALK_FORWARD]: {
                init: this.handleWalkForwardInit.bind(this),
                update: this.handleWalkForwardState.bind(this),
            },
            [FighterState.WALK_BACKWARD]: {
                init: this.handleWalkBackwardsInit.bind(this),
                update: this.handleWalkBackwardsState.bind(this),
            },
        }
    }

    changeState(newState) { 
        //this.velocity * this.direction < 0 ? FighterState.WALK_BACKWARD : FighterState.WALK_FORWARD;

        this.currentState = newState;
        this.animationFrame = 0;

        this.states[this.currentState].init();
    }
    handleWalkForwardInit() {
        this.velocity = 150;
    }

    handleWalkForwardState() {

    }

    handleWalkBackwardsInit() {
        this.velocity = -150;
    }

    handleWalkBackwardsState() {

    }

    updateStageConstraints(context) {
        const WIDTH = 32;

        if(this.position.x > context.canvas.width - WIDTH) {
            this.position.x = context.canvas.width - WIDTH;
        }

        if(this.position.x < WIDTH) {           
            this.position.x = WIDTH;
        }
    }

    update(time, context) {
        if(time.previous > this.animationTimer + 60 ){
        this.animationTimer = time.previous;

        this.animationFrame++;
        if (this.animationFrame > 5) this.animationFrame = 1;
        }

        this.position.x += this.velocity * time.secondsPassed;


        this.states[this.currentState].update(time, context);
        this.updateStageConstraints(context);
    }

    drawDebug(context) {
        context.lineWidth = 1;

        context.beginPath();
        context.strokeStyle = 'white';
        context.moveTo(Math.floor(this.position.x) - 4.5, Math.floor(this.position.y));
        context.lineTo(Math.floor(this.position.x) + 4.5, Math.floor(this.position.y));
        context.moveTo(Math.floor(this.position.x), Math.floor(this.position.y) - 4.5);
        context.lineTo(Math.floor(this.position.x), Math.floor(this.position.y) + 4.5);
        context.stroke();
    }

    draw(context) {
        const [
            [x, y, width, height],
            [originX,originY],
        ] = this.frames.get(this.animations[this.currentState][this.animationFrame]);

        context.scale(this.direction, 1);
        context.drawImage(
            this.image, 
            x, y, 
            width, height, 
            Math.floor(this.position.x * this.direction) - originX, Math.floor(this.position.y) - originY, 
            width, height
        );
        context.setTransform(1,0,0,1,0,0);

        this.drawDebug(context);
    }
}