import dotenv from "dotenv";

dotenv.config();

if (!process.env.PORT) {
  console.log("port is missing at .env");
}

export const CONFIG = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
};
