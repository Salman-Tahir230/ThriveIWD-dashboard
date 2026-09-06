import { useMemo } from 'react';
import { useDashboardData } from '../context/DashboardDataContext';
import { parseGA4Report } from '../lib/ga4';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const GREEN_SHADES = ['#2E7D52', '#5B8F72', '#B7D2C0', '#8FB89E', '#DCE9E0'];

function toPercentSlices(counts) {
  const total = Object.values(counts).reduce((sum, v) => sum + v, 0);
  if (total === 0) return [];
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value], idx) => ({
      name,
      value: Math.round((value / total) * 1000) / 10,
      fill: GREEN_SHADES[idx % GREEN_SHADES.length],
    }));
}

function DonutCard({ title, data }) {
  return (
    <div className="bg-white rounded-xl border border-[#E1E9E3] shadow-card p-6">
      <h3 className="text-sm font-semibold text-slate-900 mb-4">{title}</h3>
      {data.length === 0 ? (
        <p className="text-sm text-slate-500">No data available for the last 30 days.</p>
      ) : (
        <div className="flex items-center gap-6">
          <div className="w-32 h-32 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={35} outerRadius={58} paddingAngle={3} dataKey="value">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {data.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2 text-sm">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: entry.fill }} />
                <span className="text-slate-700">{entry.name}</span>
                <span className="text-slate-400">{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DeviceBreakdown() {
  const { analytics } = useDashboardData();

  const deviceData = useMemo(() => {
    const rows = analytics?.devices ? parseGA4Report(analytics.devices) : [];

    const byDeviceType = {};
    const byMobileOS = {};
    rows.forEach((row) => {
      const category = (row.deviceCategory || 'unknown').toLowerCase();
      const os = row.operatingSystem || 'Unknown';
      const users = Number(row.totalUsers) || 0;
      byDeviceType[category] = (byDeviceType[category] || 0) + users;
      if (category === 'mobile') {
        byMobileOS[os] = (byMobileOS[os] || 0) + users;
      }
    });

    return {
      mainBreakdown: toPercentSlices(byDeviceType).map((d) => ({ ...d, name: d.name.charAt(0).toUpperCase() + d.name.slice(1) })),
      mobileOS: toPercentSlices(byMobileOS),
    };
  }, [analytics]);

  return (
    <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
      <DonutCard title="Device Type" data={deviceData.mainBreakdown} />
      <DonutCard title="Mobile OS" data={deviceData.mobileOS} />
    </div>
  );
}
