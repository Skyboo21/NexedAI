// tests/auth/sessionToken.test.ts
import { describe, expect, it } from "vitest";
import {
  signSessionToken,
  verifySessionToken,
} from "../../src/lib/server/sessionToken";

describe("Cryptographic Session Token Engine (HMAC-SHA256)", () => {
  const mockPayload = {
    sub: "usr-test-123",
    email: "mahasiswa@nexed.ai",
    role: "mahasiswa" as const,
    name: "Muhammad Hariz",
    nimOrNip: "M3124001",
  };

  it("should successfully sign and verify a valid session token", async () => {
    const token = await signSessionToken(mockPayload);
    expect(token).toBeDefined();
    expect(token.includes(".")).toBe(true);

    const verified = await verifySessionToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.sub).toBe(mockPayload.sub);
    expect(verified?.email).toBe(mockPayload.email);
    expect(verified?.role).toBe(mockPayload.role);
    expect(verified?.name).toBe(mockPayload.name);
  });

  it("should reject a token with tampered payload", async () => {
    const token = await signSessionToken(mockPayload);
    const [payloadB64, signatureB64] = token.split(".");

    // Tamper with payload (e.g. inject role 'admin')
    const tamperedPayloadB64 = btoa(
      JSON.stringify({ ...mockPayload, role: "admin", exp: Date.now() + 10000 }),
    );
    const tamperedToken = `${tamperedPayloadB64}.${signatureB64}`;

    const verified = await verifySessionToken(tamperedToken);
    expect(verified).toBeNull();
  });

  it("should reject an expired token", async () => {
    const expiredToken = await signSessionToken({
      ...mockPayload,
      exp: Date.now() - 5000, // expired 5 seconds ago
    });

    const verified = await verifySessionToken(expiredToken);
    expect(verified).toBeNull();
  });

  it("should return null for malformed or empty token strings", async () => {
    expect(await verifySessionToken("")).toBeNull();
    expect(await verifySessionToken(null as unknown as string)).toBeNull();
    expect(await verifySessionToken("not-a-token")).toBeNull();
    expect(await verifySessionToken("abc.def.ghi")).toBeNull();
  });

  it("should reject token signed with a different secret key", async () => {
    const secretA = "secret_key_alpha_12345678901234567890";
    const secretB = "secret_key_beta_12345678901234567890";

    const token = await signSessionToken(mockPayload, secretA);
    const verified = await verifySessionToken(token, secretB);
    expect(verified).toBeNull();
  });
});
