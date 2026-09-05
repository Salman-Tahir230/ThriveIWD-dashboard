import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const DashboardDataContext = createContext(null);

export function DashboardDataProvider({ children }) {
  const [analytics, setAnalytics] = useState(null);
  const [leads, setLeads] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [analyticsRes, leadsRes] = await Promise.all([
        fetch('/api/analytics').then((r) => r.json()),
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
    fetchAll();
  }, [fetchAll]);

  return (
    <DashboardDataContext.Provider value={{ analytics, leads, loading, error, refetch: fetchAll }}>
      {children}
    </DashboardDataContext.Provider>
  );
}

export function useDashboardData() {
  const ctx = useContext(DashboardDataContext);
  if (!ctx) throw new Error('useDashboardData must be used within a DashboardDataProvider');
  return ctx;
}
