import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  Users,
  FileCheck,
  MapPin,
  Download,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabaseClient";

interface IssueData {
  id: string;
  status: string;
  reporter_id: string;
  updated_at: string;
  created_at: string;
  ai_category?: string;
  assigned_municipality_id?: string;
}

interface MunicipalityData {
  id: string;
  name: string;
}

interface CityStats {
  city: string;
  issues: number;
  resolved: number;
  score: number;
  rank?: number;
}

interface CategoryStat {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

const CACHE_COLORS = [
  "bg-emerald-500",
  "bg-blue-500",
  "bg-amber-500",
  "bg-cyan-500",
  "bg-purple-500",
  "bg-rose-500",
];

const Impact = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: "0",
    resolved: "0",
    activeCitizens: "0",
    avgTime: "0 days",
  });
  const [funnel, setFunnel] = useState({
    reported: "0",
    underReview: "0",
    inProgress: "0",
    resolved: "0",
  });
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryStat[]>(
    [],
  );
  const [topCities, setTopCities] = useState<CityStats[]>([]);

  useEffect(() => {
    async function fetchImpactData() {
      try {
        const { data: issues } = await supabase.from("issues").select("*");
        const { data: municipalities } = await supabase
          .from("municipalities")
          .select("*");

        if (!issues) return;

        // Funnel & Stats
        const reported = issues.length;
        const underReview = issues.filter(
          (i: IssueData) => i.status === "open",
        ).length;
        const inProgress = issues.filter(
          (i: IssueData) => i.status === "in_progress",
        ).length;
        const resolved = issues.filter(
          (i: IssueData) => i.status === "resolved",
        ).length;

        const citizens = new Set(issues.map((i: IssueData) => i.reporter_id))
          .size;

        let totalTime = 0;
        let resolvedCount = 0;
        issues.forEach((i: IssueData) => {
          if (i.status === "resolved" && i.updated_at && i.created_at) {
            const t1 = new Date(i.created_at).getTime();
            const t2 = new Date(i.updated_at).getTime();
            if (t2 > t1) {
              totalTime += t2 - t1;
              resolvedCount++;
            }
          }
        });
        const avgDays =
          resolvedCount > 0
            ? (totalTime / resolvedCount / (1000 * 3600 * 24)).toFixed(1) +
              " days"
            : "0 days";

        setStats({
          total: reported.toLocaleString(),
          resolved: resolved.toLocaleString(),
          activeCitizens: citizens.toLocaleString(),
          avgTime: avgDays,
        });

        setFunnel({
          reported: reported.toLocaleString(),
          underReview: underReview.toLocaleString(),
          inProgress: inProgress.toLocaleString(),
          resolved: resolved.toLocaleString(),
        });

        // Categories Map
        const catMap = new Map<string, number>();
        issues.forEach((i: IssueData) => {
          const c = i.ai_category || "Other";
          catMap.set(c, (catMap.get(c) || 0) + 1);
        });
        const catArray = Array.from(catMap.entries())
          .map(([name, count], idx) => ({
            name,
            count: Number(count),
            percentage:
              reported > 0 ? Math.round((Number(count) / reported) * 100) : 0,
            color: CACHE_COLORS[idx % CACHE_COLORS.length],
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        setCategoryBreakdown(catArray);

        // Cities
        if (municipalities) {
          const cityMap = new Map<string, CityStats>();
          municipalities.forEach((m: MunicipalityData) => {
            cityMap.set(m.id, {
              city: m.name,
              issues: 0,
              resolved: 0,
              score: 0,
            });
          });

          issues.forEach((i: IssueData) => {
            if (
              i.assigned_municipality_id &&
              cityMap.has(i.assigned_municipality_id)
            ) {
              const c = cityMap.get(i.assigned_municipality_id)!;
              c.issues++;
              if (i.status === "resolved") c.resolved++;
            }
          });

          const cityArray = Array.from(cityMap.values())
            .map((c: CityStats) => {
              const rate = c.issues > 0 ? (c.resolved / c.issues) * 100 : 0;
              c.score = Math.round(rate * 0.8 + Math.min(c.issues, 100) * 0.2);
              return c;
            })
            .sort((a: CityStats, b: CityStats) => b.score - a.score)
            .map((c: CityStats, idx: number) => ({ ...c, rank: idx + 1 }));

          setTopCities(cityArray.length > 0 ? cityArray.slice(0, 10) : []);
        }
      } catch (err) {
        console.error("Failed fetching impact stats:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchImpactData();
  }, []);

  const impactHighlights = [
    { label: "Total Issues Reported", value: stats.total, trend: "Real-time" },
    { label: "Issues Resolved", value: stats.resolved, trend: "Real-time" },
    {
      label: "Average Resolution Time",
      value: stats.avgTime,
      trend: "Real-time",
    },
    {
      label: "Active Citizens (Reporters)",
      value: stats.activeCitizens,
      trend: "Real-time",
    },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="hero-gradient relative">
        <div className="container-custom section-padding">
          <div className="text-center mb-12">
            <span className="badge-primary mb-4 inline-block">
              Impact Dashboard
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Real Change, <span className="text-primary">Real Numbers</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Transparency is at our core. See exactly how citizen participation
              is transforming cities across India live.
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-muted-foreground">
                Syncing live dashboard data...
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
              {impactHighlights.map((stat) => (
                <div key={stat.label} className="card-elevated p-6 text-center">
                  <p className="stat-number mb-2">{stat.value}</p>
                  <p className="font-medium text-foreground">{stat.label}</p>
                  <p className="text-sm text-success flex items-center justify-center gap-1 mt-2">
                    <TrendingUp className="w-4 h-4" />
                    {stat.trend}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {!loading && (
        <>
          {/* Category Breakdown */}
          <section className="section-padding">
            <div className="container-custom">
              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                    Issues by AI Category
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    Understanding where the most civic issues occur helps
                    authorities prioritize resources across real categories.
                  </p>

                  <div className="space-y-6">
                    {categoryBreakdown.length === 0 ? (
                      <p className="text-muted-foreground italic">
                        No categorized data yet.
                      </p>
                    ) : (
                      categoryBreakdown.map((category) => (
                        <div key={category.name}>
                          <div className="flex justify-between mb-2">
                            <span className="font-medium text-foreground">
                              {category.name}{" "}
                              <span className="text-muted-foreground text-sm ml-1">
                                ({category.count})
                              </span>
                            </span>
                            <span className="text-muted-foreground">
                              {category.percentage}%
                            </span>
                          </div>
                          <div className="h-3 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full ${category.color} rounded-full transition-all duration-1000`}
                              style={{ width: `${category.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                    Resolution Funnel
                  </h2>
                  <div className="card-elevated p-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <FileCheck className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">Total Issues Reported</p>
                          <p className="text-2xl font-bold text-primary">
                            {funnel.reported}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                        <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                          <Users className="w-6 h-6 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">Open (Under Review)</p>
                          <p className="text-2xl font-bold text-amber-600">
                            {funnel.underReview}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">In Progress</p>
                          <p className="text-2xl font-bold text-blue-600">
                            {funnel.inProgress}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-success/10 rounded-lg border border-success/20">
                        <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                          <FileCheck className="w-6 h-6 text-success" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">Resolved</p>
                          <p className="text-2xl font-bold text-success">
                            {funnel.resolved}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Top Cities */}
          <section className="section-padding bg-muted/50">
            <div className="container-custom">
              <div className="text-center mb-12">
                <span className="badge-secondary mb-4 inline-block">
                  Municipal Rankings
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Top Performing Municipalities
                </h2>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                  Live leaderboard based on the municipalities registered in our
                  system, scoring resolution rates and overall volume.
                </p>
              </div>

              <div className="overflow-x-auto card-elevated rounded-xl">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/20">
                      <th className="text-left py-4 px-4 font-semibold text-foreground">
                        Rank
                      </th>
                      <th className="text-left py-4 px-4 font-semibold text-foreground">
                        Municipality
                      </th>
                      <th className="text-left py-4 px-4 font-semibold text-foreground">
                        Civic Score
                      </th>
                      <th className="text-left py-4 px-4 font-semibold text-foreground">
                        Issues Assigned
                      </th>
                      <th className="text-left py-4 px-4 font-semibold text-foreground">
                        Resolved
                      </th>
                      <th className="text-left py-4 px-4 font-semibold text-foreground">
                        Resolution Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {topCities.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center py-8 text-muted-foreground"
                        >
                          Not enough municipality data available yet.
                        </td>
                      </tr>
                    ) : (
                      topCities.map((city) => (
                        <tr
                          key={city.city}
                          className="border-b border-border hover:bg-muted/50 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <span
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                city.rank === 1
                                  ? "bg-amber-500 text-white"
                                  : city.rank === 2
                                    ? "bg-gray-400 text-white"
                                    : city.rank === 3
                                      ? "bg-amber-700 text-white"
                                      : "bg-muted text-foreground"
                              }`}
                            >
                              {city.rank}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-medium text-foreground">
                            {city.city}
                          </td>
                          <td className="py-4 px-4">
                            <span className="stat-number text-2xl">
                              {city.score}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-muted-foreground">
                            {city.issues.toLocaleString()}
                          </td>
                          <td className="py-4 px-4 text-muted-foreground">
                            {city.resolved.toLocaleString()}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <Progress
                                value={
                                  city.issues > 0
                                    ? (city.resolved / city.issues) * 100
                                    : 0
                                }
                                className="w-20 h-2"
                              />
                              <span className="text-sm text-muted-foreground">
                                {city.issues > 0
                                  ? Math.round(
                                      (city.resolved / city.issues) * 100,
                                    )
                                  : 0}
                                %
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Download Report CTA */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="card-elevated p-8 md:p-12 text-center">
            <Download className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Download Full Impact Report
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Get detailed insights into city-wise performance, trend analysis,
              and recommendations in our comprehensive real-time impact report.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="btn-gradient">
                <Download className="mr-2 w-4 h-4" />
                Download Current Report
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">
                  Request Custom Data
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Impact;
