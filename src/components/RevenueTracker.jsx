import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { revenueData } from '../data/mockData';

export default function RevenueTracker() {
  const totalRevenue = useMemo(() => {
    return revenueData.reduce((acc, curr) => acc + curr.Flex + curr.Connect + curr.Live, 0);
  }, []);

  return (
    <div style={{
      padding: '24px',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      margin: '24px auto',
      maxWidth: '900px',
      fontFamily: '"Inter", "Roboto", sans-serif'
    }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
          Revenue Tracker
          <span 
            title="Monthly revenue breakdown by subscription tier" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              width: '18px', 
              height: '18px', 
              borderRadius: '50%', 
              backgroundColor: '#e5e7eb', 
              color: '#6b7280', 
              fontSize: '12px', 
              fontWeight: 'bold', 
              cursor: 'help' 
            }}
          >
            ?
          </span>
        </h2>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span style={{ fontSize: '2.5rem', fontWeight: '800', color: '#111827' }}>
            ${totalRevenue.toLocaleString()}
          </span>
          <span style={{ fontSize: '1rem', color: '#6b7280', fontWeight: '500' }}>CAD Total</span>
        </div>
      </div>

      <div style={{ height: '400px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={revenueData}
            margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickFormatter={(value) => `$${value}`}
              dx={-10}
            />
            <Tooltip 
              cursor={{ fill: '#f3f4f6' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              formatter={(value, name) => [`$${value.toLocaleString()} CAD`, name]}
            />
            <Legend 
              iconType="circle"
              wrapperStyle={{ paddingTop: '20px' }}
            />
            <Bar dataKey="Flex" stackId="a" fill="#6366f1" />
            <Bar dataKey="Connect" stackId="a" fill="#10b981" />
            <Bar dataKey="Live" stackId="a" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
