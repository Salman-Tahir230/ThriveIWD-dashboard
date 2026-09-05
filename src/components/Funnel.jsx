import { AlertTriangle } from 'lucide-react';

export default function Funnel() {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Session Funnel</h2>
      <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-900/40 rounded-lg p-4 text-amber-800 dark:text-amber-300">
        <AlertTriangle size={20} className="flex-shrink-0 mt-0.5" />
        <p className="text-sm leading-relaxed">
          <strong>No funnel data source is connected.</strong> A Landing → Browse → Signup → Payment
          funnel requires custom GA4 conversion events to be configured on thriveiwd.com (the
          standard GA4 Data API used here doesn't expose funnel/exploration reports). Set up those
          events in GA4 to enable this chart.
        </p>
      </div>
    </div>
  );
}
