// tests/components/ui.test.tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LogoutButton from "../../src/components/LogoutButton";
import NexedLeaderboard from "../../src/components/NexedLeaderboard";

describe("UI Components & Accessibility", () => {
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
});
