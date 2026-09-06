import { Users, MousePointerClick, TrendingUp, Clock, Repeat, Info } from 'lucide-react';
import { useDashboardData } from '../context/DashboardDataContext';
import { parseGA4Overview, formatSeconds } from '../lib/ga4';

function StatCard({ icon: Icon, label, value, sub, tooltip }) {
  return (
    <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] shadow-card p-5 flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)] flex-shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-[var(--text-muted)]">{label}</span>
          {tooltip && (
            <div className="relative group cursor-pointer inline-flex items-center">
              <Info className="w-3 h-3 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors" />
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-56 bg-slate-900 text-white text-xs rounded-lg py-2 px-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-30 shadow-lg text-center font-normal normal-case leading-relaxed">
                {tooltip}
              </div>
            </div>
          )}
        </div>
        <div className="text-lg sm:text-xl font-bold text-[var(--text)] leading-tight break-words">{value}</div>
        {sub && <div className="text-xs text-[var(--text-muted)] mt-0.5 leading-snug break-words">{sub}</div>}
      </div>
    </div>
  );
}

export default function OverviewStats() {
  const { analytics, rangeLabel } = useDashboardData();
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
    <div className="grid gap-3.5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))' }}>
      <StatCard
        icon={Users}
        label="Users"
        value={totalUsers.toLocaleString()}
        sub={`${newUsers.toLocaleString()} new · ${returningUsers.toLocaleString()} returning`}
        tooltip={`The number of different people who visited the website in the ${rangeLabel}. Each person is only counted once, even if they visited multiple times.`}
      />
      <StatCard
        icon={MousePointerClick}
        label="Sessions"
        value={sessions.toLocaleString()}
        sub={`${Number(overview.screenPageViews || 0).toLocaleString()} page views`}
        tooltip="The number of visits to the site. One person can create several sessions if they come back later, so this is usually higher than Users."
      />
      <StatCard
        icon={TrendingUp}
        label="Engagement Rate"
        value={`${engagementRate}%`}
        sub={`${bounceRate}% bounce rate`}
        tooltip="The share of visits where someone actually did something on the site — scrolled, clicked a link, or stayed a while — instead of leaving right away. Bounce rate is the opposite: visits that left immediately."
      />
      <StatCard
        icon={Clock}
        label="Avg. Session Duration"
        value={formatSeconds(overview.averageSessionDuration)}
        tooltip="On average, how long a visitor stays on the site during one visit."
      />
      <StatCard
        icon={Repeat}
        label="New vs Returning"
        value={`${newPct}% / ${returningPct}%`}
        sub={`${newUsers.toLocaleString()} new · ${returningUsers.toLocaleString()} returning`}
        tooltip="What percentage of visitors were arriving for the first time (New) versus people who've been to the site before (Returning)."
      />
    </div>
  );
}
