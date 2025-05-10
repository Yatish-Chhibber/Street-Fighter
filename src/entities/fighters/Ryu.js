import { Fighter } from "./fighter.js";
import { FighterState, FrameDelay, PushBox } from "../../constants/fighter.js";

export class Ryu extends Fighter {
    constructor(x, y, direction, playerId) {
        super('Ryu', x, y, direction, playerId);
        
        this.image = document.querySelector('img[alt="ryu"]');

        this.frames= new Map([
            //Idle Stance
            ['idle-1', [[[75, 14, 60, 89], [34, 86]], PushBox.IDLE]], 
            ['idle-2', [[[7, 14, 59, 90], [33, 87]], PushBox.IDLE]], 
            ['idle-3', [[[277, 11, 58, 92], [32, 89]], PushBox.IDLE]], 
            ['idle-4', [[[211, 10, 55, 93], [31, 90]], PushBox.IDLE]], 

            //Move Forward
            ['forwards-1', [[[9, 136, 53, 83], [27, 81]], PushBox.IDLE]], 
            ['forwards-2', [[[78, 131, 60, 88], [35, 86]], PushBox.IDLE]], 
            ['forwards-3', [[[152, 128, 64, 92], [35, 89]], PushBox.IDLE]], 
            ['forwards-4', [[[229, 130, 63, 90], [29, 89]], PushBox.IDLE]], 
            ['forwards-5', [[[307, 128, 54, 91], [25, 89]], PushBox.IDLE]], 
            ['forwards-6', [[[371, 128, 50, 89], [25, 86]], PushBox.IDLE]],

            //Move Backwards
            ['backwards-1', [[[430, 124, 59, 90], [35, 85]], PushBox.IDLE]], 
            ['backwards-2', [[[495, 124, 57, 90], [36, 87]], PushBox.IDLE]], 
            ['backwards-3', [[[559, 124, 58, 90], [36, 88]], PushBox.IDLE]], 
            ['backwards-4', [[[631, 125, 58, 91], [38, 89]], PushBox.IDLE]], 
            ['backwards-5', [[[707, 126, 57, 89], [36, 88]], PushBox.IDLE]], 
            ['backwards-6', [[[777, 128, 61, 87], [36, 87]], PushBox.IDLE]],

            //Jump Up
            ['jump-up-1', [[[67, 244, 56, 104], [32, 107]], PushBox.JUMP]], 
            ['jump-up-2', [[[138, 233, 50, 89], [25, 103]], PushBox.JUMP]], 
            ['jump-up-3', [[[197, 233, 54, 77], [25, 103]], PushBox.JUMP]], 
            ['jump-up-4', [[[259, 240, 48, 70], [28, 101]], PushBox.JUMP]], 
            ['jump-up-5', [[[319, 234, 48, 89], [25, 106]], PushBox.JUMP]],
            ['jump-up-6', [[[375, 244, 55, 109], [31, 113]], PushBox.JUMP]],

            //Jump Forwards/Backwards
            ['jump-roll-1', [[[375, 244, 55, 109], [25, 106]], PushBox.JUMP]], 
            ['jump-roll-2', [[[442, 261, 61, 78], [22, 90]], PushBox.JUMP]], 
            ['jump-roll-3', [[[507, 259, 104, 42], [61, 76]], PushBox.JUMP]], 
            ['jump-roll-4', [[[617, 240, 53, 82], [42, 111]], PushBox.JUMP]],
            ['jump-roll-5', [[[676, 257, 122, 44], [71, 81]], PushBox.JUMP]],
            ['jump-roll-6', [[[804, 258, 71, 87], [53, 98]]], PushBox.JUMP],
            ['jump-roll-7', [[[882, 261, 55, 109], [31, 113]], PushBox.JUMP]],

            //Crouch
            ['crouch-1', [[[551, 21, 53, 83], [27, 81]], PushBox.IDLE]], 
            ['crouch-2', [[[611, 36, 57, 69], [25, 66]], PushBox.BEND]], 
            ['crouch-3', [[[679, 44, 61, 61], [25, 58]], PushBox.CROUCH]], 

            //Idle Turn
            ['idle-turn-1', [[[348, 8, 54, 95], [29, 92]], PushBox.IDLE]], 
            ['idle-turn-2', [[[414, 6, 58, 97], [30, 95]], PushBox.IDLE]], 
            ['idle-turn-3', [[[486, 10, 54, 94], [27, 90]], PushBox.IDLE]], 

            //Crouch Turn
            ['crouch-turn-1', [[[751, 46, 53, 61], [26, 58]], PushBox.CROUCH]], 
            ['crouch-turn-2', [[[816, 46, 52, 61], [27, 58]], PushBox.CROUCH]], 
            ['crouch-turn-3', [[[878, 46, 53, 61], [29, 58]], PushBox.CROUCH]], 
        ]);

         this.animations = {
            [FighterState.IDLE]: [
                ['idle-1', 100], ['idle-2', 100], ['idle-3', 100], 
                ['idle-4', 100], ['idle-3', 100], ['idle-2', 100],
            ],
            [FighterState.WALK_FORWARD]: [
                ['forwards-1', 100], ['forwards-2', 100], ['forwards-3', 100], 
                ['forwards-4', 100], ['forwards-5', 100], ['forwards-6', 100],
            ],
            [FighterState.WALK_BACKWARD]: [
                ['backwards-1', 100], ['backwards-2', 100], ['backwards-3', 100], 
                ['backwards-4', 100], ['backwards-5', 100], ['backwards-6', 100],
            ],
            [FighterState.JUMP_UP]: [
                ['jump-up-1', 230], ['jump-up-2', 230], ['jump-up-3', 150], 
                ['jump-up-4', 150], ['jump-up-5', 150], ['jump-up-6', -1],
            ],
            [FighterState.JUMP_FORWARD]: [
                ['jump-roll-1', 250], ['jump-roll-2', 100], ['jump-roll-3', 100], 
                ['jump-roll-4', 100], ['jump-roll-5', 100], ['jump-roll-6', 100], ['jump-roll-7', 50],
            ],
            [FighterState.JUMP_BACKWARD]: [
                ['jump-roll-1', 250], ['jump-roll-2', 100], ['jump-roll-3', 100], 
                ['jump-roll-4', 100], ['jump-roll-5', 100], ['jump-roll-6', 100], ['jump-roll-7', 50],
            ],
            [FighterState.CROUCH]: [['crouch-3',FrameDelay.FREEZE]],
            [FighterState.CROUCH_DOWN]: [
                ['crouch-1',80], ['crouch-2',80], ['crouch-3',FrameDelay.TRANSITION]
            ],
            [FighterState.CROUCH_UP]: [
                ['crouch-3',80], ['crouch-2',80], ['crouch-1',FrameDelay.TRANSITION]
            ],
            [FighterState.IDLE_TURN]: [
                ['idle-turn-3',83], ['idle-turn-2',83], ['idle-turn-1', FrameDelay.TRANSITION],
            ],
            [FighterState.CROUCH_TURN]: [
                ['crouch-turn-3',83], ['crouch-turn-2',83], ['crouch-turn-1', FrameDelay.TRANSITION],
            ],    
        };

        this.initialVelocity = {
            x: {
                [FighterState.WALK_FORWARD]: 200,
                [FighterState.WALK_BACKWARD]: -150,
                [FighterState.JUMP_FORWARD]: 170,
                [FighterState.JUMP_BACKWARD]: -200,
            },
            jump: -420,
        };

        this.gravity = 1000;
    }
}
