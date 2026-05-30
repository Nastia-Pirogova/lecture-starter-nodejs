import { Router } from "express";
import { fightersService } from "../services/fightService.js";
import { responseMiddleware } from "../middlewares/response.middleware.js";

const router = Router();

router.get("/", (req, res, next) => {
  res.locals.data = fightersService.getAll();
  next();
}, responseMiddleware);

router.get("/:id", (req, res, next) => {
  const result = fightersService.getById(req.params.id);
  if (result.error) {
    res.locals.error = result.error;
  } else {
    res.locals.data = result.data;
  }
  next();
}, responseMiddleware);

router.post("/", (req, res, next) => {
  const { fighter1, fighter2 } = req.body;
  if (!fighter1 || !fighter2) {
    res.locals.error = { status: 400, message: "fighter1 and fighter2 are required" };
    return next();
  }
  const result = fightersService.fight(fighter1, fighter2);
  if (result.error) {
    res.locals.error = result.error;
  } else {
    res.locals.data = result.data;
  }
  next();
}, responseMiddleware);

export { router };
