import { useState } from 'react';
import { ExternalLink, Rss, FileText, Globe, Shield } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Switch } from '@/app/components/ui/switch';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Checkbox } from '@/app/components/ui/checkbox';
import {
  MOCK_SITEMAP_CONFIG,
  MOCK_ROBOTS_TXT,
  MOCK_RSS_CONFIG,
  MOCK_DEFAULT_DIRECTIVES,
} from '../seo.constants';
import type { SitemapConfig, RssConfig, MetaDirectives } from '../seo.types';

interface IndexingFeedsSettingsProps {
  onChangeDetected: () => void;
}

export function IndexingFeedsSettings({
  onChangeDetected,
}: IndexingFeedsSettingsProps) {
  const [sitemapConfig, setSitemapConfig] =
    useState<SitemapConfig>(MOCK_SITEMAP_CONFIG);
  const [robotsTxt, setRobotsTxt] = useState(MOCK_ROBOTS_TXT);
  const [rssConfig, setRssConfig] = useState<RssConfig>(MOCK_RSS_CONFIG);
  const [directives, setDirectives] = useState<Record<string, MetaDirectives>>(
    MOCK_DEFAULT_DIRECTIVES
  );

  /** Типы контента для sitemap с маппингом на поля SitemapConfig */
  const sitemapContentTypes = [
    {
      key: 'articles',
      label: 'Статьи',
      includeField: 'includeArticles' as const,
    },
    {
      key: 'categories',
      label: 'Категории',
      includeField: 'includeCategories' as const,
    },
    { key: 'tags', label: 'Теги', includeField: 'includeTags' as const },
    {
      key: 'staticPages',
      label: 'Статические страницы',
      includeField: 'includeStaticPages' as const,
    },
  ];

  const updateSitemapInclude = (
    includeField: keyof SitemapConfig,
    value: boolean
  ) => {
    setSitemapConfig(prev => ({
      ...prev,
      [includeField]: value,
    }));
    onChangeDetected();
  };

  const updateSitemapPriority = (key: string, value: string) => {
    setSitemapConfig(prev => ({
      ...prev,
      priorities: { ...prev.priorities, [key]: parseFloat(value) },
    }));
    onChangeDetected();
  };

  const updateSitemapChangefreq = (key: string, value: string) => {
    setSitemapConfig(prev => ({
      ...prev,
      changefreq: { ...prev.changefreq, [key]: value },
    }));
    onChangeDetected();
  };

  const updateRss = (patch: Partial<RssConfig>) => {
    setRssConfig(prev => ({ ...prev, ...patch }));
    onChangeDetected();
  };

  const updateDirective = (
    type: string,
    field: keyof MetaDirectives,
    value: boolean
  ) => {
    setDirectives(prev => {
      const current = prev[type] ?? {
        index: true,
        follow: true,
        noarchive: false,
      };
      const patched: MetaDirectives = {
        index: current.index,
        follow: current.follow,
        noarchive: current.noarchive,
        [field]: value,
      };
      return { ...prev, [type]: patched };
    });
    onChangeDetected();
  };

  const priorities = Array.from({ length: 10 }, (_, i) =>
    ((i + 1) / 10).toFixed(1)
  );
  const frequencies = ['daily', 'weekly', 'monthly', 'yearly'];
  const frequencyLabels: Record<string, string> = {
    daily: 'Ежедневно',
    weekly: 'Еженедельно',
    monthly: 'Ежемесячно',
    yearly: 'Ежегодно',
  };

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='text-lg font-semibold'>Индексация и фиды</h2>
        <p className='text-sm text-muted-foreground'>
          Управление sitemap, robots.txt, RSS и мета-директивами
        </p>
      </div>

      {/* Sitemap.xml */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-2'>
              <Globe className='h-4 w-4' />
              Sitemap.xml
            </CardTitle>
            {sitemapConfig.enabled && (
              <Badge
                variant='outline'
                className='border-green-500 text-green-600'
              >
                Активна
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center gap-2'>
            <Input
              value='https://profitableweb.ru/sitemap.xml'
              readOnly
              className='font-mono text-sm'
            />
            <Button
              variant='ghost'
              size='icon'
              onClick={() =>
                window.open('https://profitableweb.ru/sitemap.xml', '_blank')
              }
            >
              <ExternalLink className='h-4 w-4' />
            </Button>
          </div>

          <div className='space-y-3'>
            <Label className='text-sm font-medium'>Включить в sitemap</Label>
            {sitemapContentTypes.map(({ key, label, includeField }) => (
              <div key={key} className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <Switch
                    checked={sitemapConfig[includeField] as boolean}
                    onCheckedChange={v => updateSitemapInclude(includeField, v)}
                  />
                  <span className='text-sm'>{label}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Select
                    value={String(sitemapConfig.priorities[key] ?? 0.5)}
                    onValueChange={v => updateSitemapPriority(key, v)}
                  >
                    <SelectTrigger className='w-20 h-8'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map(p => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={sitemapConfig.changefreq[key] ?? 'monthly'}
                    onValueChange={v => updateSitemapChangefreq(key, v)}
                  >
                    <SelectTrigger className='w-32 h-8'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {frequencies.map(f => (
                        <SelectItem key={f} value={f}>
                          {frequencyLabels[f]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>

          <p className='text-sm text-muted-foreground'>
            Главная: приоритет 1.0, частота daily
          </p>
          <p className='text-sm text-muted-foreground'>
            47 URL в sitemap · Обновлён: сегодня
          </p>
        </CardContent>
      </Card>

      {/* Robots.txt */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-2'>
              <FileText className='h-4 w-4' />
              Robots.txt
            </CardTitle>
            <Button
              variant='ghost'
              size='icon'
              onClick={() =>
                window.open('https://profitableweb.ru/robots.txt', '_blank')
              }
            >
              <ExternalLink className='h-4 w-4' />
            </Button>
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          <Textarea
            value={robotsTxt}
            onChange={e => {
              setRobotsTxt(e.target.value);
              onChangeDetected();
            }}
            className='font-mono text-sm'
            rows={10}
          />
          <Button
            variant='outline'
            onClick={() => {
              setRobotsTxt(MOCK_ROBOTS_TXT);
              onChangeDetected();
            }}
          >
            Восстановить по умолчанию
          </Button>
        </CardContent>
      </Card>

      {/* RSS-фид */}
      <Card>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='flex items-center gap-2'>
              <Rss className='h-4 w-4' />
              RSS-фид
            </CardTitle>
            {rssConfig.enabled && (
              <Badge
                variant='outline'
                className='border-green-500 text-green-600'
              >
                Активен
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center gap-2'>
            <Input
              value='https://profitableweb.ru/rss.xml'
              readOnly
              className='font-mono text-sm'
            />
            <Button
              variant='ghost'
              size='icon'
              onClick={() =>
                window.open('https://profitableweb.ru/rss.xml', '_blank')
              }
            >
              <ExternalLink className='h-4 w-4' />
            </Button>
          </div>

          <div className='space-y-2'>
            <Label className='text-sm font-medium'>Формат</Label>
            <div className='flex gap-2'>
              {(['rss2', 'atom'] as const).map(fmt => (
                <Button
                  key={fmt}
                  variant={rssConfig.format === fmt ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => updateRss({ format: fmt })}
                >
                  {fmt === 'rss2' ? 'RSS 2.0' : 'Atom'}
                </Button>
              ))}
            </div>
          </div>

          <div className='space-y-2'>
            <Label className='text-sm font-medium'>Количество записей</Label>
            <Select
              value={String(rssConfig.itemCount)}
              onValueChange={v => updateRss({ itemCount: Number(v) })}
            >
              <SelectTrigger className='w-24'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50, 100].map(n => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label className='text-sm font-medium'>Содержимое</Label>
            <div className='flex gap-2'>
              {(['full', 'excerpt'] as const).map(mode => (
                <Button
                  key={mode}
                  variant={
                    rssConfig.contentMode === mode ? 'default' : 'outline'
                  }
                  size='sm'
                  onClick={() => updateRss({ contentMode: mode })}
                >
                  {mode === 'full' ? 'Полный текст' : 'Только превью'}
                </Button>
              ))}
            </div>
          </div>

          <div className='space-y-3'>
            <Label className='text-sm font-medium'>Включить в фид</Label>
            <div className='flex items-center justify-between'>
              <span className='text-sm'>Статьи</span>
              <Switch
                checked={rssConfig.includeArticles}
                onCheckedChange={v => updateRss({ includeArticles: v })}
              />
            </div>
            <div className='flex items-center justify-between'>
              <span className='text-sm'>Обновления категорий</span>
              <Switch
                checked={rssConfig.includeCategoryUpdates}
                onCheckedChange={v => updateRss({ includeCategoryUpdates: v })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Мета-директивы по умолчанию */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Shield className='h-4 w-4' />
            Мета-директивы по умолчанию
          </CardTitle>
          <CardDescription>
            Правила индексации для новых страниц
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          {Object.entries(directives).map(([type, values]) => {
            const directiveLabels: Record<string, string> = {
              articles: 'Статьи',
              categories: 'Категории',
              tags: 'Теги',
            };
            return (
              <div key={type} className='space-y-2'>
                <Label className='text-sm font-medium'>
                  {directiveLabels[type] ?? type}
                </Label>
                <div className='flex items-center gap-4'>
                  {(['index', 'follow', 'noarchive'] as const).map(field => (
                    <label
                      key={field}
                      className='flex items-center gap-1.5 text-sm'
                    >
                      <Checkbox
                        checked={values[field]}
                        onCheckedChange={v =>
                          updateDirective(type, field, v === true)
                        }
                      />
                      {field}
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
          <p className='text-sm italic text-muted-foreground'>
            Перекрывается индивидуальными настройками статьи
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
