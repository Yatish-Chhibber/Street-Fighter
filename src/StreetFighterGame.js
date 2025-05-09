import { Ryu } from "./entities/fighters/Ryu.js"; 
import { Stage } from "./entities/Stage.js";
import { Dha } from "./entities/fighters/dha.js";
import { FpsCounter } from "./entities/FpsCounter.js";
import { STAGE_FLOOR } from "./constants/stage.js";
import { FighterDirection} from "./constants/fighter.js";
import { registerKeyboardEvents } from "./InputHandler.js";
import { Shadow } from "./entities/fighters/Shadow.js";

export class StreetFighterGame {
    constructor() {
        this.context = this.getContext();
        this.fighters = [
            new Ryu(104, STAGE_FLOOR, FighterDirection.LEFT, 0),
            new Dha(280,STAGE_FLOOR, FighterDirection.RIGHT, 1),
        ];

        this.fighters[0].opponent = this.fighters[1];
        this.fighters[1].opponent = this.fighters[0];
    
        this.entities = [
          new Stage(),
          ...this.fighters.map(fighter => new Shadow(fighter)),
          ...this.fighters,
          new FpsCounter(),
        ]
        this.frametime = {
            previous: 0,
            secondsPassed: 0,
        };
    }

    getContext () {
    const canvasEl = document.querySelector('canvas');
    const context = canvasEl.getContext('2d');

    context.imageSmoothingEnabled = false;
    return context;
    }

    update () {
        for (const entitity of this.entities) {
            entitity.update(this.frametime,this.context);
        }
    }

    draw () {
        for (const entitity of this.entities) {
            entitity.draw(this.context); 
        }
    }

    frame(time) { 
        window.requestAnimationFrame(this.frame.bind(this));
        this.frametime = {
        secondsPassed: (time - this.frametime.previous) / 1000, 
        previous: time,
        }

        this.update();
        this.draw();
    }

    start() {
        registerKeyboardEvents();
        window.requestAnimationFrame(this.frame.bind(this));
    }
}