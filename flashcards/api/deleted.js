const { kv } = require('@vercel/kv');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const key = 'fc:deleted';

  if (req.method === 'GET') {
    const list = await kv.get(key) || [];
    return res.status(200).json(list);
  }

  if (req.method === 'PUT') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const words = Array.isArray(body) ? body : (body.words || []);
    await kv.set(key, words);
    return res.status(200).json({ ok: true });
  }

  if (req.method === 'POST') {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const words = Array.isArray(body) ? body : (body.words || []);
    const existing = await kv.get(key) || [];
    const merged = [...new Set([...existing, ...words])];
    await kv.set(key, merged);
    return res.status(200).json({ ok: true, deleted: merged });
  }

  res.status(405).json({ error: 'Method not allowed' });
};
