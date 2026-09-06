import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const DashboardDataContext = createContext(null);

export const DATE_RANGE_OPTIONS = [
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '90', label: 'Last 90 days' },
];

export function DashboardDataProvider({ children }) {
  const [analytics, setAnalytics] = useState(null);
  const [leads, setLeads] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('30');

  const fetchAll = useCallback(async (range) => {
    setLoading(true);
    setError(null);
    try {
      const [analyticsRes, leadsRes] = await Promise.all([
        fetch(`/api/analytics?range=${range}`).then((r) => r.json()),
        fetch('/api/leads').then((r) => r.json()),
      ]);
      if (analyticsRes.error) throw new Error(`Analytics API: ${analyticsRes.error}`);
      if (leadsRes.error) throw new Error(`Leads API: ${leadsRes.error}`);
      setAnalytics(analyticsRes);
      setLeads(leadsRes);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll(dateRange);
  }, [fetchAll, dateRange]);

  return (
    <DashboardDataContext.Provider
      value={{
        analytics,
        leads,
        loading,
        error,
        dateRange,
        setDateRange,
        rangeLabel: `last ${dateRange} days`,
        refetch: () => fetchAll(dateRange),
      }}
    >
      {children}
    </DashboardDataContext.Provider>
  );
}

export function useDashboardData() {
  const ctx = useContext(DashboardDataContext);
  if (!ctx) throw new Error('useDashboardData must be used within a DashboardDataProvider');
  return ctx;
}
