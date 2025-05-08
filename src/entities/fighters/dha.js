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
        ]);

        this.animations = {
            [FighterState.IDLE]: ['idle-1','idle-2','idle-3','idle-4','idle-3','idle-2'],
            [FighterState.WALK_FORWARD]: ['forwards-1', 'forwards-2', 'forwards-3', 'forwards-4', 'forwards-5', 'forwards-6'],
            [FighterState.WALK_BACKWARD]: ['backwards-1', 'backwards-2', 'backwards-3', 'backwards-4', 'backwards-5', 'backwards-6'],
        };
    }
}
