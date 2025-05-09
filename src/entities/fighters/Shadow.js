import { STAGE_FLOOR } from "../../constants/stage.js";

export class Shadow {
    constructor(fighter) {
        this.image = document.querySelector('img[alt="shadow"]');
        this.fighter = fighter;
        this.frame = [[30, 30, 34, 3], [15, 1]];
    }

    update() {

    }
    draw(context) {
        const [
            [x, y, width, height],
            [originX, originY],
        ] = this.frame;

        context.drawImage(
            this.image,
            x, y,
            width, height,
            Math.floor(this.fighter.position.x - originX),
            Math.floor(STAGE_FLOOR - originY),
            width, height,
        )
    }
}