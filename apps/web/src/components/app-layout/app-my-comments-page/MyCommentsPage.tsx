'use client';

import React, { useState, useEffect } from 'react';
import { Comment } from '@profitable-web/types';
import { useAuth } from '@/contexts/auth';
import AppBar from '@/components/app-layout/app-bar/AppBar';
import AppPageWrapper from '@/components/app-layout/app-page-wrapper';
import AppFooter from '@/components/app-layout/app-footer';
import { MyCommentsPageHeader } from './header/MyCommentsPageHeader';
import { MyCommentsSearch } from './search/MyCommentsSearch';
import { MyCommentsEmptyState } from './empty-state/MyCommentsEmptyState';
import { MyCommentsList } from './comment-list/MyCommentsList';
import { getUserComments } from '@/lib/mock-api';
import './MyCommentsPage.scss';

interface MyCommentsPageProps {
  initialComments?: Comment[];
}

/**
 * MyCommentsPage - главная страница "Мои комментарии"
 */
export const MyCommentsPage: React.FC<MyCommentsPageProps> = ({
  initialComments = [],
}) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [filteredComments, setFilteredComments] = useState<Comment[]>(
    initialComments
  );
  const [isSearching, setIsSearching] = useState(false);

  // Загружаем комментарии при монтировании (если не переданы initial)
  useEffect(() => {
    if (!user) return;

    if (initialComments.length === 0) {
      loadComments();
    }
  }, [user]);

  const loadComments = async () => {
    if (!user) return;

    try {
      // Используем фиксированный userId для mock данных
      // В будущем user.id будет получен из real auth
      const data = await getUserComments('user-1');
      setComments(data);
      setFilteredComments(data);
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  };

  const handleSearch = async (query: string) => {
    if (!user) return;

    setIsSearching(true);

    try {
      // Используем фиксированный userId для mock данных
      const data = await getUserComments('user-1', { query });
      setFilteredComments(data);
    } catch (error) {
      console.error('Failed to search comments:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const hasComments = comments.length > 0;
  const hasResults = filteredComments.length > 0;

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
