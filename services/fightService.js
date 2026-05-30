import { fightRepository } from "../repositories/fightRepository.js";
import { fighterRepository } from "../repositories/fighterRepository.js";

function getHitPower(fighter) {
  return fighter.power * (1 + Math.random());
}

function getBlockPower(fighter) {
  return fighter.defense * (1 + Math.random());
}

function getDamage(attacker, defender) {
  return Math.max(0, getHitPower(attacker) - getBlockPower(defender));
}

class FightersService {
  getAll() {
    return fightRepository.getAll();
  }

  getById(id) {
    const fight = fightRepository.getOne({ id });
    if (!fight) {
      return { error: { status: 404, message: "Fight not found" } };
    }
    return { data: fight };
  }

  fight(fighter1Id, fighter2Id) {
    const fighter1 = fighterRepository.getOne({ id: fighter1Id });
    if (!fighter1) {
      return { error: { status: 404, message: "Fighter 1 not found" } };
    }

    const fighter2 = fighterRepository.getOne({ id: fighter2Id });
    if (!fighter2) {
      return { error: { status: 404, message: "Fighter 2 not found" } };
    }

    if (fighter1Id === fighter2Id) {
      return { error: { status: 400, message: "A fighter cannot fight themselves" } };
    }

    let health1 = fighter1.health ?? 85;
    let health2 = fighter2.health ?? 85;
    const log = [];

    // Each round: both fighters attack simultaneously
    // Every 5 rounds one fighter lands a critical hit (2x power, no randomized block)
    let round = 0;
    while (health1 > 0 && health2 > 0) {
      round++;

      const isCrit1 = round % 5 === 0;
      const isCrit2 = round % 7 === 0;

      const shot1 = isCrit1
        ? 2 * fighter1.power
        : getDamage(fighter1, fighter2);

      const shot2 = isCrit2
        ? 2 * fighter2.power
        : getDamage(fighter2, fighter1);

      health2 = Math.max(0, health2 - shot1);
      health1 = Math.max(0, health1 - shot2);

      log.push({
        round,
        fighter1Shot: parseFloat(shot1.toFixed(2)),
        fighter2Shot: parseFloat(shot2.toFixed(2)),
        fighter1Health: parseFloat(health1.toFixed(2)),
        fighter2Health: parseFloat(health2.toFixed(2)),
        fighter1CriticalHit: isCrit1,
        fighter2CriticalHit: isCrit2,
      });
    }

    const winner = health1 > 0 ? fighter1Id : fighter2Id;

    const fightRecord = fightRepository.create({
      fighter1: fighter1Id,
      fighter2: fighter2Id,
      winner,
      log,
    });

    return { data: fightRecord };
  }
}

const fightersService = new FightersService();

export { fightersService };
