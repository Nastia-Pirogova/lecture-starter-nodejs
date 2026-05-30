import { USER } from "../models/user.js";

const USER_FIELDS = Object.keys(USER).filter((k) => k !== "id");
const ALL_USER_FIELDS = Object.keys(USER);

function validateUserFields(body, requireAll) {
  const errors = [];

  if ("id" in body) {
    errors.push("id must not be present in request body");
  }

  const extraFields = Object.keys(body).filter((k) => !ALL_USER_FIELDS.includes(k));
  if (extraFields.length > 0) {
    errors.push(`Unknown fields: ${extraFields.join(", ")}`);
  }

  if (requireAll) {
    const missing = USER_FIELDS.filter((k) => !(k in body));
    if (missing.length > 0) {
      errors.push(`Missing required fields: ${missing.join(", ")}`);
    }
  } else {
    const validFields = USER_FIELDS.filter((k) => k in body);
    if (validFields.length === 0) {
      errors.push("At least one valid field must be provided");
    }
  }

  if (body.email !== undefined) {
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(body.email)) {
      errors.push("email must be a valid Gmail address");
    }
  }

  if (body.phone !== undefined) {
    if (!/^\+380\d{9}$/.test(body.phone)) {
      errors.push("phone must match format +380xxxxxxxxx");
    }
  }

  if (body.password !== undefined) {
    if (typeof body.password !== "string" || body.password.length < 3) {
      errors.push("password must be a string with at least 3 characters");
    }
  }

  return errors;
}

const createUserValid = (req, res, next) => {
  const errors = validateUserFields(req.body, true);
  if (errors.length > 0) {
    res.locals.error = { status: 400, message: errors.join("; ") };
    return next();
  }
  next();
};

const updateUserValid = (req, res, next) => {
  const errors = validateUserFields(req.body, false);
  if (errors.length > 0) {
    res.locals.error = { status: 400, message: errors.join("; ") };
    return next();
  }
  next();
};

export { createUserValid, updateUserValid };
