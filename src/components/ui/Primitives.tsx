import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDownIcon, XIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { ProgramStatus } from '../../types';

const EASE = [0.23, 1, 0.32, 1] as const;

export function StatusPill({ status }: {status: ProgramStatus;}) {
  const styles: Record<ProgramStatus, string> = {
    Open: 'bg-success/10 text-success ring-success/20',
    Closed: 'bg-secondary/10 text-secondary ring-secondary/20',
    Upcoming: 'bg-accent/15 text-[#8a6400] dark:text-accent ring-accent/30'
  };
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1',
        styles[status]
      )}>
      
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>);

}

export function SectionHeading({
  title,
  intro,
  align = 'left',
  className





}: {title: string;intro?: string;align?: 'left' | 'center';className?: string;}) {
  return (
    <div
      className={cn(
        'max-w-2xl',
        align === 'center' && 'mx-auto text-center',
        className
      )}>
      
      <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      {intro && <p className="mt-3 text-base leading-relaxed text-muted">{intro}</p>}
    </div>);

}

export function Skeleton({ className }: {className?: string;}) {
  return <div className={cn('animate-pulse rounded-lg bg-elevated', className)} />;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  wide






}: {open: boolean;onClose: () => void;title: string;children: React.ReactNode;wide?: boolean;}) {
  return (
    <AnimatePresence>
      {open &&
      <div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-6">
          <motion.button
          aria-label="Close dialog"
          className="absolute inset-0 bg-slate-950/55"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: EASE }}
          onClick={onClose} />
        
          <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className={cn(
            'relative w-full overflow-hidden rounded-t-3xl border border-line bg-surface shadow-lift sm:rounded-3xl',
            wide ? 'max-w-3xl' : 'max-w-lg'
          )}
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 8 }}
          transition={{ duration: 0.24, ease: EASE }}>
          
            <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-4">
              <h3 className="font-display text-lg font-bold text-ink">{title}</h3>
              <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted transition-colors duration-150 hover:bg-elevated hover:text-ink"
              aria-label="Close">
              
                <XIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>
          </motion.div>
        </div>
      }
    </AnimatePresence>);

}

export function Accordion({ items }: {items: Array<{q: string;a: string;}>;}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <div className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
              
              <span className="font-medium text-ink">{item.q}</span>
              <ChevronDownIcon
                className={cn(
                  'h-4 w-4 shrink-0 text-muted transition-transform duration-200',
                  isOpen && 'rotate-180'
                )} />
              
            </button>
            <AnimatePresence initial={false}>
              {isOpen &&
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: EASE }}
                className="overflow-hidden">
                
                  <p className="px-5 pb-4 text-sm leading-relaxed text-muted">{item.a}</p>
                </motion.div>
              }
            </AnimatePresence>
          </div>);

      })}
    </div>);

}

export const buttonBase =
'inline-flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-[transform,background-color,color,box-shadow] duration-150 ease-out active:scale-[0.98] disabled:opacity-60';

export const btnPrimary = cn(
  buttonBase,
  'bg-primary px-5 py-2.5 text-white shadow-soft hover:bg-primary-deep'
);
export const btnGhost = cn(
  buttonBase,
  'border border-line bg-surface px-5 py-2.5 text-ink hover:bg-elevated'
);