import { BlogStats } from "@/app/components/blog-stats";
import { AnalyticsChart } from "@/app/components/analytics-chart";
import { PostsTable } from "@/app/components/posts-table";
import { QuickActions } from "@/app/components/quick-actions";

export function DashboardSection() {
  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <BlogStats />

      {/* Charts and Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AnalyticsChart />
        </div>
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
      </div>

      {/* Posts Table */}
      <PostsTable />
    </div>
  );
}
