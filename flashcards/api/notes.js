const { kv } = require('@vercel/kv');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const key = 'fc:notes';

  if (req.method === 'GET') {
    const notes = await kv.get(key) || {};
    return res.status(200).json(notes);
  }

  if (req.method === 'PUT') {
    const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    await kv.set(key, data);
    return res.status(200).json({ ok: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
};
