import { useEffect, useState } from 'react';
import { RefreshCw, AlertCircle, Info } from 'lucide-react';

const TIERS = ['VAP FLEX', 'VAP CONNECT', 'VAP LIVE'];

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
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
          <RefreshCw size={18} className="animate-spin" />
          <span className="text-sm">Loading VAP checkout funnel from Stripe…</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
          <AlertCircle size={18} />
          <span className="text-sm">Failed to load funnel: {error}</span>
        </div>
      </div>
    );
  }

  const { vap } = data;
  const started = vap.paidCount + vap.pendingCount;
  const completionRate = started > 0 ? Math.round((vap.paidCount / started) * 100) : 0;

  const stages = [
    { label: 'Checkout Started', count: started },
    { label: 'Payment Completed', count: vap.paidCount },
  ];
  const maxCount = Math.max(...stages.map((s) => s.count), 1);

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">VAP Signup Funnel</h2>
        <div className="relative group cursor-pointer inline-flex items-center">
          <Info className="w-4 h-4 text-slate-400 hover:text-indigo-500 transition-colors" />
          <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded-lg py-2 px-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 shadow-lg text-center font-normal">
            VAP registration and payment happen on Stripe's hosted Checkout page, off thriveiwd.com — so GA4 never sees this step. This funnel uses real Stripe checkout session data (all-time) instead. It doesn't cover earlier steps (site visit → landing on a VAP page), which would need conversion events added to the site itself.
          </div>
        </div>
      </div>
      <p className="text-xs text-slate-400 dark:text-slate-500 mb-6">All-time Stripe checkout data, not limited to the last 30 days.</p>

      <div className="flex flex-col items-center gap-1 w-full max-w-2xl mx-auto mb-6">
        {stages.map((stage, index) => {
          const widthPercent = `${Math.max((stage.count / maxCount) * 100, 12)}%`;
          return (
            <div key={stage.label} className="w-full flex flex-col items-center gap-1">
              <div
                className="bg-indigo-500 dark:bg-indigo-600 rounded flex items-center justify-between px-4 py-3 text-white font-medium shadow-sm transition-all"
                style={{ width: widthPercent, minWidth: '180px' }}
              >
                <span>{stage.label}</span>
                <span>{stage.count}</span>
              </div>
              {index === 0 && (
                <div className="text-slate-400 dark:text-slate-500 text-sm font-medium py-1">
                  {completionRate}% completed payment
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">By tier</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-500 dark:text-slate-400 text-xs">
              <th className="text-left font-medium pb-2">Tier</th>
              <th className="text-right font-medium pb-2">Started</th>
              <th className="text-right font-medium pb-2">Paid</th>
            </tr>
          </thead>
          <tbody>
            {TIERS.map((tier) => {
              const pending = vap.pendingByTier[tier] || 0;
              const paid = vap.paidByTier[tier] || 0;
              return (
                <tr key={tier} className="border-t border-slate-100 dark:border-slate-800">
                  <td className="py-2 text-slate-900 dark:text-slate-100">{tier}</td>
                  <td className="py-2 text-right text-slate-600 dark:text-slate-400">{pending + paid}</td>
                  <td className="py-2 text-right text-slate-600 dark:text-slate-400">{paid}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
