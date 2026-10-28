const fmt = (d: string | Date, o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', ...o }).format(new Date(d));
export const formatDate = (d?: string | Date | null) => (d ? fmt(d, { day: 'numeric', month: 'short', year: 'numeric' }) : '—');
export const formatDay = (d: string | Date) => fmt(d, { weekday: 'short', day: 'numeric', month: 'short' });
export const toInputDate = (d?: string | Date | null) => (d ? new Date(d).toISOString().slice(0, 10) : '');
export const todayInput = () => new Date().toISOString().slice(0, 10);
