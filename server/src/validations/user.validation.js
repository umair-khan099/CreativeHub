import { z } from "zod";

export const registerUserSchema = z.object({
  body: z.object({
    userName: z.string().min(3).max(20),
    email: z.string().email(),
    fullName: z.string().min(3).max(50),
    password: z
      .string()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, "Weak password")
      .min(6),
  }),
});

export const loginUserSchema = z.object({
  body: z.object({
    userName: z.string().min(3).max(20).optional(),
    email: z.string().email().optional(),
    password: z
      .string()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, "Weak password")
      .min(6),
  }),
});
