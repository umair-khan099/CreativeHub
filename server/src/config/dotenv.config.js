import dotenv from "dotenv";

dotenv.config();

if (!process.env.PORT) {
  console.log("port is missing at .env");
}

export const CONFIG = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXP: process.env.ACCESS_TOKEN_EXP,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXP: process.env.REFRESH_TOKEN_EXP,
  COUDINARY_CLOUD_NAME: process.env.COUDINARY_CLOUD_NAME,
  COUDINARY_API_KEY: process.env.COUDINARY_API_KEY,
  COUDINARY_API_SECRET: process.env.COUDINARY_API_SECRET,
};
