import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangleIcon,
  CameraIcon,
  CameraOffIcon,
  CheckCircle2Icon,
  CopyIcon,
  KeyboardIcon,
  Volume2Icon,
  VolumeXIcon } from
'lucide-react';
import { attendanceFeed } from '../../data/members';
import { programs } from '../../data/programs';
import { AttendanceRecord } from '../../types';
import { cn } from '../../utils/cn';
import { btnPrimary } from '../ui/Primitives';

const EASE = [0.23, 1, 0.32, 1] as const;

const knownMembers: Record<string, {name: string;program: string;}> = {
  'ACB-STU-1024': { name: 'Sanjana Mahendran', program: 'Digital Literacy Foundations' },
  'ACB-STU-1188': { name: 'Thivyan Selvarajah', program: 'Youth Leadership Lab' },
  'ACB-STU-0912': { name: 'Nuska Rifhana', program: 'Spoken English Circle' },
  'ACB-VOL-2087': { name: 'Ravindran Jeyakumar', program: 'Volunteer — Lab assistant' },
  'ACB-VOL-2201': { name: 'Iromi Fernando', program: 'Volunteer — Design lab' }
};

const resultCopy: Record<AttendanceRecord['result'], {label: string;tone: string;icon: typeof CheckCircle2Icon;}> = {
  success: {
    label: 'Attendance recorded',
    tone: 'bg-success/10 text-success ring-success/25',
    icon: CheckCircle2Icon
  },
  duplicate: {
    label: 'Already scanned today',
    tone: 'bg-accent/15 text-[#8a6400] dark:text-accent ring-accent/30',
    icon: CopyIcon
  },
  'not-enrolled': {
    label: 'Not enrolled in this session',
    tone: 'bg-secondary/10 text-secondary ring-secondary/25',
    icon: AlertTriangleIcon
  }
};

function beep(result: AttendanceRecord['result']) {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as {webkitAudioContext?: typeof AudioContext;}).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = result === 'success' ? 880 : result === 'duplicate' ? 520 : 260;
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22);
    osc.start();
    osc.stop(ctx.currentTime + 0.24);
    window.setTimeout(() => ctx.close(), 400);
  } catch {

    /* audio feedback is optional */}
}

export function ScannerPanel({ compact }: {compact?: boolean;}) {
  const [session, setSession] = useState(programs[0].title);
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [sound, setSound] = useState(true);
  const [manualId, setManualId] = useState('');
  const [feed, setFeed] = useState<AttendanceRecord[]>(attendanceFeed);
  const [last, setLast] = useState<AttendanceRecord | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOn(false);
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraOn(true);
    } catch {
      setCameraError(
        'Camera unavailable. Grant permission in your browser, or use a USB scanner / manual entry below.'
      );
    }
  };

  const record = (rawId: string) => {
    const id = rawId.trim().toUpperCase().replace(/^ACB\|/, '').split('|')[0];
    if (!id) return;
    const member = knownMembers[id];
    let result: AttendanceRecord['result'] = 'success';
    if (!member) result = 'not-enrolled';else
    if (feed.some((f) => f.memberId === id && f.result === 'success')) result = 'duplicate';

    const entry: AttendanceRecord = {
      id: `ar-${Date.now()}`,
      memberId: id,
      name: member?.name ?? 'Unrecognised pass',
      program: result === 'not-enrolled' ? '—' : session,
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      result
    };
    setFeed((prev) => [entry, ...prev].slice(0, 20));
    setLast(entry);
    setManualId('');
    if (sound) beep(result);
  };

  const stats = {
    success: feed.filter((f) => f.result === 'success').length,
    duplicate: feed.filter((f) => f.result === 'duplicate').length,
    rejected: feed.filter((f) => f.result === 'not-enrolled').length
  };

  return (
    <div className={cn('grid gap-6', compact ? 'lg:grid-cols-2' : 'lg:grid-cols-[1.15fr_1fr]')}>
      <section className="rounded-2xl border border-line bg-surface p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-[14rem] flex-1">
            <label htmlFor="session" className="text-sm font-medium text-ink">
              Active session
            </label>
            <select
              id="session"
              value={session}
              onChange={(e) => setSession(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-line bg-bg px-3.5 text-sm text-ink">
              
              {programs.map((p) =>
              <option key={p.id}>{p.title}</option>
              )}
            </select>
          </div>
          <button
            type="button"
            onClick={() => setSound((s) => !s)}
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-line px-4 text-sm font-semibold text-ink transition-colors duration-150 ease-out hover:bg-elevated"
            aria-pressed={sound}>
            
            {sound ? <Volume2Icon className="h-4 w-4" /> : <VolumeXIcon className="h-4 w-4" />}
            {sound ? 'Audio on' : 'Audio off'}
          </button>
        </div>

        <div className="relative mt-5 aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-slate-950">
          <video ref={videoRef} muted playsInline className="h-full w-full object-cover" />
          {!cameraOn &&
          <div className="absolute inset-0 grid place-items-center p-6 text-center">
              <div>
                <CameraOffIcon className="mx-auto h-8 w-8 text-white/50" />
                <p className="mt-3 text-sm font-semibold text-white">Camera is off</p>
                <p className="mx-auto mt-1 max-w-xs text-xs text-white/60">
                  Start the camera to scan QR passes, or use a USB scanner — its keystrokes are read
                  by the manual field.
                </p>
              </div>
            </div>
          }
          {cameraOn &&
          <>
              <div className="pointer-events-none absolute inset-[18%] rounded-2xl border-2 border-white/70" />
              <motion.div
              className="pointer-events-none absolute inset-x-[18%] h-0.5 bg-accent"
              initial={{ top: '18%' }}
              animate={{ top: ['18%', '82%', '18%'] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }} />
            
            </>
          }
        </div>

        {cameraError &&
        <p className="mt-3 rounded-xl bg-secondary/10 px-3.5 py-2.5 text-xs text-secondary">
            {cameraError}
          </p>
        }

        <div className="mt-4 flex flex-wrap gap-2">
          {cameraOn ?
          <button type="button" onClick={stopCamera} className={cn(btnPrimary, 'bg-secondary hover:bg-secondary')}>
              <CameraOffIcon className="h-4 w-4" />
              Stop camera
            </button> :

          <button type="button" onClick={startCamera} className={btnPrimary}>
              <CameraIcon className="h-4 w-4" />
              Start camera scan
            </button>
          }
        </div>

        <form
          className="mt-5 border-t border-line pt-5"
          onSubmit={(e) => {
            e.preventDefault();
            record(manualId);
          }}>
          
          <label htmlFor="manual" className="inline-flex items-center gap-2 text-sm font-medium text-ink">
            <KeyboardIcon className="h-4 w-4 text-muted" />
            USB scanner or manual member ID
          </label>
          <div className="mt-1.5 flex gap-2">
            <input
              id="manual"
              value={manualId}
              onChange={(e) => setManualId(e.target.value)}
              placeholder="ACB-STU-1024"
              className="h-11 flex-1 rounded-xl border border-line bg-bg px-3.5 font-mono text-sm text-ink placeholder:font-sans placeholder:text-muted" />
            
            <button type="submit" className={cn(btnPrimary, 'h-11')}>
              Record
            </button>
          </div>
          <p className="mt-2 text-xs text-muted">
            Try ACB-STU-1024 (success), ACB-STU-1024 again (duplicate) or ACB-STU-9999 (not
            enrolled).
          </p>
        </form>
      </section>

      <section>
        <AnimatePresence mode="wait">
          {last &&
          <motion.div
            key={last.id}
            initial={{ opacity: 0, scale: 0.97, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2, ease: EASE }}
            role="status"
            aria-live="polite"
            className={cn(
              'flex items-start gap-4 rounded-2xl p-5 ring-1',
              resultCopy[last.result].tone
            )}>
            
              {React.createElement(resultCopy[last.result].icon, { className: 'h-7 w-7 shrink-0' })}
              <div>
                <p className="font-display text-base font-bold">{resultCopy[last.result].label}</p>
                <p className="mt-1 text-sm">
                  {last.name} · <span className="font-mono">{last.memberId}</span>
                </p>
                <p className="mt-0.5 text-sm opacity-80">
                  {last.program} · {last.time}
                </p>
              </div>
            </motion.div>
          }
        </AnimatePresence>

        <dl className="mt-4 grid grid-cols-3 gap-3">
          {[
          ['Recorded', stats.success],
          ['Duplicates', stats.duplicate],
          ['Rejected', stats.rejected]].
          map(([label, value]) =>
          <div key={String(label)} className="rounded-2xl border border-line bg-surface p-4">
              <dd className="font-display text-2xl font-extrabold text-ink">{value}</dd>
              <dt className="mt-1 text-xs text-muted">{label}</dt>
            </div>
          )}
        </dl>

        <div className="mt-4 overflow-hidden rounded-2xl border border-line bg-surface">
          <p className="border-b border-line px-5 py-3.5 font-display text-sm font-bold text-ink">
            Live scan feed
          </p>
          <ul className="max-h-[22rem] divide-y divide-line overflow-y-auto">
            {feed.map((entry) =>
            <li key={entry.id} className="flex items-center gap-3 px-5 py-3">
                <span
                className={cn(
                  'h-2 w-2 shrink-0 rounded-full',
                  entry.result === 'success' ?
                  'bg-success' :
                  entry.result === 'duplicate' ?
                  'bg-accent' :
                  'bg-secondary'
                )} />
              
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{entry.name}</p>
                  <p className="truncate text-xs text-muted">
                    {entry.memberId} · {entry.program}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted">{entry.time}</span>
              </li>
            )}
          </ul>
        </div>
      </section>
    </div>);

}