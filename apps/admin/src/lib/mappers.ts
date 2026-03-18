/**
 * Маппинг API ↔ ArticleFormData.
 *
 * apiToFormData — загрузка статьи из API в react-hook-form.
 * formDataToPayload — формирование snake_case payload для сохранения.
 *
 * @see types/admin-api.ts — типы ответов API
 * @see types/article-editor.ts — ArticleFormData (форма)
 */
import type {
  AdminArticleResponse,
  AdminCategoryFull,
  ArticleCreatePayload,
  ArticleUpdatePayload,
} from '@/app/types/admin-api';
import type {
  ArticleFormData,
  ArticleStatus,
  ArtifactsData,
} from '@/app/types/article-editor';

const defaultArtifacts: ArtifactsData = {
  selfCheck: { enabled: false, items: [] },
  sources: { enabled: false, items: [] },
  glossary: { enabled: false, items: [] },
  provenance: { enabled: false, workspaceId: '', showLink: false },
};

/** API response → ArticleFormData для react-hook-form */
export function apiToFormData(
  article: AdminArticleResponse,
  timezone: string
): ArticleFormData {
  return {
    h1: article.title,
    subtitle: article.subtitle ?? '',
    title: article.metaTitle ?? '',
    slug: article.slug,
    status: article.status as ArticleStatus,
    publishedAt: article.publishedAt ?? '',
    publishTimezone: timezone,
    category: article.primaryCategory.slug,
    additionalCategories: article.additionalCategories.map(c => c.slug),
    tags: article.tags.map(t => t.name),
    excerpt: article.excerpt,
    imageUrl: article.imageUrl ?? undefined,
    imageAlt: article.imageAlt ?? undefined,
    content: article.content,
    metaDescription: article.metaDescription ?? '',
    canonicalUrl: article.canonicalUrl ?? '',
    ogTitle: article.ogTitle ?? '',
    ogDescription: article.ogDescription ?? '',
    ogImage: article.ogImage ?? '',
    focusKeyword: article.focusKeyword ?? '',
    seoKeywords: article.seoKeywords ?? [],
    robotsNoIndex: article.robotsNoIndex,
    robotsNoFollow: article.robotsNoFollow,
    schemaType: article.schemaType ?? 'BlogPosting',
    author: article.author?.name ?? '',
    artifacts: article.artifacts ?? defaultArtifacts,
  };
}

/** ArticleFormData → snake_case payload для PATCH */
export function formDataToUpdatePayload(
  form: ArticleFormData,
  categories: AdminCategoryFull[]
): ArticleUpdatePayload {
  const cat = form.category
    ? categories.find(c => c.slug === form.category)
    : undefined;
  if (form.category && !cat) throw new Error('Категория не найдена');

  const additionalIds = (form.additionalCategories ?? [])
    .map(slug => categories.find(c => c.slug === slug)?.id)
    .filter((id): id is string => !!id);

  return {
    title: form.h1,
    subtitle: form.subtitle || null,
    slug: form.slug,
    content: form.content,
    excerpt: form.excerpt,
    primary_category_id: cat?.id,
    additional_category_ids: additionalIds,
    tags: form.tags,
    image_url: form.imageUrl || null,
    image_alt: form.imageAlt || null,
    meta_title: form.title || null,
    meta_description: form.metaDescription || null,
    canonical_url: form.canonicalUrl || null,
    og_title: form.ogTitle || null,
    og_description: form.ogDescription || null,
    og_image: form.ogImage || null,
    focus_keyword: form.focusKeyword || null,
    seo_keywords: form.seoKeywords,
    schema_type: form.schemaType,
    robots_no_index: form.robotsNoIndex,
    robots_no_follow: form.robotsNoFollow,
    artifacts: form.artifacts,
  };
}

/** ArticleFormData → snake_case payload для POST (создание) */
export function formDataToCreatePayload(
  form: ArticleFormData,
  categories: AdminCategoryFull[]
): ArticleCreatePayload {
  const cat = categories.find(c => c.slug === form.category);
  if (!cat) throw new Error('Категория не выбрана');

  const additionalIds = (form.additionalCategories ?? [])
    .map(slug => categories.find(c => c.slug === slug)?.id)
    .filter((id): id is string => !!id);

  return {
    title: form.h1,
    subtitle: form.subtitle || null,
    slug: form.slug || null,
    content: form.content,
    content_format: 'html',
    excerpt: form.excerpt,
    primary_category_id: cat.id,
    additional_category_ids: additionalIds,
    tags: form.tags,
    image_url: form.imageUrl || null,
    image_alt: form.imageAlt || null,
    meta_title: form.title || null,
    meta_description: form.metaDescription || null,
    focus_keyword: form.focusKeyword || null,
    seo_keywords: form.seoKeywords,
    schema_type: form.schemaType,
    canonical_url: form.canonicalUrl || null,
    og_title: form.ogTitle || null,
    og_description: form.ogDescription || null,
    og_image: form.ogImage || null,
    robots_no_index: form.robotsNoIndex,
    robots_no_follow: form.robotsNoFollow,
    artifacts: form.artifacts,
  };
}

/** Пустые defaultValues для новой статьи */
export function getEmptyFormData(timezone: string): ArticleFormData {
  return {
    h1: '',
    subtitle: '',
    title: '',
    slug: '',
    status: 'draft',
    publishedAt: '',
    publishTimezone: timezone,
    category: '',
    additionalCategories: [],
    tags: [],
    excerpt: '',
    imageUrl: undefined,
    imageAlt: undefined,
    content: '',
    metaDescription: '',
    canonicalUrl: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    focusKeyword: '',
    seoKeywords: [],
    robotsNoIndex: false,
    robotsNoFollow: false,
    schemaType: 'BlogPosting',
    author: '',
    artifacts: defaultArtifacts,
  };
}
