import { z } from "zod"

// ── Profile Tab ──

export const profileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().min(1, "Email is required").email("Must be a valid email"),
  headline: z.string().max(200),
  bio: z.string().max(2000),
  location: z.string().max(200),
  timezone: z.string().min(1, "Timezone is required"),
  github: z.string().max(100),
  linkedin: z.string().max(100),
  twitter: z.string().max(100),
  website: z.string().max(200),
})

export type ProfileFormData = z.infer<typeof profileSchema>

// ── Portfolio Tab ──

export const portfolioSchema = z.object({
  portfolioPublic: z.boolean(),
  showEmail: z.boolean(),
  openToWork: z.boolean(),
})

export type PortfolioFormData = z.infer<typeof portfolioSchema>

// ── Notifications Tab ──

export const notificationsSchema = z.object({
  emailNotifications: z.boolean(),
  newMessageAlert: z.boolean(),
  weeklyDigest: z.boolean(),
})

export type NotificationsFormData = z.infer<typeof notificationsSchema>

// ── Security Tab ──

const changePasswordBase = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128),
  confirmPassword: z.string().min(1, "Please confirm your password"),
})

export const changePasswordSchema = changePasswordBase.refine(
  (data) => data.newPassword === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }
)

export type ChangePasswordFormData = z.infer<typeof changePasswordBase>
