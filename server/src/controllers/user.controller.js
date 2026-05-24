import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";

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

    
});
