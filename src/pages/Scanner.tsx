import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, QrCodeIcon } from 'lucide-react';
import { ScannerPanel } from '../components/attendance/ScannerPanel';

export function Scanner() {
  return (
    <div className="min-h-screen w-full bg-bg">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-page flex-wrap items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-white">
            <QrCodeIcon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h1 className="font-display text-lg font-bold text-ink">Attendance scanner station</h1>
            <p className="text-xs text-muted">
              Front desk mode · works with device camera, mobile camera or USB scanner
            </p>
          </div>
          <Link
            to="/"
            className="ml-auto inline-flex items-center gap-2 rounded-xl border border-line px-4 py-2 text-sm font-semibold text-ink transition-colors duration-150 ease-out hover:bg-elevated">
            
            <ArrowLeftIcon className="h-4 w-4" />
            Exit station
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-page px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <ScannerPanel />
      </main>
    </div>);

}