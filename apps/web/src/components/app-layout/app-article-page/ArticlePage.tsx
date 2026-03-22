'use client';

import { useCallback } from 'react';
import AppBar from '@/components/app-layout/app-bar/AppBar';
import AppPageWrapper from '@/components/app-layout/app-page-wrapper';
import AppFooter from '@/components/app-layout/app-footer';
import { ArticleHeader } from '@/components/app-layout/article-header';
import { ArticleLayout } from '@/components/common/article-layouts';
import { ArticleContentOneColumn } from '@/components/common/article-content';
import { SelfAssessment } from '@/components/common/self-assessment';
import { ArticleResources } from '@/components/common/article-resources';
import { ArticleCommentsBlock } from '@/components/app-layout/article-comments';
import { TableOfContents } from '@/components/common/table-of-contents';
import { AuthorCard } from '@/components/common/sidebar-widgets/author-card';
import { useArticleComments } from '@/hooks/api/useArticleComments';
import { createComment } from '@/lib/api-client';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import type { FullArticle } from '@/lib/api-client';
import type { ArticleLayoutType } from '@/components/common/article-layouts/types';
import './ArticlePage.scss';

export interface ArticlePageProps {
  article: FullArticle;
  categoryName?: string;
}

const ArticlePage = ({ article, categoryName }: ArticlePageProps) => {
  const layout = (article.layout ?? 'three-column') as ArticleLayoutType;
  const hasSidebar = layout === 'three-column' || layout === 'two-column';
  const isPage = !article.publishedAt;

  const queryClient = useQueryClient();
  const { data: threads = [], isLoading: commentsLoading } = useArticleComments(
    article.slug
  );

  const handleAddComment = useCallback(
    async (content: string, parentId?: string) => {
      await createComment(article.slug, content, parentId);
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.byArticle(article.slug),
      });
    },
    [article.slug, queryClient]
  );

  const enabledToc = article.toc.filter(item => item.enabled);
  const tocSidebar =
    enabledToc.length > 0 ? (
      <TableOfContents
        items={enabledToc.map(item => ({
          id: item.id,
          title: item.text,
          level: item.level,
        }))}
      />
    ) : undefined;

  return (
    <div className='article-page'>
      <AppBar />
      <AppPageWrapper>
        <main>
          <ArticleLayout
            layout={layout}
            toc={tocSidebar}
            sidebar={
              hasSidebar ? <AuthorCard author={article.author} /> : undefined
            }
            header={
              <ArticleHeader
                title={article.title}
                subtitle={article.subtitle}
                publishedAt={
                  article.publishedAt
                    ? new Date(article.publishedAt)
                    : undefined
                }
                categorySlug={article.category}
                categoryName={categoryName}
                showAuthor={!hasSidebar}
                author={article.author}
              />
            }
          >
            <ArticleContentOneColumn html={article.content} />

            {article.selfCheck.length > 0 && (
              <SelfAssessment questions={article.selfCheck} />
            )}

            {article.sources.length > 0 && (
              <ArticleResources
                resources={article.sources.map(s => ({
                  id: s.id,
                  title: s.title,
                  url: s.url,
                  external: true,
                }))}
              />
            )}

            {!isPage && (
              <ArticleCommentsBlock
                threads={threads}
                onAddComment={handleAddComment}
                loading={commentsLoading}
              />
            )}
          </ArticleLayout>
        </main>
        <AppFooter />
      </AppPageWrapper>
    </div>
  );
};

export default ArticlePage;
