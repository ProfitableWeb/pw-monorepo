import { useState, useEffect, useRef } from 'react';
import { AccessDenied } from '@/app/components/layout/access-denied';
import { ThemeProvider } from '@/app/components/layout/theme-provider';
import { SidebarNav } from '@/app/components/layout/sidebar-nav';
import { Header } from '@/app/components/layout/header';
import { DashboardSection } from '@/app/components/sections/dashboard';
import { ArticlesSection } from '@/app/components/sections/articles';
import { CalendarSection } from '@/app/components/sections/calendar';
import { CategoriesSection } from '@/app/components/sections/categories';
import { TagsSection } from '@/app/components/sections/tags';
import { MediaSection } from '@/app/components/sections/media';
import { AICenter } from '@/app/components/sections/ai-center';
import { ManifestPage } from '@/app/components/sections/manifest';
import { StyleDashboard } from '@/app/components/sections/style';
import { EditorialHub } from '@/app/components/sections/editorial';
import { ContentHub } from '@/app/components/sections/content-hub';
import { FormatsDashboard } from '@/app/components/sections/formats';
import { SocialsDashboard } from '@/app/components/sections/socials';
import { SettingsPage } from '@/app/components/sections/settings';
import { UsersPage } from '@/app/components/sections/users';
import { PromotionPage } from '@/app/components/sections/promotion';
import { AnalyticsPage } from '@/app/components/sections/analytics';
import { AdsPage } from '@/app/components/sections/ads';
import { SeoPage } from '@/app/components/sections/seo';
import { SystemHub } from '@/app/components/sections/system-hub';
import { CommandPalette } from '@/app/components/layout/command-palette';
import {
  ResearchListPage,
  ResearchWorkspace,
} from '@/app/components/sections/research';
import { ArticleWorkbench } from '@/app/components/sections/article-workbench/ArticleWorkbench';
import { AiSidebar } from '@/app/components/layout/ai-sidebar';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { cn } from '@/app/components/ui/utils';
import { useIsMobile } from '@/app/components/ui/use-mobile';
import { useNavigationStore } from '@/app/store/navigation-store';
import { useAuthStore } from '@/app/store/auth-store';
import { LoginPage } from '@/app/components/layout/login-page';
import { urlToPageId } from '@/app/lib/routes';
import type { PageId } from '@/app/store/navigation.constants';
import { useResearchStore } from '@/app/store/research-store';
import { Drawer } from 'vaul';

/** Восстановить навигацию из распарсенного маршрута (включая параметрические) */
function restoreRoute(
  route: { pageId: PageId; params?: Record<string, string> },
  options?: { skipPush?: boolean }
) {
  const nav = useNavigationStore.getState();
  const { setCurrentResearch } = useResearchStore.getState();

  if (route.pageId === 'article-editor' && route.params?.id) {
    // "new" — создание новой статьи, не передаём как articleId
    const articleId = route.params.id === 'new' ? undefined : route.params.id;
    nav.navigateToArticleEditor(articleId, options);
  } else if (route.pageId === 'research-workspace' && route.params?.id) {
    setCurrentResearch(route.params.id);
    nav.navigateToResearchWorkspace(route.params.id, options);
  } else {
    nav.navigateTo(route.pageId, options);
  }
}

function App() {
  const { currentPage, navigateTo } = useNavigationStore();
  const { isAuthenticated, isAdmin, checkAuth } = useAuthStore();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aiSidebarOpen, setAiSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  /** URL, на который нужно перенаправить после логина */
  const intendedUrlRef = useRef<string | null>(null);

  // Восстановление навигации из URL при загрузке
  useEffect(() => {
    const url = new URL(window.location.href);

    // OAuth callback
    if (url.pathname.endsWith('/auth/callback')) {
      const success = url.searchParams.get('success');
      if (success === 'true') {
        checkAuth().then(() => {
          window.history.replaceState({}, '', '/admin/');
        });
      } else {
        window.history.replaceState({}, '', '/admin/');
      }
      return;
    }

    checkAuth();

    // Парсим URL → pageId и восстанавливаем состояние
    const route = urlToPageId(url.pathname);
    if (route) {
      restoreRoute(route, { skipPush: true });
      window.history.replaceState({ pageId: route.pageId }, '', url.pathname);
      // Сохраняем intended URL для редиректа после логина
      if (route.pageId !== 'dashboard') {
        intendedUrlRef.current = url.pathname;
      }
    } else if (url.pathname !== '/admin/' && url.pathname !== '/admin') {
      // Неизвестный путь — перенаправляем на дашборд
      window.history.replaceState({ pageId: 'dashboard' }, '', '/admin/');
    }
  }, []);

  // Popstate — back/forward браузера
  // Всегда парсим URL а не state, чтобы корректно восстанавливать параметрические маршруты
  useEffect(() => {
    const handler = () => {
      const route = urlToPageId(window.location.pathname);
      if (route) {
        restoreRoute(route, { skipPush: true });
      } else {
        navigateTo('dashboard', { skipPush: true });
      }
    };
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, []);

  // Редирект на intended URL после успешного логина
  useEffect(() => {
    if (isAuthenticated && intendedUrlRef.current) {
      const intended = intendedUrlRef.current;
      intendedUrlRef.current = null;
      // Если уже на нужной странице — не навигировать повторно
      if (window.location.pathname === intended) return;
      const route = urlToPageId(intended);
      if (route && route.pageId !== 'dashboard') {
        restoreRoute(route);
      }
    }
  }, [isAuthenticated]);

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
      case 'dashboard':
        return 'Панель упраления';
      case 'ai-center':
        return 'AI центр';
      case 'articles':
        return 'Статьи';
      case 'calendar':
        return 'Календарь публикаций';
      case 'categories':
        return 'Категории';
      case 'tags':
        return 'Метки';
      case 'media':
        return 'Медиатека';
      case 'content-hub':
        return 'Центр контента';
      case 'manifest':
        return 'Манифест издания';
      case 'style':
        return 'Стиль издания';
      case 'editorial-hub':
        return 'Редакционный центр';
      case 'formats':
        return 'Форматы издания';
      case 'socials':
        return 'Социальные сети';
      case 'system-hub':
        return 'Центр системы';
      case 'settings':
        return 'Настройки';
      case 'users':
        return 'Пользователи';
      case 'promotion':
        return 'Продвижение';
      case 'analytics':
        return 'Аналитика';
      case 'ads':
        return 'Реклама';
      case 'research':
        return 'Исследования';
      case 'research-workspace':
        return 'Рабочее пространство';
      case 'article-editor':
        return 'Редактор статьи';
      case 'seo':
        return 'SEO';
      default:
        return 'Панель управления';
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardSection />;
      case 'ai-center':
        return <AICenter />;
      case 'articles':
        return <ArticlesSection />;
      case 'calendar':
        return <CalendarSection />;
      case 'categories':
        return <CategoriesSection />;
      case 'tags':
        return <TagsSection />;
      case 'media':
        return <MediaSection />;
      case 'content-hub':
        return <ContentHub />;
      case 'system-hub':
        return <SystemHub />;
      case 'manifest':
        return <ManifestPage onNavigateToAI={() => navigateTo('ai-center')} />;
      case 'style':
        return <StyleDashboard />;
      case 'editorial-hub':
        return <EditorialHub />;
      case 'formats':
        return <FormatsDashboard />;
      case 'socials':
        return <SocialsDashboard />;
      case 'settings':
        return <SettingsPage />;
      case 'users':
        return <UsersPage />;
      case 'promotion':
        return <PromotionPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'ads':
        return <AdsPage />;
      case 'seo':
        return <SeoPage />;
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

  // Role guard — только admin/editor имеют доступ к панели
  if (!isAdmin) {
    return <AccessDenied />;
  }

  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
      disableTransitionOnChange
    >
      <div className='flex h-screen overflow-hidden bg-background'>
        {/* Mobile Menu Drawer */}
        <div className='lg:hidden'>
          <Drawer.Root
            open={mobileMenuOpen}
            onOpenChange={setMobileMenuOpen}
            direction='left'
          >
            <Drawer.Portal>
              <Drawer.Overlay className='fixed inset-0 bg-black/40 z-50' />
              <Drawer.Content className='bg-background flex flex-col fixed bottom-0 left-0 top-0 z-50 outline-none w-64 border-r'>
                <div className='sr-only'>
                  <Drawer.Title>Навигация</Drawer.Title>
                  <Drawer.Description>
                    Меню навигации по разделам дашборда
                  </Drawer.Description>
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
            direction='right'
          >
            <Drawer.Portal>
              <Drawer.Overlay className='fixed inset-0 bg-black/40 z-50' />
              <Drawer.Content className='bg-background flex flex-col fixed bottom-0 right-0 top-0 z-50 outline-none w-80 border-l'>
                <div className='sr-only'>
                  <Drawer.Title>AI Агенты</Drawer.Title>
                  <Drawer.Description>
                    Панель AI агентов и автономных процессов
                  </Drawer.Description>
                </div>
                <AiSidebar
                  isOpen={true}
                  isMobile={true}
                  onClose={() => setAiSidebarOpen(false)}
                />
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            'hidden lg:block flex-shrink-0 transition-all duration-300',
            sidebarCollapsed ? 'w-20' : 'w-64'
          )}
        >
          <SidebarNav
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            collapsed={sidebarCollapsed}
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </aside>

        {/* Main Content */}
        <>
          <div className='flex flex-1 flex-col overflow-hidden min-h-0'>
            <Header
              title={getSectionTitle()}
              sidebarCollapsed={sidebarCollapsed}
              onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
              onMobileMenuToggle={() => setMobileMenuOpen(true)}
              aiSidebarOpen={aiSidebarOpen}
              onToggleAiSidebar={() => setAiSidebarOpen(!aiSidebarOpen)}
              showAISessionSelector={activeSection === 'ai-center'}
            />

            {activeSection === 'ai-center' ? (
              <div className='flex-1 min-h-0 overflow-hidden'>
                <AICenter />
              </div>
            ) : activeSection === 'manifest' ? (
              <ManifestPage onNavigateToAI={() => navigateTo('ai-center')} />
            ) : activeSection === 'style' ? (
              <StyleDashboard />
            ) : activeSection === 'media' ? (
              <div className='flex-1 min-h-0 overflow-hidden'>
                <MediaSection />
              </div>
            ) : activeSection === 'categories' ? (
              <div className='flex-1 min-h-0 overflow-hidden'>
                <CategoriesSection />
              </div>
            ) : activeSection === 'settings' ? (
              <div className='flex-1 min-h-0 overflow-hidden'>
                <SettingsPage />
              </div>
            ) : activeSection === 'users' ? (
              <div className='flex-1 min-h-0 overflow-hidden'>
                <UsersPage />
              </div>
            ) : activeSection === 'seo' ? (
              <div className='flex-1 min-h-0 overflow-hidden'>
                <SeoPage />
              </div>
            ) : activeSection === 'research' ? (
              <ScrollArea className='flex-1 min-h-0'>
                <div className='container mx-auto p-6'>
                  <ResearchListPage />
                </div>
              </ScrollArea>
            ) : activeSection === 'research-workspace' ? (
              <div className='flex-1 min-h-0 overflow-hidden'>
                <ResearchWorkspace />
              </div>
            ) : activeSection === 'article-editor' ? (
              <div className='flex-1 min-h-0 overflow-hidden'>
                <ArticleWorkbench />
              </div>
            ) : (
              <ScrollArea className='flex-1 min-h-0'>
                <div className='container mx-auto p-6'>{renderSection()}</div>
              </ScrollArea>
            )}
          </div>

          {/* AI Sidebar */}
          <div className='hidden lg:block'>
            <AiSidebar
              isOpen={aiSidebarOpen}
              onClose={() => setAiSidebarOpen(false)}
            />
          </div>
        </>

        {/* Command Palette */}
        <CommandPalette />
      </div>
    </ThemeProvider>
  );
}

export default App;
