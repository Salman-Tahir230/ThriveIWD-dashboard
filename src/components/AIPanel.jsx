import { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { useDashboardData } from '../context/DashboardDataContext';
import { parseGA4Report, parseGA4Overview } from '../lib/ga4';

const CACHE_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours — avoid re-calling Groq on every page load
const cacheKey = (dateRange) => `thrive-ai-insights-cache-${dateRange}`;

function readCache(dateRange) {
  try {
    const raw = localStorage.getItem(cacheKey(dateRange));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.insights) || Date.now() - parsed.timestamp > CACHE_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}
//data range 
function writeCache(dateRange, insights) {
  try {
    localStorage.setItem(cacheKey(dateRange), JSON.stringify({ timestamp: Date.now(), insights }));
  } catch {
    // localStorage unavailable (private browsing, quota) — caching is a nice-to-have, not required
  }
}

function timeAgo(timestamp) {
  const mins = Math.round((Date.now() - timestamp) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  return `${hours}h ago`;
}

export default function AIPanel() {
  const { analytics, leads, loading: dataLoading, dateRange, rangeLabel } = useDashboardData();
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedAt, setGeneratedAt] = useState(null);

  const fetchInsights = async (force = false) => {
    if (!force) {
      const cached = readCache(dateRange);
      if (cached) {
        setInsights(cached.insights);
        setGeneratedAt(cached.timestamp);
        setError(null);
        return;
      }
    }

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
      setGeneratedAt(Date.now());
      writeCache(dateRange, data.insights || []);
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
  }, [dataLoading, dateRange]);

  return (
    <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] shadow-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[var(--accent)]" />
          <h2 className="text-sm font-semibold text-[var(--text)]">AI Insights</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[var(--text-muted)]">
            Based on {rangeLabel}{generatedAt ? ` · updated ${timeAgo(generatedAt)}` : ''}
          </span>
          <button
            onClick={() => fetchInsights(true)}
            disabled={loading}
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-soft)] rounded-md transition-colors disabled:opacity-50"
            title="Refresh insights now (otherwise refreshes automatically every 2 hours)"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading && insights.length === 0 ? (
        <div className="flex items-center gap-3 text-[var(--text-muted)]">
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
            <li key={idx} className="flex gap-2.5 text-[var(--text-soft)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-1.5 flex-shrink-0" />
              <p className="text-sm leading-relaxed">{insight}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
