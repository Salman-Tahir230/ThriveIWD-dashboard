import { useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
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
  const styleMap = {
    Paid: { backgroundColor: 'var(--accent-soft)', color: 'var(--accent)' },
    Pending: { backgroundColor: 'var(--warn-soft)', color: 'var(--warn)' },
    Refunded: { backgroundColor: 'var(--danger-soft)', color: 'var(--danger)' },
  };
  return (
    <span
      className="px-2.5 py-1 rounded-full text-xs font-medium"
      style={styleMap[status] || { backgroundColor: 'var(--track-bg)', color: 'var(--text-soft)' }}
    >
      {status}
    </span>
  );
}

const selectClass =
  'border border-[var(--border)] bg-[var(--card-bg)] text-[var(--text-soft)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors cursor-pointer';

export default function LeadTable() {
  const { leads, loading, refetch } = useDashboardData();
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
    <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] shadow-card overflow-hidden">
      <div
        className="px-6 py-3 flex items-center justify-between gap-3 border-b border-[var(--border)]"
        style={{ backgroundColor: 'var(--accent-soft)' }}
      >
        <div className="flex items-center gap-2 text-xs font-medium" style={{ color: 'var(--accent)' }}>
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--accent)' }} />
          <span>
            Live-synced with the VAP Registration Database{leads?.sheetName ? ` (Google Sheets — "${leads.sheetName}")` : ' (Google Sheets)'}. Any new signup appears here automatically.
          </span>
        </div>
        <button
          onClick={refetch}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs font-medium flex-shrink-0 disabled:opacity-50"
          style={{ color: 'var(--accent)' }}
          title="Refresh now"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="p-6 flex flex-wrap items-end gap-3 border-b border-[var(--border)]">
        <div>
          <label className="block text-xs text-[var(--text-muted)] mb-1">VAP Tier</label>
          <select value={tierFilter} onChange={(e) => setTierFilter(e.target.value)} className={selectClass}>
            <option value="All">All Tiers</option>
            {tiers.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-[var(--text-muted)] mb-1">Payment Status</label>
          <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} className={selectClass}>
            <option value="All">All Statuses</option>
            {paymentStatuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-[var(--text-muted)] mb-1">Cohort</label>
          <select value={cohortFilter} onChange={(e) => setCohortFilter(e.target.value)} className={selectClass}>
            <option value="All">All Cohorts</option>
            {cohorts.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs text-[var(--text-muted)] mb-1">From</label>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className={selectClass} />
        </div>

        <div>
          <label className="block text-xs text-[var(--text-muted)] mb-1">To</label>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className={selectClass} />
        </div>

        {hasActiveFilters && (
          <button onClick={clearFilters} className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] px-2 py-2">
            Clear
          </button>
        )}

        <span className="ml-auto text-xs text-[var(--text-muted)] self-center">
          {filteredLeads.length} of {normalizedLeads.length} registrations
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--table-head-bg)] text-[var(--text-muted)] text-[11px] uppercase tracking-wide border-b border-[var(--border)]">
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
              <tr key={lead.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--subtle-bg)] transition-colors">
                <td className="py-3 px-6 text-[var(--text-muted)] font-mono text-xs">{lead.participantId}</td>
                <td className="py-3 px-6 text-[var(--text)] font-medium">
                  {lead.name}
                  <div className="text-xs text-[var(--text-muted)] font-normal">{lead.email}</div>
                </td>
                <td className="py-3 px-6 text-[var(--text-soft)]">{lead.tier}</td>
                <td className="py-3 px-6 text-[var(--text-soft)]">{lead.cohort}</td>
                <td className="py-3 px-6 text-[var(--text-soft)]">{lead.registrationDate}</td>
                <td className="py-3 px-6">{getPaymentBadge(lead.paymentStatus)}</td>
              </tr>
            ))}
            {filteredLeads.length === 0 && (
              <tr>
                <td colSpan="6" className="py-12 text-center text-[var(--text-muted)] text-sm">
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
