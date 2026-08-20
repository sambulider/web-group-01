import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BellIcon,
  BookOpenIcon,
  CalendarCheckIcon,
  LayoutDashboardIcon,
  QrCodeIcon,
  SettingsIcon,
  TrendingUpIcon,
  UserIcon } from
'lucide-react';
import { DashboardShell, NavItem } from '../../components/dashboard/DashboardShell';
import { QRPass } from '../../components/dashboard/QRPass';
import { StatCard } from '../../components/dashboard/StatCard';
import { useAuth } from '../../contexts/AuthContext';
import { enrollments, notifications } from '../../data/members';
import { formatDate } from '../../utils/format';
import { btnGhost, btnPrimary } from '../../components/ui/Primitives';
import { cn } from '../../utils/cn';

const nav: NavItem[] = [
{ id: 'overview', label: 'Overview', icon: LayoutDashboardIcon },
{ id: 'pass', label: 'Digital QR pass', icon: QrCodeIcon },
{ id: 'programs', label: 'My programmes', icon: BookOpenIcon },
{ id: 'notifications', label: 'Notifications', icon: BellIcon },
{ id: 'profile', label: 'Profile settings', icon: SettingsIcon }];


export function StudentDashboard() {
  const { user } = useAuth();
  const [active, setActive] = useState('overview');

  if (!user || user.role !== 'student') return <Navigate to="/login" replace />;

  const avgAttendance = Math.round(
    enrollments.reduce((sum, e) => sum + e.attendance, 0) / enrollments.length
  );

  return (
    <DashboardShell
      title={`Hello, ${user.name.split(' ')[0]}`}
      subtitle={`${user.memberId} · ${user.institution}`}
      nav={nav}
      activeId={active}
      onNavigate={setActive}>
      
      {active === 'overview' &&
      <div className="grid gap-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
            label="Attendance rate"
            value={avgAttendance}
            suffix="%"
            delta={4}
            icon={CalendarCheckIcon}
            emphasis
            note="vs last month" />
          
            <StatCard label="Enrolled programmes" value={enrollments.length} icon={BookOpenIcon} note="1 completed" />
            <StatCard
            label="Sessions attended"
            value={enrollments.reduce((s, e) => s + e.sessionsAttended, 0)}
            icon={TrendingUpIcon}
            note="this year" />
          
            <StatCard label="Unread notifications" value={notifications.filter((n) => n.unread).length} icon={BellIcon} />
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
            <section className="rounded-2xl border border-line bg-surface p-5">
              <h2 className="font-display text-lg font-bold text-ink">Learning progress</h2>
              <ul className="mt-5 space-y-5">
                {enrollments.map((e) =>
              <li key={e.programId}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-ink">{e.title}</p>
                      <p className="text-xs text-muted">
                        {e.sessionsAttended}/{e.sessionsTotal} sessions · next {e.nextSession}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-elevated">
                        <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${e.progress}%` }}
                      transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }} />
                    
                      </div>
                      <span className="w-10 shrink-0 text-right text-xs font-semibold text-ink">
                        {e.progress}%
                      </span>
                    </div>
                  </li>
              )}
              </ul>
            </section>

            <QRPass user={user} />
          </div>

          <section className="rounded-2xl border border-line bg-surface p-5">
            <h2 className="font-display text-lg font-bold text-ink">Recent notifications</h2>
            <ul className="mt-4 divide-y divide-line">
              {notifications.slice(0, 3).map((n) =>
            <li key={n.id} className="flex items-start gap-3 py-3.5">
                  {n.unread && <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />}
                  <div>
                    <p className="text-sm font-semibold text-ink">{n.title}</p>
                    <p className="mt-0.5 text-sm text-muted">{n.body}</p>
                    <p className="mt-1 text-xs text-muted">{n.time}</p>
                  </div>
                </li>
            )}
            </ul>
          </section>
        </div>
      }

      {active === 'pass' &&
      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <QRPass user={user} />
          <section className="rounded-2xl border border-line bg-surface p-5">
            <h2 className="font-display text-lg font-bold text-ink">How the pass works</h2>
            <ol className="mt-4 space-y-4 text-sm text-muted">
              {[
            'Open this pass before you reach the front desk — the code rotates every minute for security.',
            'Hold the code steady in front of the desk scanner or camera. You will hear a confirmation tone.',
            'Your attendance appears in your programme record within a few seconds.',
            'If the scan is rejected, ask the volunteer at the desk to verify your enrolment for that session.'].
            map((step, i) =>
            <li key={i} className="flex gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary-soft text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
            )}
            </ol>
          </section>
        </div>
      }

      {active === 'programs' &&
      <ul className="grid gap-4 lg:grid-cols-2">
          {enrollments.map((e) =>
        <li key={e.programId} className="rounded-2xl border border-line bg-surface p-5">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-display text-base font-bold text-ink">{e.title}</h2>
                <span
              className={cn(
                'rounded-full px-2.5 py-1 text-xs font-semibold',
                e.progress === 100 ? 'bg-success/10 text-success' : 'bg-primary-soft text-primary'
              )}>
              
                  {e.progress === 100 ? 'Completed' : 'In progress'}
                </span>
              </div>
              <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
                {[
            ['Progress', `${e.progress}%`],
            ['Attendance', `${e.attendance}%`],
            ['Sessions', `${e.sessionsAttended}/${e.sessionsTotal}`]].
            map(([k, v]) =>
            <div key={k} className="rounded-xl bg-bg p-3">
                    <dd className="font-display text-lg font-bold text-ink">{v}</dd>
                    <dt className="mt-0.5 text-xs text-muted">{k}</dt>
                  </div>
            )}
              </dl>
              <p className="mt-4 text-sm text-muted">Next session: {e.nextSession}</p>
            </li>
        )}
        </ul>
      }

      {active === 'notifications' &&
      <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
          {notifications.map((n) =>
        <li key={n.id} className="flex items-start gap-3 px-5 py-4">
              <span
            className={cn(
              'mt-1.5 h-2 w-2 shrink-0 rounded-full',
              n.unread ? 'bg-primary' : 'bg-line'
            )} />
          
              <div>
                <p className="text-sm font-semibold text-ink">{n.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{n.body}</p>
                <p className="mt-1.5 text-xs text-muted">{n.time}</p>
              </div>
            </li>
        )}
        </ul>
      }

      {active === 'profile' &&
      <section className="max-w-2xl rounded-2xl border border-line bg-surface p-5 sm:p-7">
          <div className="flex items-center gap-4">
            <img src={user.avatar} alt="" className="h-16 w-16 rounded-2xl object-cover" />
            <div>
              <h2 className="font-display text-lg font-bold text-ink">{user.name}</h2>
              <p className="text-sm text-muted">Member since {formatDate(user.joined)}</p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
          ['Full name', user.name],
          ['Member ID', user.memberId],
          ['Email', user.email],
          ['Phone', user.phone],
          ['Institution', user.institution ?? '—'],
          ['Preferred language', 'English / Tamil']].
          map(([label, value]) =>
          <div key={label}>
                <label className="text-sm font-medium text-ink">{label}</label>
                <input
              readOnly
              value={value}
              className="mt-1.5 h-11 w-full rounded-xl border border-line bg-bg px-3.5 text-sm text-ink" />
            
              </div>
          )}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="button" className={btnPrimary}>
              Save changes
            </button>
            <button type="button" className={btnGhost}>
              <UserIcon className="h-4 w-4" />
              Change photo
            </button>
          </div>
        </section>
      }
    </DashboardShell>);

}