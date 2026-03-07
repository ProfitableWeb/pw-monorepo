import { Save, Eye, Edit, Sparkles, CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/app/components/ui/accordion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Separator } from '@/app/components/ui/separator';
import type { ManifestData } from './manifest.types';
import { sections, aiQuestions } from './manifest.constants';

export function ManifestDocSection({
  manifest,
  activeTab,
  setActiveTab,
  saved,
  currentQuestion,
  answers,
  onSave,
  onExport: _onExport,
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
  updateField: (
    section: keyof ManifestData,
    field: string,
    value: string
  ) => void;
  getCompletionPercentage: () => number;
  isSectionComplete: (sectionId: string) => boolean;
  setCurrentQuestion: (question: number) => void;
  setAnswers: (answers: Record<number, string>) => void;
  handleCompleteWizard: () => void;
}) {
  return (
    <ScrollArea className='h-full'>
      <div className='p-6 max-w-6xl mx-auto space-y-6'>
        {/* Заголовок */}
        <div className='flex items-start justify-between'>
          <div>
            <h1 className='text-3xl font-bold mb-2'>Конструктор манифеста</h1>
            <p className='text-muted-foreground'>
              Стратегический документ, который пределяет миссию, аудиторию и
              развитие вашего прокта
            </p>
          </div>
          <Button onClick={onSave} disabled={saved}>
            <Save className='h-4 w-4 mr-2' />
            {saved ? 'Сохранено' : 'Сохранить'}
          </Button>
        </div>

        {/* Прогресс */}
        <Card>
          <CardContent className='pt-6'>
            <div className='space-y-2'>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-muted-foreground'>
                  Прогресс заполнения
                </span>
                <span className='font-semibold'>
                  {getCompletionPercentage()}%
                </span>
              </div>
              <div className='h-2 bg-muted rounded-full overflow-hidden'>
                <div
                  className='h-full bg-primary transition-all duration-300'
                  style={{ width: `${getCompletionPercentage()}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Вкладки */}
        <Tabs value={activeTab} onValueChange={setActiveTab} variant='line'>
          <TabsList className='mb-6'>
            <TabsTrigger value='view'>
              <Eye className='h-4 w-4' />
              Просмотр
            </TabsTrigger>
            <TabsTrigger value='edit'>
              <Edit className='h-4 w-4' />
              Редактирование
            </TabsTrigger>
            <TabsTrigger value='ai'>
              <Sparkles className='h-4 w-4' />
              AI-Помощник
            </TabsTrigger>
          </TabsList>

          {/* Режим просмотра */}
          <TabsContent value='view' className='space-y-6'>
            {sections.map(section => {
              const Icon = section.icon;
              const sectionData = manifest[section.id as keyof ManifestData];
              const hasContent = section.fields.some(field =>
                (sectionData as any)[field.key]?.trim()
              );

              return (
                <Card key={section.id}>
                  <CardHeader>
                    <div className='flex items-center gap-3'>
                      <div className='p-2 rounded-lg bg-muted'>
                        <Icon className='h-5 w-5' />
                      </div>
                      <div className='flex-1'>
                        <CardTitle>{section.title}</CardTitle>
                      </div>
                      {isSectionComplete(section.id) && (
                        <Badge variant='default' className='gap-1'>
                          <CheckCircle2 className='h-3 w-3' />
                          Заполнено
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {hasContent ? (
                      <div className='space-y-4'>
                        {section.fields.map(field => {
                          const value = (sectionData as any)[field.key];
                          if (!value?.trim()) return null;
                          return (
                            <div key={field.key}>
                              <h4 className='font-semibold mb-2 text-sm'>
                                {field.label}
                              </h4>
                              <p className='text-muted-foreground whitespace-pre-wrap'>
                                {value}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className='text-muted-foreground text-sm italic'>
                        Раздел пока не заполнен. Перейдите в режим
                        редактирования для заполнения.
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* Режим редактирования */}
          <TabsContent value='edit'>
            <Accordion type='single' collapsible className='space-y-4'>
              {sections.map(section => {
                const Icon = section.icon;
                return (
                  <AccordionItem
                    key={section.id}
                    value={section.id}
                    className='border rounded-lg px-4'
                  >
                    <AccordionTrigger className='hover:no-underline'>
                      <div className='flex items-center gap-3'>
                        <div className='p-2 rounded-lg bg-muted'>
                          <Icon className='h-5 w-5' />
                        </div>
                        <span className='font-semibold'>{section.title}</span>
                        {isSectionComplete(section.id) ? (
                          <CheckCircle2 className='h-4 w-4 text-green-500' />
                        ) : (
                          <Circle className='h-4 w-4 text-muted-foreground' />
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className='pt-4 pb-4'>
                      <div className='space-y-6'>
                        {section.fields.map(field => {
                          const value = (
                            manifest[section.id as keyof ManifestData] as any
                          )[field.key];
                          return (
                            <div key={field.key} className='space-y-2'>
                              <Label htmlFor={`${section.id}-${field.key}`}>
                                {field.label}
                              </Label>
                              <Textarea
                                id={`${section.id}-${field.key}`}
                                placeholder={field.placeholder}
                                value={value || ''}
                                onChange={e =>
                                  updateField(
                                    section.id as keyof ManifestData,
                                    field.key,
                                    e.target.value
                                  )
                                }
                                rows={4}
                                className='resize-none'
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
          <TabsContent value='ai'>
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Sparkles className='h-5 w-5 text-violet-500' />
                  AI-Помощник по заполнению манифеста
                </CardTitle>
                <CardDescription>
                  Отвечайте на вопросы, и AI поможет структурировать ваши ответы
                  в манифест
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                {/* Прогресс */}
                <div className='flex items-center gap-4'>
                  <div className='flex-1'>
                    <div className='h-2 bg-muted rounded-full overflow-hidden'>
                      <div
                        className='h-full bg-violet-500 transition-all duration-300'
                        style={{
                          width: `${((currentQuestion + 1) / aiQuestions.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <span className='text-sm text-muted-foreground'>
                    {currentQuestion + 1} / {aiQuestions.length}
                  </span>
                </div>

                {/* Текущий вопрос */}
                {(() => {
                  const currentQ = aiQuestions[currentQuestion];
                  if (!currentQ) return null;
                  return (
                    <div className='space-y-4'>
                      <div className='p-4 bg-muted rounded-lg'>
                        <p className='font-semibold mb-2'>
                          {currentQ.question}
                        </p>
                        <p className='text-sm text-muted-foreground'>
                          {currentQ.hint}
                        </p>
                      </div>

                      <Textarea
                        placeholder='Ваш ответ...'
                        value={answers[currentQ.id] || ''}
                        onChange={e =>
                          setAnswers({
                            ...answers,
                            [currentQ.id]: e.target.value,
                          })
                        }
                        rows={6}
                        className='resize-none'
                      />

                      <div className='flex justify-between'>
                        <Button
                          variant='outline'
                          onClick={() =>
                            setCurrentQuestion(Math.max(0, currentQuestion - 1))
                          }
                          disabled={currentQuestion === 0}
                        >
                          Назад
                        </Button>
                        <Button
                          onClick={() => {
                            if (currentQuestion < aiQuestions.length - 1) {
                              setCurrentQuestion(currentQuestion + 1);
                            } else {
                              // Создать AI-сессию с ответами визарда
                              handleCompleteWizard();
                            }
                          }}
                        >
                          {currentQuestion === aiQuestions.length - 1
                            ? 'Создать диалог с AI'
                            : 'Далее'}
                        </Button>
                      </div>
                    </div>
                  );
                })()}

                {/* Отвеченные вопросы */}
                {Object.keys(answers).length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className='font-semibold mb-3'>Ваши ответы:</h4>
                      <div className='space-y-2'>
                        {aiQuestions.map(q => {
                          const answer = answers[q.id];
                          if (!answer) return null;
                          return (
                            <div
                              key={q.id}
                              className='p-3 bg-muted/50 rounded text-sm'
                            >
                              <p className='font-medium mb-1'>{q.question}</p>
                              <p className='text-muted-foreground'>{answer}</p>
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
