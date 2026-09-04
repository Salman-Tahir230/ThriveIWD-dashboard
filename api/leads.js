import crypto from 'crypto';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const serviceAccount = JSON.parse(process.env.GA4_SERVICE_ACCOUNT_KEY);
    const sheetId = process.env.GOOGLE_SHEET_ID;

    const token = await getAccessToken(
      serviceAccount,
      'https://www.googleapis.com/auth/spreadsheets.readonly'
    );

    // Step 1: Get ALL sheet names
    const metaResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const meta = await metaResponse.json();
    const allSheets = meta.sheets?.map((s) => s.properties.title) || ['Sheet1'];

    // Step 2: Fetch data from ALL sheets in parallel
    const allSheetsData = await Promise.all(
      allSheets.map(async (sheetName) => {
        const dataResponse = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(sheetName)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await dataResponse.json();
        const rows = data.values || [];

        if (rows.length === 0) return { sheetName, headers: [], rows: [], total: 0 };

        const headers = rows[0];
        const leads = rows.slice(1).map((row) => {
          const obj = {};
          headers.forEach((header, i) => {
            obj[header] = row[i] || '';
          });
          return obj;
        });

        return {
          sheetName,
          headers,
          leads,
          total: leads.length,
        };
      })
    );

    // Step 3: Also return flat combined list of all leads
    const allLeads = allSheetsData.flatMap((s) => 
      s.leads?.map((lead) => ({ ...lead, _sheet: s.sheetName })) || []
    );

    res.status(200).json({
      sheets: allSheetsData,        // each sheet separately
      allLeads,                      // all combined
      totalSheets: allSheets.length,
      totalLeads: allLeads.length,
    });
  } catch (error) {
    console.error('Sheets Error:', error);
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
