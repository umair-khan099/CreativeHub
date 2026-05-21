import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { CONFIG } from "../config/dotenv.config.js";

// ================= CONFIG =================

cloudinary.config({
  cloud_name: CONFIG.CLOUDINARY_CLOUD_NAME,
  api_key: CONFIG.CLOUDINARY_API_KEY,
  api_secret: CONFIG.CLOUDINARY_API_SECRET,
});

// ================= UPLOAD FUNCTION =================

export const uploadOnCloudinary = async (localFilePath) => {
  try {
    // guard clause
    if (!localFilePath) {
      throw new Error("Local file path is required");
    }

    // upload file
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // delete temp local file after successful upload
    await fs.promises.unlink(localFilePath);

    console.log("File uploaded successfully:", response.secure_url);

    return response;
  } catch (error) {
    // cleanup temp file if exists
    if (localFilePath && fs.existsSync(localFilePath)) {
      await fs.promises.unlink(localFilePath).catch(() => {});
    }

    console.error("Cloudinary Upload Error:", error.message);

    throw error;
  }
};


