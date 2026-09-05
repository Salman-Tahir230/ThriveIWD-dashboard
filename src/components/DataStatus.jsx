import { AlertCircle, RefreshCw } from 'lucide-react';
import { useDashboardData } from '../context/DashboardDataContext';

// Shows a loading/error banner for the shared GA4 + Sheets data fetch.
// Renders nothing once data has loaded successfully.
export default function DataStatus() {
  const { loading, error, refetch } = useDashboardData();

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
        <RefreshCw className="w-4 h-4 animate-spin" />
        <p className="text-sm">Loading live data from Google Analytics &amp; Sheets…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-between gap-3 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-900/40 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">Failed to load live data: {error}</p>
        </div>
        <button
          onClick={refetch}
          className="text-sm font-medium underline hover:no-underline flex-shrink-0"
        >
          Retry
        </button>
      </div>
    );
  }

  return null;
}
