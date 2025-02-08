import { Ryu } from "./entities/fighters/Ryu.js"; 
import { Stage } from "./entities/Stage.js";
import { Dha } from "./entities/fighters/dha.js";
import { FpsCounter } from "./entities/FpsCounter.js";

const GameViewport = {
    WIDTH: 384,
    HEIGHT: 224,
};

window.addEventListener('load', function() {
    const canvasEl = document.querySelector('canvas');
    const context = canvasEl.getContext('2d');

    canvasEl.width = GameViewport.WIDTH;
    canvasEl.height = GameViewport.HEIGHT;

    const entities = [
      new Stage(),
      new Ryu(80, 110, 100),
      new Dha(80,110,-150),
      new FpsCounter(),
    ]

    let previousTime = 0;
    let secondsPassed = 0;

    function frame(time) { 
        window.requestAnimationFrame(frame);

        secondsPassed = (time - previousTime) / 1000; 
        previousTime = time;

       for (const entitity of entities) {
        entitity.update(secondsPassed,context);
       }
       
       for (const entitity of entities) {
        entitity.draw(context); 
       }

        console.log(time);
    }

    window.requestAnimationFrame(frame);
});