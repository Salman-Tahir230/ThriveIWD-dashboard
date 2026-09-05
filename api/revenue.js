const VAP_PRODUCTS = new Set(['VAP FLEX', 'VAP CONNECT', 'VAP LIVE']);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    const sessions = await fetchAllCheckoutSessions(apiKey);

    const byProduct = {}; // product name -> { amount, count } (paid only)
    const byMonth = {}; // "YYYY-MM" -> amount (paid only, all products)
    let totalRevenue = 0;

    const vap = {
      paidTotal: 0,
      paidCount: 0,
      pendingCount: 0,
      paidByTier: { 'VAP FLEX': 0, 'VAP CONNECT': 0, 'VAP LIVE': 0 },
      pendingByTier: { 'VAP FLEX': 0, 'VAP CONNECT': 0, 'VAP LIVE': 0 },
    };

    for (const session of sessions) {
      const lineItems = session.line_items?.data || [];
      const productNames = lineItems.map((li) => li.description).filter(Boolean);
      const isVap = productNames.some((name) => VAP_PRODUCTS.has(name));
      const isPaid = session.payment_status === 'paid';

      if (isPaid) {
        const amount = session.amount_total || 0;
        totalRevenue += amount;

        const month = new Date(session.created * 1000).toISOString().slice(0, 7);
        byMonth[month] = (byMonth[month] || 0) + amount;

        const label = productNames[0] || 'Unknown';
        if (!byProduct[label]) byProduct[label] = { amount: 0, count: 0 };
        byProduct[label].amount += amount;
        byProduct[label].count += 1;

        if (isVap) {
          vap.paidTotal += amount;
          vap.paidCount += 1;
          const tier = productNames.find((name) => VAP_PRODUCTS.has(name));
          if (tier) vap.paidByTier[tier] = (vap.paidByTier[tier] || 0) + 1;
        }
      } else if (isVap) {
        vap.pendingCount += 1;
        const tier = productNames.find((name) => VAP_PRODUCTS.has(name));
        if (tier) vap.pendingByTier[tier] = (vap.pendingByTier[tier] || 0) + 1;
      }
    }

    res.status(200).json({
      currency: sessions[0]?.currency?.toUpperCase() || 'CAD',
      totalRevenue,
      byProduct: Object.entries(byProduct)
        .map(([product, v]) => ({ product, ...v }))
        .sort((a, b) => b.amount - a.amount),
      byMonth: Object.entries(byMonth)
        .map(([month, amount]) => ({ month, amount }))
        .sort((a, b) => a.month.localeCompare(b.month)),
      vap,
    });
  } catch (error) {
    console.error('Revenue API Error:', error);
    res.status(500).json({ error: error.message });
  }
}

async function fetchAllCheckoutSessions(apiKey) {
  const auth = Buffer.from(`${apiKey}:`).toString('base64');
  const sessions = [];
  let url = 'https://api.stripe.com/v1/checkout/sessions?limit=100&expand[]=data.line_items';

  while (url) {
    const response = await fetch(url, {
      headers: { Authorization: `Basic ${auth}` },
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);

    sessions.push(...data.data);

    if (data.has_more) {
      const lastId = data.data[data.data.length - 1].id;
      url = `https://api.stripe.com/v1/checkout/sessions?limit=100&expand[]=data.line_items&starting_after=${lastId}`;
    } else {
      url = null;
    }
  }

  return sessions;
}
