import { FRAME_TIME } from "../../constants/game.js";
import { STAGE_MID_POINT, STAGE_PADDING } from "../../constants/stage.js";
import { BackgroundAnimation } from "./shared/BackgroundAnimation.js";
import { SkewedFloor } from "./shared/SkewedFloor.js";

export class Stage {
    constructor() {
        this.image = document.querySelector('img[alt="stage"]');
        this.floor = new SkewedFloor(this.image, [8, 392, 896, 56]);

        this.frames = new Map([
            ['stage-background', [72, 208, 768, 176]],
            ['stage-boat', [8, 16, 521, 180]],
            ['stage-floor-bottom', [8, 448, 896, 16]],

            ['bollard-small', [800, 184, 21, 16]],
            ['bollard-large', [760, 176, 31, 24]],

            ['barrels', [560, 472, 151, 96]],
        ]);

        this.flag = new BackgroundAnimation(
            this.image,
            [
                ['flag-1', [848, 312, 40, 32]],
                ['flag-2', [848, 264, 40, 32]],
                ['flag-3', [848, 216, 40, 32]],
            ],
            [['flag-1', 133], ['flag-2', 133], ['flag-3', 133]],
        );

        this.baldMan = new BackgroundAnimation(
            this.image,
            [
                ['bald-man-1', [552, 8, 40, 64]],
                ['bald-man-2', [552, 72, 40, 64]],
                ['bald-man-3', [552, 136, 40, 64]],
            ],
            [['bald-man-1', 100], ['bald-man-2', 133], ['bald-man-3', 664], ['bald-man-2', 133]],
        );

        this.cheeringWoman = new BackgroundAnimation(
            this.image,
            [
                ['woman-1', [624, 16, 32, 56]],
                ['woman-2', [624, 80, 32, 56]],
                ['woman-3', [624, 144, 32, 56]],
            ],
            [['woman-1', 100], ['woman-2', 133], ['woman-3', 664], ['woman-2', 133]],
        );

        this.greenJumperGuy = new BackgroundAnimation(
            this.image,
            [
                ['green-jumper-1', [664, 16, 32, 56]],
                ['green-jumper-2', [664, 80, 32, 56]],
            ],
            [['green-jumper-1', 664], ['green-jumper-2', 498], ['green-jumper-1', 133], ['green-jumper-2', 133]],
        );

        this.blueCoatGuy = new BackgroundAnimation(
            this.image,
            [
                ['blue-coat-1', [704, 16, 48, 56]],
                ['blue-coat-2', [704, 80, 48, 56]],
                ['blue-coat-3', [704, 144, 48, 56]],
            ],
            [
            ['blue-coat-1', 996], ['blue-coat-2', 133], ['blue-coat-3', 100], 
            ['blue-coat-2', 133], ['blue-coat-1', 249], ['blue-coat-2', 133],
            ['blue-coat-3', 100], ['blue-coat-2', 133]
            ],
        );

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
        this.baldMan.update(time);
        this.cheeringWoman.update(time);
        this.greenJumperGuy.update(time);
        this.blueCoatGuy.update(time);
        this.flag.update(time);
    }

     drawFrame(context, frameKey, x, y) {
        const [sourceX, sourceY, sourceWidth, sourceHeight] = this.frames.get(frameKey);

        context.drawImage(
            this.image,
            sourceX, sourceY, sourceWidth, sourceHeight,
            x, y, sourceWidth, sourceHeight,
        );
    }

    drawSkyOcean(context, camera) {
        const backgroundX = Math.floor(16 - (camera.position.x / 2.157303));

        this.drawFrame(context, 'stage-background', backgroundX , -camera.position.y);
        this.flag.draw(context, backgroundX + 560, 16 - camera.position.y);
    }

    drawBoat(context, camera) {
        this.boat.position = {
           x: Math.floor(150 - (camera.position.x / 1.613445)),
           y: Math.floor(1 - camera.position.y - this.boat.animation[this.boat.animationFrame]),
        }
        console.log({position: this.boat.position, animation: this.boat.animation[this.boat.animationFrame], camera: camera.position.y, animationframe: this.boat.animationFrame}, "boat position");
        this.drawFrame(context, 'stage-boat', this.boat.position.x, this.boat.position.y);
        this.baldMan.draw(context, this.boat.position.x + 128, this.boat.position.y + 96);
        this.cheeringWoman.draw(context, this.boat.position.x + 192, this.boat.position.y + 104);
        this.greenJumperGuy.draw(context, this.boat.position.x + 224, this.boat.position.y + 104);
        this.blueCoatGuy.draw(context, this.boat.position.x + 288, this.boat.position.y + 96);
    }

    drawFloor(context, camera) {
        this.floor.draw(context, camera, 176);

        this.drawFrame(
            context, 'stage-floor-bottom',
            STAGE_PADDING - camera.position.x * 1.1, 232 - camera.position.y,
        );
    }

    drawSmallBollards(context, camera) {
        const cameraXOffset = camera.position.x / 1.54;
        const y = 166 - camera.position.y;

        this.drawFrame(context, 'bollard-small', Math.floor(468 - 92 - cameraXOffset), y);
        this.drawFrame(context, 'bollard-small', Math.floor(468 + 92 - cameraXOffset), y);
    }

    drawBackground(context, camera) {
        this.drawSkyOcean(context, camera);
        this.drawBoat(context, camera);
        this.drawFloor(context, camera);
        this.drawSmallBollards(context, camera);
        this.drawFrame(context, 'barrels', Math.floor(872 - camera.position.x), 120 - camera.position.y);
    }

    drawForeground(context, camera) {
        const midPoint = STAGE_MID_POINT + STAGE_PADDING;
        const cameraXOffset = camera.position.x / 0.958;
        const y = 200 - camera.position.y;

        this.drawFrame(context, 'bollard-large', Math.floor(midPoint - 147 - cameraXOffset), y);
        this.drawFrame(context, 'bollard-large', Math.floor(midPoint + 147 - cameraXOffset), y);
    }
}

