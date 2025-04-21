import { Ryu } from "./entities/fighters/Ryu.js"; 
import { Stage } from "./entities/Stage.js";
import { Dha } from "./entities/fighters/dha.js";
import { FpsCounter } from "./entities/FpsCounter.js";
import { STAGE_FLOOR } from "./constants/stage.js";
import { FighterDirection } from "./constants/fighter.js";

window.addEventListener('load', function() {
    const canvasEl = document.querySelector('canvas');
    const context = canvasEl.getContext('2d');

    context.imageSmoothingEnabled = false;

    const entities = [
      new Stage(),
      new Ryu(104, STAGE_FLOOR, FighterDirection.LEFT),
      new Dha(280,STAGE_FLOOR, FighterDirection.RIGHT),
      new FpsCounter(),
    ]
    let frametime = {
        previous: 0,
        secondsPassed: 0,
    };
    function frame(time) { 
        window.requestAnimationFrame(frame);
        frametime = {
        secondsPassed: (time - frametime.previous) / 1000, 
        previous: time,
        }
       for (const entitity of entities) {
        entitity.update(frametime,context);
       }
       
       for (const entitity of entities) {
        entitity.draw(context); 
       }

        console.log(time);
    }

    window.requestAnimationFrame(frame);
});