import React, { useEffect, useMemo, useState } from 'react';
import { SearchIcon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { ProgramCard } from '../components/ProgramCard';
import { Reveal } from '../components/ui/Reveal';
import { Skeleton } from '../components/ui/Primitives';
import { programCategories } from '../data/programs';
import { Program, ProgramStatus } from '../types';
import { fetchPrograms } from '../lib/api';
import { cn } from '../utils/cn';

const statuses: Array<ProgramStatus | 'All'> = ['All', 'Open', 'Upcoming', 'Closed'];

export function Programs() {
  const [category, setCategory] = useState<string>('All');
  const [status, setStatus] = useState<ProgramStatus | 'All'>('All');
  const [query, setQuery] = useState('');
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadPrograms() {
      try {
        const data = await fetchPrograms();
        if (mounted) {
          setPrograms(data);
        }
      } catch (error) {
        console.warn('Falling back to dummy programs:', error);
        if (mounted) {
          const { programs: fallbackPrograms } = await import('../data/programs');
          setPrograms(fallbackPrograms);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadPrograms();

    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(
    () =>
    programs.filter(
      (p) =>
      (category === 'All' || p.category === category) && (
      status === 'All' || p.status === status) && (
      query.trim() === '' ||
      `${p.title} ${p.summary} ${p.facilitator}`.toLowerCase().includes(query.toLowerCase()))
    ),
    [category, status, query, programs]
  );

  return (
    <>
      <PageHeader
        eyebrow="Programmes"
        title="Structured cohorts, thematic series and open access — all free of charge."
        intro="Filter by theme or availability. Open programmes accept applications immediately; upcoming programmes let you register interest before the cohort opens." />
      

      <section className="mx-auto max-w-page px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-5 rounded-2xl border border-line bg-surface p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {['All', ...programCategories].map((c) =>
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

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex gap-1 rounded-xl border border-line p-1">
              {statuses.map((s) =>
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                aria-pressed={status === s}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-150 ease-out',
                  status === s ? 'bg-elevated text-ink' : 'text-muted hover:text-ink'
                )}>
                
                  {s}
                </button>
              )}
            </div>
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <label className="sr-only" htmlFor="program-search">
                Search programmes
              </label>
              <input
                id="program-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search programmes"
                className="h-11 w-full rounded-xl border border-line bg-bg pl-9 pr-3 text-sm text-ink placeholder:text-muted sm:w-60" />
              
            </div>
          </div>
        </div>

        <p className="mt-6 text-sm text-muted" aria-live="polite">
          {loading ? 'Loading programmes...' : `Showing ${filtered.length} of ${programs.length} programmes`}
        </p>

        {loading ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-line bg-surface p-4">
                <Skeleton className="h-44 w-full rounded-xl" />
                <Skeleton className="mt-4 h-4 w-20" />
                <Skeleton className="mt-3 h-6 w-3/4" />
                <Skeleton className="mt-3 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-5/6" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-line bg-surface p-12 text-center">
            <h2 className="font-display text-lg font-bold text-ink">No programmes match</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted">
              Try a different theme or clear the search. New cohorts are announced at the start of
              every month.
            </p>
            <button
              type="button"
              onClick={() => {
                setCategory('All');
                setStatus('All');
                setQuery('');
              }}
              className="mt-6 rounded-xl border border-line px-5 py-2.5 text-sm font-semibold text-ink transition-colors duration-150 ease-out hover:bg-elevated"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((program, i) => (
              <Reveal as="li" key={program.id} delay={Math.min(i * 0.04, 0.2)} className="h-full">
                <ProgramCard program={program} />
              </Reveal>
            ))}
          </ul>
        )}

        {!loading && (
          <div className="mt-14 grid gap-6 rounded-2xl border border-line bg-surface p-6 sm:grid-cols-3 sm:p-8">
            <div className="sm:col-span-1">
              <h2 className="font-display text-xl font-bold text-ink">Coming next quarter</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Three cohorts are being finalised with partner institutions. Details publish once
                facilitators and dates are confirmed.
              </p>
            </div>
            <div className="grid gap-3 sm:col-span-2 sm:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-xl border border-line bg-bg p-4">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="mt-3 h-4 w-full" />
                  <Skeleton className="mt-2 h-4 w-3/4" />
                  <Skeleton className="mt-4 h-2.5 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </>);

}