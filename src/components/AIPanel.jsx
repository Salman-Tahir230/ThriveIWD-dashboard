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
    <div className="bg-white rounded-xl border border-[#E1E9E3] shadow-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-600" />
          <h2 className="text-sm font-semibold text-slate-900">AI Insights</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">Generated from last 30 days</span>
          <button
            onClick={fetchInsights}
            disabled={loading}
            className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-md transition-colors disabled:opacity-50"
            title="Refresh insights"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading && insights.length === 0 ? (
        <div className="flex items-center gap-3 text-slate-500">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <p className="text-sm">Analyzing data to generate insights...</p>
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 text-rose-600 bg-rose-50 p-4 rounded-lg">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      ) : (
        <ul className="space-y-2.5">
          {insights.map((insight, idx) => (
            <li key={idx} className="flex gap-2.5 text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
              <p className="text-sm leading-relaxed">{insight}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
