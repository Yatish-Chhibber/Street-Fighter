import { HEALTH_COLOR, HEALTH_DAMAGE_COLOR, HEALTH_MAX_HIT_POINTS, TIME_DELAY, TIME_FLASH_DELAY, TIME_FRAME_KEYS } from "../../constants/battle.js";
import { FPS } from "../../constants/game.js";
import { gameState } from "../../state/gameState.js";

export class StatusBar {
    constructor(fighters) {
        this.image = document.querySelector('img[alt="misc"]');

        this.time = 99;
        this.timeTimer = 0;
        this.timeFlashTimer = 0;
        this.useFlashFrames = false;

        this.healthBars = [{
            timer: 0,
            hitpoints: HEALTH_MAX_HIT_POINTS,
        }, {
            timer: 0,
            hitpoints: HEALTH_MAX_HIT_POINTS,
        }]; 

        this.fighters = fighters;

        this.frames = new Map([
            ['health-bar', [16, 18, 145, 11]],

            ['ko-white', [161, 16, 32, 14]],

            [`${TIME_FRAME_KEYS[0]}-0`, [16, 32, 14, 16]],
            [`${TIME_FRAME_KEYS[0]}-1`, [32, 32, 14, 16]],
            [`${TIME_FRAME_KEYS[0]}-2`, [48, 32, 14, 16]],
            [`${TIME_FRAME_KEYS[0]}-3`, [64, 32, 14, 16]],
            [`${TIME_FRAME_KEYS[0]}-4`, [80, 32, 14, 16]],
            [`${TIME_FRAME_KEYS[0]}-5`, [96, 32, 14, 16]],
            [`${TIME_FRAME_KEYS[0]}-6`, [112, 32, 14, 16]],
            [`${TIME_FRAME_KEYS[0]}-7`, [128, 32, 14, 16]],
            [`${TIME_FRAME_KEYS[0]}-8`, [144, 32, 14, 16]],
            [`${TIME_FRAME_KEYS[0]}-9`, [160, 32, 14, 16]],

            [`${TIME_FRAME_KEYS[1]}-0`, [16, 192, 14, 16]],
            [`${TIME_FRAME_KEYS[1]}-1`, [32, 192, 14, 16]],
            [`${TIME_FRAME_KEYS[1]}-2`, [48, 192, 14, 16]],
            [`${TIME_FRAME_KEYS[1]}-3`, [64, 192, 14, 16]],
            [`${TIME_FRAME_KEYS[1]}-4`, [80, 192, 14, 16]],
            [`${TIME_FRAME_KEYS[1]}-5`, [96, 192, 14, 16]],
            [`${TIME_FRAME_KEYS[1]}-6`, [112, 192, 14, 16]],
            [`${TIME_FRAME_KEYS[1]}-7`, [128, 192, 14, 16]],
            [`${TIME_FRAME_KEYS[1]}-8`, [144, 192, 14, 16]],
            [`${TIME_FRAME_KEYS[1]}-9`, [160, 192, 14, 16]],

            ['score-0', [17, 101, 10, 10]],
            ['score-1', [29, 101, 10, 10]],
            ['score-2', [41, 101, 10, 10]],
            ['score-3', [53, 101, 10, 10]],
            ['score-4', [65, 101, 10, 10]],
            ['score-5', [77, 101, 10, 10]],
            ['score-6', [89, 101, 10, 10]],
            ['score-7', [101, 101, 10, 10]],
            ['score-8', [113, 101, 10, 10]],
            ['score-9', [125, 101, 10, 10]],

            ['score-@', [17, 113, 10, 10]],
            ['score-A', [29, 113, 11, 10]],
            ['score-B', [41, 113, 10, 10]],
            ['score-C', [53, 113, 10, 10]],
            ['score-D', [65, 113, 10, 10]],
            ['score-E', [77, 113, 10, 10]],
            ['score-F', [89, 113, 10, 10]],
            ['score-G', [101, 113, 10, 10]],
            ['score-H', [113, 113, 10, 10]],
            ['score-I', [125, 113, 9, 10]],
            ['score-J', [136, 113, 10, 10]],
            ['score-K', [149, 113, 10, 10]],
            ['score-L', [161, 113, 10, 10]],
            ['score-M', [173, 113, 10, 10]],
            ['score-N', [185, 113, 11, 10]],
            ['score-O', [197, 113, 10, 10]],
            ['score-P', [17, 125, 10, 10]],
            ['score-Q', [29, 125, 10, 10]],
            ['score-R', [41, 125, 10, 10]],
            ['score-S', [53, 125, 10, 10]],
            ['score-T', [65, 125, 10, 10]],
            ['score-U', [77, 125, 10, 10]],
            ['score-V', [89, 125, 10, 10]],
            ['score-W', [101, 125, 10, 10]],
            ['score-X', [113, 125, 10, 10]],
            ['score-Y', [125, 125, 10, 10]],
            ['score-Z', [136, 125, 10, 10]],


            ['tag-dha', [144, 72, 29, 9]],
            ['tag-ryu', [16, 56, 28, 9]],
        ]);
    }

    drawFrame(context, frameKey, x, y, direction = 1) {
        const [sourceX, sourceY, sourceWidth, sourceHeight] = this.frames.get(frameKey);

        context.scale(direction, 1);
        context.drawImage(
            this.image,
            sourceX, sourceY, sourceWidth, sourceHeight,
            x * direction, y, sourceWidth, sourceHeight,
        );
        context.setTransform(1, 0, 0, 1, 0, 0);
    }

    updateTime(time) {
        if (time.previous > this.timeTimer + TIME_DELAY) {
            this.time -= 1;
            this.timeTimer = time.previous;
        }

        if(this.time < 15 && this.time > -1 && time.previous > this.timeFlashTimer + TIME_FLASH_DELAY) {
            this.useFlashFrames = !this.useFlashFrames;
            this.timeFlashTimer = time.previous;
        }
    }

    updateHealthBars(time) {
        for (const index in this.healthBars) {
            if (this.healthBars[index].hitpoints <= gameState.fighters[index].hitpoints) continue;
            this.healthBars[index].hitpoints = Math.max(0, this.healthBars[index].hitpoints - (time.secondsPassed * FPS));
        }
    }

    update(time) {
        this.updateTime(time);
        this.updateHealthBars(time);
    }

    drawHealthBars(context) {
        this.drawFrame(context, 'health-bar', 31, 20);
        this.drawFrame(context, 'ko-white', 176, 18);
        this.drawFrame(context, 'health-bar', 353, 20, -1);

        context.fillStyle = HEALTH_DAMAGE_COLOR;

        context.beginPath();
        context.fillRect(
            32, 21,
            HEALTH_MAX_HIT_POINTS - Math.floor(this.healthBars[0].hitpoints), 9,
        );

        context.fillRect(
            208 + Math.floor(this.healthBars[1].hitpoints), 21,
            HEALTH_MAX_HIT_POINTS - Math.floor(this.healthBars[1].hitpoints), 9,
        );
    }

    drawNameTags(context) {
        const [{ name: name1 }, { name: name2 }] = this.fighters;
    
        this.drawFrame(context, `tag-${name1.toLowerCase()}`, 32, 33);
        this.drawFrame(context, `tag-${name2.toLowerCase()}`, 322, 33);
    }
    
    drawTime(context) {
        const timeString = String(Math.max(this.time, 0)).padStart(2, '00');
        const flashFrame = TIME_FRAME_KEYS[Number(this.useFlashFrames)];

        this.drawFrame(context, `${flashFrame}-${timeString.charAt(0)}`, 178, 33);
        this.drawFrame(context, `${flashFrame}-${timeString.charAt(1)}`, 194, 33);
    }

    drawScore(context, score, x) {
        const strValue = String(score);
        const buffer = ((6 * 12) - strValue.length * 12);

        for (let i = 0; i < strValue.length; i++) {
            this.drawFrame(context, `score-${strValue[i]}`, x + buffer + i * 12, 1);
        }
    }

    drawScoreLabel(context, label, x) {
        for (const index in label) {
            this.drawFrame(context, `score-${label.charAt(index)}`, x + index * 12, 1);
        }
    }

    drawScores(context) {
        this.drawScoreLabel(context, 'P1', 4);
        this.drawScore(context, gameState.fighters[0].score, 45);

        this.drawScoreLabel(context, 'ANT', 133);
        this.drawScore(context, 50000, 177);
        
        this.drawScoreLabel(context, 'P2', 269);
        this.drawScore(context, gameState.fighters[1].score, 309);

    }

    draw(context) {
        this.drawScores(context);
        this.drawHealthBars(context);
        this.drawNameTags(context);
        this.drawTime(context);        
    }
}