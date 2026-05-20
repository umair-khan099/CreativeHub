import mongoose from "mongoose";
import { CONFIG } from "../config/dotenv.config.js";

export const connectDb = async () => {
  try {
    if (!CONFIG.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    const dbInstence = await mongoose.connect(`${CONFIG.MONGO_URI}`, {
      dbName: "CreativeHub",
    });
    console.log(`✅ MongoDB connected! Host:: ${dbInstence.connection.host}`);
  } catch (error) {
    console.log(`❌ Failed to connect to MongoDB: `, error);
    process.exit(1);
  }
};
