import React from 'react';
import { Counter } from '../ui/Counter';
import { Reveal } from '../ui/Reveal';

const stats = [
{ value: 4842, suffix: '', label: 'Registered members', note: 'across Batticaloa & Ampara' },
{ value: 312, suffix: '', label: 'Active volunteers', note: 'mostly programme alumni' },
{ value: 38, suffix: '', label: 'Programmes this year', note: 'cohorts, labs and series' },
{ value: 91, suffix: '%', label: 'Average attendance', note: 'recorded via QR passes' }];


export function Stats() {
  return (
    <section className="border-y border-line bg-primary py-14 text-white lg:py-16">
      <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Fourteen years of measurable impact in the Eastern Province
          </h2>
        </Reveal>
        <dl className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) =>
          <Reveal key={stat.label} delay={Math.min(i * 0.06, 0.24)}>
              <div className="border-l-2 border-white/25 pl-4">
                <dd className="font-display text-4xl font-extrabold tracking-tight lg:text-5xl">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </dd>
                <dt className="mt-2 text-sm font-semibold">{stat.label}</dt>
                <p className="mt-1 text-sm text-white/70">{stat.note}</p>
              </div>
            </Reveal>
          )}
        </dl>
      </div>
    </section>);

}