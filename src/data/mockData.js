export const trafficSourceData = [
  { source: 'Facebook', leadCount: 450, conversionPercent: 12.5, weeklyTrend: [40, 55, 60, 45, 70, 80, 100] },
  { source: 'Instagram', leadCount: 320, conversionPercent: 15.2, weeklyTrend: [30, 40, 35, 50, 60, 55, 50] },
  { source: 'WhatsApp', leadCount: 200, conversionPercent: 25.0, weeklyTrend: [20, 25, 20, 30, 35, 40, 30] },
  { source: 'Direct', leadCount: 150, conversionPercent: 8.5, weeklyTrend: [15, 15, 20, 25, 20, 30, 25] },
  { source: 'Other', leadCount: 80, conversionPercent: 5.0, weeklyTrend: [5, 10, 5, 10, 15, 20, 15] },
];

export const pageAnalyticsData = [
  { page: 'Home', avgTimeSpent: 120, bounceRate: 45, topClickPaths: ['Home -> Programs -> VAP', 'Home -> About -> Contact', 'Home -> Partnerships'] },
  { page: 'Programs', avgTimeSpent: 180, bounceRate: 35, topClickPaths: ['Programs -> VAP', 'Programs -> Contact', 'Programs -> Home'] },
  { page: 'About', avgTimeSpent: 90, bounceRate: 50, topClickPaths: ['About -> Contact', 'About -> Home -> Programs', 'About -> Partnerships'] },
  { page: 'VAP', avgTimeSpent: 240, bounceRate: 25, topClickPaths: ['VAP -> Contact', 'VAP -> Programs -> Home', 'VAP -> About'] },
  { page: 'Partnerships', avgTimeSpent: 150, bounceRate: 40, topClickPaths: ['Partnerships -> Contact', 'Partnerships -> Home', 'Partnerships -> About'] },
  { page: 'Contact', avgTimeSpent: 60, bounceRate: 60, topClickPaths: ['Contact -> Home', 'Contact -> Programs', 'Contact -> About'] },
];

export const geographyData = [
  { city: 'Toronto', country: 'Canada', userCount: 1250, avgSessionDuration: '4m 20s' },
  { city: 'Lahore', country: 'Pakistan', userCount: 1020, avgSessionDuration: '5m 15s' },
  { city: 'Karachi', country: 'Pakistan', userCount: 890, avgSessionDuration: '6m 05s' },
  { city: 'Vancouver', country: 'Canada', userCount: 750, avgSessionDuration: '3m 45s' },
  { city: 'Calgary', country: 'Canada', userCount: 620, avgSessionDuration: '4m 00s' },
  { city: 'Islamabad', country: 'Pakistan', userCount: 580, avgSessionDuration: '5m 30s' },
  { city: 'Mississauga', country: 'Canada', userCount: 410, avgSessionDuration: '3m 10s' },
];

export const deviceData = {
  mainBreakdown: [
    { name: 'Mobile', value: 65, fill: '#6366f1' },
    { name: 'Desktop', value: 30, fill: '#818cf8' },
    { name: 'Tablet', value: 5, fill: '#a5b4fc' },
  ],
  mobileOS: [
    { name: 'Android', value: 55, fill: '#10b981' },
    { name: 'iOS', value: 40, fill: '#059669' },
    { name: 'Other', value: 5, fill: '#34d399' },
  ]
};

export const funnelData = [
  { stage: 'Landing', count: 100 },
  { stage: 'Browse', count: 68 },
  { stage: 'Signup', count: 24 },
  { stage: 'Payment', count: 11 },
];

export const leadsData = [
  { id: 1, name: 'Alice Smith', source: 'WhatsApp', date: '2026-09-02', location: 'Toronto', status: 'New' },
  { id: 2, name: 'Bob Johnson', source: 'Form', date: '2026-09-01', location: 'Vancouver', status: 'Contacted' },
  { id: 3, name: 'Charlie Brown', source: 'WhatsApp', date: '2026-08-30', location: 'Lahore', status: 'Converted' },
  { id: 4, name: 'Diana Prince', source: 'Form', date: '2026-08-28', location: 'Karachi', status: 'New' },
  { id: 5, name: 'Evan Wright', source: 'WhatsApp', date: '2026-08-25', location: 'Calgary', status: 'Contacted' },
  { id: 6, name: 'Fiona Gallagher', source: 'Form', date: '2026-08-20', location: 'Toronto', status: 'Converted' },
  { id: 7, name: 'George Miller', source: 'WhatsApp', date: '2026-08-18', location: 'Islamabad', status: 'New' },
  { id: 8, name: 'Hannah Abbott', source: 'Form', date: '2026-08-15', location: 'Vancouver', status: 'Contacted' },
  { id: 9, name: 'Ian Malcolm', source: 'WhatsApp', date: '2026-08-10', location: 'Toronto', status: 'New' },
  { id: 10, name: 'Jane Doe', source: 'Form', date: '2026-08-05', location: 'Mississauga', status: 'Converted' },
  { id: 11, name: 'Kevin Hart', source: 'WhatsApp', date: '2026-07-28', location: 'Lahore', status: 'Contacted' },
  { id: 12, name: 'Laura Dern', source: 'Form', date: '2026-07-25', location: 'Karachi', status: 'New' },
  { id: 13, name: 'Mike Ross', source: 'WhatsApp', date: '2026-07-20', location: 'Toronto', status: 'Converted' },
  { id: 14, name: 'Nina Dobrev', source: 'Form', date: '2026-07-15', location: 'Calgary', status: 'Contacted' },
  { id: 15, name: 'Oscar Isaac', source: 'WhatsApp', date: '2026-07-10', location: 'Islamabad', status: 'New' },
  { id: 16, name: 'Paul Rudd', source: 'Form', date: '2026-07-05', location: 'Vancouver', status: 'Converted' },
  { id: 17, name: 'Quinn Fabray', source: 'WhatsApp', date: '2026-06-25', location: 'Lahore', status: 'New' },
  { id: 18, name: 'Rachel Green', source: 'Form', date: '2026-06-20', location: 'Toronto', status: 'Contacted' },
];

export const revenueData = [
  { month: 'Mar', Flex: 1450, Connect: 3900, Live: 2750 },
  { month: 'Apr', Flex: 1740, Connect: 4290, Live: 3300 },
  { month: 'May', Flex: 2030, Connect: 4680, Live: 3850 },
  { month: 'Jun', Flex: 2320, Connect: 5070, Live: 4400 },
  { month: 'Jul', Flex: 2610, Connect: 5460, Live: 4950 },
  { month: 'Aug', Flex: 2900, Connect: 5850, Live: 5500 },
];
