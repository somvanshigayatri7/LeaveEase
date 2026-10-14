import { UPCOMING_HOLIDAYS_2026 } from '../data/leaveData';

export function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const parts = dateStr.split('-');
  if (parts.length !== 3) return null;
  return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
}

export function formatDatePretty(dateStr: string): string {
  const date = parseDate(dateStr);
  if (!date) return dateStr;
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function calculateBusinessDays(
  startDateStr: string,
  endDateStr: string,
  excludeHolidays: boolean = true,
  isHalfDay: boolean = false
): { workingDays: number; weekendDays: number; holidaysCount: number; holidaysList: string[] } {
  if (isHalfDay) {
    return { workingDays: 0.5, weekendDays: 0, holidaysCount: 0, holidaysList: [] };
  }

  const start = parseDate(startDateStr);
  const end = parseDate(endDateStr);

  if (!start || !end || start > end) {
    return { workingDays: 0, weekendDays: 0, holidaysCount: 0, holidaysList: [] };
  }

  let workingDays = 0;
  let weekendDays = 0;
  let holidaysCount = 0;
  const holidaysList: string[] = [];

  const cur = new Date(start);
  while (cur <= end) {
    const dayOfWeek = cur.getDay(); // 0 is Sun, 6 is Sat
    const curIso = cur.toISOString().split('T')[0];

    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const matchingHoliday = UPCOMING_HOLIDAYS_2026.find((h) => h.date === curIso);

    if (isWeekend) {
      weekendDays++;
    } else if (excludeHolidays && matchingHoliday) {
      holidaysCount++;
      holidaysList.push(`${matchingHoliday.name} (${curIso})`);
    } else {
      workingDays++;
    }

    cur.setDate(cur.getDate() + 1);
  }

  return { workingDays, weekendDays, holidaysCount, holidaysList };
}

export function calculateNoticeDays(startDateStr: string): number {
  const start = parseDate(startDateStr);
  if (!start) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);

  const diffTime = start.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

export function getNextBusinessDay(dateStr: string): string {
  const d = parseDate(dateStr);
  if (!d) return '';
  d.setDate(d.getDate() + 1);
  while (d.getDay() === 0 || d.getDay() === 6) {
    d.setDate(d.getDate() + 1);
  }
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function generateMailtoUrl(to: string, subject: string, body: string, cc?: string): string {
  const parts: string[] = [];
  if (subject) parts.push(`subject=${encodeURIComponent(subject)}`);
  if (body) parts.push(`body=${encodeURIComponent(body)}`);
  if (cc) parts.push(`cc=${encodeURIComponent(cc)}`);
  const query = parts.length > 0 ? `?${parts.join('&')}` : '';
  const recipient = to ? to.trim() : '';
  return `mailto:${recipient}${query}`;
}
