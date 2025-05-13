export const Control = {
    LEFT: 'left',
    RIGHT: 'right',
    UP: 'up',
    DOWN: 'down',
    LIGHT_PUNCH: 'lightPunch',
    MEDIUM_PUNCH: 'meduimPunch',
    HEAVY_PUNCH: 'heavyPunch',
    LIGHT_KICK: 'lightKick',
    MEDIUM_KICK: 'meduimKick',
    HEAVY_KICK: 'heavyKick',
};

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
        },
    }
];

