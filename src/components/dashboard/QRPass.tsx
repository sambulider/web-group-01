import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { RefreshCwIcon, ShieldCheckIcon } from 'lucide-react';
import { User } from '../../types';
import { formatDate } from '../../utils/format';

export function QRPass({ user }: {user: User;}) {
  const [token, setToken] = useState(() => Math.random().toString(36).slice(2, 10).toUpperCase());
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          setToken(Math.random().toString(36).slice(2, 10).toUpperCase());
          return 60;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const payload = `ACB|${user.memberId}|${token}`;

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.26, ease: [0.23, 1, 0.32, 1] }}
      aria-label="Digital attendance pass"
      className="overflow-hidden rounded-3xl border border-line bg-primary text-white">
      
      <div className="flex items-center justify-between gap-3 border-b border-white/15 px-5 py-4">
        <div className="leading-tight">
          <p className="font-display text-sm font-bold">
            {user.role === 'volunteer' ? 'Volunteer QR pass' : 'Student QR pass'}
          </p>
          <p className="text-xs text-white/70">Present at the front desk scanner</p>
        </div>
        <ShieldCheckIcon className="h-5 w-5 text-white/80" />
      </div>

      <div className="flex flex-col items-center gap-5 px-5 py-6 sm:flex-row sm:items-center">
        <div className="rounded-2xl bg-white p-3">
          <QRCodeSVG value={payload} size={132} level="M" includeMargin={false} />
        </div>
        <dl className="w-full space-y-2.5 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-white/70">Member</dt>
            <dd className="font-semibold">{user.name}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-white/70">ID</dt>
            <dd className="font-mono font-semibold">{user.memberId}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-white/70">Member since</dt>
            <dd className="font-semibold">{formatDate(user.joined, 'MMM yyyy')}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-white/15 pt-2.5">
            <dt className="inline-flex items-center gap-1.5 text-white/70">
              <RefreshCwIcon className="h-3.5 w-3.5" />
              Rotates in
            </dt>
            <dd className="font-mono font-semibold">{seconds}s</dd>
          </div>
        </dl>
      </div>
    </motion.section>);

}