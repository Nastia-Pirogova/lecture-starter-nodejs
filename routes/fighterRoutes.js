import { Router } from "express";
import { fighterService } from "../services/fighterService.js";
import { responseMiddleware } from "../middlewares/response.middleware.js";
import {
  createFighterValid,
  updateFighterValid,
} from "../middlewares/fighter.validation.middleware.js";

const router = Router();

router.get("/", (req, res, next) => {
  res.locals.data = fighterService.getAll();
  next();
}, responseMiddleware);

router.get("/:id", (req, res, next) => {
  const result = fighterService.getById(req.params.id);
  if (result.error) {
    res.locals.error = result.error;
  } else {
    res.locals.data = result.data;
  }
  next();
}, responseMiddleware);

router.post("/", createFighterValid, (req, res, next) => {
  if (res.locals.error) return next();
  const result = fighterService.create(req.body);
  if (result.error) {
    res.locals.error = result.error;
  } else {
    res.locals.data = result.data;
  }
  next();
}, responseMiddleware);

router.patch("/:id", updateFighterValid, (req, res, next) => {
  if (res.locals.error) return next();
  const result = fighterService.update(req.params.id, req.body);
  if (result.error) {
    res.locals.error = result.error;
  } else {
    res.locals.data = result.data;
  }
  next();
}, responseMiddleware);

router.delete("/:id", (req, res, next) => {
  const result = fighterService.delete(req.params.id);
  if (result.error) {
    res.locals.error = result.error;
  } else {
    res.locals.data = result.data;
  }
  next();
}, responseMiddleware);

export { router };
