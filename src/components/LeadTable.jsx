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
    paymentStatus: row['Payment Status'] || 'Unknown',
  };
}

function getPaymentBadge(status) {
  const styles = {
    Paid: 'bg-brand-50 text-brand-700',
    Pending: 'bg-amber-50 text-amber-700',
    Refunded: 'bg-rose-50 text-rose-700',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  );
}

const selectClass =
  'border border-[#E1E9E3] bg-white text-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors cursor-pointer';

export default function LeadTable() {
  const { leads } = useDashboardData();
  const [tierFilter, setTierFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [cohortFilter, setCohortFilter] = useState('All');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const normalizedLeads = useMemo(() => {
    const rows = leads?.leads || [];
    return rows.map(normalizeLead);
  }, [leads]);

  const tiers = useMemo(() => Array.from(new Set(normalizedLeads.map((l) => l.tier))).filter(Boolean), [normalizedLeads]);
  const paymentStatuses = useMemo(() => Array.from(new Set(normalizedLeads.map((l) => l.paymentStatus))).filter(Boolean), [normalizedLeads]);
  const cohorts = useMemo(() => Array.from(new Set(normalizedLeads.map((l) => l.cohort))).filter(Boolean), [normalizedLeads]);

  const filteredLeads = normalizedLeads.filter((lead) => {
    if (tierFilter !== 'All' && lead.tier !== tierFilter) return false;
    if (paymentFilter !== 'All' && lead.paymentStatus !== paymentFilter) return false;
    if (cohortFilter !== 'All' && lead.cohort !== cohortFilter) return false;

    if ((fromDate || toDate) && lead.registrationDate) {
      const regDate = new Date(lead.registrationDate);
      if (!isNaN(regDate.getTime())) {
        if (fromDate && regDate < new Date(fromDate)) return false;
        if (toDate && regDate > new Date(toDate + 'T23:59:59')) return false;
      }
    }
    return true;
  });

  const hasActiveFilters = tierFilter !== 'All' || paymentFilter !== 'All' || cohortFilter !== 'All' || fromDate || toDate;

  const clearFilters = () => {
    setTierFilter('All');
    setPaymentFilter('All');
    setCohortFilter('All');
    setFromDate('');
    setToDate('');
  };

  return (
    <div className="bg-white rounded-xl border border-[#E1E9E3] shadow-card overflow-hidden">
      <div className="p-6 flex flex-wrap items-end gap-3 border-b border-[#E1E9E3]">
        <div>
          <label className="block text-xs text-slate-400 mb-1">VAP Tier</label>
          <select value={tierFilter} onChange={(e) => setTierFilter(e.target.value)} className={selectClass}>
            <option value="All">All Tiers</option>
            {tiers.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Payment Status</label>
          <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} className={selectClass}>
            <option value="All">All Statuses</option>
            {paymentStatuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Cohort</label>
          <select value={cohortFilter} onChange={(e) => setCohortFilter(e.target.value)} className={selectClass}>
            <option value="All">All Cohorts</option>
            {cohorts.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">From</label>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className={selectClass} />
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">To</label>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className={selectClass} />
        </div>

        {hasActiveFilters && (
          <button onClick={clearFilters} className="text-sm text-slate-500 hover:text-brand-600 px-2 py-2">
            Clear
          </button>
        )}

        <span className="ml-auto text-xs text-slate-400 self-center">
          {filteredLeads.length} of {normalizedLeads.length} registrations
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-slate-400 text-[11px] uppercase tracking-wide border-b border-[#E1E9E3]">
              <th className="py-2.5 px-6 font-medium">Participant ID</th>
              <th className="py-2.5 px-6 font-medium">Full Name</th>
              <th className="py-2.5 px-6 font-medium">VAP Tier</th>
              <th className="py-2.5 px-6 font-medium">Cohort</th>
              <th className="py-2.5 px-6 font-medium">Registered</th>
              <th className="py-2.5 px-6 font-medium">Payment</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredLeads.map((lead) => (
              <tr key={lead.id} className="border-b border-[#F0F5F2] last:border-0 hover:bg-[#F7FAF8] transition-colors">
                <td className="py-3 px-6 text-slate-500 font-mono text-xs">{lead.participantId}</td>
                <td className="py-3 px-6 text-slate-800 font-medium">
                  {lead.name}
                  <div className="text-xs text-slate-400 font-normal">{lead.email}</div>
                </td>
                <td className="py-3 px-6 text-slate-600">{lead.tier}</td>
                <td className="py-3 px-6 text-slate-600">{lead.cohort}</td>
                <td className="py-3 px-6 text-slate-600">{lead.registrationDate}</td>
                <td className="py-3 px-6">{getPaymentBadge(lead.paymentStatus)}</td>
              </tr>
            ))}
            {filteredLeads.length === 0 && (
              <tr>
                <td colSpan="6" className="py-12 text-center text-slate-500 text-sm">
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
