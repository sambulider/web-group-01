import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { programs } from '../../data/programs';
import { ProgramCard } from '../ProgramCard';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/Primitives';

export function FeaturedPrograms() {
  const featured = programs.filter((p) => p.featured);

  return (
    <section className="border-y border-line bg-surface py-16 lg:py-20">
      <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <SectionHeading
              title="Featured programmes"
              intro="Currently accepting applications. Seats are allocated in order of registration, with priority review for existing members." />
            
          </Reveal>
          <Reveal delay={0.06}>
            <Link
              to="/programs"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors duration-150 ease-out hover:text-primary-deep">
              
              View all programmes
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((program, i) =>
          <Reveal as="li" key={program.id} delay={Math.min(i * 0.06, 0.24)} className="h-full">
              <ProgramCard program={program} />
            </Reveal>
          )}
        </ul>
      </div>
    </section>);

}