'use client';

import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { Comment } from '@profitable-web/types';
import { useAuth } from '@/contexts/auth';
import { formatRelativeTime } from '../utils/formatRelativeTime';
import { ArticleCommentForm } from '../ArticleCommentForm';
import './ArticleCommentReplies.scss';

const REPLY_FORM_ANIMATION_MS = 300;

interface ArticleCommentRepliesProps {
  replies: Comment[];
  defaultVisible: number;
  /** parentId = root.id вызывающего; вызывающий передаёт (content) => onAddReply(content, root.id) */
  onReply: (content: string) => void;
  /** Опционально: если не передано, используется внутреннее состояние для ответа на ответ */
  replyingTo?: Comment | null;
  onCancelReply?: () => void;
  onSetReplyingTo?: (comment: Comment | null) => void;
}

export function ArticleCommentReplies({
  replies,
  defaultVisible,
  onReply,
  replyingTo: replyingToProp,
  onCancelReply: onCancelReplyProp,
  onSetReplyingTo: onSetReplyingToProp,
}: ArticleCommentRepliesProps) {
  const { user } = useAuth();
  const [internalReplyingTo, setInternalReplyingTo] = useState<Comment | null>(
    null
  );
  const replyingTo = replyingToProp ?? internalReplyingTo;
  const onCancelReplyParent =
    onCancelReplyProp ?? (() => setInternalReplyingTo(null));
  const onSetReplyingTo = onSetReplyingToProp ?? setInternalReplyingTo;
  const [isClosingReply, setIsClosingReply] = useState(false);
  const replyFormRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const visibleCount = expanded
    ? replies.length
    : Math.min(defaultVisible, replies.length);
  const visibleReplies = replies.slice(0, visibleCount);
  const hiddenCount = replies.length - visibleCount;
  const hasMore = hiddenCount > 0;

  const handleSubmit = (content: string) => {
    onReply(content);
    onCancelReplyParent();
  };

  const handleCancelReply = useCallback(() => {
    setIsClosingReply(true);
    setTimeout(() => {
      onCancelReplyParent();
      setIsClosingReply(false);
    }, REPLY_FORM_ANIMATION_MS);
  }, [onCancelReplyParent]);

  // Прокрутка к форме ответа (второй уровень) после завершения анимации появления
  useEffect(() => {
    if (!replyingTo || isClosingReply) return;
    const t = setTimeout(() => {
      replyFormRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    }, REPLY_FORM_ANIMATION_MS);
    return () => clearTimeout(t);
  }, [replyingTo, isClosingReply]);

  return (
    <div className='article-comment-replies'>
      <div className='article-comment-replies__list'>
        {visibleReplies.map(reply => (
          <ReplyRow
            key={reply.id}
            reply={reply}
            canReply={!!user}
            onReplyClick={() => onSetReplyingTo(reply)}
          />
        ))}
      </div>
      {hasMore && (
        <button
          type='button'
          className='article-comment-replies__toggle'
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
        >
          {expanded
            ? 'Свернуть ответы'
            : `Показать ещё ${hiddenCount} ${plural(hiddenCount, 'ответ', 'ответа', 'ответов')}`}
        </button>
      )}
      {replyingTo && (
        <div
          ref={replyFormRef}
          className={`article-comment-replies__form-wrapper ${
            isClosingReply
              ? 'article-comment-replies__form-wrapper--closing'
              : ''
          }`}
          role='region'
          aria-label='Форма ответа на комментарий'
        >
          <div className='article-comment-replies__form'>
            <ArticleCommentForm
              replyingTo={replyingTo}
              onSubmit={content => handleSubmit(content)}
              onCancelReply={handleCancelReply}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ReplyRow({
  reply,
  canReply,
  onReplyClick,
}: {
  reply: Comment;
  canReply: boolean;
  onReplyClick: () => void;
}) {
  const { user } = useAuth();
  const [avatarError, setAvatarError] = useState(false);
  const avatarInitial = reply.userName.charAt(0).toUpperCase();
  const avatarUrl = useMemo(
    () => user?.avatar ?? reply.userAvatar,
    [user?.avatar, reply.userAvatar]
  );

  useEffect(() => {
    setAvatarError(false);
  }, [avatarUrl]);

  return (
    <div className='article-comment-replies__item'>
      <div className='article-comment-replies__item-header'>
        <div className='article-comment-replies__item-author'>
          {avatarUrl && !avatarError ? (
            <img
              src={avatarUrl}
              alt={reply.userName}
              width={28}
              height={28}
              className='article-comment-replies__item-avatar'
              onError={() => setAvatarError(true)}
              loading='lazy'
            />
          ) : (
            <span className='article-comment-replies__item-avatar-fallback'>
              {avatarInitial}
            </span>
          )}
          <span className='article-comment-replies__item-name'>
            {reply.userName}
          </span>
        </div>
        <time
          className='article-comment-replies__item-time'
          dateTime={reply.createdAt}
          title={new Date(reply.createdAt).toLocaleString('ru-RU')}
        >
          {formatRelativeTime(reply.createdAt)}
        </time>
      </div>
      <p className='article-comment-replies__item-content'>{reply.content}</p>
      {canReply && (
        <button
          type='button'
          className='article-comment-replies__item-reply-btn'
          onClick={onReplyClick}
          aria-label={`Ответить на комментарий ${reply.userName}`}
        >
          Ответить
        </button>
      )}
    </div>
  );
}

function plural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}
