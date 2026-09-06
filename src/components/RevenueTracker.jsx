import { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { RefreshCw, AlertCircle } from 'lucide-react';

const TIERS = [
  { key: 'VAP FLEX', label: 'VAP Flex' },
  { key: 'VAP CONNECT', label: 'VAP Connect' },
  { key: 'VAP LIVE', label: 'VAP Live' },
];

function formatCAD(cents) {
  return (cents / 100).toLocaleString(undefined, { style: 'currency', currency: 'CAD' });
}

export default function RevenueTracker() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
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
      month: new Date(m.month + '-02').toLocaleString('en-US', { month: 'short' }),
      amount: m.amount / 100,
    }));
  }, [data]);

  if (loading) {
    return (
      <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] shadow-card p-6 flex items-center gap-3 text-[var(--text-muted)]">
        <RefreshCw size={18} className="animate-spin" />
        <span className="text-sm">Loading revenue from Stripe…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] shadow-card p-6 flex items-center gap-3 text-rose-600">
        <AlertCircle size={18} />
        <span className="text-sm">Failed to load revenue: {error}</span>
      </div>
    );
  }

  const { vap } = data;

  return (
    <div className="space-y-6">
      <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] shadow-card p-6">
        <p className="text-xs text-[var(--text-muted)] mb-1">Total Revenue · all-time, Stripe</p>
        <div className="text-4xl font-bold text-[var(--text)] mb-4">{formatCAD(data.totalRevenue)}</div>
        <div className="flex flex-wrap gap-8">
          <div>
            <div className="text-xs text-[var(--text-muted)]">VAP Paid</div>
            <div className="text-lg font-bold text-[var(--text)]">{formatCAD(vap.paidTotal)}</div>
          </div>
          <div>
            <div className="text-xs text-[var(--text-muted)]">Completed Payments</div>
            <div className="text-lg font-bold text-[var(--text)]">{vap.paidCount}</div>
          </div>
          <div>
            <div className="text-xs text-[var(--text-muted)]">Pending Checkout</div>
            <div className="text-lg font-bold text-[var(--warn)]">{vap.pendingCount}</div>
          </div>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] shadow-card p-6">
          <h2 className="text-sm font-semibold text-[var(--text)] mb-4">Monthly Revenue</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: '#F7FAF8' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', fontSize: '12px' }}
                  formatter={(value) => [`$${value.toLocaleString()} CAD`, 'Revenue']}
                />
                <Bar dataKey="amount" name="Revenue" fill="#2E7D52" radius={[4, 4, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] shadow-card overflow-hidden">
        <div className="px-6 pt-6 pb-4">
          <h2 className="text-sm font-semibold text-[var(--text)]">By Product / Tier</h2>
        </div>
        {data.byProduct.length === 0 ? (
          <p className="px-6 pb-6 text-sm text-[var(--text-muted)]">No paid transactions yet.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--table-head-bg)] text-[var(--text-muted)] text-[11px] uppercase tracking-wide border-y border-[var(--border)]">
                <th className="py-2.5 px-6 font-medium">Product</th>
                <th className="py-2.5 px-6 font-medium text-right">Paid Count</th>
                <th className="py-2.5 px-6 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {data.byProduct.map((p) => (
                <tr key={p.product} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--subtle-bg)] transition-colors">
                  <td className="py-3 px-6 text-[var(--text)]">{p.product}</td>
                  <td className="py-3 px-6 text-[var(--text-muted)] text-right">{p.count}</td>
                  <td className="py-3 px-6 text-[var(--text)] font-semibold text-right">{formatCAD(p.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] shadow-card overflow-hidden">
        <div className="px-6 pt-6 pb-4">
          <h2 className="text-sm font-semibold text-[var(--text)]">VAP Funnel × Payment Status</h2>
          <p className="text-xs text-[var(--text-muted)]">Checkout sessions by tier and outcome</p>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--table-head-bg)] text-[var(--text-muted)] text-[11px] uppercase tracking-wide border-y border-[var(--border)]">
              <th className="py-2.5 px-6 font-medium">Tier</th>
              <th className="py-2.5 px-6 font-medium text-right">Paid</th>
              <th className="py-2.5 px-6 font-medium text-right">Pending</th>
              <th className="py-2.5 px-6 font-medium text-right">Total</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {TIERS.map(({ key, label }) => {
              const paid = vap.paidByTier[key] || 0;
              const pending = vap.pendingByTier[key] || 0;
              return (
                <tr key={key} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--subtle-bg)] transition-colors">
                  <td className="py-3 px-6 text-[var(--text)]">{label}</td>
                  <td className="py-3 px-6 text-[var(--accent)] font-semibold text-right">{paid}</td>
                  <td className="py-3 px-6 text-[var(--warn)] font-semibold text-right">{pending}</td>
                  <td className="py-3 px-6 text-[var(--text-muted)] text-right">{paid + pending}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
