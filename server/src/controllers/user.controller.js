import { AppError } from "../utils/AppError.js";
import { AppResponse } from "../utils/AppRespose.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";

const options = {
  httpOnly: true,
  secure: true,
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
  }).select("-password -refreshToken");

  res
    .status(201)
    .json(new AppResponse(201, user, "User register succsessfully"));
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
  console.log(isPasswordCorrect);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  const userResponse = user.toObject();

  delete userResponse.password;
  delete userResponse.refreshToken;

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new AppResponse(200, userResponse, "user logged in successfully"));
});

export const getMe = asyncHandler(async (req, res) => {
  const user = req.user;

  res
    .status(201)
    .json(new AppResponse(201, user, "user has fetched data successfully"));
});

export const logOut = asyncHandler(async (req, res) => {
  const user = req.user;

  await User.findById(user._id, {
    refreshToken: null,
  });
  res
    .status(201)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json("user loggedOut in successfully");
});
