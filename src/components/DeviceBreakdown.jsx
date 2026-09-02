import React from 'react';
import { deviceData } from '../data/mockData';
import { Smartphone, Info } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function DeviceBreakdown() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden mt-6 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-indigo-500" />
          Device Breakdown
          <div className="relative group cursor-pointer">
            <Info className="w-4 h-4 text-slate-400 hover:text-indigo-500 transition-colors" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded-lg py-2 px-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 shadow-lg text-center font-normal">
              Breakdown of visitors by device type, with a sub-split of mobile operating systems.
              <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-900 dark:border-t-slate-700"></div>
            </div>
          </div>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[300px]">
        {/* Main Device Pie Chart */}
        <div className="relative h-full flex flex-col items-center">
          <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Device Type</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={deviceData.mainBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {deviceData.mainBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => `${value}%`}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Mobile OS Pie Chart */}
        <div className="relative h-full flex flex-col items-center">
          <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Mobile OS</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={deviceData.mobileOS}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={5}
                dataKey="value"
              >
                {deviceData.mobileOS.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => `${value}%`}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
