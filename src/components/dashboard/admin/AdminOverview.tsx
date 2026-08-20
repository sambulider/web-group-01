import React from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis } from
'recharts';
import {
  CalendarDaysIcon,
  GraduationCapIcon,
  HandHeartIcon,
  LayersIcon,
  UsersIcon } from
'lucide-react';
import { StatCard } from '../StatCard';
import { attendanceByProgram, enrolmentTrend, memberSplit, attendanceFeed } from '../../../data/members';
import { events } from '../../../data/site';
import { dayParts } from '../../../utils/format';
import { cn } from '../../../utils/cn';

const tooltipStyle = {
  background: 'rgb(var(--surface))',
  border: '1px solid rgb(var(--line))',
  borderRadius: 12,
  color: 'rgb(var(--ink))',
  fontSize: 12
};

const pieColors = ['rgb(var(--primary))', 'rgb(var(--accent))', 'rgb(var(--secondary))', 'rgb(var(--muted))'];

export function AdminOverview() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total users" value={4842} icon={UsersIcon} delta={7} emphasis note="vs last month" />
        <StatCard label="Students" value={4210} icon={GraduationCapIcon} delta={8} />
        <StatCard label="Volunteers" value={312} icon={HandHeartIcon} delta={3} />
        <StatCard label="Active programmes" value={38} icon={LayersIcon} delta={-2} />
        <StatCard label="Events this quarter" value={14} icon={CalendarDaysIcon} delta={12} />
      </div>

      <section className="rounded-2xl border border-line bg-surface p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-bold text-ink">Membership growth</h2>
            <p className="mt-1 text-sm text-muted">New registrations by month, students vs volunteers</p>
          </div>
          <div className="flex gap-4 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary" /> Students
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-accent" /> Volunteers
            </span>
          </div>
        </div>
        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={enrolmentTrend}>
              <defs>
                <linearGradient id="studentsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(var(--primary))" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="rgb(var(--primary))" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--line))" vertical={false} />
              <XAxis dataKey="month" stroke="rgb(var(--muted))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="rgb(var(--muted))" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area
                type="monotone"
                dataKey="students"
                stroke="rgb(var(--primary))"
                strokeWidth={2}
                fill="url(#studentsFill)" />
              
              <Area
                type="monotone"
                dataKey="volunteers"
                stroke="rgb(var(--accent))"
                strokeWidth={2}
                fill="transparent" />
              
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-2xl border border-line bg-surface p-5 xl:col-span-2">
          <h2 className="font-display text-lg font-bold text-ink">Attendance rate by programme</h2>
          <div className="mt-5 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceByProgram} layout="vertical" margin={{ left: 12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--line))" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} stroke="rgb(var(--muted))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={112}
                  stroke="rgb(var(--muted))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false} />
                
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="rate" fill="rgb(var(--primary))" radius={[0, 6, 6, 0]} maxBarSize={22} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-surface p-5">
          <h2 className="font-display text-lg font-bold text-ink">Community composition</h2>
          <div className="mt-2 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={memberSplit} dataKey="value" nameKey="name" innerRadius={54} outerRadius={82} paddingAngle={2}>
                  {memberSplit.map((entry, i) =>
                  <Cell key={entry.name} fill={pieColors[i % pieColors.length]} stroke="rgb(var(--surface))" />
                  )}
                </Pie>
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  formatter={(value) => <span style={{ color: 'rgb(var(--muted))', fontSize: 12 }}>{value}</span>} />
                
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="overflow-hidden rounded-2xl border border-line bg-surface">
          <p className="border-b border-line px-5 py-3.5 font-display text-sm font-bold text-ink">
            Latest attendance scans
          </p>
          <ul className="divide-y divide-line">
            {attendanceFeed.map((entry) =>
            <li key={entry.id} className="flex items-center gap-3 px-5 py-3.5">
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
                  <p className="truncate text-xs text-muted">{entry.program}</p>
                </div>
                <span className="text-xs text-muted">{entry.time}</span>
              </li>
            )}
          </ul>
        </section>

        <section className="overflow-hidden rounded-2xl border border-line bg-surface">
          <p className="border-b border-line px-5 py-3.5 font-display text-sm font-bold text-ink">
            Upcoming events
          </p>
          <ul className="divide-y divide-line">
            {events.map((event) => {
              const d = dayParts(event.date);
              return (
                <li key={event.id} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-soft leading-none">
                    <span className="font-display text-sm font-extrabold text-primary">{d.day}</span>
                    <span className="text-[10px] font-semibold uppercase text-primary">{d.month}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{event.title}</p>
                    <p className="truncate text-xs text-muted">
                      {event.time} · {event.location}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted">{event.seatsLeft} left</span>
                </li>);

            })}
          </ul>
        </section>
      </div>
    </div>);

}