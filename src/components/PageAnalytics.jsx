import { useMemo } from 'react';
import { Info } from 'lucide-react';
import { useDashboardData } from '../context/DashboardDataContext';
import { parseGA4Report, humanizePath } from '../lib/ga4';

export default function PageAnalytics() {
  const { analytics, rangeLabel } = useDashboardData();

  const pageAnalyticsData = useMemo(() => {
    const rawRows = analytics?.pages ? parseGA4Report(analytics.pages) : [];

    // The same path can appear as multiple rows with different titles (e.g.
    // historical page-title changes), which reads as duplicate/confusing
    // cards. Group by path and combine into one entry per page.
    const byPath = new Map();
    for (const row of rawRows) {
      const path = row.pagePath || 'Unknown';
      const views = Number(row.screenPageViews) || 0;
      const avgTime = Number(row.averageSessionDuration) || 0;
      const bounce = Number(row.bounceRate) || 0;

      const existing = byPath.get(path) || { path, views: 0, timeWeighted: 0, bounceWeighted: 0 };
      existing.views += views;
      existing.timeWeighted += avgTime * views;
      existing.bounceWeighted += bounce * views;
      byPath.set(path, existing);
    }

    return Array.from(byPath.values())
      .map((p) => ({
        label: humanizePath(p.path),
        path: p.path,
        avgTimeSpent: p.views > 0 ? Math.round(p.timeWeighted / p.views) : 0,
        bounceRate: p.views > 0 ? Math.round((p.bounceWeighted / p.views) * 100) : 0,
        views: p.views,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 4);
  }, [analytics]);

  return (
    <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] shadow-card p-6">
      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-sm font-semibold text-[var(--text)]">Page Analytics</h2>
        <div className="relative group cursor-pointer">
          <Info className="w-3.5 h-3.5 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors" />
          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 bg-slate-900 text-white text-xs rounded-lg py-2 px-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-30 shadow-lg text-center font-normal">
            Bounce rate is the percentage of visitors who leave the site after viewing only one page.
          </div>
        </div>
      </div>
      <p className="text-xs text-[var(--text-muted)] mb-5">Bounce rate = visitors who left after one page view</p>

      {pageAnalyticsData.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">No GA4 page data available for the {rangeLabel}.</p>
      ) : (
        <div className="grid gap-3.5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {pageAnalyticsData.map((data, idx) => (
            <div key={idx} className="rounded-lg border border-[var(--border)] p-4">
              <h3 className="text-sm font-medium text-[var(--text)] truncate" title={data.label}>{data.label}</h3>
              <div className="text-xs text-[var(--text-muted)] mb-3 truncate" title={data.path}>{data.path}</div>
              <div className="flex justify-between text-xs">
                <div>
                  <div className="text-[var(--text-muted)] mb-0.5">Avg Time</div>
                  <div className="font-semibold text-[var(--text)]">{data.avgTimeSpent}s</div>
                </div>
                <div>
                  <div className="text-[var(--text-muted)] mb-0.5">Bounce Rate</div>
                  <div className="font-semibold text-[var(--text)]">{data.bounceRate}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
