import { X } from 'lucide-react';

// Fields already shown in the main table — don't repeat them in the detail view.
const SHOWN_IN_TABLE = new Set([
  'Participant ID',
  'Full Name',
  'VAP Tier',
  'Cohort',
  'Registration Date',
  'Payment Status',
  'Amount Due (CAD)',
  'Amount Paid (CAD)',
  'Participant Status',
]);

export default function LeadDetailModal({ lead, onClose }) {
  if (!lead) return null;

  const entries = Object.entries(lead).filter(
    ([key, value]) => !SHOWN_IN_TABLE.has(key) && value !== '' && value != null
  );

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[var(--card-bg)] rounded-xl border border-[var(--border)] shadow-card max-w-lg w-full max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] sticky top-0 bg-[var(--card-bg)]">
          <div>
            <h2 className="text-sm font-semibold text-[var(--text)]">{lead['Full Name'] || 'Registration details'}</h2>
            <p className="text-xs text-[var(--text-muted)] font-mono">{lead['Participant ID']}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--accent-soft)] transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-3">
          {entries.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No additional details in the sheet for this registration.</p>
          ) : (
            entries.map(([key, value]) => (
              <div key={key} className="grid grid-cols-[1fr_1.4fr] gap-3 text-sm">
                <span className="text-[var(--text-muted)]">{key}</span>
                <span className="text-[var(--text)] break-words">{String(value)}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
