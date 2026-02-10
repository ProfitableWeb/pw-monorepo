import { useRef, useState, useEffect, KeyboardEvent } from "react";
import { cn } from "@/app/components/ui/utils";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/app/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/app/components/ui/dropdown-menu";
import {
  Send,
  Paperclip,
  X,
  Bot,
  Plus,
  FileText,
  Image as ImageIcon,
  File,
  Settings,
  MessageSquare,
  Sparkles,
  Lightbulb,
  Zap,
  PenLine,
  TrendingUp,
  Search,
} from "lucide-react";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { useAIStore } from "@/app/store/ai-store";
import type { Attachment } from "@/app/store/ai-store";
import { MessageItem } from "@/app/components/message-item";

const AI_MODELS = [
  { id: "opus-4.6", name: "Opus 4.6", description: "Самая мощная модель" },
  { id: "sonnet-4.2", name: "Sonnet 4.2", description: "Баланс скорости и качества" },
  { id: "glm-4.7", name: "GLM 4.7", description: "Быстрая и эффективная" },
  { id: "haiku-3.5", name: "Haiku 3.5", description: "Максимальная скорость" },
];

export function AICenter() {
  // Zustand store
  const sessions = useAIStore((state) => state.sessions);
  const currentSessionId = useAIStore((state) => state.currentSessionId);
  const switchSession = useAIStore((state) => state.switchSession);
  const getMessages = useAIStore((state) => state.getMessages);
  const messages = getMessages();
  const input = useAIStore((state) => state.input);
  const setInput = useAIStore((state) => state.setInput);
  const selectedModel = useAIStore((state) => state.selectedModel);
  const setSelectedModel = useAIStore((state) => state.setSelectedModel);
  const attachments = useAIStore((state) => state.attachments);
  const addAttachment = useAIStore((state) => state.addAttachment);
  const removeAttachment = useAIStore((state) => state.removeAttachment);
  const setAttachments = useAIStore((state) => state.setAttachments);
  const addMessage = useAIStore((state) => state.addMessage);
  const isStreaming = useAIStore((state) => state.isStreaming);
  const setIsStreaming = useAIStore((state) => state.setIsStreaming);
  const initialPrompt = useAIStore((state) => state.initialPrompt);
  const setInitialPrompt = useAIStore((state) => state.setInitialPrompt);
  
  // Local UI state
  const [isDragging, setIsDragging] = useState(false);
  const [showSessions, setShowSessions] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateDescription, setTemplateDescription] = useState("");
  const [templateIcon, setTemplateIcon] = useState("FileText");
  const [templatePrompt, setTemplatePrompt] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<React.ElementRef<"div">>(null);

  // Handle initial prompt (from Manifest wizard)
  useEffect(() => {
    if (initialPrompt && messages.length === 0) {
      setInput(initialPrompt);
      setInitialPrompt(null);
      // Auto-send after a short delay
      setTimeout(() => {
        handleSend();
      }, 500);
    }
  }, [initialPrompt, messages.length]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [input]);

  // Auto-scroll to bottom when messages change or streaming state changes
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]");
      if (scrollContainer) {
        // Use requestAnimationFrame to ensure DOM updates are complete
        requestAnimationFrame(() => {
          scrollContainer.scrollTo({
            top: scrollContainer.scrollHeight,
            behavior: "smooth"
          });
        });
      }
    }
  }, [messages, isStreaming]);

  const handleSend = () => {
    if (!input.trim() && attachments.length === 0) return;

    addMessage({
      role: "user",
      content: input,
      attachments: attachments.length > 0 ? [...attachments] : undefined,
    });
    setInput("");
    setAttachments([]);
    setIsStreaming(true);

    // Simulate AI response
    setTimeout(() => {
      addMessage({
        role: "assistant",
        content: "Я обработал ваш запрос. Вот что я могу предложить...",
        thinking: [
          {
            id: "t" + Date.now(),
            content: "Анализирую контекст и формирую ответ на основе предыдущих сообщений...",
            duration: 1500,
          },
        ],
      });
      setIsStreaming(false);
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newAttachments: Attachment[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    newAttachments.forEach(attachment => addAttachment(attachment));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="h-4 w-4" />;
    if (type.startsWith("text/")) return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleConfigureModels = () => {
    // TODO: Open models configuration dialog
    console.log("Configure models clicked");
  };

  const handleModelChange = (value: string) => {
    if (value === "__configure__") {
      handleConfigureModels();
      // Don't change the model selection
      return;
    }
    setSelectedModel(value);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area with ScrollArea */}
      <div className="flex-1 min-h-0">
        <ScrollArea ref={scrollAreaRef} className="h-full">
          <div className="max-w-4xl mx-auto space-y-6 p-6 pb-12">{/* Увеличили padding-bottom с pb-6 до pb-12 */}
            {/* Empty State for New Session */}
            {messages.length === 0 && !isStreaming && (
              <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Bot className="h-10 w-10 text-primary" />
                </div>
                
                <h2 className="text-2xl font-semibold mb-3">Начните новую сессию</h2>
                <p className="text-muted-foreground mb-8 max-w-md">
                  Используйте AI для написания статей, анализа данных, создания контента и многого другого.
                </p>

                {/* Quick Prompts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                  <button
                    onClick={() => setInput("Помоги написать статью о новых трендах в веб-разработке")}
                    className="group p-4 rounded-lg border bg-card hover:bg-accent transition-colors text-left"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium mb-1">Написать статью</h3>
                        <p className="text-sm text-muted-foreground">
                          Создайте качественный контент для блога
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setInput("Проанализируй текущие метрики блога и дай рекомендации")}
                    className="group p-4 rounded-lg border bg-card hover:bg-accent transition-colors text-left"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Sparkles className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium mb-1">Анализ метрик</h3>
                        <p className="text-sm text-muted-foreground">
                          Получите инсайты по аналитике блога
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setInput("Предложи темы для следующих публикаций на основе трендов")}
                    className="group p-4 rounded-lg border bg-card hover:bg-accent transition-colors text-left"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Lightbulb className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium mb-1">Идеи контента</h3>
                        <p className="text-sm text-muted-foreground">
                          Найдите темы для новых публикаций
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setInput("Оптимизируй SEO для моих последних статей")}
                    className="group p-4 rounded-lg border bg-card hover:bg-accent transition-colors text-left"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Zap className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium mb-1">SEO оптимизация</h3>
                        <p className="text-sm text-muted-foreground">
                          Улучшите видимость в поисковиках
                        </p>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Add Template Button */}
                <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
                  <DialogTrigger asChild>
                    <button className="mt-4 w-full max-w-2xl p-4 rounded-lg border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 hover:bg-accent/50 transition-colors text-left group">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground group-hover:text-primary">
                        <Plus className="h-5 w-5" />
                        <span className="font-medium">Добавить шаблон</span>
                      </div>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Создать новый шаблон</DialogTitle>
                      <DialogDescription>
                        Добавьте свой шаблон для быстрого доступа к часто используемым промптам
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="template-name">Название</Label>
                        <Input
                          id="template-name"
                          placeholder="Например: Написать пост в блог"
                          value={templateName}
                          onChange={(e) => setTemplateName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="template-description">Описание</Label>
                        <Input
                          id="template-description"
                          placeholder="Краткое описание шаблона"
                          value={templateDescription}
                          onChange={(e) => setTemplateDescription(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="template-icon">Иконка</Label>
                        <Select value={templateIcon} onValueChange={setTemplateIcon}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="FileText">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                <span>Документ</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Sparkles">
                              <div className="flex items-center gap-2">
                                <Sparkles className="h-4 w-4" />
                                <span>Искры</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Lightbulb">
                              <div className="flex items-center gap-2">
                                <Lightbulb className="h-4 w-4" />
                                <span>Лампочка</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Zap">
                              <div className="flex items-center gap-2">
                                <Zap className="h-4 w-4" />
                                <span>Молния</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="PenLine">
                              <div className="flex items-center gap-2">
                                <PenLine className="h-4 w-4" />
                                <span>Ручка</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="TrendingUp">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4" />
                                <span>График</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="Search">
                              <div className="flex items-center gap-2">
                                <Search className="h-4 w-4" />
                                <span>Поиск</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="template-prompt">Текст промпта</Label>
                        <Textarea
                          id="template-prompt"
                          placeholder="Введите промпт, который будет использоваться при клике на шаблон"
                          value={templatePrompt}
                          onChange={(e) => setTemplatePrompt(e.target.value)}
                          rows={4}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsTemplateDialogOpen(false);
                          setTemplateName("");
                          setTemplateDescription("");
                          setTemplateIcon("FileText");
                          setTemplatePrompt("");
                        }}
                      >
                        Отмена
                      </Button>
                      <Button
                        onClick={() => {
                          // TODO: Save template to store
                          console.log("Save template:", {
                            name: templateName,
                            description: templateDescription,
                            icon: templateIcon,
                            prompt: templatePrompt,
                          });
                          setIsTemplateDialogOpen(false);
                          setTemplateName("");
                          setTemplateDescription("");
                          setTemplateIcon("FileText");
                          setTemplatePrompt("");
                        }}
                        disabled={!templateName || !templatePrompt}
                      >
                        Создать шаблон
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}

            {messages.map((message) => (
              <MessageItem key={message.id} message={message} aiModels={AI_MODELS} />
            ))}

            {/* Typing Indicator */}
            {isStreaming && (
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div className="flex items-center gap-1 p-4 rounded-lg bg-muted/50 border">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="flex-shrink-0 border-t p-4 bg-background">
        <div className="max-w-4xl mx-auto">
          {/* Attachments Preview */}
          {attachments.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted border text-sm group"
                >
                  {getFileIcon(attachment.type)}
                  <span className="font-medium">{attachment.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatFileSize(attachment.size)}
                  </span>
                  <button
                    onClick={() => removeAttachment(attachment.id)}
                    className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Drag & Drop Zone */}
          <div
            className={cn(
              "relative rounded-lg border-2 border-dashed transition-colors",
              isDragging ? "border-primary bg-primary/5" : "border-transparent"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {isDragging && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-lg z-10">
                <div className="text-center">
                  <Paperclip className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">Отпустите файлы для загрузки</p>
                </div>
              </div>
            )}

            <div className="flex items-end gap-2 p-2 bg-muted/30 rounded-lg">
              {/* Model Selector */}
              <div className="flex-shrink-0">
                <Select value={selectedModel} onValueChange={handleModelChange}>
                  <SelectTrigger className="w-[140px] h-10 text-xs">
                    {AI_MODELS.find(m => m.id === selectedModel)?.name}
                  </SelectTrigger>
                  <SelectContent>
                    {AI_MODELS.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        <div>
                          <div className="font-medium">{model.name}</div>
                          <div className="text-xs text-muted-foreground">{model.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                    <SelectSeparator />
                    <SelectItem value="__configure__" onSelect={(e) => {
                      e.preventDefault();
                      handleConfigureModels();
                    }}>
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        <span>Настроить список моделей</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Textarea */}
              <div className="flex-1 min-w-0">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Напишите сообщение... (Shift+Enter для новой строки)"
                  className="min-h-[40px] max-h-[200px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  rows={1}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-10 w-10"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  onClick={handleSend}
                  disabled={!input.trim() && attachments.length === 0}
                  className="h-10 w-10"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Helper Text */}
          <p className="text-xs text-muted-foreground text-center mt-2">
            AI может совершать ошибки. Проверяйте важную информацию.
          </p>
        </div>
      </div>
    </div>
  );
}