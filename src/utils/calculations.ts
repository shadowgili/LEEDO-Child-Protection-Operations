import { Child } from '../types/leedo';

// Current reference date for consistent calculation
export const CURRENT_APP_DATE = '2026-09-20';

export function calculateDaysBetween(fromDateStr: string, toDateStr: string = CURRENT_APP_DATE): number {
  if (!fromDateStr) return 0;
  try {
    const from = new Date(fromDateStr);
    const to = new Date(toDateStr);
    const diffTime = to.getTime() - from.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  } catch {
    return 0;
  }
}

export function getDaysInShelter(child: Child): number {
  if (!child.shelterAdmissionDate) return 0;
  // If reintegrated or referred, compute until that date if available
  if (child.reintegrationRecord?.reintegrationDate) {
    return calculateDaysBetween(child.shelterAdmissionDate, child.reintegrationRecord.reintegrationDate);
  }
  if (child.referralRecord?.referralDate) {
    return calculateDaysBetween(child.shelterAdmissionDate, child.referralRecord.referralDate);
  }
  if (child.leftWithoutNoticeRecord?.date) {
    return calculateDaysBetween(child.shelterAdmissionDate, child.leftWithoutNoticeRecord.date);
  }
  return calculateDaysBetween(child.shelterAdmissionDate, CURRENT_APP_DATE);
}

export function getSixWeekStatus(child: Child): {
  days: number;
  status: 'normal' | 'approaching' | 'completed' | 'exceeded';
  label: string;
  badgeClass: string;
} {
  // Only applicable if child is currently in shelter or active shelter case
  const isStillInShelter = child.shelterStatus === 'Admitted' || child.caseStatus === 'Shelter Stay' || child.caseStatus === 'Family Tracing' || child.caseStatus === 'Family Located' || child.caseStatus === 'Ready for Reintegration';
  const days = getDaysInShelter(child);

  if (!isStillInShelter || !child.shelterAdmissionDate) {
    return {
      days,
      status: 'normal',
      label: 'Not in Shelter',
      badgeClass: 'bg-stone-100 text-stone-700',
    };
  }

  if (days > 42) {
    return {
      days,
      status: 'exceeded',
      label: `Exceeded 6 Weeks (${days} days)`,
      badgeClass: 'bg-rose-100 text-rose-800 border border-rose-300 font-semibold animate-pulse',
    };
  } else if (days === 42) {
    return {
      days,
      status: 'completed',
      label: `Completed 6 Weeks (42 days)`,
      badgeClass: 'bg-amber-100 text-amber-800 border border-amber-300 font-semibold',
    };
  } else if (days >= 35) {
    const daysLeft = 42 - days;
    return {
      days,
      status: 'approaching',
      label: `Approaching 6 Weeks (${daysLeft}d left)`,
      badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200',
    };
  }

  return {
    days,
    status: 'normal',
    label: `${days} days in shelter`,
    badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  };
}

export function generateNextChildId(existingChildren: Child[]): string {
  const currentYear = new Date(CURRENT_APP_DATE).getFullYear();
  const prefix = `LEEDO-${currentYear}-`;
  
  const numbers = existingChildren
    .map(c => {
      if (c.id.startsWith(prefix)) {
        const numPart = parseInt(c.id.replace(prefix, ''), 10);
        return isNaN(numPart) ? 0 : numPart;
      }
      return 0;
    })
    .filter(n => n > 0);

  const maxNum = numbers.length > 0 ? Math.max(...numbers) : 0;
  const nextNum = maxNum + 1;
  return `${prefix}${String(nextNum).padStart(4, '0')}`;
}

export function formatDate(dateStr?: string): string {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function exportToCSV(data: Record<string, any>[], filename: string) {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]);
  const rows = data.map(item =>
    headers
      .map(header => {
        const val = item[header] ?? '';
        const escaped = String(val).replace(/"/g, '""');
        return `"${escaped}"`;
      })
      .join(',')
  );
  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
