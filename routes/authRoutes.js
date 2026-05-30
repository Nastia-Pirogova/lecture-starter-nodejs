import { Router } from "express";
import { authService } from "../services/authService.js";
import { responseMiddleware } from "../middlewares/response.middleware.js";

const router = Router();

router.post(
  "/login",
  (req, res, next) => {
    try {
      const data = authService.login(req.body);
      res.locals.data = data;
    } catch (err) {
      res.locals.error = { status: 400, message: err.message };
    } finally {
      next();
    }
  },
  responseMiddleware
);

export { router };
