import { HEALTH_MAX_HIT_POINTS } from "../constants/battle.js";

export const createDefaultFighterState = (id) => ({
    id,
    score: 1,
    battles: 0,
    hitpoints: HEALTH_MAX_HIT_POINTS,
});