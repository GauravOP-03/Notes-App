import { z } from "zod";

const loginUserSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export const registerUserSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username must not exceed 20 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      ),

    email: z
      .string()
      .email("Invalid email address")
      .nonempty("Email is required"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(32, "Password must not exceed 32 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
        "Password must include uppercase, lowercase, number, and special character"
      ),

    confirmPassword: z.string().nonempty("Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export interface Note {
  file?: File | null;
  _id: string;
  date: string;
  heading: string;
  noteBody: string;
  image: string[];
  transcribedText?: string;
  audioFile?: string | null;
}

export interface UserProp {
  _id: string;
  username: string;
  email: string;
}
