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
          content: '⚠️ La variable NVIDIA_API_KEY no se ha encontrado en Vercel. Por favor asegúrate de agregar NVIDIA_API_KEY en Vercel (Settings -> Environment Variables) y pulsar "Redeploy".'
        }
      }]
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { messages } = body;

    // List of models to try in case one is unavailable or deprecating
    const candidateModels = [
      'meta/llama-3.3-70b-instruct',
      'meta/llama-3.1-8b-instruct',
      'nvidia/llama-3.1-nemotron-70b-instruct'
    ];

    let lastError = null;
    let data = null;

    for (const model of candidateModels) {
      try {
        const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey.trim()}`
          },
          body: JSON.stringify({
            model: model,
            messages: messages || [],
            temperature: 0.7,
            max_tokens: 300
          })
        });

        if (response.ok) {
          data = await response.json();
          break; // Successfully got response!
        } else {
          const errText = await response.text();
          console.warn(`Model ${model} failed with status ${response.status}:`, errText);
          lastError = `Status ${response.status}: ${errText}`;
        }
      } catch (err) {
        console.warn(`Fetch error for model ${model}:`, err.message);
        lastError = err.message;
      }
    }

    if (data && data.choices && data.choices.length > 0) {
      return res.status(200).json(data);
    }

    // If all models failed or returned error, return friendly error detailing the issue
    console.error('All NVIDIA models failed. Last error:', lastError);
    return res.status(200).json({
      choices: [{
        message: {
          content: `⚠️ No se pudo conectar con la API de NVIDIA (${lastError || 'Error desconocido'}). Revisa que la API key en Vercel sea válida.`
        }
      }]
    });

  } catch (error) {
    console.error('Serverless Function Catch Error:', error);
    return res.status(200).json({
      choices: [{
        message: {
          content: `⚠️ Ocurrió un error en el servidor: ${error.message}`
        }
      }]
    });
  }
}
