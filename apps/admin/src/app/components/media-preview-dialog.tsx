import { useState, useEffect } from "react";
import { cn } from "@/app/components/ui/utils";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";
import { Separator } from "@/app/components/ui/separator";
import { Badge } from "@/app/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { MediaImageWithLoader } from "@/app/components/media-image-with-loader";
import {
  Download,
  Trash2,
  Copy,
  Upload,
  Save,
  Camera,
  Image as ImageIcon,
} from "lucide-react";

type FileType = "image" | "video" | "audio" | "document";

interface MediaFile {
  id: string;
  name: string;
  type: FileType;
  url: string;
  size: number;
  uploadedAt: Date;
  usedIn: number;
  purposes: string[];
  thumbnail?: string;
  dimensions?: { width: number; height: number };
  duration?: number;
  seo?: {
    filename: string;
    alt: string;
    caption: string;
  };
  exif?: {
    dateTaken?: string;
    camera?: string;
    lens?: string;
    iso?: string;
    aperture?: string;
    shutterSpeed?: string;
    focalLength?: string;
  };
  resizes?: Array<{
    name: string;
    width: number;
    height: number;
    size: number;
    url: string;
  }>;
}

interface MediaPreviewDialogProps {
  file: MediaFile | null;
  open: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
  onSave: (file: MediaFile) => void;
  formatBytes: (bytes: number) => string;
  formatDuration: (seconds: number) => string;
  getFileIcon: (type: FileType) => any;
  handleCopyUrl: (url: string) => void;
}

export function MediaPreviewDialog({
  file,
  open,
  onClose,
  onDelete,
  onSave,
  formatBytes,
  formatDuration,
  getFileIcon,
  handleCopyUrl,
}: MediaPreviewDialogProps) {
  const [editedFile, setEditedFile] = useState<MediaFile | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (file) {
      setEditedFile({ ...file });
      setHasChanges(false);
    }
  }, [file]);

  const handleFieldChange = (
    section: "seo" | "exif",
    field: string,
    value: string
  ) => {
    if (!editedFile) return;

    setEditedFile({
      ...editedFile,
      [section]: {
        ...editedFile[section],
        [field]: value,
      },
    });
    setHasChanges(true);
  };

  const handleSave = () => {
    if (editedFile) {
      onSave(editedFile);
      setHasChanges(false);
    }
  };

  const handleReplaceFile = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept =
      file?.type === "image"
        ? "image/*"
        : file?.type === "video"
        ? "video/*"
        : file?.type === "audio"
        ? "audio/*"
        : "*/*";
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        console.log("New file selected:", target.files[0]);
        // TODO: Upload new file and update editedFile
      }
    };
    input.click();
  };

  if (!editedFile) return null;

  const Icon = getFileIcon(editedFile.type);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[1400px] h-[90vh] p-0 gap-0 flex flex-col">
        {/* Fixed Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            {editedFile.name}
            {hasChanges && (
              <span className="text-xs text-muted-foreground">(изменено)</span>
            )}
          </DialogTitle>
          <DialogDescription>
            Редактирование SEO параметров, EXIF данных и замена файла
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Left Column - Preview */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">Предпросмотр</h3>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleReplaceFile}
                      >
                        <Upload className="h-3.5 w-3.5 mr-1.5" />
                        Заменить файл
                      </Button>
                    </div>
                    <div className="rounded-lg border overflow-hidden bg-muted/30 max-h-[500px] flex items-center justify-center">
                      {editedFile.type === "image" ? (
                        <MediaImageWithLoader
                          src={editedFile.url}
                          alt={editedFile.seo?.alt || editedFile.name}
                          className="w-full h-auto max-h-[500px] object-contain"
                        />
                      ) : (
                        <div className="aspect-video flex items-center justify-center">
                          <Icon className="h-24 w-24 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* URL */}
                  <div>
                    <Label className="text-xs text-muted-foreground mb-2 block">
                      URL файла
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        value={editedFile.url}
                        readOnly
                        className="text-sm font-mono"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyUrl(editedFile.url)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Image Resizes */}
                  {editedFile.resizes && editedFile.resizes.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-3 flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        Доступные размеры
                      </h3>
                      <div className="space-y-2">
                        {editedFile.resizes.map((resize, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors"
                          >
                            <div>
                              <p className="font-medium text-sm">
                                {resize.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {resize.width} × {resize.height}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-muted-foreground">
                                {formatBytes(resize.size)}
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleCopyUrl(resize.url)}
                              >
                                <Copy className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* File Info */}
                  <div>
                    <h3 className="font-medium mb-3">Информация о файле</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 border rounded-lg bg-card">
                        <Label className="text-xs text-muted-foreground">
                          Размер
                        </Label>
                        <p className="text-sm font-medium mt-1">
                          {formatBytes(editedFile.size)}
                        </p>
                      </div>
                      <div className="p-3 border rounded-lg bg-card">
                        <Label className="text-xs text-muted-foreground">
                          Назначения
                        </Label>
                        <p className="text-sm font-medium mt-1 capitalize">
                          {editedFile.purposes && editedFile.purposes.length > 0
                            ? editedFile.purposes.join(", ")
                            : "—"}
                        </p>
                      </div>
                      {editedFile.dimensions && (
                        <div className="p-3 border rounded-lg bg-card">
                          <Label className="text-xs text-muted-foreground">
                            Разрешение
                          </Label>
                          <p className="text-sm font-medium mt-1">
                            {editedFile.dimensions.width} ×{" "}
                            {editedFile.dimensions.height}
                          </p>
                        </div>
                      )}
                      {editedFile.duration && (
                        <div className="p-3 border rounded-lg bg-card">
                          <Label className="text-xs text-muted-foreground">
                            Длительность
                          </Label>
                          <p className="text-sm font-medium mt-1">
                            {formatDuration(editedFile.duration)}
                          </p>
                        </div>
                      )}
                      <div className="p-3 border rounded-lg bg-card">
                        <Label className="text-xs text-muted-foreground">
                          Загружен
                        </Label>
                        <p className="text-sm font-medium mt-1">
                          {editedFile.uploadedAt.toLocaleDateString("ru-RU")}
                        </p>
                      </div>
                      <div className="p-3 border rounded-lg bg-card">
                        <Label className="text-xs text-muted-foreground">
                          Использований
                        </Label>
                        <p className="text-sm font-medium mt-1">
                          {editedFile.usedIn}{" "}
                          {editedFile.usedIn === 1 ? "статья" : "статей"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Parameters */}
                <div className="space-y-6">
                  {/* SEO Parameters */}
                  <div>
                    <h3 className="font-medium mb-3">SEO параметры</h3>
                    <div className="space-y-4">
                      <div>
                        <Label
                          htmlFor="seo-filename"
                          className="text-sm font-medium"
                        >
                          Название файла
                        </Label>
                        <Input
                          id="seo-filename"
                          value={editedFile.seo?.filename || ""}
                          onChange={(e) =>
                            handleFieldChange("seo", "filename", e.target.value)
                          }
                          placeholder="blog-header-design-2024"
                          className="mt-1.5"
                        />
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-muted-foreground/60">
                            Используется в URL и поиске
                          </p>
                          <p className="text-xs text-muted-foreground/60">
                            <span
                              className={cn(
                                (editedFile.seo?.filename || "").length > 60 &&
                                  "text-red-500 font-medium"
                              )}
                            >
                              {(editedFile.seo?.filename || "").length}
                            </span>
                            /60
                          </p>
                        </div>
                      </div>

                      <div>
                        <Label
                          htmlFor="seo-alt"
                          className="text-sm font-medium"
                        >
                          Alt текст
                        </Label>
                        <Input
                          id="seo-alt"
                          value={editedFile.seo?.alt || ""}
                          onChange={(e) =>
                            handleFieldChange("seo", "alt", e.target.value)
                          }
                          placeholder="Описание изображения для доступности"
                          className="mt-1.5"
                        />
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-muted-foreground/60">
                            Важно для SEO и доступности
                          </p>
                          <p className="text-xs text-muted-foreground/60">
                            <span
                              className={cn(
                                (editedFile.seo?.alt || "").length > 125 &&
                                  "text-red-500 font-medium"
                              )}
                            >
                              {(editedFile.seo?.alt || "").length}
                            </span>
                            /125
                          </p>
                        </div>
                      </div>

                      <div>
                        <Label
                          htmlFor="seo-caption"
                          className="text-sm font-medium"
                        >
                          Caption (подпись)
                        </Label>
                        <Textarea
                          id="seo-caption"
                          value={editedFile.seo?.caption || ""}
                          onChange={(e) =>
                            handleFieldChange("seo", "caption", e.target.value)
                          }
                          placeholder="Подробное описание изображения"
                          className="mt-1.5 min-h-[100px]"
                        />
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-muted-foreground/60">
                            тображается под изображением в статьях
                          </p>
                          <p className="text-xs text-muted-foreground/60">
                            <span
                              className={cn(
                                (editedFile.seo?.caption || "").length > 250 &&
                                  "text-red-500 font-medium"
                              )}
                            >
                              {(editedFile.seo?.caption || "").length}
                            </span>
                            /250
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* EXIF Data (only for images) */}
                  {editedFile.type === "image" && (
                    <>
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Camera className="h-4 w-4" />
                          <h3 className="font-medium">EXIF метаданные</h3>
                        </div>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label
                                htmlFor="exif-date"
                                className="text-sm font-medium"
                              >
                                Дата съёмки
                              </Label>
                              <Input
                                id="exif-date"
                                value={editedFile.exif?.dateTaken || ""}
                                onChange={(e) =>
                                  handleFieldChange(
                                    "exif",
                                    "dateTaken",
                                    e.target.value
                                  )
                                }
                                placeholder="2024-01-10 14:23:00"
                                className="mt-1.5"
                              />
                            </div>

                            <div>
                              <Label
                                htmlFor="exif-camera"
                                className="text-sm font-medium"
                              >
                                Камера
                              </Label>
                              <Input
                                id="exif-camera"
                                value={editedFile.exif?.camera || ""}
                                onChange={(e) =>
                                  handleFieldChange(
                                    "exif",
                                    "camera",
                                    e.target.value
                                  )
                                }
                                placeholder="Canon EOS R5"
                                className="mt-1.5"
                              />
                            </div>
                          </div>

                          <div>
                            <Label
                              htmlFor="exif-lens"
                              className="text-sm font-medium"
                            >
                              Объектив
                            </Label>
                            <Input
                              id="exif-lens"
                              value={editedFile.exif?.lens || ""}
                              onChange={(e) =>
                                handleFieldChange("exif", "lens", e.target.value)
                              }
                              placeholder="RF 24-70mm f/2.8L IS USM"
                              className="mt-1.5"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label
                                htmlFor="exif-iso"
                                className="text-sm font-medium"
                              >
                                ISO
                              </Label>
                              <Input
                                id="exif-iso"
                                value={editedFile.exif?.iso || ""}
                                onChange={(e) =>
                                  handleFieldChange("exif", "iso", e.target.value)
                                }
                                placeholder="400"
                                className="mt-1.5"
                              />
                            </div>

                            <div>
                              <Label
                                htmlFor="exif-aperture"
                                className="text-sm font-medium"
                              >
                                Диафрагма
                              </Label>
                              <Input
                                id="exif-aperture"
                                value={editedFile.exif?.aperture || ""}
                                onChange={(e) =>
                                  handleFieldChange(
                                    "exif",
                                    "aperture",
                                    e.target.value
                                  )
                                }
                                placeholder="f/2.8"
                                className="mt-1.5"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label
                                htmlFor="exif-shutter"
                                className="text-sm font-medium"
                              >
                                Выдержка
                              </Label>
                              <Input
                                id="exif-shutter"
                                value={editedFile.exif?.shutterSpeed || ""}
                                onChange={(e) =>
                                  handleFieldChange(
                                    "exif",
                                    "shutterSpeed",
                                    e.target.value
                                  )
                                }
                                placeholder="1/125"
                                className="mt-1.5"
                              />
                            </div>

                            <div>
                              <Label
                                htmlFor="exif-focal"
                                className="text-sm font-medium"
                              >
                                Фокусное расстояние
                              </Label>
                              <Input
                                id="exif-focal"
                                value={editedFile.exif?.focalLength || ""}
                                onChange={(e) =>
                                  handleFieldChange(
                                    "exif",
                                    "focalLength",
                                    e.target.value
                                  )
                                }
                                placeholder="50mm"
                                className="mt-1.5"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Fixed Footer */}
        <DialogFooter className="px-6 py-4 border-t flex-row justify-between gap-2">
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Скачать
            </Button>
          </div>
          <div className="flex gap-2">
            {hasChanges && (
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Сохранить изменения
              </Button>
            )}
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(editedFile.id);
                onClose();
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Удалить
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}