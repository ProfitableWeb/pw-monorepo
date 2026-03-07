export interface HeaderProps {
  title: string;
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
  aiSidebarOpen?: boolean;
  onToggleAiSidebar?: () => void;
  onMobileMenuToggle?: () => void;
  showAISessionSelector?: boolean;
}
