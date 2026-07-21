export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido. Usa POST.' });
  }

  const apiKey = process.env.NVIDIA_API_KEY || process.env.VITE_NVIDIA_API_KEY || '';

  if (!apiKey) {
    console.error('NVIDIA_API_KEY missing in Vercel environment variables.');
    return res.status(200).json({
      choices: [{
        message: {
          content: 'Disculpa, el sistema está en mantenimiento. Puedes escribirnos directamente por WhatsApp. [BOTON_WHATSAPP]'
        }
      }]
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { messages, stream = true } = body;

    // Check if any message contains an image
    const hasImage = messages && messages.some(m => 
      Array.isArray(m.content) && m.content.some(c => c.type === 'image_url')
    );

    // Ultra-fast model priority for sub-2-second responses
    const candidateModels = hasImage 
      ? ['meta/llama-3.2-11b-vision-instruct', 'meta/llama-3.2-90b-vision-instruct']
      : ['meta/llama-3.1-8b-instruct', 'nvidia/llama-3.1-nemotron-70b-instruct', 'meta/llama-3.3-70b-instruct'];

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      let response = null;
      let lastErr = '';

      for (const model of candidateModels) {
        try {
          response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey.trim()}`
            },
            body: JSON.stringify({
              model: model,
              messages: messages || [],
              temperature: 0.4,
              max_tokens: 120,
              stream: true
            })
          });

          if (response.ok) {
            break;
          } else {
            lastErr = await response.text();
            console.warn(`Model ${model} stream failed (${response.status}):`, lastErr);
          }
        } catch (e) {
          lastErr = e.message;
        }
      }

      if (!response || !response.ok) {
        const errorMsg = `data: ${JSON.stringify({ choices: [{ delta: { content: `Para una atención inmediata, escrébenos por WhatsApp. [BOTON_WHATSAPP]` } }] })}\n\ndata: [DONE]\n\n`;
        res.write(errorMsg);
        return res.end();
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        res.write(chunk);
      }

      return res.end();
    } else {
      let data = null;
      for (const model of candidateModels) {
        try {
          const resp = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey.trim()}`
            },
            body: JSON.stringify({
              model: model,
              messages: messages || [],
              temperature: 0.4,
              max_tokens: 120
            })
          });
          if (resp.ok) {
            data = await resp.json();
            break;
          }
        } catch (err) {
          console.warn(`Fetch failed for ${model}:`, err.message);
        }
      }
      return res.status(200).json(data || { choices: [{ message: { content: 'Para una atención inmediata, escrébenos por WhatsApp. [BOTON_WHATSAPP]' } }] });
    }

  } catch (error) {
    console.error('Serverless Chat Error:', error);
    if (!res.headersSent) {
      return res.status(500).json({ error: error.message || 'Internal Server Error' });
    } else {
      res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: ` Escríbenos directamente por WhatsApp. [BOTON_WHATSAPP]` } }] })}\n\ndata: [DONE]\n\n`);
      return res.end();
    }
  }
}
