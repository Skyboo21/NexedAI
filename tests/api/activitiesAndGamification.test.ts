// tests/api/activitiesAndGamification.test.ts
import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { GET as getActivities, POST as postActivity } from "../../app/api/activities/route";
import { GET as getActivityStats } from "../../app/api/activities/stats/route";
import { GET as getBadges } from "../../app/api/gamification/badges/route";
import { GET as getLeaderboard } from "../../app/api/gamification/leaderboard/route";
import {
  calculateLevelFromXp,
  calculateStreakDays,
  INITIAL_BADGES,
} from "../../src/lib/server/gamificationDb";

describe("Gamification & Activity Telemetry Engine", { timeout: 15000 }, () => {
  it("should calculate correct level designations from total XP", () => {
    expect(calculateLevelFromXp(0)).toBe("Lvl 1 • Novice");
    expect(calculateLevelFromXp(250)).toBe("Lvl 1 • Novice");
    expect(calculateLevelFromXp(500)).toBe("Lvl 2 • Learner");
    expect(calculateLevelFromXp(1200)).toBe("Lvl 3 • Praktikan Terampil");
    expect(calculateLevelFromXp(1600)).toBe("Lvl 5 • Apprentice");
    expect(calculateLevelFromXp(2180)).toBe("Lvl 7 • Scholar");
    expect(calculateLevelFromXp(3200)).toBe("Lvl 10 • Master");
    expect(calculateLevelFromXp(4500)).toBe("Lvl 12 • Grandmaster");
  });

  it("should correctly calculate active streak days from dates", () => {
    expect(calculateStreakDays([])).toBe(0);

    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(now);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    expect(calculateStreakDays([now, yesterday, twoDaysAgo])).toBe(3);
  });

  it("should include all 6 required standard badges", () => {
    expect(INITIAL_BADGES).toHaveLength(6);
    const codes = INITIAL_BADGES.map((b) => b.code);
    expect(codes).toContain("algo_master");
    expect(codes).toContain("active_recaller");
    expect(codes).toContain("deep_thinker");
    expect(codes).toContain("target_achiever");
    expect(codes).toContain("bug_hunter");
    expect(codes).toContain("speed_demon");
  });

  describe("API Endpoints Integration", () => {
    it("should return activities and stats on GET /api/activities", async () => {
      const req = new NextRequest("http://localhost:3000/api/activities");
      const res = await getActivities(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(Array.isArray(json.data)).toBe(true);
      expect(json.stats).toBeDefined();
      expect(typeof json.stats.totalXp).toBe("number");
    });

    it("should reject invalid activity payload on POST /api/activities", async () => {
      const req = new NextRequest("http://localhost:3000/api/activities", {
        method: "POST",
        body: JSON.stringify({ type: "invalid_type", title: "" }),
      });
      const res = await postActivity(req);
      expect(res.status).toBe(400);
    });

    it("should log activity and reward XP on valid POST /api/activities", async () => {
      const req = new NextRequest("http://localhost:3000/api/activities", {
        method: "POST",
        body: JSON.stringify({
          type: "quiz_completed",
          title: "Evaluasi Loop & Iterasi",
          description: "Menuntaskan evaluasi mandiri materi For vs While",
          xpEarned: 100,
          score: 100,
          metadata: { moduleId: "3" },
        }),
      });
      const res = await postActivity(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.activity).toBeDefined();
      expect(json.activity.xpEarned).toBe(100);
      expect(json.newTotalXp).toBeGreaterThanOrEqual(100);
    });

    it("should return gamification statistics on GET /api/activities/stats", async () => {
      const req = new NextRequest("http://localhost:3000/api/activities/stats");
      const res = await getActivityStats(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.stats.level).toBeDefined();
      expect(json.stats.streakDays).toBeGreaterThan(0);
    });

    it("should return badge list on GET /api/gamification/badges", async () => {
      const req = new NextRequest("http://localhost:3000/api/gamification/badges");
      const res = await getBadges(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.length).toBeGreaterThanOrEqual(6);
      expect(json.data[0]).toHaveProperty("unlocked");
    });

    it("should return real-time leaderboard ranking on GET /api/gamification/leaderboard", async () => {
      const req = new NextRequest("http://localhost:3000/api/gamification/leaderboard");
      const res = await getLeaderboard(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.success).toBe(true);
      expect(Array.isArray(json.data)).toBe(true);
      expect(json.data.length).toBeGreaterThan(0);
      expect(json.data[0].rank).toBe(1);
    });
  });
});
