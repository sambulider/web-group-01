import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRightIcon, CalendarCheckIcon, PlayCircleIcon } from 'lucide-react';
import { btnGhost, btnPrimary } from '../ui/Primitives';
import { cn } from '../../utils/cn';

const EASE = [0.23, 1, 0.32, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '14%']);
  const cardY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '-22%']);

  return (
    <section ref={ref} className="relative overflow-hidden border-b border-line bg-surface">
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-60" aria-hidden />
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-[26rem] w-[26rem] rounded-full bg-primary-soft"
        aria-hidden />
      

      <div className="relative mx-auto grid max-w-page items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-8 lg:py-24">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, ease: EASE, delay: 0.05 }}
            className="mt-6 font-display text-4xl font-extrabold leading-[1.06] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            
            Learning, technology and opportunity — free for every young person in Batticaloa.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, ease: EASE, delay: 0.1 }}
            className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            
            Digital literacy, leadership, entrepreneurship and career programmes delivered from the
            Eastern University library complex — with an open library, study space and high-speed
            internet for all members.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, ease: EASE, delay: 0.15 }}
            className="mt-8 flex flex-wrap items-center gap-3">
            
            <Link to="/apply" className={cn(btnPrimary, 'h-12 px-6 text-base')}>
              Apply to a programme
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link to="/gallery" className={cn(btnGhost, 'h-12 px-6 text-base')}>
              <PlayCircleIcon className="h-4 w-4 text-primary" />
              See the Corner in action
            </Link>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: EASE, delay: 0.22 }}
            className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-line pt-6">
            
            {[
            { k: '4,800+', v: 'Active members' },
            { k: '38', v: 'Programmes a year' },
            { k: '14', v: 'Years serving the East' }].
            map((item) =>
            <div key={item.v}>
                <dt className="font-display text-2xl font-extrabold text-ink">{item.k}</dt>
                <dd className="text-sm text-muted">{item.v}</dd>
              </div>
            )}
          </motion.dl>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.36, ease: EASE, delay: 0.08 }}
          className="relative">
          
          <div className="relative h-[22rem] overflow-hidden rounded-3xl border border-line shadow-lift sm:h-[26rem] lg:h-[32rem]">
            <motion.img
              style={{ y: imageY }}
              src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1400&q=75"
              alt="Students collaborating during a session at American Corner Batticaloa"
              className="h-[118%] w-full object-cover" />
            
          </div>

          <motion.div
            style={{ y: cardY }}
            className="absolute -bottom-6 left-4 w-[17rem] rounded-2xl border border-line bg-surface/95 p-4 shadow-lift backdrop-blur sm:left-6">
            
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
                <CalendarCheckIcon className="h-5 w-5" />
              </span>
              <div className="leading-tight">
                <p className="font-display text-sm font-bold text-ink">Next open session</p>
                <p className="text-xs text-muted">Digital Literacy · Mon 4:00 PM</p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              9 seats remaining in Cohort 12. Applications close once the cohort fills.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>);

}