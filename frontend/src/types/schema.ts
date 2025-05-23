import { z } from "zod";

export const loginUserSchema = z.object({
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
});

export const registerUserSchema = z.object({
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
});

interface aiData {
  createdAt: string;
  updatedAt?: string;
  summary?: string;
  tags?: [string];
}
export interface Note {
  file?: File | null;
  _id: string;
  createdAt: string;
  updatedAt: string;
  heading: string;
  noteBody: string;
  image: string[];
  transcribedText?: string;
  audioFile?: string | null;
  shareId?: string;
  visibility: "public" | "private";
  sharedUntil?: string;
  aiData?: aiData;
}

export interface UserProp {
  _id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  provider: "Email" | "Google";
}
