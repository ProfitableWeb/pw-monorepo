import { create } from "zustand";
import { LucideIcon } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: LucideIcon;
  onClick?: () => void;
  dropdown?: {
    label: string;
    icon?: LucideIcon;
    href?: string;
  }[];
}

interface HeaderState {
  title: string | null;
  breadcrumbs: BreadcrumbItem[] | null;
  setTitle: (title: string) => void;
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
  reset: () => void;
}

export const useHeaderStore = create<HeaderState>((set) => ({
  title: null,
  breadcrumbs: null,
  setTitle: (title) => set({ title, breadcrumbs: null }),
  setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs, title: null }),
  reset: () => set({ title: null, breadcrumbs: null }),
}));