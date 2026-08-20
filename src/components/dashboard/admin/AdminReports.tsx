import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { FileSpreadsheetIcon, FileTextIcon, Loader2Icon, TableIcon } from 'lucide-react';
import { exportAdminReport, fetchAdminReports } from '../../../lib/api';
import { btnGhost, btnPrimary } from '../../ui/Primitives';
import { cn } from '../../../utils/cn';

type ReportRow = { month: string; students: number; volunteers: number; total: number };
type ReportData = { reportType: string; range: string; programmes: number; enrollments: number; rows: ReportRow[] };

const exports = [
  { id: 'csv', label: 'CSV export', icon: TableIcon, note: 'Raw live rows for spreadsheets' },
  { id: 'excel', label: 'Excel workbook', icon: FileSpreadsheetIcon, note: 'Live programme and member summary' },
  { id: 'pdf', label: 'PDF report', icon: FileTextIcon, note: 'Live narrative report for partners' },
];
const reportTypes = ['Attendance summary', 'Programme completion', 'Volunteer hours', 'Member growth', 'Event participation'];

export function AdminReports() {
  const [busy, setBusy] = useState<string | null>(null);
  const [reportType, setReportType] = useState(reportTypes[0]);
  const [range, setRange] = useState('Last 90 days');
  const [data, setData] = useState<ReportData | null>(null);

  const load = async () => {
    try {
      setData(await fetchAdminReports());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load reports');
    }
  };

  useEffect(() => { void load(); }, []);

  const run = async (id: string, label: string) => {
    setBusy(id);
    try {
      const result = await exportAdminReport({ reportType, range, format: id });
      toast.success(`${label} generated`, { description: result.message });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate report');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="grid gap-6">
      <section className="rounded-2xl border border-line bg-surface p-5">
        <h2 className="font-display text-lg font-bold text-ink">Build a report</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <select value={reportType} onChange={(event) => setReportType(event.target.value)} className="h-11 rounded-xl border border-line bg-bg px-3.5 text-sm text-ink" aria-label="Report type">
            {reportTypes.map((value) => <option key={value}>{value}</option>)}
          </select>
          <select value={range} onChange={(event) => setRange(event.target.value)} className="h-11 rounded-xl border border-line bg-bg px-3.5 text-sm text-ink" aria-label="Date range">
            {['Last 30 days', 'Last 90 days', 'This year', 'All time'].map((value) => <option key={value}>{value}</option>)}
          </select>
          <div className="rounded-xl border border-line bg-bg px-3.5 py-2.5 text-sm text-muted">{data?.programmes ?? 0} programmes · {data?.enrollments ?? 0} enrollments</div>
          <button type="button" onClick={() => void load()} className={cn(btnGhost, 'h-11')}>Refresh data</button>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        {exports.map((item) => (
          <article key={item.id} className="flex flex-col rounded-2xl border border-line bg-surface p-5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary"><item.icon className="h-5 w-5" /></span>
            <h3 className="mt-4 font-display text-base font-bold text-ink">{item.label}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.note}</p>
            <button type="button" disabled={busy === item.id} onClick={() => void run(item.id, item.label)} className={cn(btnPrimary, 'mt-5 w-full')}>
              {busy === item.id ? <><Loader2Icon className="h-4 w-4 animate-spin" /> Generating…</> : 'Generate'}
            </button>
          </article>
        ))}
      </div>

      <section className="overflow-hidden rounded-2xl border border-line bg-surface">
        <p className="border-b border-line px-5 py-3.5 font-display text-sm font-bold text-ink">Live data preview · {data?.reportType ?? 'Member growth'}</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead className="border-b border-line bg-elevated/60 text-xs uppercase tracking-wide text-muted"><tr><th className="px-5 py-3">Month</th><th className="px-5 py-3">Students</th><th className="px-5 py-3">Volunteers</th><th className="px-5 py-3">Total</th></tr></thead>
            <tbody className="divide-y divide-line">{(data?.rows ?? []).map((row) => <tr key={row.month}><td className="px-5 py-3.5 font-medium text-ink">{row.month} 2026</td><td className="px-5 py-3.5 text-muted">{row.students}</td><td className="px-5 py-3.5 text-muted">{row.volunteers}</td><td className="px-5 py-3.5 font-semibold text-ink">{row.total}</td></tr>)}</tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
