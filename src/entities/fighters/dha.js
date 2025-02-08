import { Fighter } from "./fighter.js";

export class Dha extends Fighter {
    constructor(x,y,velocity) {
        super('Dha',x,y,velocity);
        this.image = document.querySelector('img[alt="dha"]');
    }
}
