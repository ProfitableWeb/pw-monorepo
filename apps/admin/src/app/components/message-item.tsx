import { useState } from "react";
import { cn } from "@/app/components/ui/utils";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { Badge } from "@/app/components/ui/badge";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import {
  Bot,
  User,
  Brain,
  Code2,
  FileText,
  Image as ImageIcon,
  File,
  Copy,
  RotateCcw,
  Trash2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Check,
  X,
} from "lucide-react";
import { useAIStore } from "@/app/store/ai-store";
import type { Message, MessageVariant } from "@/app/store/ai-store";

interface MessageItemProps {
  message: Message;
  aiModels: Array<{ id: string; name: string; description: string }>;
}

export function MessageItem({ message, aiModels }: MessageItemProps) {
  const setCurrentVariant = useAIStore((state) => state.setCurrentVariant);
  const addMessageVariant = useAIStore((state) => state.addMessageVariant);
  const addMessage = useAIStore((state) => state.addMessage);
  const setIsStreaming = useAIStore((state) => state.setIsStreaming);
  const { resolvedTheme } = useTheme();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");

  const currentVariant = message.variants[message.currentVariantIndex];
  const hasMultipleVariants = message.variants.length > 1;

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

  const handlePrevVariant = () => {
    if (message.currentVariantIndex > 0) {
      setCurrentVariant(message.id, message.currentVariantIndex - 1);
    }
  };

  const handleNextVariant = () => {
    if (message.currentVariantIndex < message.variants.length - 1) {
      setCurrentVariant(message.id, message.currentVariantIndex + 1);
    }
  };

  const handleStartEdit = () => {
    setEditContent(currentVariant.content);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent("");
  };

  const handleSaveEdit = () => {
    if (!editContent.trim()) return;

    // Create new variant with edited content
    addMessageVariant(message.id, {
      role: currentVariant.role,
      content: editContent,
      attachments: currentVariant.attachments,
    });

    // Switch to the new variant
    setCurrentVariant(message.id, message.variants.length);

    setIsEditing(false);
    setEditContent("");

    // If it's a user message, generate new AI response
    if (currentVariant.role === "user") {
      setIsStreaming(true);
      setTimeout(() => {
        addMessageVariant(message.id, {
          role: "assistant",
          content: "Я обработал ваш обновленный запрос. Вот новый ответ...",
          thinking: [
            {
              id: "t" + Date.now(),
              content: "Анализирую обновленный запрос и формирую новый ответ...",
              duration: 1500,
            },
          ],
        });
        setIsStreaming(false);
      }, 2000);
    }
  };

  const handleRegenerate = () => {
    if (currentVariant.role !== "assistant") return;

    setIsStreaming(true);
    setTimeout(() => {
      addMessageVariant(message.id, {
        role: "assistant",
        content: "Это регенерированый вариант ответа с другой формулировкой...",
        thinking: [
          {
            id: "t" + Date.now(),
            content: "Генерирую альтернативный вариант ответа...",
            duration: 1200,
          },
        ],
      });
      
      // Switch to the new variant
      setCurrentVariant(message.id, message.variants.length);
      setIsStreaming(false);
    }, 2000);
  };

  return (
    <>
      <div
        key={message.id}
        className={cn(
          "flex gap-4",
          currentVariant.role === "user" ? "justify-end" : "justify-start"
        )}
      >
        {currentVariant.role === "assistant" && (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot className="h-5 w-5 text-primary" />
          </div>
        )}

        <div
          className={cn(
            "flex-1 max-w-3xl space-y-2",
            currentVariant.role === "user" && "flex flex-col items-end"
          )}
        >
          {/* Message Header with Variant Navigation */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {currentVariant.role === "assistant" && currentVariant.model && (
              <Badge variant="outline" className="text-xs">
                {aiModels.find((m) => m.id === currentVariant.model)?.name}
              </Badge>
            )}
            <span>
              {currentVariant.timestamp.toLocaleTimeString("ru-RU", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>

            {/* Variant Navigation */}
            {hasMultipleVariants && (
              <div className="flex items-center gap-1 ml-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={handlePrevVariant}
                  disabled={message.currentVariantIndex === 0}
                >
                  <ChevronLeft className="h-3 w-3" />
                </Button>
                <span className="text-xs px-1">
                  {message.currentVariantIndex + 1} / {message.variants.length}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={handleNextVariant}
                  disabled={message.currentVariantIndex === message.variants.length - 1}
                >
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>

          {/* Thinking Blocks */}
          {currentVariant.thinking && currentVariant.thinking.length > 0 && (
            <details className="group">
              <summary className="cursor-pointer p-3 rounded-lg border text-sm flex items-center gap-2 hover:bg-muted/30 transition-colors">
                <Brain className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Цепочка размышлений ({currentVariant.thinking.length})
                </span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {currentVariant.thinking.reduce((sum, t) => sum + (t.duration || 0), 0)}ms
                </span>
              </summary>
              <div className="mt-2 space-y-2 pl-4 border-l-2 border-muted">
                {currentVariant.thinking.map((think) => (
                  <div key={think.id} className="p-3 rounded-lg border text-sm">
                    <p className="text-muted-foreground italic">{think.content}</p>
                    {think.duration && (
                      <p className="text-xs text-muted-foreground mt-1">{think.duration}ms</p>
                    )}
                  </div>
                ))}
              </div>
            </details>
          )}

          {/* Tool Calls */}
          {currentVariant.toolCalls && currentVariant.toolCalls.length > 0 && (
            <div className="space-y-2">
              {currentVariant.toolCalls.map((tool) => (
                <details key={tool.id} className="group">
                  <summary className="cursor-pointer p-3 rounded-lg border text-sm flex items-center gap-2 hover:bg-muted/30 transition-colors">
                    <Code2 className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{tool.name}</span>
                    <Badge
                      variant={
                        tool.status === "success"
                          ? "outline"
                          : tool.status === "error"
                          ? "destructive"
                          : "secondary"
                      }
                      className={cn(
                        "text-xs ml-auto",
                        tool.status === "success" && "border-[rgb(200,225,210)] text-[rgb(90,170,120)] dark:border-[rgb(16,52,27)] dark:text-[rgb(65,145,94)]"
                      )}
                    >
                      {tool.status === "success" ? "Success" : tool.status}
                    </Badge>
                    {tool.duration && (
                      <span className="text-xs text-muted-foreground">{tool.duration}ms</span>
                    )}
                  </summary>
                  <div className="mt-2 p-3 rounded-lg border space-y-2">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Input:</p>
                      <pre className="text-xs bg-muted/30 p-2 rounded overflow-x-auto">
                        {JSON.stringify(tool.input, null, 2)}
                      </pre>
                    </div>
                    {tool.output && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Output:</p>
                        <p className="text-xs bg-muted/30 p-2 rounded">{tool.output}</p>
                      </div>
                    )}
                  </div>
                </details>
              ))}
            </div>
          )}

          {/* Attachments */}
          {currentVariant.attachments && currentVariant.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {currentVariant.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted border text-sm"
                >
                  {getFileIcon(attachment.type)}
                  <span className="font-medium">{attachment.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatFileSize(attachment.size)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Message Content */}
          <div
            className={cn(
              "p-4 rounded-lg",
              currentVariant.role === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-muted/50 border"
            )}
          >
            {currentVariant.role === "assistant" ? (
              <div className="text-sm leading-[1.7] prose prose-sm dark:prose-invert max-w-none prose-headings:font-semibold prose-h1:text-xl prose-h1:mt-6 prose-h1:mb-3 prose-h2:text-lg prose-h2:mt-5 prose-h2:mb-2.5 prose-h3:text-base prose-h3:mt-4 prose-h3:mb-2 prose-p:my-3 prose-p:leading-[1.7] prose-ul:my-3 prose-ol:my-3 prose-li:my-1 prose-pre:my-3 prose-pre:bg-muted prose-pre:text-foreground prose-code:text-foreground prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-blockquote:my-3 prose-blockquote:border-l-primary prose-hr:my-4 prose-strong:font-semibold prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {currentVariant.content}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                {currentVariant.content}
              </p>
            )}
          </div>

          {/* Message Actions */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleStartEdit}>
              <Edit2 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => copyToClipboard(currentVariant.content)}
            >
              <Copy className="h-3 w-3" />
            </Button>
            {currentVariant.role === "assistant" && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleRegenerate}>
                <RotateCcw className="h-3 w-3" />
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>
                  <Copy className="h-4 w-4 mr-2" />
                  Копировать
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Удалить
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {currentVariant.role === "user" && (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <User className="h-5 w-5" />
          </div>
        )}
      </div>

      {/* Edit Message Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent 
          className="max-w-4xl max-h-[85vh] flex flex-col"
          onEscapeKeyDown={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Редактировать сообщение</DialogTitle>
            <DialogDescription>
              После сохранения создастся новая ветка диалога с этого момента.
              <br />
              Исходная ветка сохранится — переключайтесь между вариантами стрелками.
            </DialogDescription>
          </DialogHeader>
          <div className="h-[500px] border rounded-md overflow-hidden">
            <Editor
              height="500px"
              defaultLanguage="markdown"
              value={editContent}
              onChange={(value) => setEditContent(value || "")}
              theme={resolvedTheme === "dark" ? "vs-dark" : "light"}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                wordWrap: "on",
                wrappingStrategy: "advanced",
                padding: { top: 10, bottom: 10 },
                suggestOnTriggerCharacters: true,
                quickSuggestions: {
                  other: true,
                  comments: false,
                  strings: false
                },
                tabSize: 2,
                insertSpaces: true,
              }}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelEdit}>
              Отмена
            </Button>
            <Button onClick={handleSaveEdit}>
              Сохранить и отправить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}