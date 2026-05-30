import { Router } from "express";
import { userService } from "../services/userService.js";
import {
  createUserValid,
  updateUserValid,
} from "../middlewares/user.validation.middleware.js";
import { responseMiddleware } from "../middlewares/response.middleware.js";

const router = Router();

router.get("/", (req, res, next) => {
  res.locals.data = userService.getAll();
  next();
}, responseMiddleware);

router.get("/:id", (req, res, next) => {
  const result = userService.getById(req.params.id);
  if (result.error) {
    res.locals.error = result.error;
  } else {
    res.locals.data = result.data;
  }
  next();
}, responseMiddleware);

router.post("/", createUserValid, (req, res, next) => {
  if (res.locals.error) return next();
  const result = userService.create(req.body);
  if (result.error) {
    res.locals.error = result.error;
  } else {
    res.locals.data = result.data;
  }
  next();
}, responseMiddleware);

router.patch("/:id", updateUserValid, (req, res, next) => {
  if (res.locals.error) return next();
  const result = userService.update(req.params.id, req.body);
  if (result.error) {
    res.locals.error = result.error;
  } else {
    res.locals.data = result.data;
  }
  next();
}, responseMiddleware);

router.delete("/:id", (req, res, next) => {
  const result = userService.delete(req.params.id);
  if (result.error) {
    res.locals.error = result.error;
  } else {
    res.locals.data = result.data;
  }
  next();
}, responseMiddleware);

export { router };
