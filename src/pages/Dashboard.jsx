import TrafficChart from '../components/TrafficChart';
import PageAnalytics from '../components/PageAnalytics';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Dashboard</h1>
      
      {/* KPI Row Placeholder (skipped in Prompt 02) */}
      
      <TrafficChart />
      <PageAnalytics />
    </div>
  );
}
