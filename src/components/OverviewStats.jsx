import { Users, MousePointerClick, TrendingUp, Clock, Repeat } from 'lucide-react';
import { useDashboardData } from '../context/DashboardDataContext';
import { parseGA4Overview, formatSeconds } from '../lib/ga4';

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="bg-white rounded-xl border border-[#E1E9E3] shadow-card p-5 flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 flex-shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <div className="text-xs text-slate-500">{label}</div>
        <div className="text-xl font-bold text-slate-900 truncate">{value}</div>
        {sub && <div className="text-xs text-slate-400 mt-0.5 truncate">{sub}</div>}
      </div>
    </div>
  );
}

export default function OverviewStats() {
  const { analytics } = useDashboardData();
  const overview = analytics?.overview ? parseGA4Overview(analytics.overview) : null;

  if (!overview) return null;

  const totalUsers = Number(overview.totalUsers) || 0;
  const newUsers = Number(overview.newUsers) || 0;
  const returningUsers = Math.max(totalUsers - newUsers, 0);
  const sessions = Number(overview.sessions) || 0;
  const engagementRate = Math.round((Number(overview.engagementRate) || 0) * 100);
  const bounceRate = Math.round((Number(overview.bounceRate) || 0) * 100);
  const newPct = totalUsers > 0 ? Math.round((newUsers / totalUsers) * 100) : 0;
  const returningPct = totalUsers > 0 ? 100 - newPct : 0;

  return (
    <div className="grid gap-3.5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))' }}>
      <StatCard icon={Users} label="Users" value={totalUsers.toLocaleString()} sub={`${newUsers.toLocaleString()} new · ${returningUsers.toLocaleString()} returning`} />
      <StatCard icon={MousePointerClick} label="Sessions" value={sessions.toLocaleString()} sub={`${Number(overview.screenPageViews || 0).toLocaleString()} page views`} />
      <StatCard icon={TrendingUp} label="Engagement Rate" value={`${engagementRate}%`} sub={`${bounceRate}% bounce rate`} />
      <StatCard icon={Clock} label="Avg. Session Duration" value={formatSeconds(overview.averageSessionDuration)} />
      <StatCard icon={Repeat} label="New vs Returning" value={`${newPct}% / ${returningPct}%`} sub={`${newUsers.toLocaleString()} new · ${returningUsers.toLocaleString()} returning`} />
    </div>
  );
}
