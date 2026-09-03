export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const serviceAccount = JSON.parse(process.env.GA4_SERVICE_ACCOUNT_KEY);
    const propertyId = process.env.GA4_PROPERTY_ID;

    // Get JWT token
    const token = await getAccessToken(serviceAccount);

    // Fetch GA4 data - multiple reports
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
    console.error('GA4 API Error:', error);
    res.status(500).json({ error: error.message });
  }
}

async function getAccessToken(serviceAccount) {
  const header = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const now = Math.floor(Date.now() / 1000);
  const payload = btoa(
    JSON.stringify({
      iss: serviceAccount.client_email,
      scope: 'https://www.googleapis.com/auth/analytics.readonly',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    })
  );

  const privateKey = serviceAccount.private_key;
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    pemToArrayBuffer(privateKey),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signingInput = `${header}.${payload}`;
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    new TextEncoder().encode(signingInput)
  );

  const jwt = `${signingInput}.${btoa(String.fromCharCode(...new Uint8Array(signature)))}`;

  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
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

function pemToArrayBuffer(pem) {
  const base64 = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\n/g, '');
  const binary = atob(base64);
  const buffer = new ArrayBuffer(binary.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < binary.length; i++) view[i] = binary.charCodeAt(i);
  return buffer;
}
