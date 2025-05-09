import { FighterState } from "../../constants/fighter.js";
import { Fighter } from "./fighter.js";

export class Dha extends Fighter {
    constructor(x,y,velocity) {
        super('Dha',x,y,velocity);
        this.image = document.querySelector('img[alt="dha"]');

        this.frames= new Map([
            //Idle Stance
            ['idle-1', [[14, 380, 73, 100], [34, 86]]], 
            ['idle-2', [[114, 380, 68, 100], [33, 87]]], 
            ['idle-3', [[214, 384, 68, 96], [32, 89]]], 
            ['idle-4', [[314, 389, 73, 91], [31, 90]]], 

             //Move Forward
            ['forwards-1', [[9, 538, 79, 98], [27, 81]]], 
            ['forwards-2', [[124, 541, 87, 95], [35, 86]]], 
            ['forwards-3', [[253, 538, 79, 98], [35, 87]]], 
            ['forwards-4', [[385, 536, 73, 100], [29, 88]]], 
            ['forwards-5', [[514, 535, 69, 101], [25, 87]]], 
            ['forwards-6', [[632, 536, 66, 100], [25, 86]]],

             //Move Backwards
            ['backwards-1', [[24, 831, 72, 102], [35, 85]]], 
            ['backwards-2', [[135, 834, 87, 99], [36, 87]]], 
            ['backwards-3', [[262, 831, 72, 102], [36, 88]]], 
            ['backwards-4', [[383, 829, 65, 104], [38, 89]]], 
            ['backwards-5', [[496, 828, 69, 105], [36, 88]]], 
            ['backwards-6', [[631, 828, 66, 105], [36, 87]]],

             //Jump Up
             ['jump-up-1', [[355, 1174, 57, 76], [32, 107]]], 
             ['jump-up-2', [[449, 1162, 64, 88], [25, 103]]], 
             ['jump-up-3', [[545, 1122, 58, 123], [25, 103]]], 
             ['jump-up-4', [[646, 1137, 58, 89], [28, 101]]], 
             ['jump-up-5', [[739, 1125, 59, 70], [25, 103]]],

             //Jump Forwards/Backwards
             ['jump-roll-1', [[34, 1309, 57, 115], [25, 106]]], 
             ['jump-roll-2', [[119, 1322, 67, 90], [22, 90]]], 
             ['jump-roll-3', [[211, 1319, 60, 68], [61, 76]]], 
             ['jump-roll-4', [[293, 1319, 95, 91], [42, 111]]], 

             //Crouch
             ['crouch-1', [[26, 1162, 64, 88], [27, 81]]], 
             ['crouch-2', [[114, 1174, 57, 76], [25, 66]]], 
             ['crouch-3', [[205, 1186, 60, 64], [25, 58]]], 
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
                ['jump-up-4', 150], ['jump-up-5', -1], 
            ],
            [FighterState.JUMP_FORWARD]: [
                ['jump-roll-1', 250], ['jump-roll-2', 100], ['jump-roll-3', 100], 
                ['jump-roll-4', 50], 
            ],
            [FighterState.JUMP_BACKWARD]: [
                ['jump-roll-1', 250], ['jump-roll-2', 100], ['jump-roll-3', 100], 
                ['jump-roll-4', 50], 
            ],
            [FighterState.CROUCH]: [['crouch-3',0]],
            [FighterState.CROUCH_DOWN]: [
                ['crouch-1',30], ['crouch-2',30], ['crouch-3',30], ['crouch-3',-2]
        ],
            [FighterState.CROUCH_UP]: [
                ['crouch-3',30], ['crouch-2',30], ['crouch-1',30], ['crouch-1',-2]
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
