const pad = (value: number) => String(value).padStart(2, "0");

export const MONTH_NAMES = [
  "январь",
  "февраль",
  "март",
  "апрель",
  "май",
  "июнь",
  "июль",
  "август",
  "сентябрь",
  "октябрь",
  "ноябрь",
  "декабрь",
];

export const WEEK_DAYS = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];

export function formatDateValue(date: Date) {
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`;
}

export function formatTimeValue(date: Date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function buildDueDateISO(dateStr: string, timeStr: string) {
  if (!dateStr) return null;

  const [day, month, year] = dateStr.split(".");
  const [hour = "00", minute = "00"] = timeStr.split(":");

  return `${year}-${month}-${day}T${hour}:${minute}:00`;
}

export function normalizeDateInput(value: string) {
  let next = value.replace(/\D/g, "");

  if (next.length > 8) next = next.slice(0, 8);

  if (next.length >= 5) {
    next = `${next.slice(0, 2)}.${next.slice(2, 4)}.${next.slice(4)}`;
  } else if (next.length >= 3) {
    next = `${next.slice(0, 2)}.${next.slice(2)}`;
  }

  return next;
}

export function formatCardDate(dateString: string | Date) {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function getDueDateStatus(
  dueDate: Date | string | undefined,
  isCompleted: boolean
) {
  if (isCompleted) return { label: "Выполнено", color: "bg-[#17ca2c]" };

  if (dueDate) {
    const due = new Date(dueDate);
    if (due < new Date()) return { label: "Просрочено", color: "bg-[#c9372c]" };
  }

  return { label: "В работе", color: "bg-[#0079bf]" };
}

export function formatDueDate(date: string | Date): string {
  if (!date) return "";

  const due = date instanceof globalThis.Date ? date : new Date(date); 
  const now = new Date();

  const months = ["янв.", "фев.", "мар.", "апр.", "май", "июн.", "июл.", "авг.", "сен.", "окт.", "ноя.", "дек."];

  const day = due.getDate();
  const month = months[due.getMonth()];
  const year = due.getFullYear();

  return year === now.getFullYear() ? `${day} ${month}` : `${day} ${month} ${year}г.`;
}

export function formatTimeAgo(date: string | Date) {
  const now = new Date();
  const past = new Date(date);

  const diff = Math.floor((now.getTime() - past.getTime()) / 1000); // seconds

  if (diff < 10) return "только что";
  if (diff < 60) return `${diff} секунд назад`;

  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes} минут назад`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} часов назад`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} дней назад`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} недель назад`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} месяцев назад`;

  const years = Math.floor(days / 365);
  return `${years} лет назад`;
}