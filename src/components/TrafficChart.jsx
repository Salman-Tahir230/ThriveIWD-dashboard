import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { HelpCircle } from 'lucide-react';
import { trafficSourceData } from '../data/mockData';

const COLORS = ['#14B8A6', '#3B82F6', '#8B5CF6', '#F59E0B', '#64748b'];

export default function TrafficChart() {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 mt-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Traffic Source Comparison</h2>
          <div className="group relative flex items-center">
            <HelpCircle size={18} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-56 p-2 bg-slate-900 text-white text-xs rounded shadow-lg z-10 text-center">
              Compare lead volumes and their respective share percentages across different marketing channels.
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div className="h-72">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4 text-center">Lead Count per Source</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trafficSourceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#CBD5E1" />
              <XAxis dataKey="source" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
              <RechartsTooltip 
                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', color: '#0F172A' }}
              />
              <Bar dataKey="leadCount" radius={[4, 4, 0, 0]}>
                {trafficSourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="h-72">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4 text-center">Share % per Source</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={trafficSourceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="leadCount"
                nameKey="source"
              >
                {trafficSourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip 
                formatter={(value, name) => {
                  const total = trafficSourceData.reduce((sum, item) => sum + item.leadCount, 0);
                  const percent = ((value / total) * 100).toFixed(1);
                  return [`${percent}% (${value})`, name];
                }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', color: '#0F172A' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {trafficSourceData.map((entry, index) => (
              <div key={entry.source} className="flex items-center text-xs text-slate-600 dark:text-slate-300">
                <div className="w-3 h-3 rounded-full mr-1.5" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                {entry.source}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
