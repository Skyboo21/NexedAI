// tests/dosen/studentLog.test.ts
import { describe, expect, it } from "vitest";
import { initialStudentLogs } from "../../src/lib/studentLogData";

describe("Student Log & Dosen AI Diagnostic Data", () => {
  it("should contain comprehensive log dataset for high risk students", () => {
    const budi = initialStudentLogs["Budi Santoso"];
    expect(budi).toBeDefined();
    expect(budi?.nim).toBe("202401048");
    expect(budi?.status).toBe("Berisiko");
    expect(budi?.riskLevel).toBe("Tinggi");
    expect(budi?.activityLogs.length).toBeGreaterThanOrEqual(3);
    expect(budi?.aiDiagnosis.rootCause).toBeDefined();
    expect(budi?.aiDiagnosis.strugglingConcepts.length).toBeGreaterThan(0);
  });

  it("should contain activity logs with telemetry information", () => {
    const budi = initialStudentLogs["Budi Santoso"];
    const quizLog = budi?.activityLogs.find((l) => l.category === "Kuis");
    expect(quizLog).toBeDefined();
    expect(quizLog?.score).toBeDefined();
    expect(quizLog?.telemetry?.attempts).toBeDefined();
  });

  it("should contain detailed diagnostic profile for Siti Aminah", () => {
    const siti = initialStudentLogs["Siti Aminah"];
    expect(siti).toBeDefined();
    expect(siti?.status).toBe("Perlu Perhatian");
    expect(siti?.aiDiagnosis.cognitiveProfile).toBeDefined();
  });

  it("should contain positive diagnostic profile for high performing students", () => {
    const ucik = initialStudentLogs["Ucik Dika Maharani"];
    expect(ucik).toBeDefined();
    expect(ucik?.status).toBe("Aman");
    expect(ucik?.mastery).toBeGreaterThanOrEqual(90);
  });
});
