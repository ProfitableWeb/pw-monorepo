"""
PW-027 | Комментарии: треды для статей + список по пользователю (для админки).
_build_threads() собирает плоский список в структуру {root, replies[]} на стороне Python.
"""

from collections.abc import Sequence

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.core.database import get_db
from src.models.comment import Comment
from src.schemas.comment import CommentResponse, CommentThreadResponse
from src.schemas.common import ApiMeta, ApiResponse
from src.services import comment as comment_service

router = APIRouter(tags=["comments"])


def _comment_to_response(comment: Comment) -> CommentResponse:
    return CommentResponse(
        id=str(comment.id),
        user_id=str(comment.user_id),
        user_name=comment.user.name if comment.user else "",
        user_avatar=comment.user.avatar if comment.user else None,
        article_id=str(comment.article_id),
        article_slug=comment.article.slug if comment.article else "",
        article_title=comment.article.title if comment.article else "",
        content=comment.content,
        created_at=comment.created_at,
        updated_at=comment.updated_at,
        parent_id=str(comment.parent_id) if comment.parent_id else None,
    )


def _build_threads(comments: Sequence[Comment]) -> list[CommentThreadResponse]:
    root_comments: list[Comment] = []
    replies_map: dict[str, list[Comment]] = {}

    for c in comments:
        assert isinstance(c, Comment)
        if c.parent_id is None:
            root_comments.append(c)
        else:
            pid = str(c.parent_id)
            if pid not in replies_map:
                replies_map[pid] = []
            replies_map[pid].append(c)

    threads = []
    for root in root_comments:
        root_id = str(root.id)
        thread_replies = replies_map.get(root_id, [])
        threads.append(
            CommentThreadResponse(
                root=_comment_to_response(root),
                replies=[_comment_to_response(r) for r in thread_replies],
            )
        )
    return threads


@router.get(
    "/articles/{slug}/comments",
    response_model=ApiResponse[list[CommentThreadResponse]],
)
def get_article_comments(
    slug: str,
    db: Session = Depends(get_db),
) -> ApiResponse[list[CommentThreadResponse]]:
    comments = comment_service.get_article_comments(db, slug)
    threads = _build_threads(comments)
    return ApiResponse(success=True, data=threads)


@router.get(
    "/users/{user_id}/comments",
    response_model=ApiResponse[list[CommentResponse]],
)
def get_user_comments(
    user_id: str,
    query: str | None = None,
    limit: int = 20,
    offset: int = 0,
    db: Session = Depends(get_db),
) -> ApiResponse[list[CommentResponse]]:
    comments, total = comment_service.get_user_comments(
        db, user_id, query=query, limit=limit, offset=offset
    )
    data = [_comment_to_response(c) for c in comments]
    return ApiResponse(
        success=True,
        data=data,
        meta=ApiMeta(limit=limit, total=total, has_more=(offset + limit < total)),
    )
