import { post } from "../requestHelper";

const entity = 'fights';

export const startFight = async (fighter1Id, fighter2Id) => {
    return await post(entity, { fighter1: fighter1Id, fighter2: fighter2Id });
}
