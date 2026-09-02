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
