"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, X } from "lucide-react";
import { createPortal } from "react-dom";

import { calcSidePosition } from "@/shared/utils/floatingPosition";
// import { useCardActions } from "@/shared/hooks/use-card-actions";
import {
  MONTH_NAMES,
  WEEK_DAYS,
  formatDateValue,
  formatTimeValue,
  buildDueDateISO,
  normalizeDateInput,
} from "@/shared/utils/date";
import { useOutsideClick } from "@/shared/hooks/use-outside-click";
import { Button } from "@/shared/components";

interface DatePickerProps {
  triggerRef: React.RefObject<HTMLElement | null>;
  cardId: string;
  cardDueDate: Date | string | undefined;
  onClose?: () => void;
  onChange?: (dueDate: string | null) => void;
}

export function DatePicker({
  triggerRef,
  cardId,
  cardDueDate,
  onClose,
  onChange,
}: DatePickerProps) {
  // const { handleChangeDueDate } = useCardActions();
  const today = new Date();

  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(today);
  const [startDate, setStartDate] = useState("");
  const [deadlineDate, setDeadlineDate] = useState("");
  const [deadlineTime, setDeadlineTime] = useState("");
  const [repeatOption, setRepeatOption] = useState("Никогда");
  const [reminderOption, setReminderOption] = useState("за 1 день");

  useEffect(() => {
    if (cardDueDate) {
      const date = new Date(cardDueDate);
      setDeadlineDate(formatDateValue(date));
      setDeadlineTime(formatTimeValue(date));
      setSelectedDate(date);
    } else {
      setDeadlineDate(formatDateValue(today));
      setDeadlineTime(formatTimeValue(today));
      setSelectedDate(today);
    }
  }, [cardDueDate]);

  const PANEL_WIDTH = 350;
  const PANEL_HEIGHT = 640;

  const pos = (() => {
    if (!triggerRef.current) return { left: 0, top: 0, maxHeight: PANEL_HEIGHT };

    return calcSidePosition(
      triggerRef.current.getBoundingClientRect(),
      PANEL_WIDTH,
      PANEL_HEIGHT
    );
  })();

  const panelRef = useRef<HTMLDivElement>(null);

  useOutsideClick([panelRef, triggerRef], () => onClose?.(), true);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1;
  };

  const navigateMonth = (direction: "prev" | "next" | "prevYear" | "nextYear") => {
    const newDate = new Date(currentDate);

    if (direction === "prev") newDate.setMonth(newDate.getMonth() - 1);
    else if (direction === "next") newDate.setMonth(newDate.getMonth() + 1);
    else if (direction === "prevYear") newDate.setFullYear(newDate.getFullYear() - 1);
    else newDate.setFullYear(newDate.getFullYear() + 1);

    setCurrentDate(newDate);
  };

  const toggleDate = (day: number) => {
    const newSelectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
      today.getHours(),
      today.getMinutes()
    );

    setSelectedDate(newSelectedDate);
    setDeadlineDate(formatDateValue(newSelectedDate));
    setDeadlineTime(formatTimeValue(newSelectedDate));
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const prevMonthDays = getDaysInMonth(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );

    const days: React.ReactNode[] = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      days.push(
        <div key={`prev-${i}`} className="text-gray-600 text-center py-2">
          {prevMonthDays - i}
        </div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected =
        selectedDate !== null &&
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentDate.getMonth() &&
        selectedDate.getFullYear() === currentDate.getFullYear();

      const isToday =
        day === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear();

      days.push(
        <button
          key={`current-${day}`}
          onClick={() => toggleDate(day)}
          className={`text-center py-2 rounded transition-colors relative ${
            isSelected ? "bg-blue-600 text-white" : "text-white hover:bg-gray-700"
          }`}
        >
          {day}
          {isToday && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-blue-500" />
          )}
        </button>
      );
    }

    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push(
        <div key={`next-${day}`} className="text-gray-600 text-center py-2">
          {day}
        </div>
      );
    }

    return days;
  };

  const handleDueDate = async (action: "save" | "delete") => {
    try {
      let dueDate: string | null = null;

      if (action === "save") {
        dueDate = buildDueDateISO(deadlineDate, deadlineTime);
        if (!dueDate) {
          console.warn("Неверная дата или время");
          return;
        }
      } else {
        dueDate = null;
        setDeadlineDate("");
        setDeadlineTime("");
      }

      // handleChangeDueDate(cardId, dueDate)
      // await cardApi.updateDueDate(cardId, dueDate);
      
      onChange?.(dueDate);
      onClose?.();
    } catch (err) {
      console.error("Ошибка работы с датой:", err);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDeadlineDate(normalizeDateInput(e.target.value));
  };

  return createPortal(
    <div
      ref={panelRef}
      style={{
        position: "fixed",
        left: pos.left,
        top: pos.top,
        width: PANEL_WIDTH,
        maxHeight: Math.max(240, pos.maxHeight - 80),
        zIndex: 99999,
      }}
      className="bg-[#2b3035] rounded-lg shadow-xl text-white flex flex-col overflow-hidden"
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700 shrink-0">
        <button onClick={onClose} className="hover:bg-gray-700 p-1 rounded">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="font-medium">Даты</h2>
        <button onClick={onClose} className="hover:bg-gray-700 p-1 rounded">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="p-4 pb-2">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => navigateMonth("prevYear")} className="hover:bg-gray-700 p-1 rounded">
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button onClick={() => navigateMonth("prev")} className="hover:bg-gray-700 p-1 rounded">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium">
              {MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button onClick={() => navigateMonth("next")} className="hover:bg-gray-700 p-1 rounded">
              <ChevronRight className="w-4 h-4" />
            </button>
            <button onClick={() => navigateMonth("nextYear")} className="hover:bg-gray-700 p-1 rounded">
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {WEEK_DAYS.map((day) => (
              <div key={day} className="text-gray-400 text-center text-xs uppercase">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-sm">{renderCalendar()}</div>
        </div>

        <div className="px-4 py-3 border-t border-gray-700">
          <label className="text-sm text-gray-400 mb-2 block">Срок</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={deadlineDate}
              onChange={handleDateChange}
              placeholder="DD.MM.YYYY"
              maxLength={10}
              className="bg-[#1f1f1f] border border-gray-600 rounded px-3 py-1.5 text-sm outline-none focus:border-blue-500 flex-1"
            />
            <input
              type="time"
              value={deadlineTime}
              onChange={(e) => setDeadlineTime(e.target.value)}
              className="bg-[#1f1f1f] border border-gray-600 rounded px-3 py-1.5 text-sm outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="p-4 border-t border-gray-700 space-y-2">
          <Button
            variant={'custom'}
            onClick={() => handleDueDate("save")}
            className="w-full text-sm"
          >
            Сохранить
          </Button>
          <button
            onClick={() => handleDueDate("delete")}
            className="w-full bg-[#2c333a] hover:bg-[#38414a] text-[#9fadbc] hover:text-white border border-gray-800 py-1 rounded text-sm transition-colors"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}