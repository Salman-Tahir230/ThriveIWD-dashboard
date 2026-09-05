import { Users, MousePointerClick, Clock, TrendingUp } from 'lucide-react';
import { useDashboardData } from '../context/DashboardDataContext';
import { parseGA4Overview, formatSeconds } from '../lib/ga4';

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 flex items-start gap-3">
      <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 flex-shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
        <div className="text-xl font-bold text-slate-900 dark:text-white">{value}</div>
        {sub && <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{sub}</div>}
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        icon={Users}
        label="Users (last 30 days)"
        value={totalUsers.toLocaleString()}
        sub={`${newUsers.toLocaleString()} new · ${returningUsers.toLocaleString()} returning`}
      />
      <StatCard
        icon={MousePointerClick}
        label="Sessions"
        value={sessions.toLocaleString()}
        sub={`${Number(overview.screenPageViews || 0).toLocaleString()} page views`}
      />
      <StatCard
        icon={TrendingUp}
        label="Engagement Rate"
        value={`${engagementRate}%`}
        sub={`${bounceRate}% bounce rate`}
      />
      <StatCard
        icon={Clock}
        label="Avg. Session Duration"
        value={formatSeconds(overview.averageSessionDuration)}
      />
    </div>
  );
}
