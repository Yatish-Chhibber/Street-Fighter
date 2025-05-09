import { StreetFighterGame } from "./StreetFighterGame.js";
import {FighterState } from "./constants/fighter.js";

window.addEventListener('load', function() {
    new StreetFighterGame().start();
});