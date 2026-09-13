import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface PredictionResult {
  priority: 'High' | 'Medium' | 'Low' | 'Critical';
  confidence: number;
  category: string;
}

interface RecentPrediction {
  id: string;
  description: string;
  category: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  confidence: number;
  time: string;
}

const categoryData = [
  { name: 'Electrical', count: 423 },
  { name: 'Roads', count: 387 },
  { name: 'Water', count: 341 },
  { name: 'Waste', count: 298 },
  { name: 'Sanitation', count: 276 },
  { name: 'Parks', count: 219 },
  { name: 'Other', count: 143 },
];

const priorityData = [
  { name: 'Critical', value: 8, color: '#EF4444' },
  { name: 'High', value: 22, color: '#F59E0B' },
  { name: 'Medium', value: 45, color: '#6366F1' },
  { name: 'Low', value: 25, color: '#71717A' },
];

const recentPredictions: RecentPrediction[] = [
  { id: 'ISS-20481', description: 'Street light on MG Road flickering since three days', category: 'Electrical', priority: 'High', confidence: 96, time: '2m ago' },
  { id: 'ISS-20480', description: 'Large pothole near Junction 14 causing vehicle damage', category: 'Roads', priority: 'Critical', confidence: 98, time: '7m ago' },
  { id: 'ISS-20479', description: 'Garbage not collected in Sector 9 for over a week', category: 'Waste', priority: 'Medium', confidence: 89, time: '15m ago' },
  { id: 'ISS-20478', description: 'Water supply disruption in Block C, residents affected', category: 'Water', priority: 'Critical', confidence: 97, time: '22m ago' },
  { id: 'ISS-20477', description: 'Open manhole cover on Park Street, safety hazard', category: 'Sanitation', priority: 'High', confidence: 94, time: '31m ago' },
  { id: 'ISS-20476', description: 'Fallen tree blocking park pathway after last night rain', category: 'Parks', priority: 'Medium', confidence: 87, time: '45m ago' },
  { id: 'ISS-20475', description: 'Road cave-in on NH-48 service lane near overpass', category: 'Roads', priority: 'Critical', confidence: 99, time: '1h ago' },
  { id: 'ISS-20474', description: 'Illegal dumping spotted near residential area boundary', category: 'Waste', priority: 'Low', confidence: 81, time: '1h 20m ago' },
];

const MOCK_FALLBACK: PredictionResult = { priority: 'Medium', confidence: 84, category: 'Infrastructure' };

const kpiCards = [
  { label: 'Total Analyzed', value: '2,847', sub: 'civic issues' },
  { label: 'Avg Confidence', value: '91.3%', sub: 'model score' },
  { label: 'Accuracy Rate', value: '94.7%', sub: 'validated results' },
  { label: 'Avg Response', value: '1.2s', sub: 'inference time' },
];

const PRIORITY_COLORS: Record<string, string> = {
  Critical: 'bg-red-500/10 text-red-400 border border-red-500/30',
  High: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
  Medium: 'bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/30',
  Low: 'bg-[#71717A]/10 text-[#71717A] border border-[#71717A]/30',
};

function PriorityBadge({ priority }: { priority: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-widest font-semibold ${PRIORITY_COLORS[priority] ?? PRIORITY_COLORS['Low']}`}>
      {priority}
    </span>
  );
}

function ConfidenceRing({ value }: { value: number }) {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  const color = value >= 90 ? '#22C55E' : value >= 75 ? '#F59E0B' : '#EF4444';

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-[76px] h-[76px]">
        <svg width={76} height={76} className="-rotate-90 absolute inset-0">
          <circle cx={38} cy={38} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={6} />
          <circle cx={38} cy={38} r={radius} fill="none" stroke={color} strokeWidth={6}
            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
            strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold" style={{ color }}>{value}%</span>
        </div>
      </div>
      <span className="text-[10px] font-mono uppercase tracking-widest text-[#71717A] mt-1">Confidence</span>
    </div>
  );
}

export default function AiIntelligence() {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze() {
    if (!description.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json() as PredictionResult;
      setResult(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(`Inference service unavailable (${msg}). Showing mock result.`);
      setResult(MOCK_FALLBACK);
    } finally {
      setLoading(false);
    }
  }

  const tooltipStyle = {
    background: '#111114',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '12px',
  };

  return (
    <div className="min-h-full p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">AI Intelligence</h1>
          <p className="text-[11px] font-mono uppercase tracking-widest text-[#71717A] mt-1">
            CIVICSENSE NEURAL ANALYSIS ENGINE
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-500/30 bg-green-500/10">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-green-400">Model Online</span>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((k) => (
          <div key={k.label} className="rounded-xl p-4 bg-[#111114] border border-[rgba(255,255,255,0.08)]">
            <p className="text-[10px] font-mono uppercase tracking-widest text-[#71717A] mb-2">{k.label}</p>
            <p className="text-2xl font-bold text-white">{k.value}</p>
            <p className="text-[11px] text-[#52525B] mt-0.5">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Live Prediction Tester */}
      <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#111114] p-5 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#6366F1]/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-[#6366F1]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">Live Prediction Tester</h2>
            <p className="text-[11px] text-[#71717A]">Submit a civic issue description for real-time AI analysis</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          <div className="space-y-3">
            <label className="block text-[10px] font-mono uppercase tracking-widest text-[#71717A]">Issue Description</label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Large pothole on MG Road near the flyover causing accidents..."
              className="w-full rounded-lg px-4 py-3 text-sm text-white placeholder-[#71717A] resize-none outline-none bg-[#0D0D0F] border border-[rgba(255,255,255,0.08)] focus:border-[#6366F1]/60 transition-colors"
            />
            <button
              onClick={handleAnalyze}
              disabled={loading || !description.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#6366F1] hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Analyzing…</>
              ) : (
                <><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>Analyze</>
              )}
            </button>
          </div>

          <div className="rounded-lg p-4 flex flex-col justify-center min-h-[140px] bg-[#0D0D0F] border border-[rgba(255,255,255,0.06)]">
            {!result && !loading && (
              <p className="text-[11px] font-mono uppercase tracking-widest text-[#52525B] text-center">Awaiting Input</p>
            )}
            {loading && (
              <div className="flex flex-col items-center gap-3">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="w-2 h-2 rounded-full bg-[#6366F1]" style={{ animation: `bounce 1.2s ${i * 0.2}s infinite` }} />
                  ))}
                </div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#52525B]">Running Inference…</p>
              </div>
            )}
            {error && <p className="text-[10px] font-mono text-amber-400/70 mb-3 text-center">⚠ {error}</p>}
            {result && (
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <ConfidenceRing value={result.confidence} />
                <div className="space-y-3 flex-1">
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-[#71717A] mb-1">Priority</p>
                    <PriorityBadge priority={result.priority} />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-widest text-[#71717A] mb-1">Category</p>
                    <span className="text-sm font-semibold text-white">{result.category}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#111114] p-5">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#71717A] mb-4">Category Distribution</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={categoryData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.03)' }} contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="#6366F1" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#111114] p-5">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#71717A] mb-4">Priority Distribution</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={priorityData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value" stroke="none">
                {priorityData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(value: any) => [`${value}%`, 'Share']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-3">
            {priorityData.map((p) => (
              <div key={p.name} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717A]">{p.name}</span>
                <span className="text-[10px] font-mono text-[#A1A1AA] ml-auto">{p.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent AI Predictions Table */}
      <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#111114] overflow-hidden">
        <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.06)]">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#71717A]">Recent AI Predictions</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.06)]">
                {['Issue ID', 'Description', 'Category', 'Priority', 'Confidence', 'Time'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-mono uppercase tracking-widest text-[#52525B]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentPredictions.map((row, idx) => (
                <tr key={row.id} className="hover:bg-white/[0.02] transition-colors" style={{ borderBottom: idx < recentPredictions.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <td className="px-5 py-3">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-[#6366F1]">{row.id}</span>
                  </td>
                  <td className="px-5 py-3 max-w-[220px]">
                    <span className="text-[13px] text-[#A1A1AA] block truncate" title={row.description}>{row.description}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-[#71717A]">{row.category}</span>
                  </td>
                  <td className="px-5 py-3"><PriorityBadge priority={row.priority} /></td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-13 rounded-full overflow-hidden bg-[rgba(255,255,255,0.08)]">
                        <div className="h-full rounded-full transition-[width] duration-500"
                          style={{ width: `${row.confidence}%`, backgroundColor: row.confidence >= 90 ? '#22C55E' : row.confidence >= 75 ? '#F59E0B' : '#EF4444' }} />
                      </div>
                      <span className="text-[11px] font-mono text-[#A1A1AA]">{row.confidence}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3"><span className="text-[11px] font-mono text-[#52525B]">{row.time}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0);opacity:.4}40%{transform:translateY(-6px);opacity:1} }`}</style>
    </div>
  );
}
