import { useEffect, useState } from 'react';
import { RefreshCw, AlertCircle, Info } from 'lucide-react';

const TIERS = [
  { key: 'VAP FLEX', label: 'VAP Flex' },
  { key: 'VAP CONNECT', label: 'VAP Connect' },
  { key: 'VAP LIVE', label: 'VAP Live' },
];

export default function Funnel() {
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

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-[#E1E9E3] shadow-card p-6">
        <div className="flex items-center gap-3 text-slate-500">
          <RefreshCw size={18} className="animate-spin" />
          <span className="text-sm">Loading VAP checkout funnel from Stripe…</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-[#E1E9E3] shadow-card p-6">
        <div className="flex items-center gap-3 text-rose-600">
          <AlertCircle size={18} />
          <span className="text-sm">Failed to load funnel: {error}</span>
        </div>
      </div>
    );
  }

  const { vap } = data;

  return (
    <div className="bg-white rounded-xl border border-[#E1E9E3] shadow-card p-6">
      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-sm font-semibold text-slate-900">VAP Signup Funnel</h2>
        <div className="relative group cursor-pointer inline-flex items-center">
          <Info className="w-3.5 h-3.5 text-slate-400 hover:text-brand-600 transition-colors" />
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 bg-slate-900 text-white text-xs rounded-lg py-2 px-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 shadow-lg text-center font-normal">
            VAP registration and payment happen on Stripe's hosted Checkout page, off thriveiwd.com — so GA4 never sees this step. Uses real Stripe checkout session data (all-time) instead.
          </div>
        </div>
      </div>
      <p className="text-xs text-slate-400 mb-5">Checkout Started → Payment Completed, all-time Stripe data, by tier</p>

      <div className="grid gap-[18px]" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {TIERS.map(({ key, label }) => {
          const paid = vap.paidByTier[key] || 0;
          const pending = vap.pendingByTier[key] || 0;
          const started = paid + pending;
          const completionRate = started > 0 ? Math.round((paid / started) * 100) : 0;
          const paidWidth = started > 0 ? Math.max(Math.round((paid / started) * 100), 34) : 34;

          return (
            <div key={key}>
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-sm font-semibold text-slate-900">{label}</span>
                <span className="text-xs text-slate-400">{completionRate}% completed</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="h-[26px] rounded-md bg-[#EBF1EC] flex items-center">
                  <div className="h-full w-full rounded-md bg-[#CFE4D8] flex items-center justify-between px-2.5 text-[11.5px] font-semibold text-slate-800">
                    <span>Started</span>
                    <span>{started}</span>
                  </div>
                </div>
                <div className="h-[26px] rounded-md bg-[#EBF1EC]">
                  <div
                    className="h-full rounded-md bg-brand-600 flex items-center justify-between px-2.5 text-[11.5px] font-semibold text-white"
                    style={{ width: `${paidWidth}%` }}
                  >
                    <span>Paid</span>
                    <span>{paid}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
