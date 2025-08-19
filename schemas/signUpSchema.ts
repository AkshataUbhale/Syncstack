import { z } from "zod";

export const signUpSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email" }),
    password: z
    .string()
    .min(1,{message: "Password is required"})
    .min(4, { message: "Password must be at least 4 characters long" })
    .max(10, { message: "Password must be at most 10 characters long" }),
  passwordConfirmation: z
    .string()
    .min(1, { message: "Password confirmation is required" })
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: "Passwords must match",
      path: ["passwordConfirmation"],
    })

