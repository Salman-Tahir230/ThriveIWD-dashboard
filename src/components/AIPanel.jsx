import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { useDashboardData } from '../context/DashboardDataContext';
import { parseGA4Report, parseGA4Overview } from '../lib/ga4';

export default function AIPanel() {
  const { analytics, leads, loading: dataLoading } = useDashboardData();
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const overview = analytics?.overview ? parseGA4Overview(analytics.overview) : {};
      const trafficSources = analytics?.trafficSources ? parseGA4Report(analytics.trafficSources) : [];
      const recentLeads = (leads?.leads || []).slice(0, 10);

      const response = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ overview, trafficSources, leads: recentLeads }),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || `API Error: ${response.status}`);
      }

      setInsights(data.insights || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!dataLoading) {
      fetchInsights();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataLoading]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">AI Insights</h2>
        </div>
        <button 
          onClick={fetchInsights}
          disabled={loading}
          className="p-2 text-slate-500 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
          title="Refresh insights"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {loading && insights.length === 0 ? (
        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <p className="text-sm">Analyzing data to generate insights...</p>
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 p-4 rounded-lg">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {insights.map((insight, idx) => (
            <li key={idx} className="flex gap-3 text-slate-600 dark:text-slate-300">
              <Sparkles className="w-4 h-4 text-indigo-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm leading-relaxed">{insight}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
