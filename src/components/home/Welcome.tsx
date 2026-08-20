import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpenIcon,
  BriefcaseIcon,
  CalendarDaysIcon,
  ImageIcon,
  LaptopIcon,
  QrCodeIcon } from
'lucide-react';
import { Reveal } from '../ui/Reveal';

const quickLinks = [
{ label: 'Browse programmes', to: '/programs', icon: BookOpenIcon },
{ label: 'Upcoming events', to: { pathname: '/', hash: '#events' }, icon: CalendarDaysIcon },
{ label: 'Apply online', to: '/apply', icon: BriefcaseIcon },
{ label: 'Photo & video gallery', to: '/gallery', icon: ImageIcon },
{ label: 'Member dashboard', to: '/login', icon: LaptopIcon },
{ label: 'Attendance scanner', to: '/scanner', icon: QrCodeIcon }];


export function Welcome() {
  return (
    <section className="mx-auto max-w-page px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
        <Reveal>
          <p className="font-display text-sm font-bold text-primary">Welcome</p>
          <h2 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
            A public space where curiosity turns into capability.
          </h2>
          <div className="mt-5 space-y-4 text-base leading-relaxed text-muted">
            <p>
              American Corner Batticaloa is one of six American Corners in Sri Lanka — an open
              resource centre where students, job seekers, teachers, entrepreneurs and community
              organisers can learn, meet and build together at no cost.
            </p>
            <p>
              Our facilitators and volunteer alumni run structured cohorts in digital literacy,
              leadership and career readiness, alongside thematic dialogue series on the issues
              shaping the Eastern Province. Everyone is welcome — you only need to register.
            </p>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <h3 className="font-display text-sm font-bold uppercase tracking-wide text-muted">
              Quick links
            </h3>
          </Reveal>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {quickLinks.map((link, i) =>
            <Reveal as="li" key={link.label} delay={Math.min(i * 0.04, 0.24)}>
                <Link
                to={link.to}
                className="group flex h-full items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3.5 text-sm font-medium text-ink transition-[background-color,border-color] duration-150 ease-out hover:border-primary/40 hover:bg-elevated">
                
                  <link.icon className="h-4 w-4 shrink-0 text-primary" />
                  {link.label}
                </Link>
              </Reveal>
            )}
          </ul>
        </div>
      </div>
    </section>);

}