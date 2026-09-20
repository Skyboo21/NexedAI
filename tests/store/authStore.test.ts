// tests/store/authStore.test.ts
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthStore } from "../../src/store/authStore";

describe("useAuthStore Zustand Store", () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({
      user: null,
      role: null,
      token: null,
      isLoading: false,
    });
  });

  it("should initialize with null user and role when empty", () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.role).toBeNull();
    expect(state.token).toBeNull();
  });

  it("should update role and generate user profile when setRole is called", () => {
    useAuthStore.getState().setRole("mahasiswa");
    let state = useAuthStore.getState();
    expect(state.role).toBe("mahasiswa");
    expect(state.user?.name).toBe("Muhammad Hariz Lazuardi");
    expect(state.user?.email).toBe("mahasiswa@nexed.ai");

    useAuthStore.setState({ user: null, role: null });
    useAuthStore.getState().setRole("dosen");
    state = useAuthStore.getState();
    expect(state.role).toBe("dosen");
    expect(state.user?.name).toBe("Dr. Ir. Hendra Wijaya, M.Kom.");

    useAuthStore.setState({ user: null, role: null });
    useAuthStore.getState().setRole("admin");
    state = useAuthStore.getState();
    expect(state.role).toBe("admin");
    expect(state.user?.name).toBe("Administrator Sistem");
  });

  it("should clear user when setRole(null) is called", () => {
    useAuthStore.getState().setRole("mahasiswa");
    expect(useAuthStore.getState().role).toBe("mahasiswa");

    useAuthStore.getState().setRole(null as any);
    expect(useAuthStore.getState().role).toBeNull();
    expect(useAuthStore.getState().user).toBeNull();
  });

  it("should handle login successfully with mock fetch response", async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        user: {
          name: "Muhammad Hariz Lazuardi",
          email: "mahasiswa@nexed.ai",
          role: "mahasiswa",
          nimOrNip: "M3124001",
        },
      }),
    } as any);

    const res = await useAuthStore.getState().login("mahasiswa@nexed.ai", "password123");
    expect(res.success).toBe(true);
    expect(useAuthStore.getState().user?.email).toBe("mahasiswa@nexed.ai");
    expect(useAuthStore.getState().role).toBe("mahasiswa");

    globalThis.fetch = originalFetch;
  });

  it("should handle logout and clear state and localStorage", async () => {
    const originalFetch = globalThis.fetch;
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    } as any);

    await useAuthStore.getState().logout();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().role).toBeNull();

    globalThis.fetch = originalFetch;
  });
});

