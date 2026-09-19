// src/lib/validations/authSchema.ts
import { z } from "zod";

export const RoleSchema = z.enum(["mahasiswa", "dosen", "admin"]);
export type Role = z.infer<typeof RoleSchema> | null;

export const UserSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  role: RoleSchema,
  avatar: z.string().optional(),
  nimOrNip: z.string().optional(),
  semester: z.number().optional(),
  prodi: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;

export const LoginInputSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi")
    .email("Format email tidak valid (contoh: mahasiswa@nexed.ai)"),
  password: z
    .string()
    .min(6, "Kata sandi minimal 6 karakter")
    .max(100, "Kata sandi terlalu panjang"),
  rememberMe: z.boolean(),
});

export type LoginInput = z.infer<typeof LoginInputSchema>;
