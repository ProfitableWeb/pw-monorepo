import { useEffect } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import { MetaSeoTab } from './MetaSeoTab';
import { EditorTab } from './EditorTab';
import { WorkbenchSidebar } from './WorkbenchSidebar';
import { useArticleEditorStore } from '@/app/store/article-editor-store';
import { useHeaderStore } from '@/app/store/header-store';
import { useNavigationStore } from '@/app/store/navigation-store';
import { mockArticle } from '@/app/mock/article-mock';

export function ArticleWorkbench() {
  const { articleSlug, openArticle, closeArticle, setContent } =
    useArticleEditorStore();
  const { setBreadcrumbs } = useHeaderStore();
  const { navigateTo } = useNavigationStore();

  // Load mock article on mount
  useEffect(() => {
    if (!articleSlug) {
      openArticle(mockArticle.slug, mockArticle.content);
    }
  }, [articleSlug, openArticle]);

  // Set breadcrumbs
  useEffect(() => {
    setBreadcrumbs([
      {
        label: 'Статьи',
        onClick: () => {
          closeArticle();
          navigateTo('articles');
        },
      },
      { label: mockArticle.h1 },
    ]);

    return () => {
      useHeaderStore.getState().reset();
    };
  }, [setBreadcrumbs, navigateTo, closeArticle]);

  return (
    <Tabs
      defaultValue='meta'
      variant='line'
      className='flex-1 flex flex-col min-h-0 h-full'
    >
      <TabsList className='mx-4 mt-2'>
        <TabsTrigger value='meta'>Мета и SEO</TabsTrigger>
        <TabsTrigger value='editor'>Редактор</TabsTrigger>
        <TabsTrigger value='context'>Контекст</TabsTrigger>
      </TabsList>

      <TabsContent value='meta' className='flex-1 overflow-auto mt-0'>
        <MetaSeoTab
          initialData={mockArticle}
          onDataChange={data => setContent(data.content)}
        />
      </TabsContent>

      <TabsContent value='editor' className='flex-1 min-h-0 mt-0'>
        <EditorTab />
      </TabsContent>

      <TabsContent value='context' className='flex-1 overflow-auto mt-0'>
        <WorkbenchSidebar />
      </TabsContent>
    </Tabs>
  );
}
