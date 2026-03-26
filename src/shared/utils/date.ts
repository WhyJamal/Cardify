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