import { Ryu } from "./entities/fighters/Ryu.js"; 
import { Stage } from "./entities/stage/Stage.js";
import { Dha } from "./entities/fighters/dha.js";
import { FpsCounter } from "./entities/FpsCounter.js";
import { STAGE_FLOOR, STAGE_PADDING, STAGE_MID_POINT } from "./constants/stage.js";
import { FIGHTER_START_DISTANCE, FighterDirection} from "./constants/fighter.js";
import { registerKeyboardEvents } from "./InputHandler.js";
import { Shadow } from "./entities/fighters/Shadow.js";
import { StatusBar } from "./entities/overlays/StatusBar.js";
import { Camera } from "./Camera.js";

export class StreetFighterGame {
    constructor() {
        this.context = this.getContext();
        this.fighters = [
            new Ryu(0),
            new Dha(1),
        ];

        this.stage = new Stage();

        this.fighters[0].opponent = this.fighters[1];
        this.fighters[1].opponent = this.fighters[0];

        this.camera = new Camera(STAGE_MID_POINT + STAGE_PADDING - (this.context.canvas.width / 2), 16, this.fighters);
    
        this.entities = [
          ...this.fighters.map(fighter => new Shadow(fighter)),
          ...this.fighters,
          new FpsCounter(),
          new StatusBar(this.fighters),
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
        this.camera.update(this.frametime, this.context);
        this.stage.update(this.frametime, this.context);

        for (const entitity of this.entities) {
            entitity.update(this.frametime,this.context, this.camera);
        }
    }

    draw () {
        this.stage.drawBackground(this.context, this.camera);
        for (const entitity of this.entities) {
            entitity.draw(this.context, this.camera); 
        }
        this.stage.drawForeground(this.context, this.camera);
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