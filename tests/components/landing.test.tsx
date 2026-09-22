// tests/components/landing.test.tsx
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import LandingPage from '../../app/page';
import { LandingNavbar } from '../../src/components/landing/LandingNavbar';
import { InteractiveAiDemo } from '../../src/components/landing/InteractiveAiDemo';
import { RoleShowcaseTabs } from '../../src/components/landing/RoleShowcaseTabs';
import { LandingFaq } from '../../src/components/landing/LandingFaq';
import { LandingFooter } from '../../src/components/landing/LandingFooter';
import { useAuthStore } from '../../src/store/authStore';

describe('Landing Page Components & User Interactivity', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    useAuthStore.setState({ user: null, role: null, token: null });
  });

  describe('LandingNavbar Component', () => {
    it('should render brand name, desktop nav links, and unauthenticated CTA', () => {
      render(<LandingNavbar />);

      expect(screen.getAllByText(/Nexed/i)[0]).toBeInTheDocument();
      expect(screen.getAllByText(/AI/i)[0]).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /fitur utama/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /simulasi ai/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /pengalaman peran/i })).toBeInTheDocument();

      // Should display Masuk Akun and Mulai Belajar Gratis when unauthenticated
      expect(screen.getByRole('link', { name: /masuk akun/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /mulai belajar gratis/i })).toBeInTheDocument();
    });

    it('should display logged in user name and dashboard link when authenticated', () => {
      useAuthStore.setState({
        user: {
          name: 'Ahmad Mahasiswa',
          email: 'ahmad@student.uns.ac.id',
          role: 'mahasiswa',
          nimOrNip: 'M3124001',
        },
        role: 'mahasiswa',
        token: 'mock-valid-token',
      });

      render(<LandingNavbar />);

      expect(screen.getByText(/Ahmad/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /buka dashboard/i })).toBeInTheDocument();
    });

    it('should toggle mobile menu drawer when mobile button is clicked', () => {
      render(<LandingNavbar />);
      const toggleButton = screen.getByRole('button', { name: /buka menu navigasi/i });
      fireEvent.click(toggleButton);

      // Mobile drawer links should appear
      const mobileNav = screen.getByRole('navigation', { name: /navigasi menu mobile/i });
      expect(mobileNav).toBeInTheDocument();
    });
  });

  describe('InteractiveAiDemo Component', () => {
    it('should render topic pills and default to Looping', () => {
      render(<InteractiveAiDemo />);

      expect(screen.getByRole('button', { name: /looping & iterasi/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /binary search tree/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /rekursi/i })).toBeInTheDocument();

      // Default Ringkasan tab content
      expect(screen.getByText(/Perulangan \(Looping\) adalah struktur kontrol fundamental/i)).toBeInTheDocument();
    });

    it('should switch topic when another topic pill is clicked', async () => {
      render(<InteractiveAiDemo />);

      const bstButton = screen.getByRole('button', { name: /binary search tree/i });
      fireEvent.click(bstButton);

      await waitFor(() => {
        expect(screen.getByText(/Struktur Data Binary Search Tree \(BST\)/i)).toBeInTheDocument();
      });
    });

    it('should switch between tabs (Summary, Roadmap, and Quiz)', () => {
      render(<InteractiveAiDemo />);

      // Switch to Roadmap tab
      const roadmapTab = screen.getByRole('tab', { name: /peta belajar/i });
      fireEvent.click(roadmapTab);
      expect(screen.getByText(/AI mengonversi materi mentah menjadi jalur belajar bertahap/i)).toBeInTheDocument();
      expect(screen.getByText(/Konsep Iterasi Sekuensial/i)).toBeInTheDocument();

      // Switch to Quiz tab
      const quizTab = screen.getByRole('tab', { name: /kuis adaptif/i });
      fireEvent.click(quizTab);
      expect(screen.getByText(/Formatif Adaptif • 1 Soal Sampel/i)).toBeInTheDocument();
      expect(screen.getByText(/Kapan struktur WHILE loop lebih disukai daripada FOR loop\?/i)).toBeInTheDocument();
    });

    it('should handle quiz answer selection and show instant explanation', () => {
      render(<InteractiveAiDemo />);

      // Go to quiz tab
      const quizTab = screen.getByRole('tab', { name: /kuis adaptif/i });
      fireEvent.click(quizTab);

      // Select correct option
      const correctOption = screen.getByRole('button', {
        name: /ketika jumlah perulangan tidak diketahui pasti sebelum program berjalan/i,
      });
      fireEvent.click(correctOption);

      expect(screen.getByText(/✓ Benar/i)).toBeInTheDocument();
      expect(screen.getByText(/Penjelasan Jawaban:/i)).toBeInTheDocument();
    });
  });

  describe('RoleShowcaseTabs Component', () => {
    it('should render all 3 roles and default to Mahasiswa', () => {
      render(<RoleShowcaseTabs />);

      expect(screen.getByRole('tab', { name: /untuk mahasiswa/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /untuk dosen/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /untuk admin/i })).toBeInTheDocument();

      expect(screen.getByText(/Taklukkan Pemrograman dengan Bimbingan AI 24\/7/i)).toBeInTheDocument();
      expect(screen.getByText(/Upload Modul PDF \/ DOCX langsung diproses AI/i)).toBeInTheDocument();
    });

    it('should switch to Dosen and Administrator tabs', () => {
      render(<RoleShowcaseTabs />);

      // Switch to Dosen
      const dosenTab = screen.getByRole('tab', { name: /untuk dosen/i });
      fireEvent.click(dosenTab);

      expect(screen.getByText(/Pantau Penguasaan Materi Kelas & Lakukan Intervensi Cepat/i)).toBeInTheDocument();
      expect(screen.getByText(/Distribusi Grade A–E dan metrik penguasaan kelas/i)).toBeInTheDocument();

      // Switch to Admin
      const adminTab = screen.getByRole('tab', { name: /untuk admin/i });
      fireEvent.click(adminTab);

      expect(screen.getByText(/Kontrol Akses Terpusat & Pemantauan Performa Server/i)).toBeInTheDocument();
      expect(screen.getByText(/Audit log perubahan hak akses & otentikasi/i)).toBeInTheDocument();
    });
  });

  describe('LandingFaq Component', () => {
    it('should render FAQ items and toggle accordion state', () => {
      render(<LandingFaq />);

      expect(screen.getByText(/Pertanyaan yang Sering Diajukan/i)).toBeInTheDocument();
      expect(screen.getByText(/Apa itu NexedAI dan siapa yang mengembangkannya\?/i)).toBeInTheDocument();

      // Open second FAQ item
      const secondQuestionButton = screen.getByRole('button', {
        name: /bagaimana nexedai mempersonalisasi materi belajar mahasiswa\?/i,
      });
      fireEvent.click(secondQuestionButton);

      expect(
        screen.getByText(/Setelah modul diunggah, AI memecah materi menjadi konsep inti/i)
      ).toBeInTheDocument();
    });
  });

  describe('LandingFooter Component', () => {
    it('should render university attribution, navigation links, and system specs', () => {
      render(<LandingFooter />);

      expect(screen.getByText(/D3 TI SV Universitas Sebelas Maret/i)).toBeInTheDocument();
      expect(screen.getByText(/Next.js 15 App Router/i)).toBeInTheDocument();
      expect(screen.getByText(/Rust Biome Engine/i)).toBeInTheDocument();
      expect(screen.getByText(/PBKDF2 Cryptographic/i)).toBeInTheDocument();
    });
  });

  describe('Full LandingPage Assembly', () => {
    it('should render the entire landing page with hero, bento grid, and cta', () => {
      render(<LandingPage />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent(/Platform E-Learning Adaptif/i);
      expect(heading).toHaveTextContent(/Berbasis AI/i);

      expect(
        screen.getByText(/Dirancang untuk Kebutuhan Riil Praktikum Vokasi/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Dibangun di Atas Fondasi Rekayasa Modern/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Tingkatkan Pemahaman Algoritma & Pemrograman Anda Hari Ini/i)
      ).toBeInTheDocument();
    });
  });
});
