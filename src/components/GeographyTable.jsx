import React, { useMemo } from 'react';
import { useDashboardData } from '../context/DashboardDataContext';
import { parseGA4Report, formatSeconds } from '../lib/ga4';
import { Info, MapPin, Globe } from 'lucide-react';

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
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mt-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">User Geography</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">No GA4 geography data available for the last 30 days.</p>
      </div>
    );
  }

  const totalUsers = countryData.reduce((sum, r) => sum + r.userCount, 0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mt-6">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
        <Globe className="w-5 h-5 text-indigo-500" />
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Traffic by Country</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-sm border-b border-slate-200 dark:border-slate-700">
              <th className="py-3 px-6 font-medium">Country</th>
              <th className="py-3 px-6 font-medium text-right">Users</th>
              <th className="py-3 px-6 font-medium text-right">Sessions</th>
              <th className="py-3 px-6 font-medium text-right">Share</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {countryData.map((row) => (
              <tr key={row.country} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="py-3 px-6 text-slate-900 dark:text-slate-100 font-medium">{row.country}</td>
                <td className="py-3 px-6 text-slate-900 dark:text-slate-100 text-right font-medium">{row.userCount.toLocaleString()}</td>
                <td className="py-3 px-6 text-slate-600 dark:text-slate-400 text-right">{row.sessions.toLocaleString()}</td>
                <td className="py-3 px-6 text-slate-600 dark:text-slate-400 text-right">
                  {totalUsers > 0 ? `${Math.round((row.userCount / totalUsers) * 100)}%` : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-6 border-t border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-indigo-500" />
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">By City</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-sm border-b border-slate-200 dark:border-slate-700">
              <th className="py-3 px-6 font-medium">City</th>
              <th className="py-3 px-6 font-medium">Country</th>
              <th className="py-3 px-6 font-medium text-right">Users</th>
              <th className="py-3 px-6 font-medium text-right">
                <div className="flex items-center justify-end gap-1">
                  Avg. Session
                  <div className="relative group cursor-pointer inline-flex items-center">
                    <Info className="w-4 h-4 text-slate-400 hover:text-indigo-500 transition-colors" />
                    <div className="absolute right-0 bottom-full mb-2 w-56 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded-lg py-2 px-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 shadow-lg font-normal whitespace-normal text-center">
                      The average amount of time users from this location spend on the site per visit.
                      <div className="absolute right-2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-900 dark:border-t-slate-700"></div>
                    </div>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {cityData.map((row, idx) => (
              <tr
                key={idx}
                className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <td className="py-3 px-6 text-slate-900 dark:text-slate-100 font-medium">{row.city}</td>
                <td className="py-3 px-6 text-slate-600 dark:text-slate-400">{row.country}</td>
                <td className="py-3 px-6 text-slate-900 dark:text-slate-100 text-right font-medium">{row.userCount.toLocaleString()}</td>
                <td className="py-3 px-6 text-slate-600 dark:text-slate-400 text-right">{row.avgSessionDuration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
