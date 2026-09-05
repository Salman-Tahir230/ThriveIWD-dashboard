import { useMemo, useState } from 'react';
import { useDashboardData } from '../context/DashboardDataContext';

function normalizeLead(row, idx) {
  return {
    id: row['Participant ID'] || idx,
    participantId: row['Participant ID'] || '—',
    name: row['Full Name'] || '—',
    email: row['Email'] || '—',
    tier: row['VAP Tier'] || 'Unknown',
    cohort: row['Cohort'] || 'Unknown',
    registrationDate: row['Registration Date'] || '',
    amountDue: row['Amount Due (CAD)'] || '',
    paymentStatus: row['Payment Status'] || 'Unknown',
    participantStatus: row['Participant Status'] || 'Unknown',
  };
}

function getPaymentBadge(status) {
  switch (status) {
    case 'Paid':
      return <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-semibold shadow-sm">Paid</span>;
    case 'Pending':
      return <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold shadow-sm">Pending</span>;
    case 'Refunded':
      return <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-xs font-semibold shadow-sm">Refunded</span>;
    default:
      return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold shadow-sm">{status}</span>;
  }
}

function getParticipantStatusBadge(status) {
  switch (status) {
    case 'Registered':
      return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold shadow-sm">Registered</span>;
    case 'Active':
      return <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-semibold shadow-sm">Active</span>;
    case 'Completed':
      return <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-semibold shadow-sm">Completed</span>;
    case 'Withdrawn':
      return <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-semibold shadow-sm">Withdrawn</span>;
    default:
      return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold shadow-sm">{status}</span>;
  }
}

export default function LeadTable() {
  const { leads } = useDashboardData();
  const [tierFilter, setTierFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [cohortFilter, setCohortFilter] = useState('All');

  const normalizedLeads = useMemo(() => {
    const rows = leads?.leads || [];
    return rows.map(normalizeLead);
  }, [leads]);

  const tiers = useMemo(
    () => Array.from(new Set(normalizedLeads.map((l) => l.tier))).filter(Boolean),
    [normalizedLeads]
  );
  const paymentStatuses = useMemo(
    () => Array.from(new Set(normalizedLeads.map((l) => l.paymentStatus))).filter(Boolean),
    [normalizedLeads]
  );
  const cohorts = useMemo(
    () => Array.from(new Set(normalizedLeads.map((l) => l.cohort))).filter(Boolean),
    [normalizedLeads]
  );

  const filteredLeads = normalizedLeads.filter((lead) => {
    if (tierFilter !== 'All' && lead.tier !== tierFilter) return false;
    if (paymentFilter !== 'All' && lead.paymentStatus !== paymentFilter) return false;
    if (cohortFilter !== 'All' && lead.cohort !== cohortFilter) return false;
    return true;
  });

  const selectClass =
    'border border-gray-200 bg-gray-50 text-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors cursor-pointer';

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
          VAP Registrations {leads?.sheetName ? <span className="text-sm font-normal text-gray-400">({leads.sheetName})</span> : null}
        </h2>
        <div className="flex flex-wrap gap-4">
          <select value={tierFilter} onChange={(e) => setTierFilter(e.target.value)} className={selectClass}>
            <option value="All">All Tiers</option>
            {tiers.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} className={selectClass}>
            <option value="All">All Payment Statuses</option>
            {paymentStatuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select value={cohortFilter} onChange={(e) => setCohortFilter(e.target.value)} className={selectClass}>
            <option value="All">All Cohorts</option>
            {cohorts.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-100">
        <table className="w-full text-left border-collapse bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Participant ID</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Tier</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Cohort</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Registered</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount Due</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Payment</th>
              <th className="py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-indigo-50/30 transition-colors duration-150">
                <td className="py-4 px-6 text-sm text-gray-500 font-mono">{lead.participantId}</td>
                <td className="py-4 px-6 text-sm text-gray-800 font-semibold">
                  {lead.name}
                  <div className="text-xs text-gray-400 font-normal">{lead.email}</div>
                </td>
                <td className="py-4 px-6 text-sm text-gray-600">{lead.tier}</td>
                <td className="py-4 px-6 text-sm text-gray-600">{lead.cohort}</td>
                <td className="py-4 px-6 text-sm text-gray-600">{lead.registrationDate}</td>
                <td className="py-4 px-6 text-sm text-gray-600">{lead.amountDue ? `$${lead.amountDue} CAD` : '—'}</td>
                <td className="py-4 px-6">{getPaymentBadge(lead.paymentStatus)}</td>
                <td className="py-4 px-6">{getParticipantStatusBadge(lead.participantStatus)}</td>
              </tr>
            ))}
            {filteredLeads.length === 0 && (
              <tr>
                <td colSpan="8" className="py-12 text-center text-gray-500 text-sm">
                  {normalizedLeads.length === 0
                    ? 'No registrations found in the connected Google Sheet.'
                    : 'No registrations found matching your filters.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
