import React from 'react';
import GeographyTable from '../components/GeographyTable';
import DeviceBreakdown from '../components/DeviceBreakdown';
import DataStatus from '../components/DataStatus';

export default function Users() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Users</h1>
      <p className="text-slate-600 dark:text-slate-400">Demographics, geography, and device breakdown for Thrive IWD visitors.</p>

      <DataStatus />

      <div className="grid grid-cols-1 gap-6">
        <GeographyTable />
        <DeviceBreakdown />
      </div>
    </div>
  );
}
