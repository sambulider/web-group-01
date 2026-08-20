import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  BellRingIcon,
  CalendarCheckIcon,
  FileBarChartIcon,
  ImageIcon,
  LayoutDashboardIcon,
  LayersIcon,
  QrCodeIcon,
  SettingsIcon,
  UsersIcon } from
'lucide-react';
import { DashboardShell, NavItem } from '../../components/dashboard/DashboardShell';
import { AdminOverview } from '../../components/dashboard/admin/AdminOverview';
import { AdminMembers } from '../../components/dashboard/admin/AdminMembers';
import { AdminContent } from '../../components/dashboard/admin/AdminContent';
import { AdminReports } from '../../components/dashboard/admin/AdminReports';
import { ScannerPanel } from '../../components/attendance/ScannerPanel';
import { useAuth } from '../../contexts/AuthContext';
import { btnPrimary } from '../../components/ui/Primitives';
import { cn } from '../../utils/cn';
import { fetchAdminSettings, updateAdminSettings } from '../../lib/api';

const nav: NavItem[] = [
{ id: 'overview', label: 'Analytics', icon: LayoutDashboardIcon },
{ id: 'members', label: 'Members', icon: UsersIcon },
{ id: 'attendance', label: 'Attendance', icon: CalendarCheckIcon },
{ id: 'scanner', label: 'QR scanner', icon: QrCodeIcon },
{ id: 'programs', label: 'Programmes (CMS)', icon: LayersIcon },
{ id: 'announcements', label: 'Announcements', icon: BellRingIcon },
{ id: 'gallery', label: 'Gallery manager', icon: ImageIcon },
{ id: 'reports', label: 'Reports & exports', icon: FileBarChartIcon },
{ id: 'settings', label: 'Settings', icon: SettingsIcon }];


const titles: Record<string, string> = {
  overview: 'Analytics overview',
  members: 'Member management',
  attendance: 'Attendance management',
  scanner: 'QR attendance scanner',
  programs: 'Programme content',
  announcements: 'Announcements',
  gallery: 'Gallery manager',
  reports: 'Reports and exports',
  settings: 'Settings'
};

type AdminSettingsData = {
  centreName: string;
  contactPhone: string;
  contactEmail: string;
  scannerId: string;
  rejectDuplicateScans: boolean;
  audioFeedback: boolean;
  flagLowAttendance: boolean;
  allowManualAttendance: boolean;
};

function AdminSettings() {
  const [data, setData] = useState<AdminSettingsData | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void fetchAdminSettings().then(setData).catch((error) => toast.error(error instanceof Error ? error.message : 'Failed to load settings'));
  }, []);

  if (!data) return <div className="rounded-2xl border border-line bg-surface p-5 text-sm text-muted">Loading settings…</div>;

  const setField = (key: keyof AdminSettingsData, value: string | boolean) => setData((current) => current ? { ...current, [key]: value } : current);

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      const saved = await updateAdminSettings(data);
      setData(saved);
      toast.success('Settings saved to Supabase');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="max-w-2xl grid gap-6" onSubmit={save}>
      <section className="rounded-2xl border border-line bg-surface p-5 sm:p-7">
        <h2 className="font-display text-lg font-bold text-ink">Centre details</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {([
            ['centreName', 'Centre name'],
            ['contactPhone', 'Contact phone'],
            ['contactEmail', 'Contact email'],
            ['scannerId', 'Front desk scanner ID'],
          ] as const).map(([key, label]) => (
            <div key={key}>
              <label htmlFor={`setting-${key}`} className="text-sm font-medium text-ink">{label}</label>
              <input id={`setting-${key}`} value={data[key]} onChange={(event) => setField(key, event.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-line bg-bg px-3.5 text-sm text-ink" />
            </div>
          ))}
        </div>
      </section>
      <section className="rounded-2xl border border-line bg-surface p-5 sm:p-7">
        <h2 className="font-display text-lg font-bold text-ink">Attendance rules</h2>
        <ul className="mt-4 divide-y divide-line">
          {([
            ['rejectDuplicateScans', 'Reject duplicate scans within the same session'],
            ['audioFeedback', 'Play audio feedback at the scanner'],
            ['flagLowAttendance', 'Flag members below 70% attendance'],
            ['allowManualAttendance', 'Allow volunteers to record attendance manually'],
          ] as const).map(([key, label]) => (
            <li key={key} className="flex items-center justify-between gap-4 py-3.5">
              <span className="text-sm text-ink">{label}</span>
              <input type="checkbox" checked={data[key]} onChange={(event) => setField(key, event.target.checked)} className="h-5 w-5 rounded border-line text-primary" aria-label={label} />
            </li>
          ))}
        </ul>
      </section>
      <button type="submit" disabled={saving} className={cn(btnPrimary, 'w-fit')}>{saving ? 'Saving…' : 'Save settings'}</button>
    </form>
  );
}

export function AdminDashboard() {
  const { user } = useAuth();
  const [active, setActive] = useState('overview');

  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;

  return (
    <DashboardShell
      title={titles[active]}
      subtitle={`Administrator · ${user.name}`}
      nav={nav}
      activeId={active}
      onNavigate={setActive}>
      
      {active === 'overview' && <AdminOverview />}
      {active === 'members' && <AdminMembers />}
      {(active === 'attendance' || active === 'scanner') && <ScannerPanel />}
      {active === 'programs' && <AdminContent view="cms" />}
      {active === 'announcements' && <AdminContent view="announcements" />}
      {active === 'gallery' && <AdminContent view="gallery" />}
      {active === 'reports' && <AdminReports />}
      {active === 'settings' && <AdminSettings />}
    </DashboardShell>);

}