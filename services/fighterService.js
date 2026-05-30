import { fighterRepository } from "../repositories/fighterRepository.js";

class FighterService {
  getAll() {
    return fighterRepository.getAll();
  }

  getById(id) {
    const fighter = fighterRepository.getOne({ id });
    if (!fighter) {
      return { error: { status: 404, message: "Fighter not found" } };
    }
    return { data: fighter };
  }

  create(data) {
    const all = fighterRepository.getAll();
    const nameTaken = all.find(
      (f) => f.name.toLowerCase() === data.name.toLowerCase()
    );
    if (nameTaken) {
      return { error: { status: 400, message: "Fighter with this name already exists" } };
    }

    if (data.health === undefined) {
      data.health = 85;
    }

    const fighter = fighterRepository.create(data);
    return { data: fighter };
  }

  update(id, dataToUpdate) {
    const existing = fighterRepository.getOne({ id });
    if (!existing) {
      return { error: { status: 404, message: "Fighter not found" } };
    }

    if (dataToUpdate.name) {
      const all = fighterRepository.getAll();
      const nameTaken = all.find(
        (f) => f.name.toLowerCase() === dataToUpdate.name.toLowerCase() && f.id !== id
      );
      if (nameTaken) {
        return { error: { status: 400, message: "Fighter with this name already exists" } };
      }
    }

    const updated = fighterRepository.update(id, dataToUpdate);
    return { data: updated };
  }

  delete(id) {
    const existing = fighterRepository.getOne({ id });
    if (!existing) {
      return { error: { status: 404, message: "Fighter not found" } };
    }
    fighterRepository.delete(id);
    return { data: { message: "Fighter deleted successfully" } };
  }
}

const fighterService = new FighterService();

export { fighterService };
