import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageSquareIcon, SendIcon, SparklesIcon, XIcon } from 'lucide-react';
import { contact, operationalHours } from '../data/site';
import { programs } from '../data/programs';
import { cn } from '../utils/cn';

interface Message {
  id: number;
  from: 'bot' | 'user';
  text: string;
}

const quickPrompts = [
'What programmes are open?',
'How do I register?',
'What are the office hours?',
'Where are you located?',
'How does QR attendance work?'];


function answer(input: string): string {
  const q = input.toLowerCase();
  if (q.includes('open') || q.includes('programme') || q.includes('program') || q.includes('course')) {
    const open = programs.filter((p) => p.status === 'Open').map((p) => p.title);
    return `We currently have ${open.length} programmes open for applications: ${open.join(', ')}. Visit the Programs page for schedules and seat availability.`;
  }
  if (q.includes('regist') || q.includes('apply') || q.includes('enrol')) {
    return 'Head to the Apply page, choose a programme, and open its application form. Each form takes about three minutes, and shortlisted applicants receive an SMS confirmation before the cohort starts.';
  }
  if (q.includes('hour') || q.includes('open time') || q.includes('close')) {
    return `Our operational hours are: ${operationalHours.
    map((h) => `${h.day} ${h.hours}`).
    join('; ')}.`;
  }
  if (q.includes('where') || q.includes('locat') || q.includes('address') || q.includes('map')) {
    return `You will find us at ${contact.address}. The Contact page includes a map and directions from Batticaloa town.`;
  }
  if (q.includes('qr') || q.includes('attend')) {
    return 'Every member gets a digital QR pass inside their dashboard. Show it at the front desk scanner before each session and your attendance is recorded instantly — no paper register.';
  }
  if (q.includes('fee') || q.includes('cost') || q.includes('price')) {
    return 'All American Corner Batticaloa programmes, library access and events are completely free of charge.';
  }
  if (q.includes('volunteer')) {
    return 'Volunteers support facilitation, registration desks and library reference. Write to us at ' + contact.email + ' with a short note about your availability.';
  }
  if (q.includes('contact') || q.includes('phone') || q.includes('email')) {
    return `You can reach the team on ${contact.phone} or by email at ${contact.email}. We reply to messages within one working day.`;
  }
  return 'I can help with programme details, registration steps, office hours, attendance passes and general support. If you need a person, call us on ' + contact.phone + ' during operational hours.';
}

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
  {
    id: 1,
    from: 'bot',
    text: 'Hello! I am the American Corner assistant. Ask me about programmes, registration, office hours or attendance.'
  }]
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing, open]);

  const send = (text: string) => {
    const value = text.trim();
    if (!value) return;
    setMessages((prev) => [...prev, { id: Date.now(), from: 'user', text: value }]);
    setInput('');
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { id: Date.now() + 1, from: 'bot', text: answer(value) }]);
    }, 650);
  };

  return (
    <>
      <AnimatePresence>
        {open &&
        <motion.div
          role="dialog"
          aria-label="Support assistant"
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 8 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="fixed bottom-24 right-4 z-[60] flex h-[30rem] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-lift sm:right-6">
          
            <div className="flex items-center gap-3 border-b border-line bg-primary px-4 py-3.5 text-white">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/15">
                <SparklesIcon className="h-4 w-4" />
              </span>
              <div className="leading-tight">
                <p className="font-display text-sm font-bold">Corner Assistant</p>
                <p className="text-xs text-white/75">Typically replies instantly</p>
              </div>
              <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close assistant"
              className="ml-auto rounded-lg p-1.5 transition-colors duration-150 hover:bg-white/15">
              
                <XIcon className="h-4 w-4" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m) =>
            <div
              key={m.id}
              className={cn('flex', m.from === 'user' ? 'justify-end' : 'justify-start')}>
              
                  <p
                className={cn(
                  'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
                  m.from === 'user' ?
                  'bg-primary text-white' :
                  'bg-elevated text-ink'
                )}>
                
                    {m.text}
                  </p>
                </div>
            )}
              {typing &&
            <div className="flex gap-1.5 rounded-2xl bg-elevated px-3.5 py-3 w-fit">
                  {[0, 1, 2].map((i) =>
              <motion.span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-muted"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }} />

              )}
                </div>
            }
            </div>

            <div className="border-t border-line px-3 py-3">
              <div className="mb-2 flex gap-1.5 overflow-x-auto pb-1">
                {quickPrompts.map((p) =>
              <button
                key={p}
                type="button"
                onClick={() => send(p)}
                className="shrink-0 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-muted transition-colors duration-150 ease-out hover:border-primary hover:text-primary">
                
                    {p}
                  </button>
              )}
              </div>
              <form
              className="flex items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}>
              
                <label className="sr-only" htmlFor="chat-input">
                  Message
                </label>
                <input
                id="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question…"
                className="h-10 flex-1 rounded-xl border border-line bg-bg px-3 text-sm text-ink placeholder:text-muted" />
              
                <button
                type="submit"
                aria-label="Send message"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-white transition-colors duration-150 ease-out hover:bg-primary-deep">
                
                  <SendIcon className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.div>
        }
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close support assistant' : 'Open support assistant'}
        className="fixed bottom-5 right-4 z-[60] inline-flex h-14 items-center gap-2.5 rounded-full bg-primary px-5 text-sm font-semibold text-white shadow-lift transition-[transform,background-color] duration-150 ease-out hover:bg-primary-deep active:scale-95 sm:right-6">
        
        {open ? <XIcon className="h-5 w-5" /> : <MessageSquareIcon className="h-5 w-5" />}
        <span className="hidden sm:inline">{open ? 'Close' : 'Need help?'}</span>
      </button>
    </>);

}