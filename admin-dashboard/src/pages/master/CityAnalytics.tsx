import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
} from 'recharts';

interface WardRow {
  ward: string;
  total: number;
  resolved: number;
  rate: number;
  avgTime: string;
  status: 'OPTIMAL' | 'ACTIVE' | 'ALERT';
}

const kpiCards = [
  { label: 'Total Issues (YTD)', value: '8,421', delta: '+12.4% vs last month', up: true },
  { label: 'Resolution Rate', value: '73.2%', delta: '+5.1% vs last month', up: true },
  { label: 'Avg Resolution Time', value: '4.2d', delta: '-0.8 days vs last month', up: true },
  { label: 'Active Municipalities', value: '14 wards', delta: '+2 new this month', up: true },
];

const trendData = [
  { month: 'Oct', issues: 312 }, { month: 'Nov', issues: 298 }, { month: 'Dec', issues: 334 },
  { month: 'Jan', issues: 421 }, { month: 'Feb', issues: 398 }, { month: 'Mar', issues: 512 },
  { month: 'Apr', issues: 634 }, { month: 'May', issues: 589 }, { month: 'Jun', issues: 547 },
  { month: 'Jul', issues: 612 }, { month: 'Aug', issues: 578 }, { month: 'Sep', issues: 634 },
];

const statusData = [
  { name: 'Open', value: 23 },
  { name: 'In Progress', value: 31 },
  { name: 'Resolved', value: 38 },
  { name: 'Rejected', value: 8 },
];
const STATUS_COLORS: Record<string, string> = {
  Open: '#F59E0B', 'In Progress': '#6366F1', Resolved: '#22C55E', Rejected: '#71717A',
};

const categoryData = [
  { name: 'Roads', value: 1847 }, { name: 'Electrical', value: 1634 },
  { name: 'Water', value: 1421 }, { name: 'Waste', value: 1198 }, { name: 'Sanitation', value: 987 },
];

const wardData: WardRow[] = [
  { ward: 'Ward 01 – Andheri East', total: 1124, resolved: 892, rate: 79, avgTime: '3.8d', status: 'OPTIMAL' },
  { ward: 'Ward 02 – Bandra West', total: 987, resolved: 734, rate: 74, avgTime: '4.1d', status: 'ACTIVE' },
  { ward: 'Ward 03 – Kurla North', total: 1203, resolved: 812, rate: 67, avgTime: '5.2d', status: 'ALERT' },
  { ward: 'Ward 04 – Dharavi', total: 876, resolved: 701, rate: 80, avgTime: '3.6d', status: 'OPTIMAL' },
  { ward: 'Ward 05 – Chembur', total: 743, resolved: 541, rate: 73, avgTime: '4.4d', status: 'ACTIVE' },
  { ward: 'Ward 06 – Govandi', total: 654, resolved: 389, rate: 59, avgTime: '6.1d', status: 'ALERT' },
  { ward: 'Ward 07 – Malad West', total: 921, resolved: 702, rate: 76, avgTime: '4.0d', status: 'ACTIVE' },
  { ward: 'Ward 08 – Borivali', total: 913, resolved: 757, rate: 83, avgTime: '3.3d', status: 'OPTIMAL' },
];

const resolutionTrendData = [
  { week: 'Wk 1', days: 5.8 }, { week: 'Wk 2', days: 5.2 }, { week: 'Wk 3', days: 4.9 },
  { week: 'Wk 4', days: 4.7 }, { week: 'Wk 5', days: 4.5 }, { week: 'Wk 6', days: 4.3 },
  { week: 'Wk 7', days: 4.1 }, { week: 'Wk 8', days: 4.2 },
];

const TOOLTIP_STYLE = {
  background: '#111114', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '8px', color: '#fff', fontSize: '12px',
};

const STATUS_BADGE: Record<WardRow['status'], { color: string; bg: string }> = {
  OPTIMAL: { color: '#22C55E', bg: 'rgba(34,197,94,0.12)' },
  ACTIVE: { color: '#38BDF8', bg: 'rgba(56,189,248,0.12)' },
  ALERT: { color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
};

const PANEL = 'rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#111114] p-5';
const MONO_HDR = 'text-[10px] font-mono uppercase tracking-widest text-[#71717A] mb-4';

export default function CityAnalytics() {
  return (
    <div className="p-6 space-y-6 min-h-full">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-widest uppercase text-white font-mono">City Analytics</h1>
        <p className="mt-1 text-[11px] font-mono uppercase tracking-widest text-[#71717A]">
          Municipal Performance Dashboard · Real-Time Data
        </p>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((k) => (
          <div key={k.label} className={PANEL}>
            <p className="text-[10px] font-mono uppercase tracking-widest text-[#71717A] mb-2">{k.label}</p>
            <p className="text-2xl font-bold text-white">{k.value}</p>
            <p className="text-xs mt-1" style={{ color: k.up ? '#22C55E' : '#EF4444' }}>{k.delta}</p>
          </div>
        ))}
      </div>

      {/* Issue Trend Chart */}
      <div className={PANEL}>
        <p className={MONO_HDR}>Monthly Issue Volume <span className="normal-case text-[#52525B]">· Last 12 months</span></p>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={trendData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366F1" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#6366F1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ stroke: 'rgba(99,102,241,0.3)', strokeWidth: 1 }} />
            <Area type="monotone" dataKey="issues" stroke="#6366F1" strokeWidth={2} fill="url(#areaFill)" dot={false}
              activeDot={{ r: 4, fill: '#6366F1', stroke: '#fff', strokeWidth: 1 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Two-column: Status Pie + Category Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className={PANEL}>
          <p className={MONO_HDR}>Issue Status Breakdown</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value" strokeWidth={0}>
                {statusData.map((entry) => <Cell key={entry.name} fill={STATUS_COLORS[entry.name] ?? '#6366F1'} />)}
              </Pie>
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value: any) => [`${value}%`, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {statusData.map((e) => (
              <div key={e.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: STATUS_COLORS[e.name] }} />
                <span className="text-[11px] text-[#A1A1AA]">{e.name}</span>
                <span className="text-[11px] font-semibold text-white">{e.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className={PANEL}>
          <p className={MONO_HDR}>Issue Categories</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
              <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} width={72} />
              <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(99,102,241,0.08)' }} />
              <Bar dataKey="value" fill="#6366F1" radius={[0, 4, 4, 0]} maxBarSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Ward Performance Table */}
      <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#111114] overflow-hidden">
        <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.06)]">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#71717A]">Ward Performance Index</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.06)]">
                {['WARD', 'TOTAL', 'RESOLVED', 'RESOLUTION RATE', 'AVG TIME', 'STATUS'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] font-mono uppercase tracking-widest text-[#52525B]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {wardData.map((row, i) => {
                const badge = STATUS_BADGE[row.status];
                return (
                  <tr key={row.ward} className="hover:bg-[rgba(99,102,241,0.04)] transition-colors" style={{ borderBottom: i < wardData.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    <td className="px-5 py-3 text-white/80 font-medium">{row.ward}</td>
                    <td className="px-5 py-3 font-mono text-[11px] text-white">{row.total.toLocaleString()}</td>
                    <td className="px-5 py-3 font-mono text-[11px] text-green-400">{row.resolved.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2 min-w-[120px]">
                        <div className="flex-1 h-1 rounded-full overflow-hidden bg-[rgba(255,255,255,0.08)]">
                          <div className="h-full rounded-full" style={{ width: `${row.rate}%`, background: row.rate >= 75 ? '#22C55E' : row.rate >= 65 ? '#6366F1' : '#F59E0B', transition: 'width .5s ease' }} />
                        </div>
                        <span className="font-mono text-[11px] text-white/70 w-8 text-right">{row.rate}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 font-mono text-[11px] text-[#A1A1AA]">{row.avgTime}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-widest" style={{ color: badge.color, background: badge.bg }}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resolution Time Trend */}
      <div className={PANEL}>
        <p className={MONO_HDR}>Resolution Time Trend <span className="normal-case text-[#52525B]">· Last 8 weeks (avg days)</span></p>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={resolutionTrendData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="week" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[3.5, 6.5]} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ stroke: 'rgba(34,197,94,0.2)', strokeWidth: 1 }} formatter={(v: any) => [`${v} days`, 'Avg Resolution']} />
            <Line type="monotone" dataKey="days" stroke="#22C55E" strokeWidth={2}
              dot={{ fill: '#ffffff', stroke: '#22C55E', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 5, fill: '#22C55E', stroke: '#fff', strokeWidth: 1 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
