import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { useDashboardData } from '../context/DashboardDataContext';
import { parseGA4Report } from '../lib/ga4';

const COLORS = ['#2E7D52', '#5B8F72', '#8FB89E', '#B7D2C0', '#DCE9E0'];

export default function TrafficChart() {
  const { analytics, rangeLabel } = useDashboardData();

  const trafficSourceData = (analytics?.trafficSources ? parseGA4Report(analytics.trafficSources) : [])
    .map((row) => ({
      source: row.sessionDefaultChannelGroup || 'Unknown',
      users: Number(row.totalUsers) || 0,
    }))
    .sort((a, b) => b.users - a.users);

  if (trafficSourceData.length === 0) {
    return (
      <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] shadow-card p-6">
        <h2 className="text-sm font-semibold text-[var(--text)] mb-2">Traffic Source Comparison</h2>
        <p className="text-sm text-[var(--text-muted)]">No GA4 traffic-source data available for the {rangeLabel}.</p>
      </div>
    );
  }

  const total = trafficSourceData.reduce((sum, item) => sum + item.users, 0);
  const maxUsers = Math.max(...trafficSourceData.map((d) => d.users), 1);

  return (
    <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] shadow-card p-6">
      <h2 className="text-sm font-semibold text-[var(--text)]">Traffic Source Comparison</h2>
      <p className="text-xs text-[var(--text-muted)] mb-5">Users by channel, {rangeLabel}</p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-8 items-center">
        <div className="space-y-3">
          {trafficSourceData.map((row, idx) => {
            const pct = total > 0 ? Math.round((row.users / total) * 100) : 0;
            const widthPct = Math.max((row.users / maxUsers) * 100, 4);
            return (
              <div key={row.source}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-[var(--text-soft)]">{row.source}</span>
                  <span className="text-[var(--text-muted)]">{row.users.toLocaleString()} · {pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-[var(--track-bg)] overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${widthPct}%`, backgroundColor: COLORS[idx % COLORS.length] }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col items-center">
          <div className="h-40 w-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={trafficSourceData} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={2} dataKey="users" nameKey="source">
                  {trafficSourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip
                  formatter={(value, name) => [`${((value / total) * 100).toFixed(1)}% (${value})`, name]}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2">
            {trafficSourceData.map((entry, index) => (
              <div key={entry.source} className="flex items-center text-[11px] text-[var(--text-muted)]">
                <div className="w-2 h-2 rounded-full mr-1" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                {entry.source}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
