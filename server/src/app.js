import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import { CONFIG } from "./config/dotenv.config.js";



// express app

export const app = express();

// CORS
app.use(
  cors({
    origin: CONFIG.CORS_ORIGIN,
    credentials: true,
  }),
);

// middlewares
app.use(morgan("dev"));
app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// all route fiile import
import { authRouter } from "./routes/auth.route.js";

//  route declaration
app.use("/api/v1/auth", authRouter);
