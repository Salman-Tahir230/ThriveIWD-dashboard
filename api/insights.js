export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error('Missing GROQ_API_KEY on the server.');

    const { overview, trafficSources, leads } = req.body || {};

    const promptText = `
Based on the following real Google Analytics 4 and leads data for thriveiwd.com, provide 3 to 5 short business insights in plain English. One sentence each.
Overview (last 30 days): ${JSON.stringify(overview)}
Traffic Sources: ${JSON.stringify(trafficSources)}
Leads (recent): ${JSON.stringify(leads)}

Return the insights as a simple bulleted list, starting each insight with a dash (-). Do not include any other text.
`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages: [{ role: 'user', content: promptText }],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '';

    const insights = content
      .split('\n')
      .map((line) => line.trim().replace(/^[-*]\s*/, '').trim())
      .filter((line) => line.length > 0 && !line.startsWith('Here are'));

    res.status(200).json({ insights });
  } catch (error) {
    console.error('Insights API Error:', error);
    res.status(500).json({ error: error.message });
  }
}
