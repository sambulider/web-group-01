import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon, ClockIcon, UsersIcon } from 'lucide-react';
import { Program } from '../types';
import { StatusPill } from './ui/Primitives';

export function ProgramCard({ program }: {program: Program;}) {
  const filled = Math.round(program.seatsTaken / program.seats * 100);

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-soft">
      
      <div className="relative h-44 overflow-hidden">
        <img
          src={program.image}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 ease-out hover:scale-[1.04]" />
        
        <div className="absolute left-3 top-3">
          <StatusPill status={program.status} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          {program.category}
        </p>
        <h3 className="mt-2 font-display text-lg font-bold leading-snug text-ink">
          {program.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{program.summary}</p>

        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted">
            <ClockIcon className="h-4 w-4 shrink-0 text-muted" />
            <dd>{program.schedule}</dd>
          </div>
          <div className="flex items-center gap-2 text-muted">
            <UsersIcon className="h-4 w-4 shrink-0 text-muted" />
            <dd>
              {program.seatsTaken}/{program.seats} seats
            </dd>
          </div>
        </dl>

        <div className="mt-3">
          <div
            className="h-1.5 w-full overflow-hidden rounded-full bg-elevated"
            role="progressbar"
            aria-valuenow={filled}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${program.title} seats filled`}>
            
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              whileInView={{ width: `${filled}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }} />
            
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <span className="text-xs font-medium text-muted">
            {program.duration} · {program.mode}
          </span>
          <Link
            to="/apply"
            state={{ programId: program.id }}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors duration-150 ease-out hover:text-primary-deep">
            
            {program.status === 'Open' ? 'Apply' : 'Details'}
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.article>);

}