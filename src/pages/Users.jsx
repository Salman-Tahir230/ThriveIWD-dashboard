import GeographyTable from '../components/GeographyTable';
import DeviceBreakdown from '../components/DeviceBreakdown';
import DataStatus from '../components/DataStatus';

export default function Users() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <DataStatus />
      <GeographyTable />
      <DeviceBreakdown />
    </div>
  );
}
