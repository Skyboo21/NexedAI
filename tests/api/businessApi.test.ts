// tests/api/businessApi.test.ts
import { describe, expect, it } from "vitest";
import { GET as meHandler } from "../../app/api/auth/me/route";
import { GET as getInterventions, POST as postIntervention } from "../../app/api/interventions/route";
import { GET as getMastery } from "../../app/api/mastery/route";
import { GET as getTasks, POST as postTask } from "../../app/api/tasks/route";
import { signSessionToken } from "../../src/lib/server/sessionToken";

describe("Business & Session API Endpoints", () => {
  describe("/api/auth/me", () => {
    it("should return 401 when no session cookie is present", async () => {
      const req = new Request("http://localhost:3000/api/auth/me");
      const res = await meHandler(req as any);
      expect(res.status).toBe(401);
      const json = await res.json();
      expect(json.authenticated).toBe(false);
    });

    it("should return 200 and user data when valid session cookie is provided", async () => {
      const token = await signSessionToken({
        sub: "usr_mhs_001",
        email: "mahasiswa@nexed.ai",
        role: "mahasiswa",
        name: "Muhammad Hariz Lazuardi",
      });

      const req = new Request("http://localhost:3000/api/auth/me", {
        headers: {
          cookie: `nexed_session_token=${token}`,
        },
      });

      const res = await meHandler(req as any);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.authenticated).toBe(true);
      expect(json.user.email).toBe("mahasiswa@nexed.ai");
    });
  });

  describe("/api/tasks", () => {
    it("should return default task list on GET", async () => {
      const res = await getTasks();
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(Array.isArray(json.data)).toBe(true);
      expect(json.data.length).toBeGreaterThanOrEqual(1);
    });

    it("should add a new task on POST", async () => {
      const req = new Request("http://localhost:3000/api/tasks", {
        method: "POST",
        body: JSON.stringify({
          title: "Belajar Algoritma Greedy",
          courseName: "Algoritma & Pemrograman",
          priority: "HIGH",
          dueDate: "2026-10-15",
        }),
      });
      const res = await postTask(req);
      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.title).toBe("Belajar Algoritma Greedy");
    });

    it("should reject POST with invalid data", async () => {
      const req = new Request("http://localhost:3000/api/tasks", {
        method: "POST",
        body: JSON.stringify({ title: "" }),
      });
      const res = await postTask(req);
      expect(res.status).toBe(400);
    });
  });

  describe("/api/interventions", () => {
    it("should record a new lecturer intervention", async () => {
      const req = new Request("http://localhost:3000/api/interventions", {
        method: "POST",
        body: JSON.stringify({
          studentName: "Budi Santoso",
          type: "Penugasan Remedial",
          message: "Harap kerjakan modul tracing table.",
        }),
      });
      const res = await postIntervention(req);
      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.success).toBe(true);

      const listRes = await getInterventions();
      const listJson = await listRes.json();
      expect(listJson.data.some((i: any) => i.studentName === "Budi Santoso")).toBe(true);
    });

    it("should reject intervention with missing fields", async () => {
      const req = new Request("http://localhost:3000/api/interventions", {
        method: "POST",
        body: JSON.stringify({ studentName: "" }),
      });
      const res = await postIntervention(req);
      expect(res.status).toBe(400);
    });
  });

  describe("/api/mastery", () => {
    it("should return class mastery data", async () => {
      const res = await getMastery();
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(Array.isArray(json.data)).toBe(true);
      expect(json.data.length).toBeGreaterThan(0);
    });
  });
});
