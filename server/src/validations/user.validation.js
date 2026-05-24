import { z } from "zod";

export const registerUserSchema = z.object({
  body: z.object({
    userName: z.string().min(3).max(20),
    email: z.string().email(),
    fullName: z.string().min(3).max(50),
    password: z.string().min(6),
  }),
});
