import { Info } from 'lucide-react';
import { useDashboardData } from '../context/DashboardDataContext';
import { parseGA4Report } from '../lib/ga4';

export default function PageAnalytics() {
  const { analytics } = useDashboardData();

  const pageAnalyticsData = (analytics?.pages ? parseGA4Report(analytics.pages) : [])
    .map((row) => ({
      title: row.pageTitle || row.pagePath || 'Unknown',
      path: row.pagePath || '',
      avgTimeSpent: Math.round(Number(row.averageSessionDuration) || 0),
      bounceRate: Math.round((Number(row.bounceRate) || 0) * 100),
      views: Number(row.screenPageViews) || 0,
    }))
    .slice(0, 4);

  return (
    <div className="bg-white rounded-xl border border-[#E1E9E3] shadow-card p-6">
      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-sm font-semibold text-slate-900">Page Analytics</h2>
        <div className="relative group cursor-pointer">
          <Info className="w-3.5 h-3.5 text-slate-400 hover:text-brand-600 transition-colors" />
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 bg-slate-900 text-white text-xs rounded-lg py-2 px-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 shadow-lg text-center font-normal">
            Bounce rate is the percentage of visitors who leave the site after viewing only one page.
          </div>
        </div>
      </div>
      <p className="text-xs text-slate-400 mb-5">Bounce rate = visitors who left after one page view</p>

      {pageAnalyticsData.length === 0 ? (
        <p className="text-sm text-slate-500">No GA4 page data available for the last 30 days.</p>
      ) : (
        <div className="grid gap-3.5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {pageAnalyticsData.map((data, idx) => (
            <div key={idx} className="rounded-lg border border-[#E1E9E3] p-4">
              <h3 className="text-sm font-medium text-slate-900 truncate" title={data.title}>{data.title}</h3>
              <div className="text-xs text-slate-400 mb-3 truncate" title={data.path}>{data.path}</div>
              <div className="flex justify-between text-xs">
                <div>
                  <div className="text-slate-400 mb-0.5">Avg Time</div>
                  <div className="font-semibold text-slate-800">{data.avgTimeSpent}s</div>
                </div>
                <div>
                  <div className="text-slate-400 mb-0.5">Bounce Rate</div>
                  <div className="font-semibold text-slate-800">{data.bounceRate}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
