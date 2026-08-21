import React from 'react';
import { motion } from 'framer-motion';
import { ReededGlassHero } from './ui/ReededGlassHero';

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  intro: string;
}

export function PageHeader({ eyebrow, title, intro }: PageHeaderProps) {
  return (
    <section className="hero-frame relative overflow-hidden border-b border-line bg-surface">
      <ReededGlassHero />
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-40" aria-hidden />
      <div className="relative mx-auto max-w-page px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
          className="font-display text-sm font-bold text-primary">
          
          {eyebrow}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1], delay: 0.05 }}
          className="mt-3 max-w-3xl font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl">
          
          {title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1], delay: 0.1 }}
          className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          
          {intro}
        </motion.p>
      </div>
    </section>);

}