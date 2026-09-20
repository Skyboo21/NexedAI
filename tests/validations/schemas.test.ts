// tests/validations/schemas.test.ts
import { describe, expect, it } from "vitest";
import {
  LoginInputSchema,
  RegisterInputSchema,
} from "../../src/lib/validations/authSchema";
import {
  CreateTaskSchema,
  StudentMasterySchema,
} from "../../src/schemas/taskSchema";

describe("Validation Schemas (Zod)", () => {
  describe("LoginInputSchema", () => {
    it("should accept valid email and password", () => {
      const valid = {
        email: "mahasiswa@nexed.ai",
        password: "password123",
        rememberMe: true,
      };
      const res = LoginInputSchema.safeParse(valid);
      expect(res.success).toBe(true);
    });

    it("should accept username identifier without @ sign", () => {
      const valid = {
        email: "hariz_lazuardi",
        password: "password123",
      };
      const res = LoginInputSchema.safeParse(valid);
      expect(res.success).toBe(true);
    });

    it("should reject empty identifier or short password", () => {
      const invalid = {
        email: "",
        password: "123",
      };
      const res = LoginInputSchema.safeParse(invalid);
      expect(res.success).toBe(false);
    });
  });

  describe("RegisterInputSchema", () => {
    it("should validate complete registration form with matching passwords", () => {
      const valid = {
        name: "Ahmad Dahlan",
        email: "ahmad@student.uns.ac.id",
        role: "mahasiswa",
        nimOrNip: "M3124099",
        password: "rahasiaNegara123",
        confirmPassword: "rahasiaNegara123",
        terms: true,
      };
      const res = RegisterInputSchema.safeParse(valid);
      expect(res.success).toBe(true);
    });

    it("should reject when passwords do not match", () => {
      const invalid = {
        name: "Ahmad Dahlan",
        email: "ahmad@student.uns.ac.id",
        role: "mahasiswa",
        nimOrNip: "M3124099",
        password: "passwordA",
        confirmPassword: "passwordB",
        terms: true,
      };
      const res = RegisterInputSchema.safeParse(invalid);
      expect(res.success).toBe(false);
    });

    it("should reject when terms are false", () => {
      const invalid = {
        name: "Ahmad Dahlan",
        email: "ahmad@student.uns.ac.id",
        role: "mahasiswa",
        nimOrNip: "M3124099",
        password: "rahasiaNegara123",
        confirmPassword: "rahasiaNegara123",
        terms: false,
      };
      const res = RegisterInputSchema.safeParse(invalid);
      expect(res.success).toBe(false);
    });
  });

  describe("CreateTaskSchema", () => {
    it("should accept valid learning task input", () => {
      const valid = {
        title: "Praktikum Queue & Stack",
        courseName: "Struktur Data",
        priority: "HIGH",
        dueDate: "2026-09-30",
      };
      const res = CreateTaskSchema.safeParse(valid);
      expect(res.success).toBe(true);
    });

    it("should reject invalid priority", () => {
      const invalid = {
        title: "Test Task",
        courseName: "Struktur Data",
        priority: "INVALID_PRIORITY",
        dueDate: "2026-09-30",
      };
      const res = CreateTaskSchema.safeParse(invalid);
      expect(res.success).toBe(false);
    });
  });

  describe("StudentMasterySchema", () => {
    it("should validate student mastery record correctly", () => {
      const valid = {
        id: 101,
        name: "Ucik Dika",
        topic: "Looping",
        mastery: 95,
        status: "Aman",
      };
      const res = StudentMasterySchema.safeParse(valid);
      expect(res.success).toBe(true);
    });
  });
});
