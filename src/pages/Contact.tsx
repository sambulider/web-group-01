import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  FacebookIcon,
  InstagramIcon,
  Loader2Icon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  SendIcon } from
'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Reveal } from '../components/ui/Reveal';
import { Accordion, btnPrimary } from '../components/ui/Primitives';
import { contact, operationalHours } from '../data/site';
import { cn } from '../utils/cn';

const faqs = [
{
  q: 'Do I need to be a university student to join?',
  a: 'No. Membership is open to anyone — school students, school leavers, undergraduates, teachers, job seekers and entrepreneurs. Some programmes have a minimum age of 16.'
},
{
  q: 'Is there any fee for programmes or membership?',
  a: 'Everything at American Corner Batticaloa is free, including programmes, library access, internet and events. We never ask for payment at any stage.'
},
{
  q: 'Which languages are programmes delivered in?',
  a: 'Sessions are facilitated in English with Tamil support, and materials are provided in both languages wherever possible.'
},
{
  q: 'Can I visit without registering for a programme?',
  a: 'Yes. Walk in during operational hours to use the library, study space and computers. Registration only takes a few minutes at the front desk.'
}];


const inputClass =
'h-11 w-full rounded-xl border border-line bg-bg px-3.5 text-sm text-ink placeholder:text-muted';

export function Contact() {
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const values = {
      name: String(form.get('name') ?? '').trim(),
      email: String(form.get('email') ?? '').trim(),
      subject: String(form.get('subject') ?? '').trim(),
      message: String(form.get('message') ?? '').trim()
    };
    const next: Record<string, string> = {};
    if (!values.name) next.name = 'Please tell us your name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = 'Enter a valid email address';
    if (values.message.length < 12) next.message = 'Please add a little more detail';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSending(true);
    const formEl = e.currentTarget;
    window.setTimeout(() => {
      setSending(false);
      formEl.reset();
      toast.success('Message sent', {
        description: 'Our team replies within one working day during operational hours.'
      });
    }, 900);
  };

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Talk to the team, or simply walk in during operational hours."
        intro="Questions about a programme, a partnership or volunteering? Send us a message and we will reply within one working day." />
      

      <section className="mx-auto max-w-page px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          <Reveal>
            <form onSubmit={submit} noValidate className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
              <h2 className="font-display text-xl font-bold text-ink">Send a message</h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="text-sm font-medium text-ink">
                    Full name
                  </label>
                  <input id="name" name="name" className={cn(inputClass, 'mt-1.5')} placeholder="Your name" />
                  {errors.name && <p className="mt-1.5 text-xs text-secondary">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="text-sm font-medium text-ink">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className={cn(inputClass, 'mt-1.5')}
                    placeholder="you@example.com" />
                  
                  {errors.email && <p className="mt-1.5 text-xs text-secondary">{errors.email}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="subject" className="text-sm font-medium text-ink">
                    Subject
                  </label>
                  <select id="subject" name="subject" className={cn(inputClass, 'mt-1.5')}>
                    <option>Programme enquiry</option>
                    <option>Volunteering</option>
                    <option>Partnership or collaboration</option>
                    <option>Library and facilities</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="message" className="text-sm font-medium text-ink">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    className="mt-1.5 w-full rounded-xl border border-line bg-bg p-3.5 text-sm text-ink placeholder:text-muted"
                    placeholder="How can we help?" />
                  
                  {errors.message &&
                  <p className="mt-1.5 text-xs text-secondary">{errors.message}</p>
                  }
                </div>
              </div>
              <button type="submit" disabled={sending} className={cn(btnPrimary, 'mt-6')}>
                {sending ?
                <>
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                    Sending…
                  </> :

                <>
                    <SendIcon className="h-4 w-4" />
                    Send message
                  </>
                }
              </button>
            </form>
          </Reveal>

          <div className="grid gap-4">
            <Reveal>
              <ul className="grid gap-3">
                {[
                { icon: PhoneIcon, label: 'Phone', value: `${contact.phone} · ${contact.altPhone}`, href: `tel:${contact.phone.replace(/\s/g, '')}` },
                { icon: MailIcon, label: 'Email', value: contact.email, href: `mailto:${contact.email}` },
                { icon: MapPinIcon, label: 'Address', value: contact.address }].
                map((row) =>
                <li
                  key={row.label}
                  className="flex gap-4 rounded-2xl border border-line bg-surface p-5">
                  
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
                      <row.icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink">{row.label}</p>
                      {row.href ?
                    <a
                      href={row.href}
                      className="mt-0.5 block break-words text-sm text-muted transition-colors duration-150 hover:text-primary">
                      
                          {row.value}
                        </a> :

                    <p className="mt-0.5 text-sm text-muted">{row.value}</p>
                    }
                    </div>
                  </li>
                )}
              </ul>
            </Reveal>

            <Reveal delay={0.06}>
              <div className="flex flex-wrap gap-3">
                <a
                  href={contact.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-line bg-surface px-4 py-3 text-sm font-semibold text-ink transition-colors duration-150 ease-out hover:border-primary/40">
                  
                  <FacebookIcon className="h-4 w-4 text-primary" />
                  Facebook
                </a>
                <a
                  href={contact.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-line bg-surface px-4 py-3 text-sm font-semibold text-ink transition-colors duration-150 ease-out hover:border-secondary/40">
                  
                  <InstagramIcon className="h-4 w-4 text-secondary" />
                  Instagram
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <dl className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
                {operationalHours.map((row) =>
                <div key={row.day} className="flex items-center justify-between gap-4 px-5 py-3.5">
                    <dt className="text-sm text-muted">{row.day}</dt>
                    <dd className="text-sm font-semibold text-ink">{row.hours}</dd>
                  </div>
                )}
              </dl>
            </Reveal>

            <Reveal delay={0.14}>
              <div className="overflow-hidden rounded-2xl border border-line">
                <iframe
                  title="Map showing American Corner Batticaloa"
                  src={contact.mapEmbed}
                  loading="lazy"
                  className="h-64 w-full"
                  style={{ border: 0 }}
                  referrerPolicy="no-referrer-when-downgrade" />
                
              </div>
            </Reveal>
          </div>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:gap-14">
          <Reveal>
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Frequently asked
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Still unsure about something? The assistant in the corner of the screen answers most
              questions instantly.
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <Accordion items={faqs} />
          </Reveal>
        </div>
      </section>
    </>);

}