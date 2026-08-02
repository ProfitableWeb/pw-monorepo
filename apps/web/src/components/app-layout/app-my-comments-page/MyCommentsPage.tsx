'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { useOwnComments } from '@/hooks/api';
import AppBar from '@/components/app-layout/app-bar/AppBar';
import AppPageWrapper from '@/components/app-layout/app-page-wrapper';
import AppFooter from '@/components/app-layout/app-footer';
import { MyCommentsPageHeader } from './header/MyCommentsPageHeader';
import { MyCommentsSearch } from './search/MyCommentsSearch';
import { MyCommentsEmptyState } from './empty-state/MyCommentsEmptyState';
import { MyCommentsList } from './comment-list/MyCommentsList';
import './MyCommentsPage.scss';

/**
 * MyCommentsPage — главная страница «Мои комментарии».
 *
 * PW-074 | Данные берутся из `/users/me/comments` и только для авторизованного
 * пользователя. Раньше страница запрашивала `/users/{userId}/comments` с
 * захардкоженным `user-1` — эндпоинт был открытым; теперь он закрыт
 * авторизацией и отдаёт только собственные комментарии.
 */
export const MyCommentsPage = () => {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  // Все комментарии (без фильтра)
  const { data: comments = [] } = useOwnComments(isAuthenticated);

  // Отфильтрованные по поисковому запросу — запрос уходит только при вводе
  const { data: searchResults, isFetching: isSearching } = useOwnComments(
    isAuthenticated && !!searchQuery,
    searchQuery || undefined
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const visibleComments = searchQuery ? (searchResults ?? []) : comments;
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
              resultCount={visibleComments.length}
              isLoading={isSearching}
            />
          )}

          {/* Пока статус авторизации неизвестен — не показываем ни один
              из двух пустых экранов, чтобы не мигать неверным сообщением. */}
          {!hasComments && !isAuthLoading && (
            <MyCommentsEmptyState unauthenticated={!isAuthenticated} />
          )}

          {hasComments && <MyCommentsList comments={visibleComments} />}
        </main>
        <AppFooter />
      </AppPageWrapper>
    </div>
  );
};
