import { Control } from "../constants/control.js";
export const controls = [
    {
        keyboard: {
            [Control.LEFT]: 'ArrowLeft',
            [Control.RIGHT]: 'ArrowRight',
            [Control.UP]: 'ArrowUp',
            [Control.DOWN]: 'ArrowDown',
            [Control.LIGHT_PUNCH]: 'KeyZ',
            [Control.MEDIUM_PUNCH]: 'KeyX',
            [Control.HEAVY_PUNCH]: 'KeyC',
            [Control.LIGHT_KICK]: 'ShiftLeft',
            [Control.MEDIUM_KICK]: 'Space',
            [Control.HEAVY_KICK]: 'KeyV',
        }
    },
    {
        keyboard: {
            [Control.LEFT]: 'KeyA',
            [Control.RIGHT]: 'KeyD',
            [Control.UP]: 'KeyW',
            [Control.DOWN]: 'KeyS',
            [Control.LIGHT_PUNCH]: 'KeyJ',
            [Control.MEDIUM_PUNCH]: 'KeyK',
            [Control.HEAVY_PUNCH]: 'KeyL',
            [Control.LIGHT_KICK]: 'KeyU',
            [Control.MEDIUM_KICK]: 'KeyI',
            [Control.HEAVY_KICK]: 'KeyO',
        },
    }
];
