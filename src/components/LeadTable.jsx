import { useState } from 'react';
import { leadsData } from '../data/mockData';

export default function LeadTable() {
  const [sourceFilter, setSourceFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All Time');

  const filteredLeads = leadsData.filter(lead => {
    // Source filter
    if (sourceFilter !== 'All' && lead.source !== sourceFilter) {
      return false;
    }
    
    // Date filter
    if (dateFilter !== 'All Time') {
      const leadDate = new Date(lead.date);
      const now = new Date();
      // Set hours to 0 to compare just dates easily if needed, but exact time diff is fine too
      const diffTime = Math.abs(now - leadDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      if (dateFilter === 'Last 7 Days' && diffDays > 7) return false;
      if (dateFilter === 'Last 30 Days' && diffDays > 30) return false;
      if (dateFilter === 'Last 90 Days' && diffDays > 90) return false;
    }

    return true;
  });

  const getStatusBadge = (status) => {
    switch(status) {
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
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Leads</h2>
        <div className="flex gap-4">
          <select 
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="border border-gray-200 bg-gray-50 text-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors cursor-pointer"
          >
            <option value="All">All Sources</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Form">Form</option>
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
                  No leads found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
