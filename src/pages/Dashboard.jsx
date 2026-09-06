import TrafficChart from '../components/TrafficChart';
import LandingPages from '../components/LandingPages';
import PageAnalytics from '../components/PageAnalytics';
import Funnel from '../components/Funnel';
import AIPanel from '../components/AIPanel';
import DataStatus from '../components/DataStatus';
import OverviewStats from '../components/OverviewStats';

export default function Dashboard() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <DataStatus />
      <OverviewStats />
      <AIPanel />
      <TrafficChart />
      <LandingPages />
      <PageAnalytics />
      <Funnel />
    </div>
  );
}
