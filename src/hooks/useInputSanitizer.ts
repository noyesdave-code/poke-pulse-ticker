import { z } from "zod";

export const searchSchema = z
  .string()
  .max(200, "Search query too long")
  .transform((v) => v.replace(/<[^>]*>/g, "").trim());

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  message: z.string().trim().min(1, "Message required").max(2000),
});

export const profileSchema = z.object({
  display_name: z.string().trim().max(50, "Name too long").optional(),
  avatar_url: z.string().url().max(500).optional().or(z.literal("")),
});

export function sanitizeSearchInput(raw: string): string {
  const result = searchSchema.safeParse(raw);
  return result.success ? result.data : raw.slice(0, 200).replace(/<[^>]*>/g, "").trim();
}
