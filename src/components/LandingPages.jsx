import { useMemo } from 'react';
import { LogIn, Info } from 'lucide-react';
import { useDashboardData } from '../context/DashboardDataContext';
import { parseGA4Report, formatSeconds } from '../lib/ga4';

export default function LandingPages() {
  const { analytics } = useDashboardData();

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
      <div className="bg-white rounded-xl border border-[#E1E9E3] shadow-card p-6">
        <h2 className="text-sm font-semibold text-slate-900 mb-2">Landing Pages</h2>
        <p className="text-sm text-slate-500">No GA4 landing page data available for the last 30 days.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#E1E9E3] shadow-card overflow-hidden">
      <div className="px-6 pt-6 pb-4 flex items-center gap-2">
        <LogIn className="w-4 h-4 text-brand-600" />
        <h2 className="text-sm font-semibold text-slate-900">Landing Pages</h2>
        <div className="relative group cursor-pointer inline-flex items-center">
          <Info className="w-3.5 h-3.5 text-slate-400 hover:text-brand-600 transition-colors" />
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 bg-slate-900 text-white text-xs rounded-lg py-2 px-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 shadow-lg text-center font-normal">
            The first page each session viewed — shows which pages actually bring visitors into the site.
          </div>
        </div>
        <span className="text-xs text-slate-400 ml-auto">First page of each session, last 30 days</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-slate-400 text-[11px] uppercase tracking-wide border-y border-[#E1E9E3]">
              <th className="py-2.5 px-6 font-medium">Landing Page</th>
              <th className="py-2.5 px-6 font-medium text-right">Sessions</th>
              <th className="py-2.5 px-6 font-medium text-right">Bounce</th>
              <th className="py-2.5 px-6 font-medium text-right">Avg. Session</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {rows.map((row, idx) => (
              <tr key={idx} className="border-b border-[#F0F5F2] last:border-0 hover:bg-[#F7FAF8] transition-colors">
                <td className="py-3 px-6 text-slate-800 font-medium max-w-xs truncate" title={row.path}>{row.path}</td>
                <td className="py-3 px-6 text-slate-700 text-right">{row.sessions.toLocaleString()}</td>
                <td className="py-3 px-6 text-slate-500 text-right">{row.bounceRate}%</td>
                <td className="py-3 px-6 text-slate-500 text-right">{row.avgSessionDuration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
