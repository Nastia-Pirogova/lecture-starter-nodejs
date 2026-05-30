import { FIGHTER } from "../models/fighter.js";

const REQUIRED_FIGHTER_FIELDS = ["name", "power", "defense"];
const ALL_FIGHTER_FIELDS = Object.keys(FIGHTER);

function validateFighterFields(body, requireAll) {
  const errors = [];

  if ("id" in body) {
    errors.push("id must not be present in request body");
  }

  const extraFields = Object.keys(body).filter((k) => !ALL_FIGHTER_FIELDS.includes(k));
  if (extraFields.length > 0) {
    errors.push(`Unknown fields: ${extraFields.join(", ")}`);
  }

  const allowedFields = ALL_FIGHTER_FIELDS.filter((k) => k !== "id");

  if (requireAll) {
    const missing = REQUIRED_FIGHTER_FIELDS.filter((k) => !(k in body));
    if (missing.length > 0) {
      errors.push(`Missing required fields: ${missing.join(", ")}`);
    }
  } else {
    const validFields = allowedFields.filter((k) => k in body);
    if (validFields.length === 0) {
      errors.push("At least one valid field must be provided");
    }
  }

  if (body.power !== undefined) {
    const p = Number(body.power);
    if (!Number.isFinite(p) || p < 1 || p > 100) {
      errors.push("power must be a number between 1 and 100");
    }
  }

  if (body.defense !== undefined) {
    const d = Number(body.defense);
    if (!Number.isFinite(d) || d < 1 || d > 10) {
      errors.push("defense must be a number between 1 and 10");
    }
  }

  if (body.health !== undefined) {
    const h = Number(body.health);
    if (!Number.isFinite(h) || h < 80 || h > 120) {
      errors.push("health must be a number between 80 and 120");
    }
  }

  return errors;
}

const createFighterValid = (req, res, next) => {
  const errors = validateFighterFields(req.body, true);
  if (errors.length > 0) {
    res.locals.error = { status: 400, message: errors.join("; ") };
    return next();
  }
  next();
};

const updateFighterValid = (req, res, next) => {
  const errors = validateFighterFields(req.body, false);
  if (errors.length > 0) {
    res.locals.error = { status: 400, message: errors.join("; ") };
    return next();
  }
  next();
};

export { createFighterValid, updateFighterValid };
