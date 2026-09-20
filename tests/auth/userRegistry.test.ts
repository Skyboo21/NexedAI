// tests/auth/userRegistry.test.ts
import { describe, expect, it } from "vitest";
import {
  findUserByIdentifier,
  hashPassword,
  registerServerUser,
  verifyUserCredentials,
} from "../../src/lib/server/userRegistry";

describe("Server-Side User Registry & Hashing", () => {
  it("should verify default seed user with correct password", async () => {
    const user = await verifyUserCredentials("mahasiswa@nexed.ai", "password123");
    expect(user).not.toBeNull();
    expect(user?.role).toBe("mahasiswa");
    expect(user?.name).toBe("Muhammad Hariz Lazuardi");
  });

  it("should reject login with incorrect password", async () => {
    const user = await verifyUserCredentials("mahasiswa@nexed.ai", "wrong_password_999");
    expect(user).toBeNull();
  });

  it("should support login using username prefix or NIM", async () => {
    const byPrefix = await findUserByIdentifier("dosen");
    expect(byPrefix).not.toBeNull();
    expect(byPrefix?.role).toBe("dosen");

    const byNim = await findUserByIdentifier("M3124001");
    expect(byNim).not.toBeNull();
    expect(byNim?.email).toBe("mahasiswa@nexed.ai");
  });

  it("should successfully register a new user with salted hashed password", async () => {
    const uniqueEmail = `test.student.${Date.now()}@nexed.ai`;
    const newUser = await registerServerUser({
      name: "Bintang Pratama",
      email: uniqueEmail,
      role: "mahasiswa",
      nimOrNip: `NIM-${Date.now()}`,
      password: "secureSecretPassword2026!",
    });

    expect(newUser.id).toBeDefined();
    expect(newUser.email).toBe(uniqueEmail.toLowerCase());
    expect(newUser.passwordHash).not.toBe("secureSecretPassword2026!");

    // Verify authentication succeeds with the new password
    const verified = await verifyUserCredentials(uniqueEmail, "secureSecretPassword2026!");
    expect(verified).not.toBeNull();
    expect(verified?.name).toBe("Bintang Pratama");
  });

  it("should reject duplicate registration for the same email", async () => {
    const email = "mahasiswa@nexed.ai";
    await expect(
      registerServerUser({
        name: "Duplikat User",
        email,
        role: "mahasiswa",
        password: "password123",
      }),
    ).rejects.toThrow();
  });

  it("should generate deterministic hash for identical password and salt", async () => {
    const salt = "test_salt_123456";
    const hash1 = await hashPassword("mySecretPassword", salt);
    const hash2 = await hashPassword("mySecretPassword", salt);
    expect(hash1).toBe(hash2);
    expect(hash1.length).toBe(64); // SHA-256 produces 64 hex chars
  });
});
