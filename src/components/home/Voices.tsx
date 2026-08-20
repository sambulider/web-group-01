import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { QuoteIcon } from 'lucide-react';
import { partners, testimonials } from '../../data/site';
import { Reveal } from '../ui/Reveal';
import { cn } from '../../utils/cn';

const EASE = [0.23, 1, 0.32, 1] as const;

export function Voices() {
  const [active, setActive] = useState(0);
  const current = testimonials[active];

  return (
    <section className="border-y border-line bg-surface py-16 lg:py-20">
      <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:gap-16">
          <div>
            <Reveal>
              <QuoteIcon className="h-8 w-8 text-primary" aria-hidden />
            </Reveal>
            <div className="relative mt-6 min-h-[13rem]">
              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={current.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.24, ease: EASE }}>
                  
                  <p className="font-display text-xl font-semibold leading-snug tracking-tight text-ink sm:text-2xl lg:text-[1.75rem]">
                    “{current.quote}”
                  </p>
                  <footer className="mt-6 flex items-center gap-3">
                    <img
                      src={current.avatar}
                      alt=""
                      loading="lazy"
                      className="h-11 w-11 rounded-full object-cover" />
                    
                    <div className="leading-tight">
                      <p className="text-sm font-bold text-ink">{current.name}</p>
                      <p className="text-sm text-muted">{current.role}</p>
                    </div>
                  </footer>
                </motion.blockquote>
              </AnimatePresence>
            </div>
            <div className="mt-8 flex gap-2" role="tablist" aria-label="Testimonials">
              {testimonials.map((t, i) =>
              <button
                key={t.id}
                role="tab"
                aria-selected={i === active}
                aria-label={`Testimonial from ${t.name}`}
                onClick={() => setActive(i)}
                className={cn(
                  'h-1.5 rounded-full transition-[width,background-color] duration-200 ease-out',
                  i === active ? 'w-10 bg-primary' : 'w-5 bg-line hover:bg-muted'
                )} />

              )}
            </div>
          </div>

          <Reveal delay={0.08}>
            <div className="rounded-3xl border border-line bg-bg p-6 sm:p-8">
              <h3 className="font-display text-sm font-bold uppercase tracking-wide text-muted">
                Our partners
              </h3>
              <ul className="mt-5 grid gap-3">
                {partners.map((partner) =>
                <li
                  key={partner}
                  className="flex items-center gap-3 border-b border-line pb-3 text-sm font-medium text-ink last:border-0 last:pb-0">
                  
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface font-display text-xs font-bold text-primary ring-1 ring-line">
                      {partner.
                    split(' ').
                    slice(0, 2).
                    map((w) => w[0]).
                    join('')}
                    </span>
                    {partner}
                  </li>
                )}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>);

}