import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { FileText, Eye, MessageSquare, TrendingUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: string;
}

function StatCard({ title, value, icon, change }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className="text-xs text-muted-foreground mt-1">
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export function BlogStats() {
  const stats = [
    {
      title: "Всего постов",
      value: "284",
      icon: <FileText className="h-4 w-4" />,
      change: "+12% с прошлого месяца",
    },
    {
      title: "Просмотры",
      value: "45.2K",
      icon: <Eye className="h-4 w-4" />,
      change: "+20.1% с прошлого месяца",
    },
    {
      title: "Комментарии",
      value: "1,234",
      icon: <MessageSquare className="h-4 w-4" />,
      change: "+8% с прошлого месяца",
    },
    {
      title: "Вовлеченность",
      value: "12.5%",
      icon: <TrendingUp className="h-4 w-4" />,
      change: "+2.5% с прошлого месяца",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
