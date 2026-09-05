import React from 'react';
import { Info, Clock, Activity } from 'lucide-react';
import { useDashboardData } from '../context/DashboardDataContext';
import { parseGA4Report } from '../lib/ga4';

export default function PageAnalytics() {
  const { analytics } = useDashboardData();

  const pageAnalyticsData = (analytics?.pages ? parseGA4Report(analytics.pages) : []).map((row) => ({
    title: row.pageTitle || row.pagePath || 'Unknown',
    path: row.pagePath || '',
    avgTimeSpent: Math.round(Number(row.averageSessionDuration) || 0),
    bounceRate: Math.round((Number(row.bounceRate) || 0) * 100),
    views: Number(row.screenPageViews) || 0,
  }));

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          Page Analytics
          <div className="relative group cursor-pointer">
            <Info className="w-4 h-4 text-slate-400 hover:text-indigo-500 transition-colors" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded-lg py-2 px-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 shadow-lg text-center font-normal">
              Bounce rate is the percentage of visitors who leave the site after viewing only one page.
              <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-900 dark:border-t-slate-700"></div>
            </div>
          </div>
        </h2>
      </div>

      {pageAnalyticsData.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">No GA4 page data available for the last 30 days.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pageAnalyticsData.map((data, idx) => (
            <div key={idx} className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-5 border border-slate-100 dark:border-slate-800 hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-colors">
              <h3 className="text-base font-medium text-slate-900 dark:text-white mb-1 truncate" title={data.title}>{data.title}</h3>
              <div className="text-xs text-slate-400 dark:text-slate-500 mb-4 truncate" title={data.path}>{data.path}</div>

              <div className="flex justify-between items-center pb-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Avg Time</div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">{data.avgTimeSpent}s</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Bounce Rate</div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">{data.bounceRate}%</div>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-400 dark:text-slate-500 mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                {data.views.toLocaleString()} page views (last 30 days)
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
