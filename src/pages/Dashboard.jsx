import TrafficChart from '../components/TrafficChart';
import PageAnalytics from '../components/PageAnalytics';
import Funnel from '../components/Funnel';
import AIPanel from '../components/AIPanel';
import DataStatus from '../components/DataStatus';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Dashboard</h1>

      <DataStatus />

      <AIPanel />

      <TrafficChart />
      <PageAnalytics />
      <Funnel />
    </div>
  );
}
