// tests/auth/authApi.test.ts
import { describe, expect, it } from "vitest";
import { POST as loginHandler } from "../../app/api/auth/login/route";
import { POST as logoutHandler } from "../../app/api/auth/logout/route";
import { POST as registerHandler } from "../../app/api/auth/register/route";

describe("BFF Auth API Route Handlers", () => {
  it("should return 400 when login payload is malformed", async () => {
    const req = new Request("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "", password: "" }),
    });
    const res = await loginHandler(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
  });

  it("should return 401 when password does not match", async () => {
    const req = new Request("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "mahasiswa@nexed.ai", password: "wrongpassword123" }),
    });
    const res = await loginHandler(req);
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.success).toBe(false);
  });

  it("should return 200 and set HttpOnly session cookie on successful login", async () => {
    const req = new Request("http://localhost:3000/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: "mahasiswa@nexed.ai", password: "password123" }),
    });
    const res = await loginHandler(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.user.role).toBe("mahasiswa");

    // Verify Set-Cookie header contains session token
    const cookieHeader = res.headers.get("set-cookie");
    expect(cookieHeader).toBeDefined();
    expect(cookieHeader).toContain("nexed_session_token=");
    expect(cookieHeader).toContain("HttpOnly");
  });

  it("should clear session cookies on logout", async () => {
    const res = await logoutHandler();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);

    const cookieHeader = res.headers.get("set-cookie");
    expect(cookieHeader?.toLowerCase()).toContain("max-age=0");
  });

  it("should register a new student and set session cookie", async () => {
    const uniqueEmail = `new.student.${Date.now()}@uns.ac.id`;
    const req = new Request("http://localhost:3000/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: "Test Mahasiswa Baru",
        email: uniqueEmail,
        role: "mahasiswa",
        nimOrNip: `M3124${Math.floor(Math.random() * 900 + 100)}`,
        password: "passwordSuperAman2026",
        confirmPassword: "passwordSuperAman2026",
        terms: true,
      }),
    });
    const res = await registerHandler(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.user.email).toBe(uniqueEmail.toLowerCase());
  });
});
