import React from 'react';
import { ArrowUpRightIcon, MapPinIcon, TicketIcon } from 'lucide-react';
import { announcements, events } from '../../data/site';
import { dayParts, formatDate } from '../../utils/format';
import { Reveal } from '../ui/Reveal';
import { cn } from '../../utils/cn';
import { Announcement } from '../../types';

const tagStyles: Record<Announcement['tag'], string> = {
  Notice: 'bg-elevated text-muted',
  Deadline: 'bg-secondary/10 text-secondary',
  Result: 'bg-success/10 text-success',
  Update: 'bg-primary-soft text-primary'
};

export function EventsAndNews() {
  return (
    <section id="events" className="mx-auto max-w-page px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="grid gap-12 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
        <div>
          <Reveal>
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Upcoming events
            </h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
              Talks, competitions and networking evenings open to all members. Registration at the
              front desk or through the assistant.
            </p>
          </Reveal>

          <ol className="mt-8 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
            {events.map((event, i) => {
              const d = dayParts(event.date);
              return (
                <Reveal as="li" key={event.id} delay={Math.min(i * 0.05, 0.2)}>
                  <article className="group flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                    <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-primary-soft leading-none">
                      <span className="font-display text-xl font-extrabold text-primary">
                        {d.day}
                      </span>
                      <span className="mt-1 text-xs font-semibold uppercase text-primary">
                        {d.month}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                        {event.category} · {d.weekday}
                      </p>
                      <h3 className="mt-1 font-display text-base font-bold text-ink">
                        {event.title}
                      </h3>
                      <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                        <span>{event.time}</span>
                        <span className="inline-flex items-center gap-1.5">
                          <MapPinIcon className="h-3.5 w-3.5" />
                          {event.location}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <TicketIcon className="h-3.5 w-3.5" />
                          {event.seatsLeft} seats left
                        </span>
                      </p>
                    </div>
                    <ArrowUpRightIcon className="hidden h-5 w-5 shrink-0 text-muted transition-colors duration-150 ease-out group-hover:text-primary sm:block" />
                  </article>
                </Reveal>);

            })}
          </ol>
        </div>

        <div>
          <Reveal>
            <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Latest announcements
            </h2>
          </Reveal>
          <ul className="mt-8 space-y-3">
            {announcements.map((item, i) =>
            <Reveal as="li" key={item.id} delay={Math.min(i * 0.05, 0.2)}>
                <article className="rounded-2xl border border-line bg-surface p-5">
                  <div className="flex items-center gap-3">
                    <span
                    className={cn(
                      'rounded-full px-2.5 py-1 text-xs font-semibold',
                      tagStyles[item.tag]
                    )}>
                    
                      {item.tag}
                    </span>
                    <time className="text-xs text-muted" dateTime={item.date}>
                      {formatDate(item.date)}
                    </time>
                  </div>
                  <h3 className="mt-3 font-display text-[15px] font-bold leading-snug text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
                </article>
              </Reveal>
            )}
          </ul>
        </div>
      </div>
    </section>);

}