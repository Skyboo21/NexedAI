"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const easeCurve = [0.16, 1, 0.3, 1] as const;

export function HeroSection() {
  return (
    <section className="relative min-h-[92vh] sm:min-h-screen w-full bg-white flex flex-col justify-center overflow-hidden font-['Inter',sans-serif] pt-28 sm:pt-32 pb-16 sm:pb-20">
      {/* 1. Education & Learning Themed Silhouette Background Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Subtle architectural dot/grid pattern */}
        <div className="absolute inset-0 bento-bg-grid opacity-50" />

        {/* Ambient radial lighting */}
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-black/[0.02] to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Themed Education Silhouette Graphic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: easeCurve }}
          className="absolute right-0 top-0 w-full md:w-[65%] lg:w-[58%] h-full flex items-center justify-center md:justify-end pr-0 md:pr-4 lg:pr-12"
        >
          <div className="relative w-full max-w-[850px] aspect-[16/10] sm:aspect-[16/9]">
            {/* Themed Education & AI Learning Graphic */}
            <Image
              src="/images/hero-education-silhouette.jpg"
              alt="Siluet Pendidikan dan Pembelajaran AI Adaptif"
              width={850}
              height={530}
              priority
              className="w-full h-full object-contain object-right-bottom mix-blend-multiply opacity-80 transition-opacity duration-700 pointer-events-none select-none"
              style={{
                maskImage:
                  "radial-gradient(ellipse at 65% 55%, black 45%, rgba(0,0,0,0.4) 70%, transparent 95%), linear-gradient(to right, transparent 0%, black 25%, black 100%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse at 65% 55%, black 45%, rgba(0,0,0,0.4) 70%, transparent 95%), linear-gradient(to right, transparent 0%, black 25%, black 100%)",
              }}
            />

          </div>
        </motion.div>

        {/* Left-to-right fade gradient to keep hero text on the left 100% pristine */}
        <div className="absolute inset-y-0 left-0 w-full md:w-[50%] bg-gradient-to-r from-white via-white/95 to-transparent pointer-events-none z-10" />

        {/* Soft bottom edge fade for seamless transition to marquee */}
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
      </div>

      {/* 2. Main Hero Content (Vertically Balanced & Proportional) */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.9, ease: easeCurve }}
        className="relative z-30 w-full max-w-7xl mx-auto px-6 sm:px-8 my-auto"
      >
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          {/* Left Block: Subtitle + Heading + Buttons */}
          <div className="space-y-5 max-w-3xl">
            {/* Subtitle Line: 8px black circle dot + text (13px, 55% opacity black) */}
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8, ease: easeCurve }}
              className="flex items-center gap-2.5 text-[13px] text-black/60 font-medium"
            >
              <span className="w-2 h-2 rounded-full bg-black shrink-0" />
              <span>Platform E-Learning Adaptif Berbasis AI 2026</span>
            </motion.div>

            {/* Heading: Font-weight 300, clamp, letter-spacing -0.03em, line-height 1 */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8, ease: easeCurve }}
              className="text-black font-light tracking-[-0.03em] leading-[1.05] text-[clamp(2.2rem,7vw,4.5rem)] md:text-[clamp(2.6rem,5.2vw,4.5rem)]"
            >
              Platform E-Learning Adaptif
              <br />
              Berbasis AI. Worldwide.
            </motion.h1>

            {/* Two Buttons: Black pill and Transparent with dark border */}
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8, ease: easeCurve }}
              className="flex flex-wrap items-center gap-3 pt-2"
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
          <div className="flex flex-wrap md:flex-col items-start md:items-end gap-2.5 shrink-0">
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
