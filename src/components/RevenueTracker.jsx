import { useEffect, useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { RefreshCw, AlertCircle, Clock } from 'lucide-react';

function formatCAD(cents) {
  return (cents / 100).toLocaleString(undefined, { style: 'currency', currency: 'CAD' });
}

export default function RevenueTracker() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch('/api/revenue')
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        if (json.error) throw new Error(json.error);
        setData(json);
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const chartData = useMemo(() => {
    if (!data) return [];
    return data.byMonth.map((m) => ({
      month: m.month,
      amount: m.amount / 100,
    }));
  }, [data]);

  if (loading) {
    return (
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#6b7280' }}>
          <RefreshCw size={18} className="animate-spin" />
          <span>Loading revenue from Stripe…</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={cardStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#b91c1c' }}>
          <AlertCircle size={18} />
          <span>Failed to load revenue: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <h2 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', color: '#111827' }}>Revenue Tracker</h2>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '24px' }}>
        <span style={{ fontSize: '2.5rem', fontWeight: '800', color: '#111827' }}>
          {formatCAD(data.totalRevenue)}
        </span>
        <span style={{ fontSize: '1rem', color: '#6b7280', fontWeight: '500' }}>
          total revenue (all products, Stripe live data)
        </span>
      </div>

      {chartData.length > 0 && (
        <div style={{ height: '320px', width: '100%', marginBottom: '32px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(v) => `$${v}`} dx={-10} />
              <Tooltip
                cursor={{ fill: '#f3f4f6' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                formatter={(value) => [`$${value.toLocaleString()} CAD`, 'Revenue']}
              />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="amount" name="Revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>By product</h3>
      <div style={{ marginBottom: '32px' }}>
        {data.byProduct.length === 0 ? (
          <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>No paid transactions yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <tbody>
              {data.byProduct.map((p) => (
                <tr key={p.product} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '8px 0', color: '#111827' }}>{p.product}</td>
                  <td style={{ padding: '8px 0', color: '#6b7280', textAlign: 'right' }}>{p.count} paid</td>
                  <td style={{ padding: '8px 0', color: '#111827', fontWeight: 600, textAlign: 'right' }}>{formatCAD(p.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>VAP Program (Flex / Connect / Live)</h3>
        <p style={{ fontSize: '0.8125rem', color: '#6b7280', marginBottom: '16px' }}>
          Revenue specific to the VAP tiers registrants sign up for on the Leads page.
        </p>

        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: data.vap.pendingCount > 0 ? '16px' : 0 }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Paid</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827' }}>{formatCAD(data.vap.paidTotal)}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Completed payments</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827' }}>{data.vap.paidCount}</div>
          </div>
        </div>

        {data.vap.pendingCount > 0 && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '14px', color: '#92400e', fontSize: '0.8125rem', lineHeight: 1.5 }}>
            <Clock size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>{data.vap.pendingCount} registrant{data.vap.pendingCount === 1 ? '' : 's'} started checkout but haven't paid yet</strong>
              {' '}({Object.entries(data.vap.pendingByTier).filter(([, c]) => c > 0).map(([tier, c]) => `${tier}: ${c}`).join(', ')}).
              This matches the "Pending" payment status seen on the Leads page.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const cardStyle = {
  padding: '24px',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  margin: '24px auto',
  maxWidth: '900px',
  fontFamily: '"Inter", "Roboto", sans-serif',
};
