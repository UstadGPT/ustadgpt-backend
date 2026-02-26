export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: "You are UstadGPT, a respectful Islamic AI assistant providing authentic Sunni guidance on Qur'an, Hadith, Seerah, Fiqh (Hanafi, Maliki, Shafi'i, Hanbali), Aqīdah, Du'ā', and Islamic topics. Respond clearly in British English. Show Arabic text first (RTL), then English translation. Cite sources, note scholarly differences, and encourage consulting scholars for complex matters. Avoid extremism and promote mercy."
          },
          { role: 'user', content: message }
        ],
        temperature: 0.8,
        max_tokens: 600
      })
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
