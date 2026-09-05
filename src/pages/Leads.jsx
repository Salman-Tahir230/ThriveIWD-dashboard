import LeadTable from '../components/LeadTable';
import DataStatus from '../components/DataStatus';

export default function Leads() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">VAP Registrations</h1>
      <p className="text-gray-500">Volunteer & Ambassador Program signups, by tier, cohort, and payment status.</p>
      <DataStatus />
      <LeadTable />
    </div>
  );
}
