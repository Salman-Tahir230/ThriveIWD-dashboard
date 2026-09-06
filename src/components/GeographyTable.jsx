import { useMemo } from 'react';
import { useDashboardData } from '../context/DashboardDataContext';
import { parseGA4Report, formatSeconds } from '../lib/ga4';
import { Info } from 'lucide-react';

export default function GeographyTable() {
  const { analytics, rangeLabel } = useDashboardData();

  const countryData = useMemo(() => {
    const rows = analytics?.countries ? parseGA4Report(analytics.countries) : [];
    return rows
      .map((row) => ({
        country: row.country || 'Unknown',
        userCount: Number(row.totalUsers) || 0,
        sessions: Number(row.sessions) || 0,
      }))
      .sort((a, b) => b.userCount - a.userCount);
  }, [analytics]);

  const cityData = useMemo(() => {
    const rows = analytics?.geography ? parseGA4Report(analytics.geography) : [];
    return rows
      .map((row) => ({
        city: row.city || 'Unknown',
        country: row.country || 'Unknown',
        userCount: Number(row.totalUsers) || 0,
        avgSessionDuration: formatSeconds(row.averageSessionDuration),
      }))
      .sort((a, b) => b.userCount - a.userCount);
  }, [analytics]);

  if (countryData.length === 0 && cityData.length === 0) {
    return (
      <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] shadow-card p-6">
        <h2 className="text-sm font-semibold text-[var(--text)] mb-2">Traffic by Country</h2>
        <p className="text-sm text-[var(--text-muted)]">No GA4 geography data available for the {rangeLabel}.</p>
      </div>
    );
  }

  const totalUsers = countryData.reduce((sum, r) => sum + r.userCount, 0);

  return (
    <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] shadow-card overflow-hidden">
      <div className="px-6 pt-6 pb-4">
        <h2 className="text-sm font-semibold text-[var(--text)]">Traffic by Country</h2>
        <p className="text-xs text-[var(--text-muted)]">Where your website visitors are located, {rangeLabel}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--table-head-bg)] text-[var(--text-muted)] text-[11px] uppercase tracking-wide border-y border-[var(--border)]">
              <th className="py-2.5 px-6 font-medium">Country</th>
              <th className="py-2.5 px-6 font-medium text-right">Users</th>
              <th className="py-2.5 px-6 font-medium text-right">Sessions</th>
              <th className="py-2.5 px-6 font-medium text-right">Share</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {countryData.map((row) => (
              <tr key={row.country} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--subtle-bg)] transition-colors">
                <td className="py-3 px-6 text-[var(--text)] font-medium">{row.country}</td>
                <td className="py-3 px-6 text-[var(--text)] text-right font-medium">{row.userCount.toLocaleString()}</td>
                <td className="py-3 px-6 text-[var(--text-muted)] text-right">{row.sessions.toLocaleString()}</td>
                <td className="py-3 px-6 text-[var(--text-muted)] text-right">
                  {totalUsers > 0 ? `${Math.round((row.userCount / totalUsers) * 100)}%` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 pt-6 pb-4 border-t border-[var(--border)]">
        <h3 className="text-sm font-semibold text-[var(--text)]">By City</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--table-head-bg)] text-[var(--text-muted)] text-[11px] uppercase tracking-wide border-y border-[var(--border)]">
              <th className="py-2.5 px-6 font-medium">City</th>
              <th className="py-2.5 px-6 font-medium">Country</th>
              <th className="py-2.5 px-6 font-medium text-right">Users</th>
              <th className="py-2.5 px-6 font-medium text-right">
                <div className="flex items-center justify-end gap-1">
                  Avg. Session
                  <div className="relative group cursor-pointer inline-flex items-center">
                    <Info className="w-3.5 h-3.5 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors" />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900 text-white text-xs rounded-lg py-2 px-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-30 shadow-lg font-normal whitespace-normal text-center">
                      The average amount of time users from this location spend on the site per visit.
                    </div>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {cityData.map((row, idx) => (
              <tr key={idx} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--subtle-bg)] transition-colors">
                <td className="py-3 px-6 text-[var(--text)] font-medium">{row.city}</td>
                <td className="py-3 px-6 text-[var(--text-muted)]">{row.country}</td>
                <td className="py-3 px-6 text-[var(--text)] text-right font-medium">{row.userCount.toLocaleString()}</td>
                <td className="py-3 px-6 text-[var(--text-muted)] text-right">{row.avgSessionDuration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
