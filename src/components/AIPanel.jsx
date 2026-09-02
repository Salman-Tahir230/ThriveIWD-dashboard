import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { trafficSourceData, leadsData } from '../data/mockData';

export default function AIPanel() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY;
      if (!apiKey || apiKey === 'your_key_here') {
        throw new Error("Missing Groq API key in .env file.");
      }

      const promptText = `
Based on the following data, provide 3 to 5 short business insights in plain English. One sentence each.
Traffic Sources: ${JSON.stringify(trafficSourceData)}
Leads (recent): ${JSON.stringify(leadsData.slice(0, 10))}

Return the insights as a simple bulleted list, starting each insight with a dash (-). Do not include any other text.
`;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-20b',
          messages: [{ role: 'user', content: promptText }],
          temperature: 0.7,
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Groq API Error:', errorData);
        throw new Error(`API Error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || "";
      
      const parsedInsights = content
        .split('\n')
        .map(line => line.trim().replace(/^[-*]\s*/, '').trim())
        .filter(line => line.length > 0 && !line.startsWith('Here are'));

      setInsights(parsedInsights);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

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
