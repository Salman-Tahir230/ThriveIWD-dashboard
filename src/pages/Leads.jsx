import LeadTable from '../components/LeadTable';
import DataStatus from '../components/DataStatus';

export default function Leads() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Leads Management</h1>
      <p className="text-gray-500">View and manage your leads from all sources.</p>
      <DataStatus />
      <LeadTable />
    </div>
  );
}
