import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name must be less than 50 characters" }),

  referredCode: z
    .string().optional(),
  phone: z
    .union([
      z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian phone number"),
      z.number().refine((num) => /^[6-9]\d{9}$/.test(String(num)), {
        message: "Enter a valid 10-digit Indian phone number",
      }),
    ])
    .transform((val) => Number(val)),
  email: z
    .string()
    .min(5, { message: "Email must be at least 5 characters long" })
    .max(100, { message: "Email must be less than 100 characters" })
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: "Invalid email format",
    }),
  password: z
    .string()
    .min(4, { message: "Password must be at least 4 characters long" })
    .max(10, { message: "Password must be at most 10 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/\d/, { message: "Password must contain at least one number" })
    .regex(/[@!#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, {
      message:
        "Password must contain at least one special character (@, !, #, etc.)",
    }),
});


export const LoginSchema = z.object({
  email: z
    .string()
    .min(5, { message: "Email must be at least 5 characters long" })
    .max(100, { message: "Email must be less than 100 characters" })
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: "Invalid email format",
    }),
  provider: z
    .string().optional(),
  password: z
    .string()
    .min(4, { message: "Password must be at least 4 characters long" })
    .max(10, { message: "Password must be at most 10 characters long" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/\d/, { message: "Password must contain at least one number" })
    .regex(/[@!#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, {
      message:
        "Password must contain at least one special character (@, !, #, etc.)",
    }),
});

export const ForgetPasswordSchema = z.object({
  email: z
    .string()
    .min(5, { message: "Email must be at least 5 characters long" })
    .max(100, { message: "Email must be less than 100 characters" })
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: "Invalid email format",
    }),
});

export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only numbers"),
});