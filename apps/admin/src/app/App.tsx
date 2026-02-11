import { useState, useEffect } from "react";
import { ThemeProvider } from "@/app/components/theme-provider";
import { SidebarNav } from "@/app/components/sidebar-nav";
import { Header } from "@/app/components/header";
import { DashboardSection } from "@/app/components/dashboard-section";
import { ArticlesSection } from "@/app/components/articles-section";
import { CalendarSection } from "@/app/components/calendar-section";
import { CategoriesSection } from "@/app/components/categories-section";
import { TagsSection } from "@/app/components/tags-section";
import { MediaSection } from "@/app/components/media-section";
import { AICenter } from "@/app/components/ai-center";
import { ManifestPage } from "@/app/components/manifest-page";
import { StyleDashboard } from "@/app/components/style-dashboard";
import { EditorialHub } from "@/app/components/editorial-hub";
import { ContentHub } from "@/app/components/content-hub";
import { FormatsDashboard } from "@/app/components/formats-dashboard";
import { SocialsDashboard } from "@/app/components/socials-dashboard";
import { SettingsPage } from "@/app/components/settings-page";
import { UsersPage } from "@/app/components/users-page";
import { PromotionPage } from "@/app/components/promotion-page";
import { AnalyticsPage } from "@/app/components/analytics-page";
import { AdsPage } from "@/app/components/ads-page";
import { SEOPage } from "@/app/components/seo-page";
import { CommandPalette } from "@/app/components/command-palette";
import { AiSidebar } from "@/app/components/ai-sidebar";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { cn } from "@/app/components/ui/utils";
import { useIsMobile } from "@/app/components/ui/use-mobile";
import { useNavigationStore } from "@/app/store/navigation-store";
import { useAuthStore } from "@/app/store/auth-store";
import { LoginPage } from "@/app/components/login-page";
import { Drawer } from "vaul";

function App() {
  const { currentPage, navigateTo } = useNavigationStore();
  const { isAuthenticated, checkAuth } = useAuthStore();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiSidebarOpen, setAiSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  // Проверка авторизации при загрузке
  useEffect(() => {
    checkAuth();
  }, []);

  // Sync navigation store with local state
  useEffect(() => {
    setActiveSection(currentPage);
  }, [currentPage]);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    navigateTo(section as any);
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case "dashboard":
        return "Панель упраления";
      case "ai-center":
        return "AI центр";
      case "articles":
        return "Статьи";
      case "calendar":
        return "Календарь публикаций";
      case "categories":
        return "Категории";
      case "tags":
        return "Метки";
      case "media":
        return "Медиатека";
      case "content-hub":
        return "Центр контента";
      case "manifest":
        return "Манифест издания";
      case "style":
        return "Стиль издания";
      case "editorial-hub":
        return "Редакционный центр";
      case "formats":
        return "Форматы издания";
      case "socials":
        return "Социальные сети";
      case "settings":
        return "Настройки";
      case "users":
        return "Пользователи";
      case "promotion":
        return "Продвижение";
      case "analytics":
        return "Аналитика";
      case "ads":
        return "Реклама";
      case "seo":
        return "SEO";
      default:
        return "Панель управления";
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardSection />;
      case "ai-center":
        return <AICenter />;
      case "articles":
        return <ArticlesSection />;
      case "calendar":
        return <CalendarSection />;
      case "categories":
        return <CategoriesSection />;
      case "tags":
        return <TagsSection />;
      case "media":
        return <MediaSection />;
      case "content-hub":
        return <ContentHub />;
      case "manifest":
        return <ManifestPage onNavigateToAI={() => setActiveSection("ai-center")} />;
      case "style":
        return <StyleDashboard />;
      case "editorial-hub":
        return <EditorialHub />;
      case "formats":
        return <FormatsDashboard />;
      case "socials":
        return <SocialsDashboard />;
      case "settings":
        return <SettingsPage />;
      case "users":
        return <UsersPage />;
      case "promotion":
        return <PromotionPage />;
      case "analytics":
        return <AnalyticsPage />;
      case "ads":
        return <AdsPage />;
      case "seo":
        return <SEOPage />;
      default:
        return <DashboardSection />;
    }
  };

  // Ensure we always render something
  if (!activeSection) {
    return null;
  }

  // Auth guard — показываем login page если не авторизован
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Mobile Menu Drawer */}
        <div className="lg:hidden">
          <Drawer.Root 
            open={mobileMenuOpen} 
            onOpenChange={setMobileMenuOpen}
            direction="left"
          >
            <Drawer.Portal>
              <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
              <Drawer.Content 
                className="bg-background flex flex-col fixed bottom-0 left-0 top-0 z-50 outline-none w-64 border-r"
              >
                <div className="sr-only">
                  <Drawer.Title>Навигация</Drawer.Title>
                  <Drawer.Description>Меню навигации по разделам дашборда</Drawer.Description>
                </div>
                <SidebarNav 
                  activeSection={activeSection} 
                  onSectionChange={handleSectionChange} 
                  collapsed={false}
                />
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        </div>

        {/* AI Sidebar Mobile Drawer */}
        {isMobile && aiSidebarOpen && (
          <Drawer.Root 
            open={aiSidebarOpen} 
            onOpenChange={setAiSidebarOpen}
            direction="right"
          >
            <Drawer.Portal>
              <Drawer.Overlay className="fixed inset-0 bg-black/40 z-50" />
              <Drawer.Content 
                className="bg-background flex flex-col fixed bottom-0 right-0 top-0 z-50 outline-none w-80 border-l"
              >
                <div className="sr-only">
                  <Drawer.Title>AI Агенты</Drawer.Title>
                  <Drawer.Description>Панель AI агентов и автономных процессов</Drawer.Description>
                </div>
                <AiSidebar isOpen={true} isMobile={true} onClose={() => setAiSidebarOpen(false)} />
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        )}

        {/* Sidebar */}
        <aside className={cn(
          "hidden lg:block flex-shrink-0 transition-all duration-300",
          sidebarCollapsed ? "w-20" : "w-64"
        )}>
          <SidebarNav 
            activeSection={activeSection} 
            onSectionChange={handleSectionChange} 
            collapsed={sidebarCollapsed}
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </aside>

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden min-h-0">
          <Header 
            title={getSectionTitle()} 
            sidebarCollapsed={sidebarCollapsed}
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
            onMobileMenuToggle={() => setMobileMenuOpen(true)}
            aiSidebarOpen={aiSidebarOpen}
            onToggleAiSidebar={() => setAiSidebarOpen(!aiSidebarOpen)}
            showAISessionSelector={activeSection === "ai-center"}
          />
          
          {activeSection === "ai-center" ? (
            <div className="flex-1 min-h-0 overflow-hidden">
              <AICenter />
            </div>
          ) : activeSection === "manifest" ? (
            <ManifestPage onNavigateToAI={() => setActiveSection("ai-center")} />
          ) : activeSection === "style" ? (
            <StyleDashboard />
          ) : activeSection === "media" ? (
            <div className="flex-1 min-h-0 overflow-hidden">
              <MediaSection />
            </div>
          ) : activeSection === "categories" ? (
            <div className="flex-1 min-h-0 overflow-hidden">
              <CategoriesSection />
            </div>
          ) : activeSection === "settings" ? (
            <div className="flex-1 min-h-0 overflow-hidden">
              <SettingsPage />
            </div>
          ) : activeSection === "users" ? (
            <div className="flex-1 min-h-0 overflow-hidden">
              <UsersPage />
            </div>
          ) : activeSection === "seo" ? (
            <div className="flex-1 min-h-0 overflow-hidden">
              <SEOPage />
            </div>
          ) : (
            <ScrollArea className="flex-1 min-h-0">
              <div className="container mx-auto p-6">
                {renderSection()}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* AI Sidebar */}
        <div className="hidden lg:block">
          <AiSidebar isOpen={aiSidebarOpen} onClose={() => setAiSidebarOpen(false)} />
        </div>

        {/* Command Palette */}
        <CommandPalette onNavigate={handleSectionChange} />
      </div>
    </ThemeProvider>
  );
}

export default App;