import React from 'react';
import { pageAnalyticsData } from '../data/mockData';
import { Info, Clock, Activity, MousePointerClick, ArrowRight } from 'lucide-react';

export default function PageAnalytics() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          Page Analytics
          <div className="relative group cursor-pointer">
            <Info className="w-4 h-4 text-slate-400 hover:text-indigo-500 transition-colors" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded-lg py-2 px-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 shadow-lg text-center font-normal">
              Bounce rate is the percentage of visitors who leave the site after viewing only one page. Click path shows the most common sequence of pages visited.
              <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-900 dark:border-t-slate-700"></div>
            </div>
          </div>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pageAnalyticsData.map((data, idx) => (
          <div key={idx} className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-5 border border-slate-100 dark:border-slate-800 hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-colors">
            <h3 className="text-base font-medium text-slate-900 dark:text-white mb-4">{data.page}</h3>
            
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200 dark:border-slate-800">
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

            <div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
                <MousePointerClick className="w-3.5 h-3.5" />
                Top Click Paths
              </div>
              <div className="space-y-2">
                {data.topClickPaths.map((path, pIdx) => (
                  <div key={pIdx} className="flex items-center flex-wrap gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                    {path.split(' -> ').map((step, sIdx, arr) => (
                      <React.Fragment key={sIdx}>
                        <span className="bg-white dark:bg-slate-800 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm">{step}</span>
                        {sIdx < arr.length - 1 && <ArrowRight className="w-3 h-3 text-slate-400" />}
                      </React.Fragment>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
