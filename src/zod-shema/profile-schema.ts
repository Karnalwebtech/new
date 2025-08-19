import { z } from "zod";

export const profileSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  email: z
    .string()
    .min(5, { message: "Email must be at least 5 characters long" })
    .max(100, { message: "Email must be less than 100 characters" })
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: "Invalid email format",
    }),
  bio: z.string().nullable().optional(),
  profile_image: z.string().nullable().optional(),
  dateOfBirth: z.string().optional(),
  phone: z
    .union([
      z
        .string()
        .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian phone number"),
      z.number().refine((num) => /^[6-9]\d{9}$/.test(String(num)), {
        message: "Enter a valid 10-digit Indian phone number",
      }),
    ])
    .transform((val) => Number(val)),
  gender: z.string({ message: "Please select a valid gender" }),
});


export const changePasswordSchema = z
  .object({
    c_password: z
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

    n_password: z
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

    cn_password: z
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
  })
  .refine((data) => data.n_password === data.cn_password, {
    message: "New Password and Confirm Password must match",
    path: ["cn_password"], // Error will be shown under "Confirm Password" field
  });
