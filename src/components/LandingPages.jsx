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
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mt-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Landing Pages</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">No GA4 landing page data available for the last 30 days.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mt-6">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
        <LogIn className="w-5 h-5 text-indigo-500" />
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Where Sessions Land</h2>
        <div className="relative group cursor-pointer inline-flex items-center">
          <Info className="w-4 h-4 text-slate-400 hover:text-indigo-500 transition-colors" />
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded-lg py-2 px-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 shadow-lg text-center font-normal">
            The first page each session viewed — shows which pages actually bring visitors into the site, as opposed to pages viewed later in a visit.
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-sm border-b border-slate-200 dark:border-slate-700">
              <th className="py-3 px-6 font-medium">Landing Page</th>
              <th className="py-3 px-6 font-medium text-right">Sessions</th>
              <th className="py-3 px-6 font-medium text-right">Users</th>
              <th className="py-3 px-6 font-medium text-right">Bounce Rate</th>
              <th className="py-3 px-6 font-medium text-right">Avg. Session</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {rows.map((row, idx) => (
              <tr key={idx} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="py-3 px-6 text-slate-900 dark:text-slate-100 font-medium max-w-xs truncate" title={row.path}>{row.path}</td>
                <td className="py-3 px-6 text-slate-900 dark:text-slate-100 text-right font-medium">{row.sessions.toLocaleString()}</td>
                <td className="py-3 px-6 text-slate-600 dark:text-slate-400 text-right">{row.users.toLocaleString()}</td>
                <td className="py-3 px-6 text-slate-600 dark:text-slate-400 text-right">{row.bounceRate}%</td>
                <td className="py-3 px-6 text-slate-600 dark:text-slate-400 text-right">{row.avgSessionDuration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
