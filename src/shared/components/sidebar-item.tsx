import Link from "next/link";
import type { NavItem } from "../config/navigation"

interface SidebarItemProps {
    item: NavItem;
    isActive: boolean;
    collapsed: boolean;
}

export function SidebarItem({ item, isActive, collapsed }: SidebarItemProps) {
    const Icon = item.icon;

    return (
        <Link key={item.id} href={item.url || "/"} className="block">
            <button
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md mb-1 text-sm transition-all
                  ${collapsed ? "justify-center px-0" : ""}
                  ${isActive
                        ? "bg-[#579dff26] text-[#579dff]"
                        : "text-[#b6c2cf] hover:bg-[#a1bdd914]"
                    }`}
            >
                <Icon size={18} />
                {!collapsed && <span>{item.label}</span>}
            </button>
        </Link>
    )
}