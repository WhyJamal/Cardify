import { PAGES } from "@/config/pages.config";
import { LayoutDashboard, FileText, Home } from "lucide-react";

export type NavItem = {
    id: string;
    label: string;
    icon: any;
    url?: string;
};

export const sidebarItems: NavItem[] = [
    {
        id: "boards",
        label: "Доски",
        icon: LayoutDashboard,
        url: PAGES.USER_BOARDS("user"),
    },
    {
        id: "templates",
        label: "Шаблоны",
        icon: FileText,
        url: PAGES.TEMPLATES,
    },
    {
        id: "home",
        label: "Главная страница",
        icon: Home,
        url: PAGES.HOME,
    },
];