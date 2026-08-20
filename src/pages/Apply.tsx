import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import {
  CheckCircle2Icon,
  ClockIcon,
  ExternalLinkIcon,
  FileTextIcon,
  UserCheckIcon,
  UsersIcon } from
'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Reveal } from '../components/ui/Reveal';
import { Modal, StatusPill, btnGhost, btnPrimary } from '../components/ui/Primitives';
import { programs } from '../data/programs';
import { Program } from '../types';
import { cn } from '../utils/cn';

const steps = [
{
  icon: FileTextIcon,
  title: 'Choose a programme',
  body: 'Review the schedule, seat availability and mode of delivery before you start.'
},
{
  icon: UserCheckIcon,
  title: 'Complete the form',
  body: 'The application form takes about three minutes and needs your NIC or student number.'
},
{
  icon: CheckCircle2Icon,
  title: 'Confirmation by SMS',
  body: 'Shortlisted applicants receive a confirmation and orientation date within five working days.'
}];


export function Apply() {
  const location = useLocation();
  const preselected = (location.state as {programId?: string;} | null)?.programId;
  const [selected, setSelected] = useState<Program | null>(null);

  useEffect(() => {
    if (!preselected) return;
    const match = programs.find((p) => p.id === preselected);
    if (match) setSelected(match);
  }, [preselected]);

  return (
    <>
      <PageHeader
        eyebrow="Apply"
        title="Pick a programme and send your application in a few minutes."
        intro="Applications are handled through official Google Forms. There is no fee at any stage — if anyone asks you for payment, please report it to our team." />
      

      <section className="mx-auto max-w-page px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <ol className="grid gap-4 sm:grid-cols-3">
          {steps.map((step, i) =>
          <Reveal as="li" key={step.title} delay={Math.min(i * 0.06, 0.2)} className="h-full">
              <div className="flex h-full gap-4 rounded-2xl border border-line bg-surface p-5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                  <step.icon className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="font-display text-base font-bold text-ink">{step.title}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.body}</p>
                </div>
              </div>
            </Reveal>
          )}
        </ol>

        <h2 className="mt-14 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Available programmes
        </h2>

        <ul className="mt-6 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
          {programs.map((program, i) => {
            const disabled = program.status === 'Closed';
            return (
              <Reveal as="li" key={program.id} delay={Math.min(i * 0.03, 0.18)}>
                <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-display text-base font-bold text-ink">{program.title}</h3>
                      <StatusPill status={program.status} />
                    </div>
                    <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                      <span>{program.category}</span>
                      <span className="inline-flex items-center gap-1.5">
                        <ClockIcon className="h-3.5 w-3.5" />
                        {program.schedule} · {program.duration}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <UsersIcon className="h-3.5 w-3.5" />
                        {program.seats - program.seatsTaken} of {program.seats} seats free
                      </span>
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelected(program)}
                      className={cn(btnGhost, 'px-4 py-2')}>
                      
                      Details
                    </button>
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => {
                        if (disabled) return;
                        window.open(program.formUrl, '_blank', 'noopener');
                        toast.success('Application form opened in a new tab', {
                          description: `${program.title} — complete it within 24 hours to hold your place.`
                        });
                      }}
                      className={cn(
                        btnPrimary,
                        'px-4 py-2',
                        disabled && 'cursor-not-allowed bg-elevated text-muted shadow-none hover:bg-elevated'
                      )}>
                      
                      {disabled ? 'Closed' : 'Apply now'}
                      {!disabled && <ExternalLinkIcon className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </Reveal>);

          })}
        </ul>
      </section>

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.title ?? ''}
        wide>
        
        {selected &&
        <div className="grid gap-6 sm:grid-cols-[1.2fr_1fr]">
            <div>
              <img
              src={selected.image}
              alt=""
              className="h-40 w-full rounded-2xl object-cover"
              loading="lazy" />
            
              <p className="mt-4 text-sm leading-relaxed text-muted">{selected.summary}</p>
              <p className="mt-4 text-sm text-muted">
                Facilitated by{' '}
                <span className="font-semibold text-ink">{selected.facilitator}</span>
              </p>
            </div>
            <div>
              <dl className="divide-y divide-line rounded-2xl border border-line">
                {[
              ['Status', selected.status],
              ['Category', selected.category],
              ['Schedule', selected.schedule],
              ['Duration', selected.duration],
              ['Mode', selected.mode],
              ['Seats', `${selected.seatsTaken}/${selected.seats}`]].
              map(([k, v]) =>
              <div key={k} className="flex items-center justify-between gap-3 px-4 py-3">
                    <dt className="text-sm text-muted">{k}</dt>
                    <dd className="text-sm font-semibold text-ink">{v}</dd>
                  </div>
              )}
              </dl>
              <button
              type="button"
              disabled={selected.status === 'Closed'}
              onClick={() => {
                window.open(selected.formUrl, '_blank', 'noopener');
                toast.success('Application form opened in a new tab');
              }}
              className={cn(
                btnPrimary,
                'mt-4 w-full',
                selected.status === 'Closed' &&
                'cursor-not-allowed bg-elevated text-muted shadow-none hover:bg-elevated'
              )}>
              
                {selected.status === 'Closed' ? 'Applications closed' : 'Open application form'}
              </button>
            </div>
          </div>
        }
      </Modal>
    </>);

}