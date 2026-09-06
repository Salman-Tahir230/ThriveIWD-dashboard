// Converts a raw GA4 Data API runReport response into an array of plain objects
// keyed by dimension/metric name, e.g. [{ country: 'Canada', totalUsers: '1250' }, ...]
export function parseGA4Report(report) {
  if (!report?.rows) return [];
  const dimHeaders = (report.dimensionHeaders || []).map((h) => h.name);
  const metHeaders = (report.metricHeaders || []).map((h) => h.name);

  return report.rows.map((row) => {
    const obj = {};
    (row.dimensionValues || []).forEach((v, i) => {
      obj[dimHeaders[i]] = v.value;
    });
    (row.metricValues || []).forEach((v, i) => {
      obj[metHeaders[i]] = v.value;
    });
    return obj;
  });
}

// The overview report has no dimensions and exactly one row of metrics.
export function parseGA4Overview(report) {
  const rows = parseGA4Report(report);
  return rows[0] || null;
}

// Turns a raw URL path into a plain-English label for non-technical readers,
// e.g. "/" -> "Homepage", "/blog/understanding-mental-wellness" -> "Blog › Understanding Mental Wellness".
export function humanizePath(path) {
  if (!path || path === '/') return 'Homepage';
  if (path === '(not set)' || path === 'Unknown') return 'Unknown / No Referrer';

  const segments = path.split('/').filter(Boolean);
  if (segments.length === 0) return 'Homepage';

  const words = segments.map((seg) =>
    seg
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
  );
  return words.join(' › ');
}

export function formatSeconds(seconds) {
  const s = Math.round(Number(seconds) || 0);
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return m > 0 ? `${m}m ${rem}s` : `${rem}s`;
}
