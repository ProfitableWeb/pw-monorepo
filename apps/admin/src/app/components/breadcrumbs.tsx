import { ChevronRight, ChevronDown } from "lucide-react";
import { BreadcrumbItem } from "@/app/store/header-store";
import { cn } from "@/app/components/ui/utils";
import { EditorialDropdown } from "@/app/components/editorial-dropdown";
import { ContentDropdown } from "@/app/components/content-dropdown";
import { SystemDropdown } from "@/app/components/system-dropdown";
import { useNavigationStore } from "@/app/store/navigation-store";

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const { navigateTo } = useNavigationStore();

  const handleBreadcrumbClick = (href?: string) => {
    if (href) {
      navigateTo(href as any);
    }
  };

  return (
    <nav className={cn("flex items-center gap-1.5 text-sm", className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const Icon = item.icon;
        
        // Специальная обработка для "Редакция" и "Контент"
        const isEditorialSection = item.label === 'Редакция';
        const isContentSection = item.label === 'Контент';
        const isSystemSection = item.label === 'Система';
        
        return (
          <div key={index} className="flex items-center gap-1.5">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            
            {isEditorialSection && !isLast ? (
              <EditorialDropdown onNavigate={handleBreadcrumbClick}>
                <button
                  onClick={() => handleBreadcrumbClick('editorial-hub')}
                  className={cn(
                    "flex items-center gap-1 transition-colors hover:text-foreground",
                    "text-muted-foreground"
                  )}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{item.label}</span>
                  <ChevronDown className="h-3 w-3 opacity-60" />
                </button>
              </EditorialDropdown>
            ) : isContentSection && !isLast ? (
              <ContentDropdown onNavigate={handleBreadcrumbClick}>
                <button
                  onClick={() => handleBreadcrumbClick('content-hub')}
                  className={cn(
                    "flex items-center gap-1 transition-colors hover:text-foreground",
                    "text-muted-foreground"
                  )}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{item.label}</span>
                  <ChevronDown className="h-3 w-3 opacity-60" />
                </button>
              </ContentDropdown>
            ) : isSystemSection && !isLast ? (
              <SystemDropdown onNavigate={handleBreadcrumbClick}>
                <button
                  onClick={() => handleBreadcrumbClick('system-hub')}
                  className={cn(
                    "flex items-center gap-1 transition-colors hover:text-foreground",
                    "text-muted-foreground"
                  )}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{item.label}</span>
                  <ChevronDown className="h-3 w-3 opacity-60" />
                </button>
              </SystemDropdown>
            ) : item.href || item.onClick ? (
              <button
                onClick={() => {
                  item.onClick?.();
                  handleBreadcrumbClick(item.href);
                }}
                className={cn(
                  "flex items-center gap-1.5 transition-colors hover:text-foreground",
                  isLast 
                    ? "text-foreground font-medium" 
                    : "text-muted-foreground"
                )}
              >
                {Icon && <Icon className="h-4 w-4" />}
                <span>{item.label}</span>
              </button>
            ) : (
              <div
                className={cn(
                  "flex items-center gap-1.5",
                  isLast 
                    ? "text-foreground font-semibold" 
                    : "text-muted-foreground"
                )}
              >
                {Icon && <Icon className="h-4 w-4" />}
                <span>{item.label}</span>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}