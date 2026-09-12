import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { cn } from "../../lib/utils";

import { LeafletMap } from "../../components/ui/LeafletMap";

interface Issue {
  id: string;
  title: string;
  address: string;
  location_lat?: number;
  location_lng?: number;
  status: string;
  priority: string;
  ai_category?: string;
  created_at: string;
  updated_at: string;
}

const StatCard = ({
  title,
  value,
  change,
  isPositive,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  change: number;
  isPositive: boolean;
  icon: any;
}) => (
  <div className="card-elevated p-6 flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-muted-foreground">{title}</span>
      <div className="p-2 bg-primary/10 rounded-lg">
        <Icon className="w-5 h-5 text-primary" />
      </div>
    </div>
    <div>
      <h3 className="text-3xl font-bold text-foreground">{value}</h3>
      <div className="flex items-center gap-1 mt-1">
        <span
          className={cn(
            "inline-flex items-center text-xs font-medium",
            isPositive ? "text-primary" : "text-destructive",
          )}
        >
          {isPositive ? (
            <ArrowUpRight className="w-3 h-3" />
          ) : (
            <ArrowDownRight className="w-3 h-3" />
          )}
          {change}%
        </span>
        <span className="text-xs text-muted-foreground ml-1">
          vs last month
        </span>
      </div>
    </div>
  </div>
);

export default function MasterDashboard() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data: issuesData } = await supabase.from("issues").select("*");
      if (issuesData) setIssues(issuesData);

      setLoading(false);
    }
    fetchData();
  }, []);

  // Compute stats
  const activeIssues = issues.filter((i) => i.status !== "resolved").length;
  const resolvedIssues = issues.filter((i) => i.status === "resolved").length;
  const avgResolutionTime = issues.length > 0 ? "2.4 days" : "0 days"; // Mocking time calculation for now

  // Process data for charts
  const monthlyDataDict = issues.reduce((acc: Record<string, any>, issue) => {
    const month = new Date(issue.created_at).toLocaleString("default", {
      month: "short",
    });
    if (!acc[month]) acc[month] = { name: month, issues: 0, resolved: 0 };
    acc[month].issues += 1;
    if (issue.status === "resolved") acc[month].resolved += 1;
    return acc;
  }, {});
  const chartData = Object.values(monthlyDataDict);
  if (chartData.length === 0)
    chartData.push({ name: "This Month", issues: 0, resolved: 0 });

  const categoryDataDict = issues.reduce((acc: Record<string, any>, issue) => {
    const cat = issue.ai_category || "Unclassified";
    if (!acc[cat]) acc[cat] = { name: cat, total: 0, resolved: 0 };
    acc[cat].total += 1;
    if (issue.status === "resolved") acc[cat].resolved += 1;
    return acc;
  }, {});
  const categoryData = Object.values(categoryDataDict);
  if (categoryData.length === 0)
    categoryData.push({ name: "None", total: 0, resolved: 0 });

  if (loading) {
    return (
      <div className="p-8 text-muted-foreground animate-pulse text-center">
        Loading Analytics...
      </div>
    );
  }
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Analytics Overview
          </h1>
          <p className="text-sm text-muted-foreground">
            Monitor platform activity and issue resolution rates.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Filters placeholder */}
          <select className="bg-background border border-input rounded-md px-3 py-1.5 text-sm">
            <option>Last 30 Days</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Active Issues"
          value={activeIssues.toLocaleString()}
          change={4.2}
          isPositive={false}
          icon={AlertCircle}
        />
        <StatCard
          title="Resolved Issues"
          value={resolvedIssues.toLocaleString()}
          change={22.8}
          isPositive={true}
          icon={CheckCircle2}
        />
        <StatCard
          title="Avg Resolution Time"
          value={avgResolutionTime}
          change={8.1}
          isPositive={true}
          icon={Clock}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Issue Trends */}
        <div className="card-elevated p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-lg">Issue Resolution Trends</h3>
            <p className="text-sm text-muted-foreground">
              New vs Resolved issues over time
            </p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="colorResolved"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient id="colorIssues" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--destructive))"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--destructive))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  itemStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Area
                  type="monotone"
                  dataKey="resolved"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#colorResolved)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="issues"
                  stroke="hsl(var(--destructive))"
                  fillOpacity={1}
                  fill="url(#colorIssues)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Municipality Performance */}
        <div className="card-elevated p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-lg">Region Performance</h3>
            <p className="text-sm text-muted-foreground">
              Top performing municipalities
            </p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  cursor={{ fill: "hsl(var(--muted))" }}
                />
                <Bar
                  dataKey="resolved"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Live Map */}
      <div className="card-elevated p-6 mt-6">
        <div className="mb-6">
          <h3 className="font-semibold text-lg">Live Issue Map</h3>
          <p className="text-sm text-muted-foreground">
            Geotagged civic issues across the region
          </p>
        </div>
        <div className="h-[400px] w-full rounded-xl overflow-hidden z-0 relative">
          <LeafletMap
            center={[26.8467, 80.9462]}
            zoom={11}
            markers={issues
              .filter((i) => i.location_lat && i.location_lng)
              .map((issue: Issue) => ({
                id: issue.id,
                lat: issue.location_lat!,
                lng: issue.location_lng!,
                popupContent: `
                  <strong style="color: hsl(var(--primary))">${issue.title}</strong><br/>
                  <span style="font-size: 0.75rem; color: #666;">${issue.address}</span><br/><br/>
                  <div style="font-size: 0.875rem;">
                    Status: <span style="text-transform: capitalize; font-weight: 600;">${issue.status.replace("_", " ")}</span><br/>
                    AI Category: ${issue.ai_category || "Unknown"}
                  </div>
                `,
              }))}
          />
        </div>
      </div>
    </div>
  );
}
