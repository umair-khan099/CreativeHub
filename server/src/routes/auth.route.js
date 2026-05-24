import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { registerUserSchema } from "../validations/user.validation.js";
import { upload } from "../middlewares/multer.middleware.js";

export const authRouter = Router();

authRouter.post(
  "/register",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1   },
  ]),
  validate(registerUserSchema),
  registerUser,
);
