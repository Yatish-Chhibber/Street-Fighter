import { Fighter } from "./fighter.js";
import { FighterState, FrameDelay, HurtBox, PushBox } from "../../constants/fighter.js";

export class Dha extends Fighter {
    constructor(playerId) {
        super('Dha', playerId);
        this.image = document.querySelector('img[alt="dha"]');

        this.frames= new Map([
            //Idle Stance
            ['idle-1', [[[14, 380, 73, 100], [34, 86]], PushBox.IDLE, [[-8, -88, 24, 16], [-26, -74, 40, 42], [-26, -31, 40, 32]]]], 
            ['idle-2', [[[114, 380, 68, 100], [33, 87]], PushBox.IDLE, [[-8, -88, 24, 16], [-26, -74, 40, 42], [-26, -31, 40, 32]]]], 
            ['idle-3', [[[214, 384, 68, 96], [32, 89]], PushBox.IDLE, [[-8, -88, 24, 16], [-26, -74, 40, 42], [-26, -31, 40, 32]]]], 
            ['idle-4', [[[314, 389, 73, 91], [31, 90]], PushBox.IDLE, [[-8, -88, 24, 16], [-26, -74, 40, 42], [-26, -31, 40, 32]]]], 

             //Move Forward
            ['forwards-1', [[[9, 538, 79, 98], [27, 81]], PushBox.IDLE, HurtBox.FORWARD]], 
            ['forwards-2', [[[124, 541, 87, 95], [35, 86]], PushBox.IDLE, HurtBox.FORWARD]], 
            ['forwards-3', [[[253, 538, 79, 98], [35, 87]], PushBox.IDLE, HurtBox.FORWARD]], 
            ['forwards-4', [[[385, 536, 73, 100], [29, 88]], PushBox.IDLE, HurtBox.FORWARD]], 
            ['forwards-5', [[[514, 535, 69, 101], [25, 87]], PushBox.IDLE, HurtBox.FORWARD]], 
            ['forwards-6', [[[632, 536, 66, 100], [25, 86]], PushBox.IDLE, HurtBox.FORWARD]],

             //Move Backwards
            ['backwards-1', [[[24, 831, 72, 102], [35, 85]], PushBox.IDLE, HurtBox.BACKWARD]], 
            ['backwards-2', [[[135, 834, 87, 99], [36, 87]], PushBox.IDLE, HurtBox.BACKWARD]], 
            ['backwards-3', [[[262, 831, 72, 102], [36, 88]], PushBox.IDLE, HurtBox.BACKWARD]], 
            ['backwards-4', [[[383, 829, 65, 104], [38, 89]], PushBox.IDLE, HurtBox.BACKWARD]], 
            ['backwards-5', [[[496, 828, 69, 105], [36, 88]], PushBox.IDLE, HurtBox.BACKWARD]], 
            ['backwards-6', [[[631, 828, 66, 105], [36, 87]], PushBox.IDLE, HurtBox.BACKWARD]],

             //Jump Up
             ['jump-up-1', [[[355, 1174, 57, 76], [32, 107]], PushBox.JUMP, HurtBox.JUMP]], 
             ['jump-up-2', [[[449, 1162, 64, 88], [25, 103]], PushBox.JUMP, HurtBox.JUMP]], 
             ['jump-up-3', [[[545, 1122, 58, 123], [25, 103]], PushBox.JUMP, HurtBox.JUMP]], 
             ['jump-up-4', [[[646, 1137, 58, 89], [28, 101]], PushBox.JUMP, HurtBox.JUMP]], 
             ['jump-up-5', [[[739, 1125, 59, 70], [25, 103]], PushBox.JUMP, HurtBox.JUMP]],

             //Jump Forwards/Backwards
             ['jump-roll-1', [[[34, 1309, 57, 115], [25, 106]], PushBox.JUMP]], 
             ['jump-roll-2', [[[119, 1322, 67, 90], [22, 90]], PushBox.JUMP]], 
             ['jump-roll-3', [[[211, 1319, 60, 68], [61, 76]], PushBox.JUMP]], 
             ['jump-roll-4', [[[293, 1319, 95, 91], [42, 111]], PushBox.JUMP]], 

             //Crouch
             ['crouch-1', [[[26, 1162, 64, 88], [27, 81]], PushBox.IDLE, HurtBox.IDLE]], 
             ['crouch-2', [[[114, 1174, 57, 76], [25, 66]], PushBox.BEND, HurtBox.BEND]], 
             ['crouch-3', [[[205, 1186, 60, 64], [25, 58]], PushBox.CROUCH, HurtBox.CROUCH]], 

             //Idle Turn
             ['idle-turn-1', [[[37, 1492, 62, 95], [29, 92]], PushBox.IDLE]], 
             ['idle-turn-2', [[[131, 1490, 66, 95], [30, 94]], PushBox.IDLE]], 
             ['idle-turn-3', [[[228, 1488, 73, 95], [27, 90]], PushBox.IDLE]], 

             //Crouch Turn
             ['crouch-turn-1', [[[344, 1512, 58, 71], [26, 58]], PushBox.CROUCH]], 
             ['crouch-turn-2', [[[436, 1510, 59, 71], [27, 58]], PushBox.CROUCH]], 
             ['crouch-turn-3', [[[526, 1512, 57, 67], [29, 58]], PushBox.CROUCH]], 

             //light Punch
             ['light-punch-1', [[[24, 1677, 91, 87], [32, 88]], PushBox.IDLE, HurtBox.IDLE]],
             ['light-punch-2', [[[147, 1680, 84, 84], [32, 88]], PushBox.IDLE, HurtBox.IDLE]],
             ['light-punch-3', [[[258, 1683, 136, 81], [32, 88]], PushBox.IDLE, HurtBox.IDLE, [11, -85, 90, 18]]],

             //Medium Punch
             ['med-punch-1', [[[20, 2162, 75, 100], [28, 91]], PushBox.IDLE, HurtBox.IDLE]],
             ['med-punch-2', [[[128, 2184, 87, 78], [29, 92]], PushBox.IDLE, HurtBox.IDLE]],
             ['med-punch-3', [[[247, 2215, 151, 47], [24, 92]], PushBox.IDLE, HurtBox.PUNCH]],
             ['med-punch-4', [[[425, 2215, 215, 47], [24, 92]], PushBox.IDLE, HurtBox.PUNCH, [120, -85, 68, 14]]],

             //Heavy Punch
             ['heavy-punch-1', [[[256, 2654, 149, 47], [24, 92]], PushBox.IDLE, HurtBox.IDLE]],
             ['heavy-punch-2', [[[432, 2654, 248, 47], [24, 92]], PushBox.IDLE, HurtBox.PUNCH, [145, -95, 76, 30]]],

             //Light/medium Kick
             ['light-kick-1', [[[30, 3023, 59, 93], [46, 93]], PushBox.IDLE, [[-33, -96, 30, 18], [-41, -79, 42, 38], [-32, -52, 44, 50]]]],
             ['light-kick-2', [[[115, 3006, 119, 110], [68, 95]], PushBox.IDLE, [[-65, -96, 30, 18], [-57, -79, 42, 38], [-32, -52, 44, 50]]]],
             ['light-kick-3', [[[258, 3006, 166, 110], [68, 95]], PushBox.IDLE, [[-97, -106, 24, 16], [-105, -90, 40, 42], [-32, -52, 44, 50]], [30, -88, 66, 28]]],

             //Medium Kick
             ['med-kick-1', [[[126, 3501, 116, 96], [68, 95]], PushBox.IDLE, [[-65, -96, 30, 18], [-57, -79, 42, 38], [-32, -52, 44, 50]]]],
             ['med-kick-2', [[[284, 3481, 178, 116], [68, 95]], PushBox.IDLE, [[-97, -106, 24, 16], [-105, -90, 40, 42], [-32, -52, 44, 50]], [30, -93, 80, 28]]],

             //Heavy Kick
             ['heavy-kick-1', [[[20, 3883, 74, 97], [37, 87]], PushBox.IDLE, [[-41, -78, 20, 20], [-25, -78, 42, 42], [-11, -50, 42, 50]]]],
             ['heavy-kick-2', [[[117, 3873, 55, 107], [44, 91]], PushBox.IDLE, [[12, -90, 34, 34], [-25, -78, 42, 42], [-11, -50, 42, 50]], [55, -79, 40, 32]]],
             ['heavy-kick-3', [[[199, 3875, 52, 105], [42, 91]], PushBox.IDLE, [[13, -91, 62, 34], [-25, -78, 42, 42], [-11, -50, 42, 50]], [81, -67, 62, 24]]],
             ['heavy-kick-4', [[[275, 3877, 104, 102], [39, 74]], PushBox.IDLE, [[-41, -78, 20, 20], [-25, -78, 42, 42], [-11, -50, 42, 50]]]],
             ['heavy-kick-5', [[[408, 3872, 184, 108], [38, 78]], PushBox.IDLE, [[-41, -78, 20, 20], [-25, -78, 42, 42], [-11, -50, 42, 50]]]],
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
            [FighterState.LIGHT_PUNCH]: [
                ['light-punch-1', 33], ['light-punch-2', 66], ['light-punch-3', 66], ['light-punch-2', 66], ['light-punch-1', 66], ['light-punch-1', FrameDelay.TRANSITION],
            ],
            [FighterState.MEDIUM_PUNCH]: [
                ['med-punch-1', 16], ['med-punch-2', 33], ['med-punch-3', 66], ['med-punch-4', 66], ['med-punch-3', 50],['med-punch-2', 50], 
                ['med-punch-1', 50], ['med-punch-1', FrameDelay.TRANSITION],
            ],
            [FighterState.HEAVY_PUNCH]: [
                ['med-punch-1', 50], ['med-punch-2', 33], ['heavy-punch-1', 100], ['heavy-punch-2', 130], ['med-punch-2', 166], 
                ['med-punch-1', 199], ['med-punch-1', FrameDelay.TRANSITION],
            ],
            [FighterState.LIGHT_KICK]: [
                ['med-punch-1', 50], ['light-kick-1', 50], ['light-kick-2', 133], ['light-kick-3', 133], ['light-kick-2', 66], 
                ['light-kick-1', 66], ['med-punch-1', 16], ['med-punch-1', FrameDelay.TRANSITION],
            ],
            [FighterState.MEDIUM_KICK]: [
                ['med-punch-1', 83], ['light-kick-1', 100], ['med-kick-1', 199], ['med-kick-2', 199], ['light-kick-1', 116],
                ['light-kick-1', FrameDelay.TRANSITION],
            ],
            [FighterState.HEAVY_KICK]: [
                ['heavy-kick-1', 23], ['heavy-kick-2', 56], ['heavy-kick-3', 123], ['heavy-kick-4', 156], ['heavy-kick-5', 106], 
                ['heavy-kick-5', FrameDelay.TRANSITION],
            ],
        };

        this.initialVelocity = {
            x: {
                [FighterState.WALK_FORWARD]: 3 * 60,
                [FighterState.WALK_BACKWARD]: -(2 * 60),
                [FighterState.JUMP_FORWARD]: ((48 * 3) + (15 * 3)),
                [FighterState.JUMP_BACKWARD]: -((45 * 4) + (15 * 3)),
            },
            jump: -420,
        };

        this.gravity = 1000;
    }
}
