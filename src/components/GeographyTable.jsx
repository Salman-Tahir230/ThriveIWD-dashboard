import React, { useMemo } from 'react';
import { geographyData } from '../data/mockData';
import { Info, MapPin } from 'lucide-react';

export default function GeographyTable() {
  const sortedData = useMemo(() => {
    return [...geographyData].sort((a, b) => b.userCount - a.userCount);
  }, []);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mt-6">
      <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <MapPin className="w-5 h-5 text-indigo-500" />
          User Geography
        </h2>
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
            {sortedData.map((row, idx) => (
              <tr 
                key={idx} 
                className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <td className="py-3 px-6 text-slate-900 dark:text-slate-100 font-medium">{row.city}</td>
                <td className="py-3 px-6 text-slate-600 dark:text-slate-400">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    row.country === 'Canada' 
                      ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                      : 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                  }`}>
                    {row.country}
                  </span>
                </td>
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
