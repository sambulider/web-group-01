import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  BellIcon,
  CalendarDaysIcon,
  ClipboardListIcon,
  ClockIcon,
  LayoutDashboardIcon,
  QrCodeIcon,
  UsersIcon } from
'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis } from
'recharts';
import { DashboardShell, NavItem } from '../../components/dashboard/DashboardShell';
import { QRPass } from '../../components/dashboard/QRPass';
import { StatCard } from '../../components/dashboard/StatCard';
import { useAuth } from '../../contexts/AuthContext';
import { assignments, notifications, volunteerHoursByMonth } from '../../data/members';
import { formatDate } from '../../utils/format';
import { cn } from '../../utils/cn';
import { Assignment } from '../../types';

const nav: NavItem[] = [
{ id: 'overview', label: 'Overview', icon: LayoutDashboardIcon },
{ id: 'pass', label: 'Volunteer QR pass', icon: QrCodeIcon },
{ id: 'activities', label: 'Assigned activities', icon: ClipboardListIcon },
{ id: 'schedule', label: 'Schedule', icon: CalendarDaysIcon },
{ id: 'notifications', label: 'Notifications', icon: BellIcon }];


const statusStyles: Record<Assignment['status'], string> = {
  Confirmed: 'bg-success/10 text-success',
  Pending: 'bg-accent/15 text-[#8a6400] dark:text-accent',
  Completed: 'bg-elevated text-muted'
};

export function VolunteerDashboard() {
  const { user } = useAuth();
  const [active, setActive] = useState('overview');

  if (!user || user.role !== 'volunteer') return <Navigate to="/login" replace />;

  const totalHours = volunteerHoursByMonth.reduce((s, m) => s + m.hours, 0);
  const upcoming = assignments.filter((a) => a.status !== 'Completed');

  return (
    <DashboardShell
      title={`Hello, ${user.name.split(' ')[0]}`}
      subtitle={`${user.memberId} · Volunteering since ${formatDate(user.joined, 'MMM yyyy')}`}
      nav={nav}
      activeId={active}
      onNavigate={setActive}>
      
      {active === 'overview' &&
      <div className="grid gap-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Hours logged (6 months)" value={totalHours} icon={ClockIcon} emphasis delta={12} note="vs previous period" />
            <StatCard label="Upcoming assignments" value={upcoming.length} icon={ClipboardListIcon} />
            <StatCard label="Sessions supported" value={64} icon={UsersIcon} note="lifetime" />
            <StatCard label="Learners assisted" value={410} icon={UsersIcon} note="lifetime" />
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
            <section className="rounded-2xl border border-line bg-surface p-5">
              <h2 className="font-display text-lg font-bold text-ink">Volunteer hours by month</h2>
              <div className="mt-5 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={volunteerHoursByMonth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--line))" vertical={false} />
                    <XAxis dataKey="month" stroke="rgb(var(--muted))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="rgb(var(--muted))" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                    contentStyle={{
                      background: 'rgb(var(--surface))',
                      border: '1px solid rgb(var(--line))',
                      borderRadius: 12,
                      color: 'rgb(var(--ink))',
                      fontSize: 12
                    }} />
                  
                    <Bar dataKey="hours" fill="rgb(var(--primary))" radius={[6, 6, 0, 0]} maxBarSize={44} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <QRPass user={user} />
          </div>
        </div>
      }

      {active === 'pass' &&
      <div className="max-w-xl">
          <QRPass user={user} />
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Scan in at the start and end of each assignment so your volunteer hours are logged
            automatically. Certificates of service are issued from these records.
          </p>
        </div>
      }

      {(active === 'activities' || active === 'schedule') &&
      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[44rem] text-left text-sm">
              <caption className="sr-only">Assigned volunteer activities</caption>
              <thead className="border-b border-line bg-elevated/60 text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th scope="col" className="px-5 py-3 font-semibold">Activity</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Date</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Time</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Role</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Hours</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {assignments.map((a) =>
              <tr key={a.id}>
                    <td className="px-5 py-4 font-medium text-ink">{a.activity}</td>
                    <td className="px-5 py-4 text-muted">{formatDate(a.date)}</td>
                    <td className="px-5 py-4 text-muted">{a.time}</td>
                    <td className="px-5 py-4 text-muted">{a.role}</td>
                    <td className="px-5 py-4 text-muted">{a.hours}</td>
                    <td className="px-5 py-4">
                      <span className={cn('rounded-full px-2.5 py-1 text-xs font-semibold', statusStyles[a.status])}>
                        {a.status}
                      </span>
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          </div>
        </div>
      }

      {active === 'notifications' &&
      <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface">
          {notifications.map((n) =>
        <li key={n.id} className="flex items-start gap-3 px-5 py-4">
              <span className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', n.unread ? 'bg-primary' : 'bg-line')} />
              <div>
                <p className="text-sm font-semibold text-ink">{n.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{n.body}</p>
                <p className="mt-1.5 text-xs text-muted">{n.time}</p>
              </div>
            </li>
        )}
        </ul>
      }
    </DashboardShell>);

}