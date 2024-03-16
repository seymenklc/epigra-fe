import { z } from "zod"

export const LoginSchema = z.object({
   email: z.string().email(),
   password: z.string(),
})

export type LoginCredentials = z.infer<typeof LoginSchema>

export const RegisterSchema = z
   .object({
      email: z.string().email(),
      username: z.string().max(20, "Username must be less than 20 characters"),
      password: z.string().min(8, "Password must be at least 8 characters"),
      confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
   })
   .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
   })

export type RegisterCredentials = z.infer<typeof RegisterSchema>