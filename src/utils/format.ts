import { format, parseISO } from 'date-fns';

export function formatDate(iso: string, pattern = 'd MMM yyyy'): string {
  try {
    return format(parseISO(iso), pattern);
  } catch {
    return iso;
  }
}

export function dayParts(iso: string): {day: string;month: string;weekday: string;} {
  const date = parseISO(iso);
  return {
    day: format(date, 'dd'),
    month: format(date, 'MMM'),
    weekday: format(date, 'EEEE')
  };
}

export function compactNumber(value: number): string {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(
    value
  );
}