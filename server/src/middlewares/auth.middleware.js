import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { CONFIG } from "../config/dotenv.config.js";
import { User } from "../models/user.model.js";

export const isAuth = asyncHandler(async (req, res, next) => {
  const { accessToken, refreshToken } = req.cookies;
  if (!accessToken || !refreshToken) {
    throw new AppError(400, "Not Authhorized User , Login first");
  }
  const decode = jwt.verify(accessToken, CONFIG.ACCESS_TOKEN_SECRET);

  if (!decode) {
    throw new AppError(401, "unAuthorized token ");
  }

  const user = await User.findById(decode?._id);
  req.user = user;
  next();
});
