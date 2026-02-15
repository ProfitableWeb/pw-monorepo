'use client';

import React, { useState } from 'react';
import { Comment } from '@profitable-web/types';
import { useAuth } from '@/contexts/auth';
import { useUserComments } from '@/hooks/api';
import AppBar from '@/components/app-layout/app-bar/AppBar';
import AppPageWrapper from '@/components/app-layout/app-page-wrapper';
import AppFooter from '@/components/app-layout/app-footer';
import { MyCommentsPageHeader } from './header/MyCommentsPageHeader';
import { MyCommentsSearch } from './search/MyCommentsSearch';
import { MyCommentsEmptyState } from './empty-state/MyCommentsEmptyState';
import { MyCommentsList } from './comment-list/MyCommentsList';
import './MyCommentsPage.scss';

interface MyCommentsPageProps {
  initialComments?: Comment[];
}

/**
 * MyCommentsPage - главная страница "Мои комментарии"
 */
export const MyCommentsPage = ({
  initialComments = [],
}: MyCommentsPageProps) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  // Все комментарии (без фильтра)
  const { data: comments = initialComments } = useUserComments(
    'user-1',
    undefined,
    initialComments
  );

  // Отфильтрованные по поисковому запросу
  const { data: filteredComments = comments, isFetching: isSearching } =
    useUserComments(
      'user-1',
      searchQuery || undefined,
      searchQuery ? undefined : comments
    );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const hasComments = comments.length > 0;

  return (
    <div className='my-comments-page'>
      <AppBar />
      <AppPageWrapper>
        <main>
          <MyCommentsPageHeader count={comments.length} />

          {hasComments && (
            <MyCommentsSearch
              onSearch={handleSearch}
              resultCount={filteredComments.length}
              isLoading={isSearching}
            />
          )}

          {!hasComments ? (
            <MyCommentsEmptyState />
          ) : (
            <MyCommentsList comments={filteredComments} />
          )}
        </main>
        <AppFooter />
      </AppPageWrapper>
    </div>
  );
};
