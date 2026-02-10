import { useHeaderStore } from "@/app/store/header-store";
import { breadcrumbPresets } from "@/app/utils/breadcrumbs-helper";

import { useState, useMemo, useEffect } from "react";
import { cn } from "@/app/components/ui/utils";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
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
  DropdownMenuSeparator,
} from "@/app/components/ui/dropdown-menu";
import {
  Upload,
  Search,
  Grid3x3,
  List,
  FolderOpen,
  Image as ImageIcon,
  Video,
  FileText,
  Music,
  MoreVertical,
  Download,
  Trash2,
  Copy,
  ExternalLink,
  Check,
  X as CloseIcon,
  FileAudio,
  File,
  RefreshCw,
  Archive,
  Clock,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { Label } from "@/app/components/ui/label";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Textarea } from "@/app/components/ui/textarea";
import { Separator } from "@/app/components/ui/separator";
import { MediaPreviewDialog } from "@/app/components/media-preview-dialog";
import { MediaImageWithLoader } from "@/app/components/media-image-with-loader";

type FileType = "image" | "video" | "audio" | "document";
type ViewMode = "grid" | "list";

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

interface Backup {
  id: string;
  date: Date;
  size: number;
  filesCount: number;
  status: "completed" | "in-progress" | "failed";
  type: "auto" | "manual";
}

const PURPOSES = [
  { id: "all", name: "Все файлы", icon: FolderOpen },
  { id: "articles", name: "Статьи", icon: FileText },
  { id: "covers", name: "Обложки", icon: ImageIcon },
  { id: "logos", name: "Логотипы", icon: ImageIcon },
  { id: "ai-audio", name: "AI Аудио", icon: FileAudio },
  { id: "documents", name: "Документы", icon: File },
];

const FILE_TYPES = [
  { id: "all", name: "Все типы", icon: FolderOpen },
  { id: "image", name: "Изображения", icon: ImageIcon },
  { id: "video", name: "Видео", icon: Video },
  { id: "audio", name: "Аудио", icon: Music },
  { id: "document", name: "Документы", icon: FileText },
];

const initialFiles: MediaFile[] = [
  {
    id: "1",
    name: "blog-header-design.jpg",
    type: "image",
    url: "https://images.unsplash.com/photo-1603534477954-ffb7cc4b6a0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9nJTIwYXJ0aWNsZSUyMGhlYWRlcnxlbnwxfHx8fDE3Njk4OTc2ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    size: 2456000,
    uploadedAt: new Date(2024, 1, 15),
    usedIn: 3,
    purposes: ["covers"],
    dimensions: { width: 1920, height: 1080 },
    seo: {
      filename: "blog-header-design-2024",
      alt: "Современный дизайн заголовка блога с яркими цвтами",
      caption: "Креативный дизайн заголовка для статей о технологиях и инновациях",
    },
    exif: {
      dateTaken: "2024-01-10 14:23:00",
      camera: "Canon EOS R5",
      lens: "RF 24-70mm f/2.8L IS USM",
      iso: "400",
      aperture: "f/2.8",
      shutterSpeed: "1/125",
      focalLength: "50mm",
    },
    resizes: [
      {
        name: "Thumbnail",
        width: 150,
        height: 150,
        size: 45000,
        url: "https://images.unsplash.com/photo-1603534477954-ffb7cc4b6a0f?w=150&h=150&fit=crop",
      },
      {
        name: "Small",
        width: 480,
        height: 270,
        size: 180000,
        url: "https://images.unsplash.com/photo-1603534477954-ffb7cc4b6a0f?w=480&h=270&fit=crop",
      },
      {
        name: "Medium",
        width: 1024,
        height: 576,
        size: 520000,
        url: "https://images.unsplash.com/photo-1603534477954-ffb7cc4b6a0f?w=1024&h=576&fit=crop",
      },
      {
        name: "Large",
        width: 1920,
        height: 1080,
        size: 2456000,
        url: "https://images.unsplash.com/photo-1603534477954-ffb7cc4b6a0f?w=1920&h=1080&fit=crop",
      },
    ],
  },
  {
    id: "2",
    name: "tech-workspace.jpg",
    type: "image",
    url: "https://images.unsplash.com/photo-1623715537851-8bc15aa8c145?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwd29ya3NwYWNlfGVufDF8fHx8MTc2OTgwOTc0Mnww&ixlib=rb-4.1.0&q=80&w=1080",
    size: 1850000,
    uploadedAt: new Date(2024, 1, 20),
    usedIn: 5,
    purposes: ["articles"],
    dimensions: { width: 1920, height: 1280 },
    seo: {
      filename: "tech-workspace-modern-office",
      alt: "Современное технологичное рабочее пространство",
      caption: "Рабочее место с современными гаджетами и минималистичным дизайном",
    },
    exif: {
      dateTaken: "2024-01-18 10:15:30",
      camera: "Sony A7 IV",
      lens: "FE 35mm f/1.8",
      iso: "800",
      aperture: "f/1.8",
      shutterSpeed: "1/60",
      focalLength: "35mm",
    },
  },
  {
    id: "3",
    name: "office-setup.jpg",
    type: "image",
    url: "https://images.unsplash.com/photo-1623679116710-78b05d2fe2f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBkZXNrfGVufDF8fHx8MTc2OTg0Mjk5MHww&ixlib=rb-4.1.0&q=80&w=1080",
    size: 3120000,
    uploadedAt: new Date(2024, 1, 22),
    usedIn: 2,
    purposes: ["articles"],
    dimensions: { width: 2400, height: 1600 },
  },
  {
    id: "4",
    name: "abstract-design.jpg",
    type: "image",
    url: "https://images.unsplash.com/photo-1595411425732-e69c1abe2763?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGdlb21ldHJpYyUyMGRlc2lnbnxlbnwxfHx8fDE3Njk4MjI2NzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    size: 1920000,
    uploadedAt: new Date(2024, 1, 18),
    usedIn: 7,
    purposes: ["covers"],
    dimensions: { width: 1920, height: 1080 },
  },
  {
    id: "5",
    name: "mountain-landscape.jpg",
    type: "image",
    url: "https://images.unsplash.com/photo-1597434429739-2574d7e06807?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBsYW5kc2NhcGUlMjBtb3VudGFpbnxlbnwxfHx8fDE3Njk4ODI1NTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    size: 4250000,
    uploadedAt: new Date(2024, 1, 25),
    usedIn: 1,
    purposes: ["covers"],
    dimensions: { width: 3840, height: 2160 },
  },
  {
    id: "6",
    name: "team-meeting.jpg",
    type: "image",
    url: "https://images.unsplash.com/photo-1716703432455-3045789de738?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lZXRpbmclMjB0ZWFtfGVufDF8fHx8MTc2OTg5NzY4OHww&ixlib=rb-4.1.0&q=80&w=1080",
    size: 2890000,
    uploadedAt: new Date(2024, 1, 28),
    usedIn: 4,
    purposes: ["articles"],
    dimensions: { width: 1920, height: 1280 },
  },
  {
    id: "7",
    name: "coffee-minimal.jpg",
    type: "image",
    url: "https://images.unsplash.com/photo-1672707069442-91a5854ce1c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBsaWZlc3R5bGUlMjBtaW5pbWFsfGVufDF8fHx8MTc2OTg5NzY4OHww&ixlib=rb-4.1.0&q=80&w=1080",
    size: 1650000,
    uploadedAt: new Date(2024, 2, 1),
    usedIn: 2,
    purposes: ["articles"],
    dimensions: { width: 1920, height: 1280 },
  },
  {
    id: "8",
    name: "mobile-app.jpg",
    type: "image",
    url: "https://images.unsplash.com/photo-1730817403158-b30479c8d473?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwbW9iaWxlJTIwYXBwfGVufDF8fHx8MTc2OTg5NzY4OHww&ixlib=rb-4.1.0&q=80&w=1080",
    size: 1980000,
    uploadedAt: new Date(2024, 2, 3),
    usedIn: 6,
    purposes: ["articles"],
    dimensions: { width: 1920, height: 1080 },
  },
  {
    id: "9",
    name: "social-media-marketing.jpg",
    type: "image",
    url: "https://images.unsplash.com/photo-1754926981910-ff527608846c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwbWFya2V0aW5nJTIwc29jaWFsfGVufDF8fHx8MTc2OTg5NzY4OHww&ixlib=rb-4.1.0&q=80&w=1080",
    size: 2340000,
    uploadedAt: new Date(2024, 2, 5),
    usedIn: 8,
    purposes: ["covers"],
    dimensions: { width: 1920, height: 1080 },
  },
  {
    id: "10",
    name: "creative-studio.jpg",
    type: "image",
    url: "https://images.unsplash.com/photo-1742440710226-450e3b85c100?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMGRlc2lnbiUyMHN0dWRpb3xlbnwxfHx8fDE3Njk4MjQyNDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    size: 3450000,
    uploadedAt: new Date(2024, 2, 8),
    usedIn: 3,
    purposes: ["articles"],
    dimensions: { width: 2560, height: 1440 },
  },
  {
    id: "11",
    name: "entrepreneur-laptop.jpg",
    type: "image",
    url: "https://images.unsplash.com/photo-1590097521871-03f076644314?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFydHVwJTIwZW50cmVwcmVuZXVyJTIwbGFwdG9wfGVufDF8fHx8MTc2OTg5NzY4OXww&ixlib=rb-4.1.0&q=80&w=1080",
    size: 2120000,
    uploadedAt: new Date(2024, 2, 10),
    usedIn: 5,
    purposes: ["articles"],
    dimensions: { width: 1920, height: 1280 },
  },
  {
    id: "12",
    name: "web-development.jpg",
    type: "image",
    url: "https://images.unsplash.com/photo-1643116774075-acc00caa9a7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWIlMjBkZXZlbG9wbWVudCUyMGNvZGV8ZW58MXx8fHwxNzY5ODMwMDIzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    size: 1780000,
    uploadedAt: new Date(2024, 2, 12),
    usedIn: 9,
    purposes: ["covers", "articles"],
    dimensions: { width: 1920, height: 1080 },
  },
  {
    id: "13",
    name: "article-intro-audio.mp3",
    type: "audio",
    url: "#",
    size: 3450000,
    uploadedAt: new Date(2024, 2, 5),
    usedIn: 1,
    purposes: ["ai-audio"],
    duration: 180,
  },
  {
    id: "14",
    name: "podcast-episode-42.mp3",
    type: "audio",
    url: "#",
    size: 12450000,
    uploadedAt: new Date(2024, 2, 8),
    usedIn: 1,
    purposes: ["ai-audio"],
    duration: 720,
  },
  {
    id: "15",
    name: "tutorial-video.mp4",
    type: "video",
    url: "#",
    size: 45600000,
    uploadedAt: new Date(2024, 2, 10),
    usedIn: 2,
    purposes: ["articles"],
    duration: 240,
  },
  {
    id: "16",
    name: "brand-guidelines.pdf",
    type: "document",
    url: "#",
    size: 8900000,
    uploadedAt: new Date(2024, 1, 12),
    usedIn: 0,
    purposes: ["documents"],
  },
  {
    id: "17",
    name: "content-strategy.docx",
    type: "document",
    url: "#",
    size: 1250000,
    uploadedAt: new Date(2024, 2, 1),
    usedIn: 0,
    purposes: ["documents"],
  },
];

const backupHistory: Backup[] = [
  {
    id: "1",
    date: new Date(2024, 2, 12, 3, 0),
    size: 450000000,
    filesCount: 156,
    status: "completed",
    type: "auto",
  },
  {
    id: "2",
    date: new Date(2024, 2, 11, 3, 0),
    size: 448000000,
    filesCount: 154,
    status: "completed",
    type: "auto",
  },
  {
    id: "3",
    date: new Date(2024, 2, 10, 15, 30),
    size: 446000000,
    filesCount: 152,
    status: "completed",
    type: "manual",
  },
  {
    id: "4",
    date: new Date(2024, 2, 10, 3, 0),
    size: 445000000,
    filesCount: 152,
    status: "completed",
    type: "auto",
  },
  {
    id: "5",
    date: new Date(2024, 2, 9, 3, 0),
    size: 443000000,
    filesCount: 150,
    status: "completed",
    type: "auto",
  },
];

export function MediaSection() {
  const [files, setFiles] = useState<MediaFile[]>(initialFiles);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState("all");
  const [selectedFileType, setSelectedFileType] = useState("all");
  const [previewFile, setPreviewFile] = useState<MediaFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showBackupDialog, setShowBackupDialog] = useState(false);
  const [displayedCount, setDisplayedCount] = useState(12);

  // Header store for breadcrumbs
  const { setBreadcrumbs, reset } = useHeaderStore();

  // Set breadcrumbs
  useEffect(() => {
    setBreadcrumbs(breadcrumbPresets.media());

    return () => reset();
  }, [setBreadcrumbs, reset]);

  const filteredFiles = useMemo(() => {
    let result = files;

    // Filter by search
    if (searchQuery) {
      result = result.filter((file) =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by purpose
    if (selectedFolder !== "all") {
      result = result.filter((file) => file.purposes.includes(selectedFolder));
    }

    // Filter by file type
    if (selectedFileType !== "all") {
      result = result.filter((file) => file.type === selectedFileType);
    }

    return result;
  }, [files, searchQuery, selectedFolder, selectedFileType]);

  const displayedFiles = useMemo(() => {
    return filteredFiles.slice(0, displayedCount);
  }, [filteredFiles, displayedCount]);

  const hasMore = displayedFiles.length < filteredFiles.length;

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const maxStorage = 10 * 1024 * 1024 * 1024; // 10GB
  const storagePercentage = (totalSize / maxStorage) * 100;

  const fileTypeStats = useMemo(() => {
    const stats = { image: 0, video: 0, audio: 0, document: 0 };
    files.forEach((file) => {
      stats[file.type] += file.size;
    });
    return stats;
  }, [files]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleFileSelect = (id: string) => {
    setSelectedFiles((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredFiles.map((f) => f.id));
    }
  };

  const handleDelete = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setSelectedFiles((prev) => prev.filter((f) => f !== id));
    setPreviewFile(null);
  };

  const handleBulkDelete = () => {
    setFiles((prev) => prev.filter((f) => !selectedFiles.includes(f.id)));
    setSelectedFiles([]);
  };

  const handleCopyUrl = (url: string) => {
    // Fallback for environments where Clipboard API is blocked
    const textArea = document.createElement("textarea");
    textArea.value = url;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
      document.execCommand("copy");
      // TODO: Show toast notification
    } catch (err) {
      console.error("Failed to copy:", err);
    } finally {
      document.body.removeChild(textArea);
    }
  };

  const handleSaveFile = (updatedFile: MediaFile) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === updatedFile.id ? updatedFile : f))
    );
    // TODO: Show toast notification
  };

  const handleUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 0;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleBackup = () => {
    // Simulate backup creation
    setShowBackupDialog(false);
    // TODO: Show toast notification
  };

  const getFileIcon = (type: FileType) => {
    switch (type) {
      case "image":
        return ImageIcon;
      case "video":
        return Video;
      case "audio":
        return Music;
      case "document":
        return FileText;
    }
  };

  const lastBackup = backupHistory[0];

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r bg-card flex-shrink-0 flex flex-col">
        <div className="p-4 border-b flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск файлов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4 space-y-6">
            {/* Storage Stats */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Хранилище</span>
                <span className="font-medium">{Math.round(storagePercentage)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all",
                    storagePercentage > 90 ? "bg-destructive" : 
                    storagePercentage > 70 ? "bg-yellow-500" : "bg-primary"
                  )}
                  style={{ width: `${Math.min(storagePercentage, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {formatBytes(totalSize)} из {formatBytes(maxStorage)}
              </p>
            </div>

            <Separator />

            {/* Purpose Filter */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium mb-3">Назначение</h3>
              {PURPOSES.map((purpose) => {
                const Icon = purpose.icon;
                const count = files.filter(f => 
                  purpose.id === 'all' 
                    ? true 
                    : f.purposes.includes(purpose.id)
                ).length;
                const isActive = selectedFolder === purpose.id;

                return (
                  <button
                    key={purpose.id}
                    onClick={() => setSelectedFolder(purpose.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                      isActive
                        ? "bg-accent text-accent-foreground font-medium"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                    )}
                  >
                    <Icon className="size-4 flex-shrink-0" />
                    <span className="flex-1 text-left">{purpose.name}</span>
                    {purpose.id !== 'all' && (
                      <span className={cn(
                        "text-xs px-1.5 py-0.5 rounded",
                        isActive ? "bg-background/50" : "bg-muted"
                      )}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <Separator />

            {/* File Type Filter */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium mb-3">Тип файла</h3>
              {FILE_TYPES.map((type) => {
                const Icon = type.icon;
                const count = files.filter(f => 
                  type.id === 'all' 
                    ? true 
                    : f.type === type.id
                ).length;
                const isActive = selectedFileType === type.id;

                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedFileType(type.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                      isActive
                        ? "bg-accent text-accent-foreground font-medium"
                        : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                    )}
                  >
                    <Icon className="size-4 flex-shrink-0" />
                    <span className="flex-1 text-left">{type.name}</span>
                    {type.id !== 'all' && (
                      <span className={cn(
                        "text-xs px-1.5 py-0.5 rounded",
                        isActive ? "bg-background/50" : "bg-muted"
                      )}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <Separator />

            {/* Backup Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Резервные копии</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowBackupDialog(true)}
                  className="h-7 text-xs"
                >
                  <Archive className="size-3 mr-1" />
                  Создать
                </Button>
              </div>
              {lastBackup && (
                <div className="p-3 rounded-lg border bg-muted/30 space-y-1">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "size-2 rounded-full",
                      lastBackup.status === 'completed' ? "bg-green-500" :
                      lastBackup.status === 'in-progress' ? "bg-yellow-500" : "bg-red-500"
                    )} />
                    <span className="text-xs font-medium">
                      {lastBackup.type === 'auto' ? 'Авто' : 'Ручной'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatBytes(lastBackup.size)} • {lastBackup.filesCount} файлов
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <Clock className="size-3 inline mr-1" />
                    {lastBackup.date.toLocaleDateString('ru-RU', { 
                      day: 'numeric', 
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* Header */}
        <div className="p-4 lg:p-6 border-b space-y-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Медиатека</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {filteredFiles.length} файлов • {formatBytes(totalSize)} использовано
              </p>
            </div>
            <Button onClick={handleUpload}>
              <Upload className="h-4 w-4 mr-2" />
              Загрузить
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {Object.entries(fileTypeStats).map(([type, size]) => {
              const Icon = getFileIcon(type as FileType);
              const typeNames: Record<string, string> = {
                image: 'Изображения',
                video: 'Видео',
                audio: 'Аудио',
                document: 'Документы'
              };
              return (
                <div key={type} className="p-3 border rounded-lg bg-card">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Icon className="h-4 w-4" />
                    <span className="text-xs font-medium">{typeNames[type]}</span>
                  </div>
                  <p className="text-lg font-semibold">{formatBytes(size)}</p>
                </div>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {selectedFiles.length > 0 && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleBulkDelete}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Удалить ({selectedFiles.length})
                </Button>
                <div className="h-4 w-px bg-border" />
              </>
            )}

            <Button
              size="sm"
              variant="outline"
              onClick={handleSelectAll}
            >
              {selectedFiles.length === filteredFiles.length
                ? "Снять все"
                : "Выбрать все"}
            </Button>

            <div className="flex-1" />

            <div className="flex items-center gap-1 border rounded-lg p-1">
              <Button
                size="sm"
                variant={viewMode === "grid" ? "default" : "ghost"}
                onClick={() => setViewMode("grid")}
                className="h-7 w-7 p-0"
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === "list" ? "default" : "ghost"}
                onClick={() => setViewMode("list")}
                className="h-7 w-7 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="px-4 lg:px-6 py-3 border-b bg-muted/30 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Загрузка файлов...</span>
                  <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsUploading(false)}
              >
                <CloseIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Files Display */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4 lg:p-6 space-y-6">
            {viewMode === "grid" ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 lg:gap-4">
                {displayedFiles.map((file) => {
                  const Icon = getFileIcon(file.type);
                  const isSelected = selectedFiles.includes(file.id);

                  return (
                    <div
                      key={file.id}
                      className={cn(
                        "group relative border rounded-lg overflow-hidden bg-card transition-all cursor-pointer hover:shadow-md",
                        isSelected && "ring-2 ring-primary"
                      )}
                      onClick={() => setPreviewFile(file)}
                    >
                      {/* Selection Checkbox */}
                      <div
                        className="absolute top-2 left-2 z-10"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => handleFileSelect(file.id)}
                          className={cn(
                            "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                            isSelected
                              ? "bg-primary border-primary"
                              : "bg-background/80 border-muted-foreground/50 opacity-0 group-hover:opacity-100"
                          )}
                        >
                          {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                        </button>
                      </div>

                      {/* Thumbnail */}
                      <div className={cn(
                        "aspect-square bg-muted flex items-center justify-center relative overflow-hidden transition-opacity",
                        isSelected && "opacity-60"
                      )}>
                        {file.type === "image" ? (
                          <MediaImageWithLoader
                            src={file.url}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Icon className="h-12 w-12 lg:h-16 lg:w-16 text-muted-foreground" />
                        )}

                        {(file.type === "video" || file.type === "audio") && file.duration && (
                          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 text-white text-xs rounded">
                            {formatDuration(file.duration)}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-2 lg:p-3">
                        <p className="text-xs lg:text-sm font-medium truncate" title={file.name}>
                          {file.name}
                        </p>
                        <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                          <span>{formatBytes(file.size)}</span>
                          {file.usedIn > 0 && (
                            <Badge variant="secondary" className="text-xs px-1.5 py-0">
                              {file.usedIn}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-7 w-7 bg-background/80 backdrop-blur-sm"
                            >
                              <MoreVertical className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleCopyUrl(file.url)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Копировать URL
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Скачать
                            </DropdownMenuItem>
                            {file.type === "image" && (
                              <DropdownMenuItem>
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Открыть в новой вкладке
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDelete(file.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Удалить
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })}
                </div>

                {/* Load More */}
                {hasMore && (
                  <div className="flex justify-center pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setDisplayedCount(prev => prev + 12)}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Загрузить ещё
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-2">
                {displayedFiles.map((file) => {
                  const Icon = getFileIcon(file.type);
                  const isSelected = selectedFiles.includes(file.id);

                  return (
                    <div
                      key={file.id}
                      className={cn(
                        "group flex items-center gap-4 p-3 border rounded-lg bg-card transition-all cursor-pointer hover:shadow-sm",
                        isSelected && "ring-2 ring-primary"
                      )}
                      onClick={() => setPreviewFile(file)}
                    >
                      {/* Selection Checkbox */}
                      <div onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleFileSelect(file.id)}
                          className={cn(
                            "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                            isSelected
                              ? "bg-primary border-primary"
                              : "bg-background border-muted-foreground/50"
                          )}
                        >
                          {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                        </button>
                      </div>

                      {/* Thumbnail */}
                      <div className="w-16 h-16 bg-muted rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {file.type === "image" ? (
                          <MediaImageWithLoader
                            src={file.url}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Icon className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{file.name}</p>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <span>{formatBytes(file.size)}</span>
                          <span>•</span>
                          <span>{file.uploadedAt.toLocaleDateString('ru-RU')}</span>
                          {file.usedIn > 0 && (
                            <>
                              <span>•</span>
                              <span>Использован: {file.usedIn}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleCopyUrl(file.url)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Копировать URL
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Скачать
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => handleDelete(file.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Удалить
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  );
                })}

                {/* Load More */}
                {hasMore && (
                  <div className="flex justify-center pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setDisplayedCount(prev => prev + 12)}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Загрузить ещё
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Preview Dialog */}
      {previewFile && (
        <MediaPreviewDialog
          file={previewFile}
          onClose={() => setPreviewFile(null)}
          onDelete={handleDelete}
          onSave={handleSaveFile}
        />
      )}

      {/* Backup Dialog */}
      <Dialog open={showBackupDialog} onOpenChange={setShowBackupDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Создать резервную копию</DialogTitle>
            <DialogDescription>
              Будет создана резервная копия всех медиафайлов ({files.length} файлов, {formatBytes(totalSize)})
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-3">
              <div className="p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Последняя копия</span>
                  <Badge variant="secondary">{lastBackup.type === 'auto' ? 'Авто' : 'Ручной'}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {lastBackup.date.toLocaleDateString('ru-RU', { 
                    day: 'numeric', 
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatBytes(lastBackup.size)} • {lastBackup.filesCount} файлов
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBackupDialog(false)}>
              Отмена
            </Button>
            <Button onClick={handleBackup}>
              <Archive className="h-4 w-4 mr-2" />
              Создать копию
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
