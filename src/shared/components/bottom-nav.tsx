"use client";

import { Inbox, Calendar, LayoutDashboard, MonitorSmartphone } from "lucide-react";
import { useState } from "react";

export function BottomNav() {
  const [active, setActive] = useState("board");

  const tabs = [
    { id: "inbox", label: "Inbox", icon: Inbox },
    { id: "planner", label: "Планировщик", icon: Calendar },
    { id: "board", label: "Доска", icon: LayoutDashboard },
    { id: "other", label: "Выбрать другую доску", icon: MonitorSmartphone },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 bg-[#1d2125]/95 backdrop-blur-md border border-[#3d4954]/60 rounded-full px-2 py-1.5 shadow-2xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all whitespace-nowrap ${
                isActive
                  ? tab.id === "board"
                    ? "bg-[#0052cc] text-white"
                    : "bg-white/10 text-white border border-[#3d4954]"
                  : "text-[#9fadbc] hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
