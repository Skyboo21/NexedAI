// src/components/landing/HeroSection.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const easeCurve = [0.16, 1, 0.3, 1] as const;

export function HeroSection() {
  return (
    <section className="relative min-h-screen w-full bg-white flex flex-col justify-between overflow-hidden font-['Inter',sans-serif]">
      {/* 1. Background Video Wrapper (Centered on mobile 80%, full on desktop 100%) */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, ease: easeCurve }}
        className="hero-video-wrapper pointer-events-none"
      >
        <video
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Spacer to push content down */}
      <div className="flex-1" />

      {/* 2. White Gradient Fade-up Overlay */}
      <div className="hero-gradient-overlay" />

      {/* 3. Footer / Bottom Content Pinned to Bottom */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1, ease: easeCurve }}
        className="relative z-30 w-full max-w-7xl mx-auto px-6 pb-12 sm:px-8 sm:pb-16"
      >
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          {/* Left Block: Subtitle + Heading + Buttons */}
          <div className="space-y-4 max-w-3xl">
            {/* Subtitle Line: 8px black circle dot + text (13px, 55% opacity black) */}
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8, ease: easeCurve }}
              className="flex items-center gap-2.5 text-[13px] text-black/55 font-medium"
            >
              <span className="w-2 h-2 rounded-full bg-black shrink-0" />
              <span>Platform E-Learning Adaptif Berbasis AI 2026</span>
            </motion.div>

            {/* Heading: Font-weight 300, clamp, letter-spacing -0.03em, line-height 1 */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8, ease: easeCurve }}
              className="text-black font-light tracking-[-0.03em] leading-[1] text-[clamp(2rem,8vw,4.5rem)] md:text-[clamp(2.5rem,5.5vw,4.5rem)]"
            >
              Platform E-Learning Adaptif
              <br />
              Berbasis AI. Worldwide.
            </motion.h1>

            {/* Two Buttons: Black pill and Transparent with dark border */}
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.8, ease: easeCurve }}
              className="flex flex-wrap items-center gap-3 pt-3"
            >
              <Link href="/register" className="btn-pill-black">
                Mulai Belajar Sekarang
              </Link>
              <a href="#demo" className="btn-pill-outline">
                Coba Demo Interaktif
              </a>
            </motion.div>
          </div>

          {/* Right Block: Three Tag Pills */}
          <div className="flex flex-wrap md:flex-col items-start md:items-end gap-2 shrink-0">
            <span className="tag-pill">Neuromorphic AI</span>
            <span className="tag-pill">Adaptive Roadmap</span>
            <span className="tag-pill">Cybernetics & Recalls</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default HeroSection;
