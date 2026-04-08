"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

interface SidebarItemProps {
  href: string;
  label: string;
  icon: ReactNode;
  hasChevron?: boolean;
}

export default function WorkspaceItem({ href, label, icon, hasChevron = false }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <li>
      <Link
        href={href}
        className={`group flex items-center gap-3 px-3 py-2 rounded-lg justify-between
                   transition-all duration-200
                   ${isActive
                     ? "bg-[#1d2ee726] text-[#579dff]"
                     : "text-[#b6c2cf] hover:bg-white/10 hover:text-white"
                   }`}
      >
        <div className="flex gap-2 items-center">
          {icon}
          <span className="font-medium">{label}</span>
        </div>

        {hasChevron && !isActive && (
          <ChevronRight
            className="ml-auto opacity-0 translate-x-3 transition-all duration-200 ease-out
                       group-hover:opacity-100 group-hover:translate-x-0"
            size={16}
          />
        )}
      </Link>
    </li>
  );
}