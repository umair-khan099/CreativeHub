import { AppError } from "../utils/AppError.js";
import { AppResponse } from "../utils/AppRespose.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { CONFIG } from "../config/dotenv.config.js";

const options = {
  httpOnly: true,
  secure: true,
};
const removePasswordAndRefreshToken = (user) => {
  const userResponse = user.toObject();

  delete userResponse.password;
  delete userResponse.refreshToken;
  return userResponse;
};

export const registerUser = asyncHandler(async (req, res) => {
  //   take data from user
  const { userName, email, fullName, password } = req.body;
  const { avatar, coverImage } = req.files;

  //  cheak if user is exist already
  const isExist = await User.findOne({ $or: [{ userName }, { email }] });

  if (isExist) {
    throw new AppError(409, "user already exist");
  }
  //  take user file data
  const avatarLocalPath = avatar?.[0]?.path;
  const coverImageLocalPath = coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new AppError(400, "Avatar file id requierd");
  }
  // upload it to cloudinary

  const avatarUploaded = await uploadOnCloudinary(avatarLocalPath);
  let coverImageUploaded;

  if (coverImageLocalPath) {
    coverImageUploaded = await uploadOnCloudinary(coverImageLocalPath);
  }

  if (!avatarUploaded) {
    throw new AppError(400, "Avatar file id requierd");
  }

  //   create user in database

  const user = await User.create({
    fullName,
    userName,
    email,
    password,
    avatar: avatarUploaded.url,
    coverImage: coverImageUploaded?.url,
  });

  res;
  const userResponse = removePasswordAndRefreshToken(user);

  res
    .status(201)
    .json(new AppResponse(201, userResponse, "User register successfully"));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;

  const user = await User.findOne({ $or: [{ userName }, { email }] }).select(
    "+password ",
  );

  if (!user) {
    throw new AppError(404, "user not found , register first");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new AppError(401, "Invalide user credentials");
  }
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const userResponse = removePasswordAndRefreshToken(user);
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new AppResponse(200, userResponse, "user logged in successfully"));
});

export const getMe = asyncHandler(async (req, res) => {
  const user = req.user;

  res
    .status(200)
    .json(new AppResponse(200, user, "user has fetched data successfully"));
});

export const logOut = asyncHandler(async (req, res) => {
  const user = req.user;

  await User.findByIdAndUpdate(user._id, {
    refreshToken: null,
  });
  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json("user loggedOut in successfully");
});

export const generateNewAccessTokenAndRefreshToken = asyncHandler(
  async (req, res) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw new AppError(401, "UnAuthorized user");
    }

    const decoded = jwt.verify(refreshToken, CONFIG.REFRESH_TOKEN_SECRET);

    if (!decoded) {
      throw new AppError(400, "Invalide Refresh Token");
    }
    const user = await User.findById(decoded._id).select("+refreshToken");

    if (!user) {
      throw new AppError(404, "User not found");
    }

    if (refreshToken !== user?.refreshToken) {
      throw new AppError(400, "Invalide Refresh Token ");
    }

    const accessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    const userResponse = removePasswordAndRefreshToken(user);

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(new AppResponse(200, userResponse, "Access token refreshed"));
  },
);
