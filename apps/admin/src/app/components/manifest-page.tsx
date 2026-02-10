import { useHeaderStore } from "@/app/store/header-store";
import { breadcrumbPresets } from "@/app/utils/breadcrumbs-helper";
import { useState, useEffect } from "react";
import { 
  BookOpen, 
  Users, 
  Target, 
  FileText, 
  Shield, 
  TrendingUp, 
  Rocket,
  Bot,
  Save,
  Eye,
  Edit,
  Sparkles,
  CheckCircle2,
  Circle,
  ChevronRight,
  Search,
  Heart,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Separator } from "@/app/components/ui/separator";
import { useAIStore } from "@/app/store/ai-store";
import { cn } from "@/app/components/ui/utils";

interface ManifestPageProps {
  onNavigateToAI?: () => void;
}

interface NavigationItem {
  id: string;
  label: string;
  icon: any;
}

const NAVIGATION_ITEMS: NavigationItem[] = [
  { id: 'manifest-doc', label: 'Конструктор', icon: Sparkles },
  { id: 'mission', label: 'Миссия и ценности', icon: Heart },
  { id: 'audience', label: 'Целевая аудитория', icon: Users },
  { id: 'positioning', label: 'Позиционирование', icon: Target },
  { id: 'content-strategy', label: 'Контент-стратегия', icon: FileText },
  { id: 'editorial', label: 'Редакционная политика', icon: Shield },
  { id: 'metrics', label: 'Метрики успеха', icon: TrendingUp },
  { id: 'development', label: 'Развитие', icon: Rocket },
];

interface ManifestData {
  mission: {
    purpose: string;
    problem: string;
    vision: string;
    values: string;
  };
  audience: {
    target: string;
    pains: string;
    goals: string;
    channels: string;
    language: string;
  };
  positioning: {
    uniqueness: string;
    toneOfVoice: string;
    boundaries: string;
    expertise: string;
  };
  contentStrategy: {
    topics: string;
    formats: string;
    frequency: string;
    quality: string;
  };
  editorialPolicy: {
    topicSelection: string;
    research: string;
    factChecking: string;
    ethics: string;
  };
  metrics: {
    kpis: string;
    successDefinition: string;
    targets: string;
  };
  development: {
    direction: string;
    changes: string;
    experiments: string;
  };
  aiInstructions: {
    priorities: string;
    forbidden: string;
    examples: string;
    approval: string;
    sources: string;
  };
}

const defaultManifest: ManifestData = {
  mission: {
    purpose: "",
    problem: "",
    vision: "",
    values: "",
  },
  audience: {
    target: "",
    pains: "",
    goals: "",
    channels: "",
    language: "",
  },
  positioning: {
    uniqueness: "",
    toneOfVoice: "",
    boundaries: "",
    expertise: "",
  },
  contentStrategy: {
    topics: "",
    formats: "",
    frequency: "",
    quality: "",
  },
  editorialPolicy: {
    topicSelection: "",
    research: "",
    factChecking: "",
    ethics: "",
  },
  metrics: {
    kpis: "",
    successDefinition: "",
    targets: "",
  },
  development: {
    direction: "",
    changes: "",
    experiments: "",
  },
  aiInstructions: {
    priorities: "",
    forbidden: "",
    examples: "",
    approval: "",
    sources: "",
  },
};

const sections = [
  {
    id: "mission",
    title: "Мисс��я и видение",
    icon: BookOpen,
    color: "text-blue-500",
    fields: [
      { key: "purpose", label: "Почему мы существуем?", placeholder: "Глобальная цель издания..." },
      { key: "problem", label: "Какую проблему решаем?", placeholder: "Боль аудитории..." },
      { key: "vision", label: "Какой мир мы хотим создать?", placeholder: "Долгосрочное видение..." },
      { key: "values", label: "Наши ценности", placeholder: "Принципы, которыми руководствуемся..." },
    ],
  },
  {
    id: "audience",
    title: "Аудитория",
    icon: Users,
    color: "text-green-500",
    fields: [
      { key: "target", label: "Кто ваша целевая аудитория?", placeholder: "Детальное описание..." },
      { key: "pains", label: "Их боли и проблемы", placeholder: "Что их беспокоит..." },
      { key: "goals", label: "Их цели и стремления", placeholder: "К чему они идут..." },
      { key: "channels", label: "Где они находятся?", placeholder: "Каналы и платформы..." },
      { key: "language", label: "Язык аудитории", placeholder: "Как они говорят, какие термины используют..." },
    ],
  },
  {
    id: "positioning",
    title: "Позиционирование",
    icon: Target,
    color: "text-purple-500",
    fields: [
      { key: "uniqueness", label: "Наша уникальность", placeholder: "Чем отличаемся от конкурентов..." },
      { key: "toneOfVoice", label: "Tone of Voice", placeholder: "Как мы говорим (экспертно/дружелюбно/провокационно)..." },
      { key: "boundaries", label: "Что мы НЕ делаем", placeholder: "Границы контента..." },
      { key: "expertise", label: "Наша экспертиза", placeholder: "В чем мы сильны..." },
    ],
  },
  {
    id: "contentStrategy",
    title: "Контентная стратегия",
    icon: FileText,
    color: "text-orange-500",
    fields: [
      { key: "topics", label: "Основные темы", placeholder: "Топ-5 направлений контента..." },
      { key: "formats", label: "Форматы контента", placeholder: "Статьи, гайды, кейсы, интервью..." },
      { key: "frequency", label: "Частота публикаций", placeholder: "Сколько и когда..." },
      { key: "quality", label: "Стандарты качества", placeholder: "Критерии хорошей статьи..." },
    ],
  },
  {
    id: "editorialPolicy",
    title: "Редакционная политика",
    icon: Shield,
    color: "text-red-500",
    fields: [
      { key: "topicSelection", label: "Как мы выбираем темы?", placeholder: "Критерии отбора..." },
      { key: "research", label: "Как мы исследуем?", placeholder: "Методология..." },
      { key: "factChecking", label: "Как мы проверяем факты?", placeholder: "Стандарты..." },
      { key: "ethics", label: "Этические принципы", placeholder: "Что допустимо, что нет..." },
    ],
  },
  {
    id: "metrics",
    title: "Метрики успеха",
    icon: TrendingUp,
    color: "text-cyan-500",
    fields: [
      { key: "kpis", label: "Ключевые KPI", placeholder: "Что измеряем..." },
      { key: "successDefinition", label: "Определение успешной статьи", placeholder: "Конкретные цифр��..." },
      { key: "targets", label: "Целевые показатели", placeholder: "К чему стремимся..." },
    ],
  },
  {
    id: "development",
    title: "Развитие и эволюция",
    icon: Rocket,
    color: "text-pink-500",
    fields: [
      { key: "direction", label: "Куда мы идем?", placeholder: "Планы на год/3 года..." },
      { key: "changes", label: "Что будем менять?", placeholder: "Области развития..." },
      { key: "experiments", label: "Эксперименты", placeholder: "Что хотим попробовать..." },
    ],
  },
  {
    id: "aiInstructions",
    title: "Инструкции для AI",
    icon: Bot,
    color: "text-violet-500",
    fields: [
      { key: "priorities", label: "Приоритеты при выборе тем", placeholder: "Алгоритм принятия решений..." },
      { key: "forbidden", label: "Запрещенные темы/подходы", placeholder: "Чего избегать..." },
      { key: "examples", label: "Примеры идеальных статей", placeholder: "Референсы..." },
      { key: "approval", label: "Процесс согласования", placeholder: "Когда нужно человеческое одобрение..." },
      { key: "sources", label: "Используемые источники", placeholder: "Откуда брать информацию..." },
    ],
  },
];

const aiQuestions = [
  {
    id: 1,
    section: "mission",
    question: "Почему вы решили создать это издание?",
    hint: "Подумайте о том, что вас мотивирует, какую ценность вы хотите принести миру.",
  },
  {
    id: 2,
    section: "audience",
    question: "Опишите вашего идеального читателя. Кто он?",
    hint: "Возраст, профессия, интересы, проблемы, к чему стремится.",
  },
  {
    id: 3,
    section: "positioning",
    question: "Чем ваше издание отличается от других в вашей ие?",
    hint: "Уникальный угол зрения, подход, экспертиза, формат.",
  },
  {
    id: 4,
    section: "contentStrategy",
    question: "О чем вы будете писать чаще всего? Назовите топ-3 темы.",
    hint: "Сфокусируйтесь на том, в чем вы действительны эксперт.",
  },
  {
    id: 5,
    section: "metrics",
    question: "Как вы поймете, что ваше издание успешно?",
    hint: "Конкретные цифры: просмотры, подписчики, вовлеченность, доход.",
  },
];

export function ManifestPage({ onNavigateToAI }: ManifestPageProps) {
  const [activeSubsection, setActiveSubsection] = useState('manifest-doc');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [manifest, setManifest] = useState<ManifestData>(defaultManifest);
  const [activeTab, setActiveTab] = useState("view");
  const [saved, setSaved] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  
  // Zustand AI store
  const clearMessages = useAIStore((state) => state.clearMessages);
  const setInitialPrompt = useAIStore((state) => state.setInitialPrompt);
  const switchSession = useAIStore((state) => state.switchSession);

  // Header store for breadcrumbs
  const { setBreadcrumbs, reset } = useHeaderStore();

  // Set breadcrumbs on mount
  useEffect(() => {
    updateBreadcrumbs(activeSubsection);

    return () => reset();
  }, []);

  // Update breadcrumbs when subsection changes
  useEffect(() => {
    updateBreadcrumbs(activeSubsection);
  }, [activeSubsection]);

  const updateBreadcrumbs = (subsectionId: string) => {
    const baseBreadcrumbs = breadcrumbPresets.manifest();
    
    // Find current subsection label
    const subsection = NAVIGATION_ITEMS.find(item => item.id === subsectionId);
    if (subsection) {
      setBreadcrumbs([
        ...baseBreadcrumbs,
        { label: subsection.label, icon: subsection.icon }
      ]);
    } else {
      setBreadcrumbs(baseBreadcrumbs);
    }
  };

  // Load manifest from localStorage
  useEffect(() => {
    const savedManifest = localStorage.getItem("manifest");
    if (savedManifest) {
      try {
        setManifest(JSON.parse(savedManifest));
      } catch (e) {
        console.error("Error loading manifest:", e);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("manifest", JSON.stringify(manifest));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExport = () => {
    const manifestText = generateMarkdown(manifest);
    const blob = new Blob([manifestText], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "manifest.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const updateField = (section: keyof ManifestData, field: string, value: string) => {
    setManifest((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const getCompletionPercentage = () => {
    let total = 0;
    let filled = 0;
    sections.forEach((section) => {
      section.fields.forEach((field) => {
        total++;
        const value = (manifest[section.id as keyof ManifestData] as any)[field.key];
        if (value && value.trim().length > 0) {
          filled++;
        }
      });
    });
    return Math.round((filled / total) * 100);
  };

  const isSectionComplete = (sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    if (!section) return false;
    
    return section.fields.every((field) => {
      const value = (manifest[section.id as keyof ManifestData] as any)[field.key];
      return value && value.trim().length > 0;
    });
  };

  const handleCompleteWizard = () => {
    // Switch to manifest creation session
    switchSession("session-2");
    
    // Navigate to AI center
    if (onNavigateToAI) {
      onNavigateToAI();
    }
    
    // Reset wizard
    setCurrentQuestion(0);
    setAnswers({});
    setActiveTab("view");
  };

  const renderSubsection = () => {
    switch (activeSubsection) {
      case 'manifest-doc':
        return (
          <ManifestDocSection
            manifest={manifest}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            saved={saved}
            currentQuestion={currentQuestion}
            answers={answers}
            onSave={handleSave}
            onExport={handleExport}
            updateField={updateField}
            getCompletionPercentage={getCompletionPercentage}
            isSectionComplete={isSectionComplete}
            setCurrentQuestion={setCurrentQuestion}
            setAnswers={setAnswers}
            handleCompleteWizard={handleCompleteWizard}
          />
        );
      case 'mission':
        return <MissionSection />;
      case 'audience':
        return <AudienceSection />;
      case 'positioning':
        return <PositioningSection />;
      case 'content-strategy':
        return <ContentStrategySection />;
      case 'editorial':
        return <EditorialSection />;
      case 'metrics':
        return <MetricsSection />;
      case 'development':
        return <DevelopmentSection />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r bg-card flex-shrink-0 flex flex-col">
        <div className="p-4 border-b flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <ScrollArea className="flex-1 min-h-0">
          <nav className="p-2">
            {NAVIGATION_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeSubsection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSubsection(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors mb-1",
                    isActive
                      ? "bg-accent text-accent-foreground font-medium"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                  )}
                >
                  <Icon className="size-4 flex-shrink-0" />
                  <span className="flex-1 text-left">{item.label}</span>
                  <ChevronRight className={cn(
                    "size-4 transition-transform flex-shrink-0",
                    isActive && "rotate-90"
                  )} />
                </button>
              );
            })}
          </nav>
        </ScrollArea>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        {renderSubsection()}
      </div>
    </div>
  );
}

function generateMarkdown(manifest: ManifestData): string {
  let md = "# Манифест издания\n\n";
  
  sections.forEach((section) => {
    md += `## ${section.title}\n\n`;
    section.fields.forEach((field) => {
      const value = (manifest[section.id as keyof ManifestData] as any)[field.key];
      if (value?.trim()) {
        md += `### ${field.label}\n\n${value}\n\n`;
      }
    });
  });
  
  return md;
}

// Subsection components
function ManifestDocSection({
  manifest,
  activeTab,
  setActiveTab,
  saved,
  currentQuestion,
  answers,
  onSave,
  onExport,
  updateField,
  getCompletionPercentage,
  isSectionComplete,
  setCurrentQuestion,
  setAnswers,
  handleCompleteWizard,
}: {
  manifest: ManifestData;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  saved: boolean;
  currentQuestion: number;
  answers: Record<number, string>;
  onSave: () => void;
  onExport: () => void;
  updateField: (section: keyof ManifestData, field: string, value: string) => void;
  getCompletionPercentage: () => number;
  isSectionComplete: (sectionId: string) => boolean;
  setCurrentQuestion: (question: number) => void;
  setAnswers: (answers: Record<number, string>) => void;
  handleCompleteWizard: () => void;
}) {
  return (
    <ScrollArea className="h-full">
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Конструктор манифеста</h1>
            <p className="text-muted-foreground">
              Стратегический документ, который пределяет миссию, аудиторию и развитие вашего прокта
            </p>
          </div>
          <Button onClick={onSave} disabled={saved}>
            <Save className="h-4 w-4 mr-2" />
            {saved ? "Сохранено" : "Сохранить"}
          </Button>
        </div>

        {/* Progress */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Прогресс заполнения</span>
                <span className="font-semibold">{getCompletionPercentage()}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${getCompletionPercentage()}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} variant="line">
          <TabsList className="mb-6">
            <TabsTrigger value="view">
              <Eye className="h-4 w-4" />
              Просмотр
            </TabsTrigger>
            <TabsTrigger value="edit">
              <Edit className="h-4 w-4" />
              Редактирование
            </TabsTrigger>
            <TabsTrigger value="ai">
              <Sparkles className="h-4 w-4" />
              AI-Помощник
            </TabsTrigger>
          </TabsList>

          {/* View Mode */}
          <TabsContent value="view" className="space-y-6">
            {sections.map((section) => {
              const Icon = section.icon;
              const sectionData = manifest[section.id as keyof ManifestData];
              const hasContent = section.fields.some(
                (field) => (sectionData as any)[field.key]?.trim()
              );

              return (
                <Card key={section.id}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-muted">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <CardTitle>{section.title}</CardTitle>
                      </div>
                      {isSectionComplete(section.id) && (
                        <Badge variant="default" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Заполнено
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {hasContent ? (
                      <div className="space-y-4">
                        {section.fields.map((field) => {
                          const value = (sectionData as any)[field.key];
                          if (!value?.trim()) return null;
                          return (
                            <div key={field.key}>
                              <h4 className="font-semibold mb-2 text-sm">{field.label}</h4>
                              <p className="text-muted-foreground whitespace-pre-wrap">{value}</p>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm italic">
                        Раздел пока не заполнен. Перейдите в режим редактирования для заполнения.
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* Edit Mode */}
          <TabsContent value="edit">
            <Accordion type="single" collapsible className="space-y-4">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <AccordionItem key={section.id} value={section.id} className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-muted">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="font-semibold">{section.title}</span>
                        {isSectionComplete(section.id) ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-4">
                      <div className="space-y-6">
                        {section.fields.map((field) => {
                          const value = (manifest[section.id as keyof ManifestData] as any)[field.key];
                          return (
                            <div key={field.key} className="space-y-2">
                              <Label htmlFor={`${section.id}-${field.key}`}>{field.label}</Label>
                              <Textarea
                                id={`${section.id}-${field.key}`}
                                placeholder={field.placeholder}
                                value={value || ""}
                                onChange={(e) =>
                                  updateField(section.id as keyof ManifestData, field.key, e.target.value)
                                }
                                rows={4}
                                className="resize-none"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </TabsContent>

          {/* AI Assistant Mode */}
          <TabsContent value="ai">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-violet-500" />
                  AI-Помощник по заполнению манифеста
                </CardTitle>
                <CardDescription>
                  Отвечайте на вопросы, и AI поможет структурировать ваши ответы в манифест
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Progress */}
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-violet-500 transition-all duration-300"
                        style={{ width: `${((currentQuestion + 1) / aiQuestions.length) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {currentQuestion + 1} / {aiQuestions.length}
                  </span>
                </div>

                {/* Current Question */}
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="font-semibold mb-2">{aiQuestions[currentQuestion].question}</p>
                    <p className="text-sm text-muted-foreground">{aiQuestions[currentQuestion].hint}</p>
                  </div>

                  <Textarea
                    placeholder="Ваш ответ..."
                    value={answers[aiQuestions[currentQuestion].id] || ""}
                    onChange={(e) =>
                      setAnswers({ ...answers, [aiQuestions[currentQuestion].id]: e.target.value })
                    }
                    rows={6}
                    className="resize-none"
                  />

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                      disabled={currentQuestion === 0}
                    >
                      Назад
                    </Button>
                    <Button
                      onClick={() => {
                        if (currentQuestion < aiQuestions.length - 1) {
                          setCurrentQuestion(currentQuestion + 1);
                        } else {
                          // Create AI session with wizard answers
                          handleCompleteWizard();
                        }
                      }}
                    >
                      {currentQuestion === aiQuestions.length - 1 ? "Создать диалог с AI" : "Далее"}
                    </Button>
                  </div>
                </div>

                {/* Answered Questions */}
                {Object.keys(answers).length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-3">Ваши ответы:</h4>
                      <div className="space-y-2">
                        {aiQuestions.map((q) => {
                          const answer = answers[q.id];
                          if (!answer) return null;
                          return (
                            <div key={q.id} className="p-3 bg-muted/50 rounded text-sm">
                              <p className="font-medium mb-1">{q.question}</p>
                              <p className="text-muted-foreground">{answer}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}

function MissionSection() {
  return (
    <ScrollArea className="h-full">
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold mb-2">Миссия и ценности</h1>
        <p className="text-muted-foreground">
          Определите миссию и ценности вашего издания
        </p>
      </div>
    </ScrollArea>
  );
}

function AudienceSection() {
  return (
    <ScrollArea className="h-full">
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold mb-2">Целевая аудитория</h1>
        <p className="text-muted-foreground">
          Определите целевую аудиторию вашего издания
        </p>
      </div>
    </ScrollArea>
  );
}

function PositioningSection() {
  return (
    <ScrollArea className="h-full">
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold mb-2">Позиционирование</h1>
        <p className="text-muted-foreground">
          Опеделите позиционирование вашего издания
        </p>
      </div>
    </ScrollArea>
  );
}

function ContentStrategySection() {
  return (
    <ScrollArea className="h-full">
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold mb-2">Контент-стратегия</h1>
        <p className="text-muted-foreground">
          Определите контент-стратегию вашего издания
        </p>
      </div>
    </ScrollArea>
  );
}

function EditorialSection() {
  return (
    <ScrollArea className="h-full">
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold mb-2">Редакционная политика</h1>
        <p className="text-muted-foreground">
          Определите редакционную поитику вашего издания
        </p>
      </div>
    </ScrollArea>
  );
}

function MetricsSection() {
  return (
    <ScrollArea className="h-full">
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold mb-2">Метрики успеха</h1>
        <p className="text-muted-foreground">
          Определите метрики успеха вашего издания
        </p>
      </div>
    </ScrollArea>
  );
}

function DevelopmentSection() {
  return (
    <ScrollArea className="h-full">
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold mb-2">Развитие</h1>
        <p className="text-muted-foreground">
          Определите план развития вашего издания
        </p>
      </div>
    </ScrollArea>
  );
}