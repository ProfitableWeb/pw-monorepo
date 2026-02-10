import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { useTheme } from "next-themes";

const data = [
  { name: "Янв", views: 4000, posts: 24 },
  { name: "Фев", views: 3000, posts: 18 },
  { name: "Мар", views: 5000, posts: 32 },
  { name: "Апр", views: 4500, posts: 28 },
  { name: "Май", views: 6000, posts: 35 },
  { name: "Июн", views: 5500, posts: 30 },
  { name: "Июл", views: 7000, posts: 42 },
];

export function AnalyticsChart() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const axisColor = isDark ? "#a1a1aa" : "#71717a";
  const textColor = isDark ? "#e4e4e7" : "#18181b";
  const gridColor = isDark ? "#27272a" : "#e4e4e7";
  const lineColor = isDark ? "#a1a1aa" : "#18181b";
  const dotColor = isDark ? "#d4d4d8" : "#18181b";
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Аналитика</CardTitle>
        <CardDescription>Просмотры за последние 7 месяцев</CardDescription>
      </CardHeader>
      <CardContent className="pt-2 bg-[rgba(255,255,255,0)]">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis 
              dataKey="name" 
              className="text-xs"
              stroke={axisColor}
              tick={{ fill: textColor }}
            />
            <YAxis 
              className="text-xs"
              stroke={axisColor}
              tick={{ fill: textColor }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: isDark ? "#18181b" : "#ffffff",
                border: `1px solid ${gridColor}`,
                borderRadius: "8px",
                color: textColor,
              }}
              labelStyle={{ color: textColor }}
              itemStyle={{ color: textColor }}
            />
            <Line 
              type="monotone" 
              dataKey="views" 
              stroke={lineColor}
              strokeWidth={2}
              dot={{ fill: dotColor, stroke: dotColor, r: 4 }}
              activeDot={{ r: 6, fill: dotColor }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}