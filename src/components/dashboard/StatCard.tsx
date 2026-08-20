import React from 'react';
import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';
import { Counter } from '../ui/Counter';
import { cn } from '../../utils/cn';

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  delta?: number;
  icon: React.ComponentType<{className?: string;}>;
  emphasis?: boolean;
  note?: string;
}

export function StatCard({
  label,
  value,
  suffix = '',
  delta,
  icon: Icon,
  emphasis,
  note
}: StatCardProps) {
  return (
    <article
      className={cn(
        'flex h-full flex-col rounded-2xl border p-5',
        emphasis ? 'border-primary/30 bg-primary-soft' : 'border-line bg-surface'
      )}>
      
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-muted">{label}</p>
        <span
          className={cn(
            'grid h-9 w-9 place-items-center rounded-xl',
            emphasis ? 'bg-primary text-white' : 'bg-elevated text-primary'
          )}>
          
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p
        className={cn(
          'mt-4 font-display font-extrabold tracking-tight text-ink',
          emphasis ? 'text-4xl' : 'text-3xl'
        )}>
        
        <Counter value={value} suffix={suffix} />
      </p>
      <div className="mt-auto flex items-center gap-2 pt-3 text-xs">
        {typeof delta === 'number' &&
        <span
          className={cn(
            'inline-flex items-center gap-1 font-semibold',
            delta >= 0 ? 'text-success' : 'text-secondary'
          )}>
          
            {delta >= 0 ?
          <TrendingUpIcon className="h-3.5 w-3.5" /> :

          <TrendingDownIcon className="h-3.5 w-3.5" />
          }
            {Math.abs(delta)}%
          </span>
        }
        {note && <span className="text-muted">{note}</span>}
      </div>
    </article>);

}