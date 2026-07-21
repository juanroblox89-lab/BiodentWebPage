export default async function handler(request) {
  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const apiKey = process.env.NVIDIA_API_KEY || process.env.VITE_NVIDIA_API_KEY || '';

  if (!apiKey) {
    console.error('NVIDIA_API_KEY is not set in Vercel environment variables.');
    return Response.json(
      { error: 'API key not configured. Set NVIDIA_API_KEY in Vercel Environment Variables and redeploy.' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const messages = body.messages || [];

    const nvidiaResponse = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'nvidia/llama-3.3-nemotron-nano-omni-instruct',
        messages: messages,
        temperature: 0.7,
        max_tokens: 256,
      }),
    });

    if (!nvidiaResponse.ok) {
      const errorText = await nvidiaResponse.text();
      console.error(`NVIDIA API error ${nvidiaResponse.status}:`, errorText);
      return Response.json(
        { error: `NVIDIA API error (${nvidiaResponse.status})` },
        { status: nvidiaResponse.status }
      );
    }

    const data = await nvidiaResponse.json();
    return Response.json(data, {
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  } catch (error) {
    console.error('Serverless function error:', error);
    return Response.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export const config = {
  runtime: 'edge',
};
