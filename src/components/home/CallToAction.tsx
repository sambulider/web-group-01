import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, PhoneIcon } from 'lucide-react';
import { contact } from '../../data/site';
import { Reveal } from '../ui/Reveal';
import { btnGhost, btnPrimary } from '../ui/Primitives';
import { cn } from '../../utils/cn';

export function CallToAction() {
  return (
    <section className="mx-auto max-w-page px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-line bg-surface px-6 py-12 shadow-soft sm:px-12 lg:px-16">
          <div className="pointer-events-none absolute inset-0 grid-lines opacity-50" aria-hidden />
          <div className="relative max-w-2xl">
            <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-4xl">
              Membership is free. Your next programme starts this month.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Register once and you can apply to any cohort, borrow from the collection, book study
              space and track your attendance and progress from your own dashboard.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/apply" className={cn(btnPrimary, 'h-12 px-6 text-base')}>
                Start an application
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <a
                href={`tel:${contact.phone.replace(/\s/g, '')}`}
                className={cn(btnGhost, 'h-12 px-6 text-base')}>
                
                <PhoneIcon className="h-4 w-4 text-primary" />
                {contact.phone}
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>);

}