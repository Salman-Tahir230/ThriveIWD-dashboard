import LeadTable from '../components/LeadTable';
import DataStatus from '../components/DataStatus';

export default function Leads() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <DataStatus />
      <LeadTable />
    </div>
  );
}
