import { useMemo, useState } from 'react';
import { useDashboardData } from '../context/DashboardDataContext';

// The Google Sheet's exact column names aren't known ahead of time, so match
// common variants case-insensitively instead of assuming a fixed schema.
function findField(row, candidates) {
  const keys = Object.keys(row);
  for (const candidate of candidates) {
    const key = keys.find((k) => k.toLowerCase().trim() === candidate);
    if (key) return row[key];
  }
  return '';
}

function normalizeLead(row, idx) {
  return {
    id: idx,
    name: findField(row, ['name', 'full name', 'lead name']) || '—',
    source: findField(row, ['source', 'lead source', 'channel']) || 'Unknown',
    date: findField(row, ['date', 'timestamp', 'created', 'submitted at']) || '',
    location: findField(row, ['location', 'city']) || '—',
    status: findField(row, ['status', 'lead status']) || 'New',
  };
}

export default function LeadTable() {
  const { leads } = useDashboardData();
  const [sourceFilter, setSourceFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All Time');

  const normalizedLeads = useMemo(() => {
    const rows = leads?.leads || [];
    return rows.map(normalizeLead);
  }, [leads]);

  const sources = useMemo(
    () => Array.from(new Set(normalizedLeads.map((l) => l.source))).filter(Boolean),
    [normalizedLeads]
  );

  const filteredLeads = normalizedLeads.filter((lead) => {
    if (sourceFilter !== 'All' && lead.source !== sourceFilter) {
      return false;
    }

    if (dateFilter !== 'All Time' && lead.date) {
      const leadDate = new Date(lead.date);
      if (!isNaN(leadDate.getTime())) {
        const now = new Date();
        const diffDays = Math.ceil(Math.abs(now - leadDate.getTime()) / (1000 * 60 * 60 * 24));
        if (dateFilter === 'Last 7 Days' && diffDays > 7) return false;
        if (dateFilter === 'Last 30 Days' && diffDays > 30) return false;
        if (dateFilter === 'Last 90 Days' && diffDays > 90) return false;
      }
    }

    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'New':
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold shadow-sm">New</span>;
      case 'Contacted':
        return <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold shadow-sm">Contacted</span>;
      case 'Converted':
        return <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-semibold shadow-sm">Converted</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold shadow-sm">{status}</span>;
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
          Leads {leads?.sheetName ? <span className="text-sm font-normal text-gray-400">({leads.sheetName})</span> : null}
        </h2>
        <div className="flex gap-4">
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="border border-gray-200 bg-gray-50 text-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors cursor-pointer"
          >
            <option value="All">All Sources</option>
            {sources.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border border-gray-200 bg-gray-50 text-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors cursor-pointer"
          >
            <option value="All Time">All Time</option>
            <option value="Last 7 Days">Last 7 Days</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="Last 90 Days">Last 90 Days</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-100">
        <table className="w-full text-left border-collapse bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Source</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Location</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-indigo-50/30 transition-colors duration-150">
                <td className="py-4 px-6 text-sm text-gray-800 font-semibold">{lead.name}</td>
                <td className="py-4 px-6 text-sm text-gray-600">{lead.source}</td>
                <td className="py-4 px-6 text-sm text-gray-600">{lead.date}</td>
                <td className="py-4 px-6 text-sm text-gray-600">{lead.location}</td>
                <td className="py-4 px-6">{getStatusBadge(lead.status)}</td>
              </tr>
            ))}
            {filteredLeads.length === 0 && (
              <tr>
                <td colSpan="5" className="py-12 text-center text-gray-500 text-sm">
                  {normalizedLeads.length === 0
                    ? 'No leads found in the connected Google Sheet.'
                    : 'No leads found matching your filters.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
