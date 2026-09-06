import { useMemo } from 'react';
import { LogIn, Info } from 'lucide-react';
import { useDashboardData } from '../context/DashboardDataContext';
import { parseGA4Report, formatSeconds, humanizePath } from '../lib/ga4';

export default function LandingPages() {
  const { analytics, rangeLabel } = useDashboardData();

  const rows = useMemo(() => {
    return (analytics?.landingPages ? parseGA4Report(analytics.landingPages) : []).map((row) => ({
      path: row.landingPage || 'Unknown',
      sessions: Number(row.sessions) || 0,
      users: Number(row.totalUsers) || 0,
      bounceRate: Math.round((Number(row.bounceRate) || 0) * 100),
      avgSessionDuration: formatSeconds(row.averageSessionDuration),
    }));
  }, [analytics]);

  if (rows.length === 0) {
    return (
      <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] shadow-card p-6">
        <h2 className="text-sm font-semibold text-[var(--text)] mb-2">Landing Pages</h2>
        <p className="text-sm text-[var(--text-muted)]">No GA4 landing page data available for the {rangeLabel}.</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] shadow-card overflow-hidden">
      <div className="px-6 pt-6 pb-4 flex items-center gap-2">
        <LogIn className="w-4 h-4 text-[var(--accent)]" />
        <h2 className="text-sm font-semibold text-[var(--text)]">Landing Pages</h2>
        <div className="relative group cursor-pointer inline-flex items-center">
          <Info className="w-3.5 h-3.5 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors" />
          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 bg-slate-900 text-white text-xs rounded-lg py-2 px-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-30 shadow-lg text-center font-normal">
            The first page each session viewed — shows which pages actually bring visitors into the site.
          </div>
        </div>
        <span className="text-xs text-[var(--text-muted)] ml-auto">First page of each session, {rangeLabel}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--table-head-bg)] text-[var(--text-muted)] text-[11px] uppercase tracking-wide border-y border-[var(--border)]">
              <th className="py-2.5 px-6 font-medium">Landing Page</th>
              <th className="py-2.5 px-6 font-medium text-right">Sessions</th>
              <th className="py-2.5 px-6 font-medium text-right">Bounce</th>
              <th className="py-2.5 px-6 font-medium text-right">Avg. Session</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {rows.map((row, idx) => (
              <tr key={idx} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--subtle-bg)] transition-colors">
                <td className="py-3 px-6 text-[var(--text)] font-medium max-w-xs" title={row.path}>
                  {humanizePath(row.path)}
                  <div className="text-xs text-[var(--text-muted)] font-normal truncate">{row.path}</div>
                </td>
                <td className="py-3 px-6 text-[var(--text-soft)] text-right">{row.sessions.toLocaleString()}</td>
                <td className="py-3 px-6 text-[var(--text-muted)] text-right">{row.bounceRate}%</td>
                <td className="py-3 px-6 text-[var(--text-muted)] text-right">{row.avgSessionDuration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
