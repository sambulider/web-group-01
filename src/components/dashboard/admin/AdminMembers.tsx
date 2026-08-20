import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { SearchIcon, UserPlusIcon } from 'lucide-react';
import { adminMembers } from '../../../data/members';
import { btnGhost, btnPrimary } from '../../ui/Primitives';
import { cn } from '../../../utils/cn';

const statusStyles: Record<string, string> = {
  Active: 'bg-success/10 text-success',
  'At risk': 'bg-secondary/10 text-secondary',
  Pending: 'bg-accent/15 text-[#8a6400] dark:text-accent'
};

export function AdminMembers() {
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('All');

  const rows = useMemo(
    () =>
    adminMembers.filter(
      (m) =>
      (role === 'All' || m.role === role) &&
      `${m.name} ${m.id} ${m.program}`.toLowerCase().includes(query.toLowerCase())
    ),
    [query, role]
  );

  return (
    <div className="grid gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Student', 'Volunteer'].map((r) =>
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            aria-pressed={role === r}
            className={cn(
              'rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-150 ease-out',
              role === r ? 'bg-primary text-white' : 'border border-line text-muted hover:text-ink'
            )}>
            
              {r}
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1 sm:w-64">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <label className="sr-only" htmlFor="member-search">
              Search members
            </label>
            <input
              id="member-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search members"
              className="h-11 w-full rounded-xl border border-line bg-bg pl-9 pr-3 text-sm text-ink placeholder:text-muted" />
            
          </div>
          <button
            type="button"
            onClick={() => toast.success('Invitation sent to the new member')}
            className={cn(btnPrimary, 'h-11 shrink-0')}>
            
            <UserPlusIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Add member</span>
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[48rem] text-left text-sm">
            <caption className="sr-only">Registered members and attendance</caption>
            <thead className="border-b border-line bg-elevated/60 text-xs uppercase tracking-wide text-muted">
              <tr>
                <th scope="col" className="px-5 py-3 font-semibold">Member</th>
                <th scope="col" className="px-5 py-3 font-semibold">ID</th>
                <th scope="col" className="px-5 py-3 font-semibold">Role</th>
                <th scope="col" className="px-5 py-3 font-semibold">Programme</th>
                <th scope="col" className="px-5 py-3 font-semibold">Attendance</th>
                <th scope="col" className="px-5 py-3 font-semibold">Status</th>
                <th scope="col" className="px-5 py-3 font-semibold sr-only">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((m) =>
              <tr key={m.id}>
                  <td className="px-5 py-4 font-medium text-ink">{m.name}</td>
                  <td className="px-5 py-4 font-mono text-xs text-muted">{m.id}</td>
                  <td className="px-5 py-4 text-muted">{m.role}</td>
                  <td className="px-5 py-4 text-muted">{m.program}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-elevated">
                        <div
                        className={cn(
                          'h-full rounded-full',
                          m.attendance >= 75 ? 'bg-success' : m.attendance > 0 ? 'bg-accent' : 'bg-line'
                        )}
                        style={{ width: `${m.attendance}%` }} />
                      
                      </div>
                      <span className="text-xs text-muted">{m.attendance}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={cn('rounded-full px-2.5 py-1 text-xs font-semibold', statusStyles[m.status])}>
                      {m.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                    type="button"
                    onClick={() => toast.info(`Opened record for ${m.name}`)}
                    className="text-sm font-semibold text-primary transition-colors duration-150 hover:text-primary-deep">
                    
                      Manage
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {rows.length === 0 &&
        <p className="px-5 py-10 text-center text-sm text-muted">No members match this search.</p>
        }
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-5 py-4">
        <p className="text-sm text-muted">
          Showing {rows.length} of {adminMembers.length} records · attendance below 70% is flagged
          for follow-up
        </p>
        <button
          type="button"
          onClick={() => toast.success('Follow-up SMS queued for at-risk members')}
          className={cn(btnGhost, 'py-2')}>
          
          Notify at-risk members
        </button>
      </div>
    </div>);

}