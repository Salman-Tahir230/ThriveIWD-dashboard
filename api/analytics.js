import crypto from 'crypto';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const serviceAccount = JSON.parse(process.env.GA4_SERVICE_ACCOUNT_KEY);
    const propertyId = process.env.GA4_PROPERTY_ID;

    const token = await getAccessToken(
      serviceAccount,
      'https://www.googleapis.com/auth/analytics.readonly'
    );

    const [overviewData, geoData, deviceData, pageData] = await Promise.all([
      fetchGA4Report(token, propertyId, {
        metrics: [
          { name: 'totalUsers' },
          { name: 'activeUsers' },
          { name: 'sessions' },
          { name: 'screenPageViews' },
          { name: 'averageSessionDuration' },
          { name: 'newUsers' },
          { name: 'bounceRate' },
        ],
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      }),
      fetchGA4Report(token, propertyId, {
        dimensions: [{ name: 'country' }, { name: 'city' }],
        metrics: [{ name: 'totalUsers' }, { name: 'averageSessionDuration' }],
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        limit: 10,
      }),
      fetchGA4Report(token, propertyId, {
        dimensions: [{ name: 'deviceCategory' }, { name: 'operatingSystem' }],
        metrics: [{ name: 'totalUsers' }],
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      }),
      fetchGA4Report(token, propertyId, {
        dimensions: [{ name: 'pagePath' }],
        metrics: [
          { name: 'screenPageViews' },
          { name: 'averageSessionDuration' },
          { name: 'bounceRate' },
        ],
        dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
        limit: 10,
      }),
    ]);

    res.status(200).json({
      overview: overviewData,
      geography: geoData,
      devices: deviceData,
      pages: pageData,
    });
  } catch (error) {
    console.error('GA4 Error:', error);
    res.status(500).json({ error: error.message });
  }
}

function base64url(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

async function getAccessToken(serviceAccount, scope) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64url(
    JSON.stringify({
      iss: serviceAccount.client_email,
      scope,
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    })
  );

  const signingInput = `${header}.${payload}`;
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(signingInput);
  const signature = base64url(sign.sign(serviceAccount.private_key));
  const jwt = `${signingInput}.${signature}`;

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  const data = await response.json();
  if (!data.access_token) throw new Error(`Token error: ${JSON.stringify(data)}`);
  return data.access_token;
}

async function fetchGA4Report(token, propertyId, body) {
  const response = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );
  return response.json();
}
