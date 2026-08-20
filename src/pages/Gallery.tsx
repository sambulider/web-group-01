import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon, XIcon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Reveal } from '../components/ui/Reveal';
import { galleryCategories, galleryItems } from '../data/gallery';
import { formatDate } from '../utils/format';
import { cn } from '../utils/cn';

const EASE = [0.23, 1, 0.32, 1] as const;

export function Gallery() {
  const [category, setCategory] = useState<string>('All');
  const [type, setType] = useState<'all' | 'photo' | 'video'>('all');
  const [lightbox, setLightbox] = useState<number | null>(null);

  const items = useMemo(
    () =>
    galleryItems.filter(
      (item) =>
      (category === 'All' || item.category === category) && (
      type === 'all' || item.type === type)
    ),
    [category, type]
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight') setLightbox((i) => i === null ? i : (i + 1) % items.length);
      if (e.key === 'ArrowLeft')
      setLightbox((i) => i === null ? i : (i - 1 + items.length) % items.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, items.length]);

  const active = lightbox === null ? null : items[lightbox];

  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="Moments from our programmes, events and the community around them."
        intro="Photographs and short films from cohorts, competitions and field visits across the district." />
      

      <section className="mx-auto max-w-page px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {galleryCategories.map((c) =>
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={cn(
                'rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-150 ease-out',
                category === c ?
                'bg-primary text-white' :
                'border border-line text-muted hover:text-ink'
              )}>
              
                {c}
              </button>
            )}
          </div>
          <div className="flex gap-1 rounded-xl border border-line p-1">
            {(['all', 'photo', 'video'] as const).map((t) =>
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              aria-pressed={type === t}
              className={cn(
                'rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors duration-150 ease-out',
                type === t ? 'bg-elevated text-ink' : 'text-muted hover:text-ink'
              )}>
              
                {t === 'all' ? 'All media' : `${t}s`}
              </button>
            )}
          </div>
        </div>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item, i) =>
          <Reveal
            as="li"
            key={item.id}
            delay={Math.min(i * 0.03, 0.2)}
            className={cn(i % 7 === 0 && 'sm:col-span-2 sm:row-span-2')}>
            
              <button
              type="button"
              onClick={() => setLightbox(i)}
              className="group relative block h-full w-full overflow-hidden rounded-2xl border border-line bg-surface text-left">
              
                <div className={cn('overflow-hidden', i % 7 === 0 ? 'h-72 sm:h-[26rem]' : 'h-52')}>
                  <img
                  src={item.type === 'video' ? item.poster : item.src}
                  alt={item.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105" />
                
                </div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-slate-950/65 p-4 opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100">
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-0.5 text-xs text-white/70">
                    {item.category} · {formatDate(item.date)}
                  </p>
                </div>
                {item.type === 'video' &&
              <span className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-slate-950/70 px-2.5 py-1 text-xs font-semibold text-white">
                    <PlayIcon className="h-3 w-3" />
                    Video
                  </span>
              }
              </button>
            </Reveal>
          )}
        </ul>
      </section>

      <AnimatePresence>
        {active &&
        <motion.div
          className="fixed inset-0 z-[80] flex flex-col bg-slate-950/92 p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: EASE }}
          role="dialog"
          aria-modal="true"
          aria-label={active.title}>
          
            <div className="flex items-start justify-between gap-4 text-white">
              <div>
                <p className="font-display text-base font-bold">{active.title}</p>
                <p className="text-sm text-white/65">
                  {active.category} · {formatDate(active.date)}
                </p>
              </div>
              <button
              type="button"
              onClick={() => setLightbox(null)}
              aria-label="Close viewer"
              className="rounded-xl border border-white/20 p-2 transition-colors duration-150 hover:bg-white/10">
              
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="relative flex flex-1 items-center justify-center gap-3 py-4">
              <button
              type="button"
              aria-label="Previous item"
              onClick={() =>
              setLightbox((i) => i === null ? i : (i - 1 + items.length) % items.length)
              }
              className="absolute left-0 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white transition-colors duration-150 hover:bg-white/10">
              
                <ChevronLeftIcon className="h-5 w-5" />
              </button>

              <motion.div
              key={active.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.22, ease: EASE }}
              className="max-h-full max-w-5xl overflow-hidden rounded-2xl">
              
                {active.type === 'video' ?
              <video
                src={active.src}
                poster={active.poster}
                controls
                autoPlay
                className="max-h-[70vh] w-full rounded-2xl bg-black" /> :


              <img
                src={active.src}
                alt={active.title}
                className="max-h-[72vh] w-auto rounded-2xl object-contain" />

              }
              </motion.div>

              <button
              type="button"
              aria-label="Next item"
              onClick={() => setLightbox((i) => i === null ? i : (i + 1) % items.length)}
              className="absolute right-0 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white transition-colors duration-150 hover:bg-white/10">
              
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>

            <p className="text-center text-xs text-white/50">
              {(lightbox ?? 0) + 1} of {items.length} · Use arrow keys to browse
            </p>
          </motion.div>
        }
      </AnimatePresence>
    </>);

}