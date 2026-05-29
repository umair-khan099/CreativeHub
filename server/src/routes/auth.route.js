import { Router } from "express";
import {
  getMe,
  loginUser,
  logOut,
  registerUser,
} from "../controllers/user.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  loginUserSchema,
  registerUserSchema,
} from "../validations/user.validation.js";
import { upload } from "../middlewares/multer.middleware.js";
import { isAuth } from "../middlewares/auth.middleware.js";

export const authRouter = Router();

authRouter.post(
  "/register",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  validate(registerUserSchema),
  registerUser,
);

authRouter.post("/login", validate(loginUserSchema), loginUser);

authRouter.get("/getMe", isAuth, getMe);

authRouter.post("/logout", isAuth, logOut);
