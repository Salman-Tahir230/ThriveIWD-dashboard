import { useMemo } from 'react';
import { useDashboardData } from '../context/DashboardDataContext';
import { parseGA4Report, formatSeconds } from '../lib/ga4';
import { Info } from 'lucide-react';

export default function GeographyTable() {
  const { analytics } = useDashboardData();

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
      <div className="bg-white rounded-xl border border-[#E1E9E3] shadow-card p-6">
        <h2 className="text-sm font-semibold text-slate-900 mb-2">Traffic by Country</h2>
        <p className="text-sm text-slate-500">No GA4 geography data available for the last 30 days.</p>
      </div>
    );
  }

  const totalUsers = countryData.reduce((sum, r) => sum + r.userCount, 0);

  return (
    <div className="bg-white rounded-xl border border-[#E1E9E3] shadow-card overflow-hidden">
      <div className="px-6 pt-6 pb-4">
        <h2 className="text-sm font-semibold text-slate-900">Traffic by Country</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-slate-400 text-[11px] uppercase tracking-wide border-y border-[#E1E9E3]">
              <th className="py-2.5 px-6 font-medium">Country</th>
              <th className="py-2.5 px-6 font-medium text-right">Users</th>
              <th className="py-2.5 px-6 font-medium text-right">Sessions</th>
              <th className="py-2.5 px-6 font-medium text-right">Share</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {countryData.map((row) => (
              <tr key={row.country} className="border-b border-[#F0F5F2] last:border-0 hover:bg-[#F7FAF8] transition-colors">
                <td className="py-3 px-6 text-slate-800 font-medium">{row.country}</td>
                <td className="py-3 px-6 text-slate-800 text-right font-medium">{row.userCount.toLocaleString()}</td>
                <td className="py-3 px-6 text-slate-500 text-right">{row.sessions.toLocaleString()}</td>
                <td className="py-3 px-6 text-slate-500 text-right">
                  {totalUsers > 0 ? `${Math.round((row.userCount / totalUsers) * 100)}%` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 pt-6 pb-4 border-t border-[#E1E9E3]">
        <h3 className="text-sm font-semibold text-slate-900">By City</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-slate-400 text-[11px] uppercase tracking-wide border-y border-[#E1E9E3]">
              <th className="py-2.5 px-6 font-medium">City</th>
              <th className="py-2.5 px-6 font-medium">Country</th>
              <th className="py-2.5 px-6 font-medium text-right">Users</th>
              <th className="py-2.5 px-6 font-medium text-right">
                <div className="flex items-center justify-end gap-1">
                  Avg. Session
                  <div className="relative group cursor-pointer inline-flex items-center">
                    <Info className="w-3.5 h-3.5 text-slate-400 hover:text-brand-600 transition-colors" />
                    <div className="absolute right-0 bottom-full mb-2 w-56 bg-slate-900 text-white text-xs rounded-lg py-2 px-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 shadow-lg font-normal whitespace-normal text-center">
                      The average amount of time users from this location spend on the site per visit.
                    </div>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {cityData.map((row, idx) => (
              <tr key={idx} className="border-b border-[#F0F5F2] last:border-0 hover:bg-[#F7FAF8] transition-colors">
                <td className="py-3 px-6 text-slate-800 font-medium">{row.city}</td>
                <td className="py-3 px-6 text-slate-500">{row.country}</td>
                <td className="py-3 px-6 text-slate-800 text-right font-medium">{row.userCount.toLocaleString()}</td>
                <td className="py-3 px-6 text-slate-500 text-right">{row.avgSessionDuration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
