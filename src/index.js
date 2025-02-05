import { drawRyu, updateRyu } from "./Ryu.js"; 
import { drawBackground } from "./Stage.js";
import { drawDha, updateDha } from "./dha.js";

const GameViewport = {
    WIDTH: 384,
    HEIGHT: 224,
};

window.onload = function() {
    const canvasEl = document.querySelector('canvas');
    const context = canvasEl.getContext('2d');

    canvasEl.width = GameViewport.WIDTH;
    canvasEl.height = GameViewport.HEIGHT;

    function frame() { 
        updateRyu(context);
        updateDha(context);
        
        drawBackground(context);
        drawRyu(context);
        drawDha(context);

        window.requestAnimationFrame(frame);
    }

    window.requestAnimationFrame(frame);
}