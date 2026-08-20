import React from 'react';
import { CompassIcon, HeartHandshakeIcon, MapPinIcon, PhoneIcon, TargetIcon } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Reveal } from '../components/ui/Reveal';
import { SectionHeading } from '../components/ui/Primitives';
import { branches, contact, history, operationalHours } from '../data/site';

export function About() {
  return (
    <>
      <PageHeader
        eyebrow="About us"
        title="A shared space for learning, dialogue and opportunity in the Eastern Province."
        intro="American Corner Batticaloa is operated by Eastern University, Sri Lanka in partnership with the Public Affairs Section of the U.S. Embassy in Colombo. Entry, membership and every programme are free." />
      

      <section className="mx-auto max-w-page px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <Reveal>
            <SectionHeading
              title="Organisation overview"
              intro="We host a reference collection, a 20-station digital lab, quiet study space and a programme hall used for cohorts, dialogue series and public events." />
            
            <div className="mt-6 space-y-4 text-base leading-relaxed text-muted">
              <p>
                The Corner serves school leavers, undergraduates, teachers, job seekers and small
                business owners from Batticaloa, Ampara and Trincomalee. Programming is designed with
                local partners so that each cohort answers a need identified in the district — from
                English fluency to digital skills to enterprise finance.
              </p>
              <p>
                A team of four staff and more than three hundred registered volunteers — most of them
                alumni of our own programmes — keep the space open six days a week.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-4">
            <Reveal>
              <article className="rounded-2xl border border-line bg-surface p-6">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
                  <TargetIcon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-ink">Our mission</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  To provide free, open and reliable access to information, technology and skills
                  training that helps young people in the Eastern Province take their next step in
                  education, work or enterprise.
                </p>
              </article>
            </Reveal>
            <Reveal delay={0.06}>
              <article className="rounded-2xl border border-line bg-surface p-6">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
                  <CompassIcon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-ink">Our vision</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  A district where every young person — regardless of school, language or income —
                  can find a place to learn, a mentor who believes in them and a pathway to
                  meaningful work.
                </p>
              </article>
            </Reveal>
            <Reveal delay={0.12}>
              <article className="rounded-2xl border border-line bg-surface p-6">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary">
                  <HeartHandshakeIcon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-ink">How we work</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Cohorts are small, facilitated in English and Tamil, and always paired with
                  mentorship. Attendance and progress are tracked so no participant quietly drops
                  out.
                </p>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-surface py-16 lg:py-20">
        <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading title="Our history" intro="From a single reference shelf in 2012 to a regional programming hub." />
          </Reveal>
          <ol className="mt-10 space-y-6 border-l border-line pl-6 sm:pl-8">
            {history.map((item, i) =>
            <Reveal as="li" key={item.year} delay={Math.min(i * 0.05, 0.2)} className="relative">
                <span
                className="absolute -left-[1.85rem] top-1.5 grid h-3 w-3 place-items-center rounded-full bg-primary ring-4 ring-surface sm:-left-[2.35rem]"
                aria-hidden />
              
                <p className="font-display text-sm font-bold text-primary">{item.year}</p>
                <h3 className="mt-1 font-display text-lg font-bold text-ink">{item.title}</h3>
                <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted">{item.body}</p>
              </Reveal>
            )}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-page px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-14">
          <Reveal>
            <SectionHeading title="Operational hours" />
            <dl className="mt-6 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
              {operationalHours.map((row) =>
              <div key={row.day} className="flex items-center justify-between gap-4 px-5 py-4">
                  <dt className="text-sm text-muted">{row.day}</dt>
                  <dd className="text-sm font-semibold text-ink">{row.hours}</dd>
                </div>
              )}
            </dl>
            <div className="mt-6 space-y-3 text-sm text-muted">
              <p className="flex gap-2.5">
                <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {contact.address}
              </p>
              <p className="flex gap-2.5">
                <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {contact.phone} · {contact.altPhone}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="h-full min-h-[22rem] overflow-hidden rounded-2xl border border-line">
              <iframe
                title="Map showing American Corner Batticaloa"
                src={contact.mapEmbed}
                loading="lazy"
                className="h-full w-full"
                style={{ border: 0, minHeight: '22rem' }}
                referrerPolicy="no-referrer-when-downgrade" />
              
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line bg-surface py-16 lg:py-20">
        <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              title="American Corners across Sri Lanka"
              intro="Six locations offer the same free access to collections, technology and programming." />
            
          </Reveal>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {branches.map((branch, i) =>
            <Reveal as="li" key={branch.id} delay={Math.min(i * 0.05, 0.25)} className="h-full">
                <article className="flex h-full flex-col rounded-2xl border border-line bg-bg p-5">
                  <h3 className="font-display text-lg font-bold text-ink">{branch.city}</h3>
                  <p className="mt-1.5 text-sm text-muted">{branch.venue}</p>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-5 text-xs">
                    <span className="rounded-full bg-primary-soft px-2.5 py-1 font-semibold text-primary">
                      {branch.hours}
                    </span>
                    <span className="text-muted">{branch.phone}</span>
                  </div>
                </article>
              </Reveal>
            )}
          </ul>
        </div>
      </section>
    </>);

}