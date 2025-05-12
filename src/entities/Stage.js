import { FRAME_TIME } from "../constants/game.js";

export class Stage {
    constructor() {
        this.image = document.querySelector('img[alt="stage"]');

        this.frames = new Map([
            ['stage-background', [72, 208, 768, 176]],
            ['stage-boat', [8, 16, 521, 180]],
            ['stage-floor', [8, 392, 896, 72]],
        ]);

        this.boat = {
            position: { x: 0, y: 0 },
            animationFrame: 0,
            animationTimer: 0,
            animationDelay: 22,
            animation: [0, -1, -2, -3, -4, -3, -2, -1],
        }
    }

    updateBoat(time) {
        console.log({prev: time.previous, timer: this.boat.animationTimer, delay: this.boat.animationDelay, frame: this.boat.animationFrame, length: this.boat.animation.length, frametime: FRAME_TIME}, "update boat")
        if (time.previous > this.boat.animationTimer + (this.boat.animationDelay * FRAME_TIME)) {
            this.boat.animationTimer = time.previous;
            this.boat.animationFrame += 1;
            this.boat.animationDelay = 22 + (Math.random() * 16 - 8);
        }

        if (this.boat.animationFrame >= this.boat.animation.length) {
            this.boat.animationFrame = 0;
        }
    }

    update(time) {
        this.updateBoat(time);
    }

     drawFrame(context, frameKey, x, y) {
        const [sourceX, sourceY, sourceWidth, sourceHeight] = this.frames.get(frameKey);

        context.drawImage(
            this.image,
            sourceX, sourceY, sourceWidth, sourceHeight,
            x, y, sourceWidth, sourceHeight,
        );
    }

    drawBoat(context, camera) {
        this.boat.position = {
           x: Math.floor(150 - (camera.position.x / 1.613445)),
           y: Math.floor(1 - camera.position.y - this.boat.animation[this.boat.animationFrame]),
        }
        console.log({position: this.boat.position, animation: this.boat.animation[this.boat.animationFrame], camera: camera.position.y, animationframe: this.boat.animationFrame}, "boat position");
        this.drawFrame(context, 'stage-boat', this.boat.position.x, this.boat.position.y);
    }

    draw(context, camera) {
        this.drawFrame(context, 'stage-background', Math.floor(16 - (camera.position.x / 2.157303)), -camera.position.y);
        this.drawBoat(context, camera);
        this.drawFrame(context, 'stage-floor', Math.floor(192 - camera.position.x), 176 - camera.position.y);
    }
}

