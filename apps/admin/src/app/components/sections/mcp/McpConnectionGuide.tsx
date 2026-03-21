import { useState } from 'react';
import {
  Copy,
  Check,
  Terminal,
  Monitor,
  Code2,
  Globe,
  Blocks,
  ChevronDown,
  FileText,
  FolderOpen,
  Tag,
  Image,
  Search,
  Wrench,
  PenLine,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { cn } from '@/app/components/ui/utils';

const TABS = [
  { id: 'claude-desktop', label: 'Claude Desktop', icon: Monitor },
  { id: 'cursor', label: 'Cursor', icon: Code2 },
  { id: 'claude-code', label: 'Claude Code', icon: Terminal },
  { id: 'opencode', label: 'OpenCode', icon: Blocks },
  { id: 'api', label: 'API', icon: Globe },
] as const;

type TabId = (typeof TABS)[number]['id'];

interface TabContent {
  steps: string[];
  config?: string;
  language?: string;
}

const TAB_CONTENT: Record<TabId, TabContent> = {
  'claude-desktop': {
    steps: [
      'Откройте Claude Desktop → Settings → Developer → Edit Config',
      'Вставьте конфигурацию:',
    ],
    config: JSON.stringify(
      {
        mcpServers: {
          profitableweb: {
            url: 'https://api.profitableweb.ru/mcp',
            headers: {
              Authorization: 'Bearer <ваш_ключ>',
            },
          },
        },
      },
      null,
      2
    ),
    language: 'json',
  },
  cursor: {
    steps: [
      'Создайте файл .cursor/mcp.json в корне проекта',
      'Вставьте конфигурацию:',
    ],
    config: JSON.stringify(
      {
        mcpServers: {
          profitableweb: {
            url: 'https://api.profitableweb.ru/mcp',
            headers: {
              Authorization: 'Bearer <ваш_ключ>',
            },
          },
        },
      },
      null,
      2
    ),
    language: 'json',
  },
  'claude-code': {
    steps: ['Откройте терминал и выполните:'],
    config: `claude mcp add profitableweb \\
  --transport http \\
  --url https://api.profitableweb.ru/mcp \\
  --header "Authorization: Bearer <ваш_ключ>"`,
    language: 'bash',
  },
  opencode: {
    steps: [
      'Откройте .opencode/opencode.jsonc в корне проекта',
      'Добавьте секцию mcpServers:',
    ],
    config: JSON.stringify(
      {
        mcpServers: {
          profitableweb: {
            url: 'https://api.profitableweb.ru/mcp',
            headers: {
              Authorization: 'Bearer <ваш_ключ>',
            },
          },
        },
      },
      null,
      2
    ),
    language: 'json',
  },
  api: {
    steps: ['Используйте MCP JSON-RPC протокол напрямую:'],
    config: `# Список доступных tools
curl -X POST https://api.profitableweb.ru/mcp \\
  -H "Authorization: Bearer pw_mcp_..." \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","method":"tools/list","id":1}'

# Вызов tool
curl -X POST https://api.profitableweb.ru/mcp \\
  -H "Authorization: Bearer pw_mcp_..." \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"list_articles","arguments":{"limit":5}},"id":2}'`,
    language: 'bash',
  },
};

const AFTER_STEPS: Record<TabId, string[]> = {
  'claude-desktop': [
    'Перезапустите Claude Desktop',
    'В новом чате появятся инструменты ProfitableWeb (29 tools)',
  ],
  cursor: ['Перезапустите Cursor', 'MCP-инструменты станут доступны в чате'],
  'claude-code': ['Инструменты будут доступны в следующей сессии Claude Code'],
  opencode: [
    'Перезапустите OpenCode',
    'MCP-инструменты появятся автоматически',
  ],
  api: [],
};

// --- Available Tools ---

interface ToolDef {
  name: string;
  description: string;
  scope: 'read' | 'write' | 'admin';
}

interface ToolGroup {
  label: string;
  icon: typeof FileText;
  tools: ToolDef[];
}

const TOOL_GROUPS: ToolGroup[] = [
  {
    label: 'Статьи',
    icon: FileText,
    tools: [
      {
        name: 'list_articles',
        description:
          'Список статей с фильтрацией по статусу, категории, поиску',
        scope: 'read',
      },
      {
        name: 'get_article',
        description: 'Полная статья по ID/slug (контент, SEO, категории, теги)',
        scope: 'read',
      },
      {
        name: 'search_articles',
        description: 'Полнотекстовый поиск по статьям',
        scope: 'read',
      },
      {
        name: 'get_article_stats',
        description: 'Агрегированная статистика по статьям',
        scope: 'read',
      },
      {
        name: 'create_article',
        description: 'Создать черновик (title + content + category)',
        scope: 'write',
      },
      {
        name: 'update_article',
        description: 'Обновить поля существующей статьи',
        scope: 'write',
      },
      {
        name: 'publish_article',
        description: 'Опубликовать статью немедленно',
        scope: 'write',
      },
      {
        name: 'schedule_article',
        description: 'Запланировать публикацию на дату',
        scope: 'write',
      },
      {
        name: 'delete_article',
        description: 'Удалить статью (soft/hard)',
        scope: 'admin',
      },
    ],
  },
  {
    label: 'Категории',
    icon: FolderOpen,
    tools: [
      {
        name: 'list_categories',
        description: 'Все категории с количеством статей',
        scope: 'read',
      },
      {
        name: 'create_category',
        description: 'Создать новую категорию',
        scope: 'write',
      },
      {
        name: 'update_category',
        description: 'Обновить название, slug, описание',
        scope: 'write',
      },
      {
        name: 'delete_category',
        description: 'Удалить категорию',
        scope: 'admin',
      },
    ],
  },
  {
    label: 'Теги',
    icon: Tag,
    tools: [
      {
        name: 'list_tags',
        description: 'Все теги с количеством статей',
        scope: 'read',
      },
      { name: 'create_tag', description: 'Создать новый тег', scope: 'write' },
      { name: 'update_tag', description: 'Обновить тег', scope: 'write' },
      { name: 'delete_tag', description: 'Удалить тег', scope: 'admin' },
    ],
  },
  {
    label: 'Медиа',
    icon: Image,
    tools: [
      {
        name: 'list_media',
        description: 'Список файлов с фильтрацией по типу',
        scope: 'read',
      },
      {
        name: 'get_media',
        description: 'Метаданные и URL файла',
        scope: 'read',
      },
      {
        name: 'upload_media',
        description: 'Загрузить файл (base64, до 10MB)',
        scope: 'write',
      },
      {
        name: 'update_media_metadata',
        description: 'Обновить alt, caption, slug',
        scope: 'write',
      },
    ],
  },
  {
    label: 'SEO',
    icon: Search,
    tools: [
      {
        name: 'get_seo_settings',
        description: 'Текущие SEO-настройки сайта',
        scope: 'read',
      },
      {
        name: 'analyze_article_seo',
        description: 'SEO-анализ статьи с чеклистом рекомендаций',
        scope: 'read',
      },
      {
        name: 'update_seo_settings',
        description: 'Обновить глобальные SEO-настройки',
        scope: 'admin',
      },
    ],
  },
  {
    label: 'Система',
    icon: Wrench,
    tools: [
      {
        name: 'get_system_health',
        description: 'Здоровье системы и статус сервисов',
        scope: 'admin',
      },
      {
        name: 'get_site_analytics',
        description: 'Статистика посещаемости из Яндекс.Метрики',
        scope: 'read',
      },
      {
        name: 'get_audit_log',
        description: 'Журнал действий пользователей и API',
        scope: 'admin',
      },
    ],
  },
  {
    label: 'Контент-хелперы',
    icon: PenLine,
    tools: [
      {
        name: 'generate_slug',
        description: 'Генерация URL-slug из заголовка на русском',
        scope: 'write',
      },
      {
        name: 'get_content_brief',
        description:
          'Контекст сайта: стиль, аудитория, форматы — для создания контента',
        scope: 'read',
      },
    ],
  },
];

const SCOPE_LABELS: Record<
  ToolDef['scope'],
  { label: string; className: string }
> = {
  read: { label: 'read', className: 'text-blue-400 bg-blue-400/10' },
  write: { label: 'write', className: 'text-amber-400 bg-amber-400/10' },
  admin: { label: 'admin', className: 'text-red-400 bg-red-400/10' },
};

function ToolsReference() {
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const toggleGroup = (label: string) => {
    setExpandedGroup(prev => (prev === label ? null : label));
  };

  const totalTools = TOOL_GROUPS.reduce((sum, g) => sum + g.tools.length, 0);

  return (
    <Card>
      <CardHeader className='pb-3'>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-base'>Доступные инструменты</CardTitle>
          <span className='text-xs text-muted-foreground'>
            {totalTools} tools
          </span>
        </div>
        <p className='text-xs text-muted-foreground mt-1'>
          AI-ассистент получает описание каждого инструмента и автоматически
          выбирает нужные для выполнения задачи. Доступность зависит от scope
          API-ключа.
        </p>
      </CardHeader>
      <CardContent>
        <div className='space-y-1'>
          {TOOL_GROUPS.map(group => {
            const Icon = group.icon;
            const isExpanded = expandedGroup === group.label;

            return (
              <div
                key={group.label}
                className='border rounded-lg overflow-hidden'
              >
                <button
                  onClick={() => toggleGroup(group.label)}
                  className='w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-muted/50 transition-colors'
                >
                  <Icon className='size-4 text-muted-foreground shrink-0' />
                  <span className='font-medium flex-1 text-left'>
                    {group.label}
                  </span>
                  <span className='text-xs text-muted-foreground'>
                    {group.tools.length}
                  </span>
                  <ChevronDown
                    className={cn(
                      'size-3.5 text-muted-foreground transition-transform',
                      isExpanded && 'rotate-180'
                    )}
                  />
                </button>

                {isExpanded && (
                  <div className='border-t bg-muted/20'>
                    {group.tools.map(tool => {
                      const scopeStyle = SCOPE_LABELS[tool.scope];
                      return (
                        <div
                          key={tool.name}
                          className='flex items-start gap-3 px-3 py-2 border-b border-border/30 last:border-b-0'
                        >
                          <code className='text-xs font-mono font-medium shrink-0 mt-0.5 min-w-[160px]'>
                            {tool.name}
                          </code>
                          <span className='text-xs text-muted-foreground flex-1'>
                            {tool.description}
                          </span>
                          <span
                            className={cn(
                              'text-[10px] font-medium rounded-full px-2 py-0.5 shrink-0',
                              scopeStyle.className
                            )}
                          >
                            {scopeStyle.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Scope legend */}
        <div className='flex items-center gap-4 mt-4 pt-3 border-t'>
          <span className='text-xs text-muted-foreground'>Уровни доступа:</span>
          {Object.entries(SCOPE_LABELS).map(([key, { label, className }]) => (
            <span
              key={key}
              className={cn(
                'text-[10px] font-medium rounded-full px-2 py-0.5',
                className
              )}
            >
              {label}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// --- Main Component ---

export function McpConnectionGuide() {
  const [activeTab, setActiveTab] = useState<TabId>('claude-desktop');
  const [copied, setCopied] = useState(false);

  const content = TAB_CONTENT[activeTab];
  const afterSteps = AFTER_STEPS[activeTab];

  const handleCopy = async () => {
    if (!content.config) return;
    await navigator.clipboard.writeText(content.config);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Build full step numbering
  let stepNum = 0;

  return (
    <>
      <Card>
        <CardHeader className='pb-3'>
          <CardTitle className='text-base'>Инструкция по подключению</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Tabs */}
          <div className='flex gap-1 border-b mb-4'>
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setCopied(false);
                  }}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors border-b-2 -mb-px',
                    activeTab === tab.id
                      ? 'border-primary text-foreground'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
                  )}
                >
                  <Icon className='h-3.5 w-3.5' />
                  <span className='hidden sm:inline'>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Steps */}
          <div className='space-y-3'>
            {content.steps.map(step => {
              stepNum++;
              return (
                <div key={stepNum} className='flex gap-2.5'>
                  <span className='flex-shrink-0 h-5 w-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium mt-0.5'>
                    {stepNum}
                  </span>
                  <span className='text-sm text-muted-foreground'>{step}</span>
                </div>
              );
            })}

            {/* Config block */}
            {content.config && (
              <div className='relative rounded-lg border bg-muted/50'>
                <pre className='p-3 text-xs font-mono whitespace-pre-wrap text-muted-foreground overflow-auto max-h-64'>
                  {content.config}
                </pre>
                <Button
                  variant='ghost'
                  size='sm'
                  className='absolute top-2 right-2 h-7 text-xs gap-1'
                  onClick={handleCopy}
                >
                  {copied ? (
                    <Check className='h-3 w-3 text-green-500' />
                  ) : (
                    <Copy className='h-3 w-3' />
                  )}
                  {copied ? 'Скопировано' : 'Копировать'}
                </Button>
              </div>
            )}

            {afterSteps.map(step => {
              stepNum++;
              return (
                <div key={stepNum} className='flex gap-2.5'>
                  <span className='flex-shrink-0 h-5 w-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium mt-0.5'>
                    {stepNum}
                  </span>
                  <span className='text-sm text-muted-foreground'>{step}</span>
                </div>
              );
            })}
          </div>

          {/* Замените ключ */}
          <p className='text-xs text-amber-400/80 mt-4'>
            Замените{' '}
            <code className='font-mono bg-muted px-1 rounded'>
              {'<ваш_ключ>'}
            </code>{' '}
            на API-ключ, созданный в разделе «Ключи доступа».
          </p>
        </CardContent>
      </Card>

      <ToolsReference />
    </>
  );
}
