// tests/components/ui.test.tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import ProfileLayoutClient from "../../app/profil/ProfileLayoutClient";
import LogoutButton from "../../src/components/LogoutButton";
import NexedLeaderboard from "../../src/components/NexedLeaderboard";
import { useAuthStore } from "../../src/store/authStore";

describe("UI Components & Accessibility", () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, role: null, token: null });
  });

  it("should render LogoutButton with accessible aria-label", () => {
    render(<LogoutButton />);
    const button = screen.getByRole("button", { name: /keluar dari akun/i });
    expect(button).toBeInTheDocument();
  });

  it("should render NexedLeaderboard with default XP tab", () => {
    render(<NexedLeaderboard />);
    expect(screen.getByText(/Papan Peringkat & Lencana Capaian/i)).toBeInTheDocument();
    expect(screen.getByText(/Ucik Dika Maharani/i)).toBeInTheDocument();
  });

  it("should toggle between Leaderboard and Badges tabs", () => {
    render(<NexedLeaderboard />);
    const badgesTabButton = screen.getByRole("tab", { name: /koleksi lencana/i });
    fireEvent.click(badgesTabButton);

    expect(screen.getByText(/Algo Master/i)).toBeInTheDocument();
    expect(screen.getByText(/Active Recaller/i)).toBeInTheDocument();
  });

  describe("ProfileLayoutClient Role-Adaptive Sidebar", () => {
    it("should render Admin Sidebar when role is admin", () => {
      useAuthStore.setState({
        user: {
          name: "Administrator Sistem",
          email: "admin@nexed.ai",
          role: "admin",
          nimOrNip: "ADM-001",
        },
        role: "admin",
        token: "admin-token",
      });

      render(
        <ProfileLayoutClient initialRole="admin">
          <div>Konten Profil Admin</div>
        </ProfileLayoutClient>,
      );

      expect(screen.getAllByText(/Portal Admin/i)[0]).toBeInTheDocument();
      expect(screen.getAllByText(/Super Administrator/i)[0]).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /profil admin/i })).toBeInTheDocument();
      expect(screen.getByText(/Konten Profil Admin/i)).toBeInTheDocument();
    });

    it("should render Dosen Sidebar when role is dosen", () => {
      useAuthStore.setState({
        user: {
          name: "Dr. Hendra Wijaya",
          email: "dosen@nexed.ai",
          role: "dosen",
          nimOrNip: "198504122010121003",
        },
        role: "dosen",
        token: "dosen-token",
      });

      render(
        <ProfileLayoutClient initialRole="dosen">
          <div>Konten Profil Dosen</div>
        </ProfileLayoutClient>,
      );

      expect(screen.getAllByText(/Portal Dosen/i)[0]).toBeInTheDocument();
      expect(screen.getAllByText(/Dosen Pengampu Aktif/i)[0]).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /profil dosen/i })).toBeInTheDocument();
      expect(screen.getByText(/Konten Profil Dosen/i)).toBeInTheDocument();
    });

    it("should render Mahasiswa Sidebar when role is mahasiswa", () => {
      useAuthStore.setState({
        user: {
          name: "Muhammad Hariz",
          email: "mahasiswa@nexed.ai",
          role: "mahasiswa",
          nimOrNip: "M3124001",
        },
        role: "mahasiswa",
        token: "mhs-token",
      });

      render(
        <ProfileLayoutClient initialRole="mahasiswa">
          <div>Konten Profil Mahasiswa</div>
        </ProfileLayoutClient>,
      );

      expect(screen.getAllByText(/Portal Mahasiswa/i)[0]).toBeInTheDocument();
      expect(screen.getAllByText(/Mahasiswa Aktif/i)[0]).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /profil saya/i })).toBeInTheDocument();
      expect(screen.getByText(/Konten Profil Mahasiswa/i)).toBeInTheDocument();
    });
  });
});
