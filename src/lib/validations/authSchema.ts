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
  email: z.string().min(1, "Email atau username akun wajib diisi"),
  password: z
    .string()
    .min(6, "Kata sandi minimal 6 karakter")
    .max(100, "Kata sandi terlalu panjang"),
  rememberMe: z.boolean(),
});

export type LoginInput = z.infer<typeof LoginInputSchema>;

export const RegisterInputSchema = z
  .object({
    name: z.string().min(2, "Nama lengkap minimal 2 karakter"),
    email: z
      .string()
      .min(1, "Alamat email kampus wajib diisi")
      .email("Format email tidak valid (contoh: nama@nexed.ai)"),
    role: z.enum(["mahasiswa", "dosen"]),
    nimOrNip: z.string().min(5, "NIM / NIP wajib diisi"),
    password: z
      .string()
      .min(6, "Kata sandi minimal 6 karakter")
      .max(100, "Kata sandi terlalu panjang"),
    confirmPassword: z.string().min(6, "Konfirmasi kata sandi wajib diisi"),
    terms: z.boolean().refine((val) => val === true, {
      message: "Anda harus menyetujui syarat & ketentuan",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi kata sandi tidak cocok",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof RegisterInputSchema>;
