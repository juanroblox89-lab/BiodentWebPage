// Chatbot de BioDent. Orden de intento: primero el 9router del dueño (gateway compatible
// con OpenAI), después NVIDIA. Si todo falla, el paciente ve el botón de WhatsApp.
//
// Variables de entorno (Vercel):
//   ROUTER9_API_KEY       clave de 9router (si falta, se salta 9router)
//   ROUTER9_URL           por defecto https://r3w75ds.abc-tunnel.us/v1
//   ROUTER9_MODELS        modelos de texto separados por coma
//   ROUTER9_VISION_MODEL  modelo que acepta imágenes
//   ROUTER9_MAX_TOKENS    por defecto 500 (los modelos que razonan gastan tokens pensando)
//   NVIDIA_API_KEY        respaldo

const MENSAJE_WHATSAPP = 'Para una atención inmediata, escríbenos por WhatsApp. [BOTON_WHATSAPP]';
const USER_AGENT = 'Go-http-client/1.1'; // Cloudflare bloquea otros agentes en el túnel
const NVIDIA_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';

function listaDeEntorno(valor, porDefecto) {
  const partes = (valor || '').split(',').map((s) => s.trim()).filter(Boolean);
  return partes.length ? partes : porDefecto;
}

// Cada intento: a dónde llamar, con qué clave, con qué modelo y cuánto esperar.
export function armarIntentos(hasImage, env = process.env) {
  const intentos = [];
  const routerKey = (env.ROUTER9_API_KEY || '').trim();
  if (routerKey) {
    const base = (env.ROUTER9_URL || 'https://r3w75ds.abc-tunnel.us/v1').replace(/\/+$/, '');
    const maxTokens = Math.max(16, parseInt(env.ROUTER9_MAX_TOKENS || '500', 10) || 500);
    const modelos = hasImage
      ? [(env.ROUTER9_VISION_MODEL || 'C-O-5').trim()]
      : listaDeEntorno(env.ROUTER9_MODELS, ['oc/big-pickle(xhigh)', 'oc/mimo-v2.6-flash-free(xhigh)']);
    for (const model of modelos) {
      intentos.push({
        nombre: 'router9',
        url: `${base}/chat/completions`,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${routerKey}`, 'User-Agent': USER_AGENT },
        model,
        maxTokens,
        ms: hasImage ? 20000 : 12000,
      });
    }
  }
  const nvidiaKey = (env.NVIDIA_API_KEY || env.VITE_NVIDIA_API_KEY || '').trim();
  if (nvidiaKey) {
    const modelos = hasImage
      ? ['meta/llama-3.2-11b-vision-instruct', 'meta/llama-3.2-90b-vision-instruct']
      : ['meta/llama-3.1-8b-instruct', 'nvidia/llama-3.1-nemotron-70b-instruct', 'meta/llama-3.3-70b-instruct'];
    for (const model of modelos) {
      intentos.push({
        nombre: 'nvidia',
        url: NVIDIA_URL,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${nvidiaKey}` },
        model,
        maxTokens: 120,
        ms: hasImage ? 20000 : 12000,
      });
    }
  }
  return intentos;
}

function cuerpo(intento, messages, stream) {
  return JSON.stringify({
    model: intento.model,
    messages: messages || [],
    temperature: 0.4,
    max_tokens: intento.maxTokens,
    stream, // siempre explícito: sin esto 9router puede contestar SSE aunque no se pida
  });
}

// Reenvía al cliente SOLO el texto (content); el razonamiento interno del modelo se descarta.
// Devuelve cuántos trozos de texto se enviaron (0 = este intento no sirvió).
async function transmitir(intento, messages, res) {
  const ctrl = new AbortController();
  let temporizador = setTimeout(() => ctrl.abort(), intento.ms);
  let enviados = 0;
  try {
    const r = await fetch(intento.url, {
      method: 'POST',
      headers: intento.headers,
      signal: ctrl.signal,
      body: cuerpo(intento, messages, true),
    });
    if (!r.ok) {
      console.warn(`${intento.nombre}/${intento.model} respondió ${r.status}`);
      return 0;
    }
    const lector = r.body.getReader();
    const decoder = new TextDecoder();
    let pendiente = '';
    while (true) {
      const { done, value } = await lector.read();
      if (done) break;
      pendiente += decoder.decode(value, { stream: true });
      let salto;
      while ((salto = pendiente.indexOf('\n')) >= 0) {
        const linea = pendiente.slice(0, salto).trim();
        pendiente = pendiente.slice(salto + 1);
        if (!linea.startsWith('data:')) continue;
        const carga = linea.slice(5).trim();
        if (!carga || carga === '[DONE]') continue;
        let trozo;
        try { trozo = JSON.parse(carga); } catch { continue; }
        const texto = trozo?.choices?.[0]?.delta?.content;
        if (typeof texto === 'string' && texto) {
          if (enviados === 0) { clearTimeout(temporizador); temporizador = null; }
          res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: texto } }] })}\n\n`);
          enviados += 1;
        }
      }
    }
  } catch (e) {
    console.warn(`${intento.nombre}/${intento.model} falló: ${e.name === 'AbortError' ? 'tiempo agotado' : e.message}`);
  } finally {
    if (temporizador) clearTimeout(temporizador);
  }
  return enviados;
}

async function responderSinStream(intento, messages) {
  const ctrl = new AbortController();
  const temporizador = setTimeout(() => ctrl.abort(), intento.ms);
  try {
    const r = await fetch(intento.url, {
      method: 'POST',
      headers: intento.headers,
      signal: ctrl.signal,
      body: cuerpo(intento, messages, false),
    });
    if (!r.ok) {
      console.warn(`${intento.nombre}/${intento.model} respondió ${r.status}`);
      return null;
    }
    const datos = await r.json();
    const texto = datos?.choices?.[0]?.message?.content;
    return typeof texto === 'string' && texto.trim() ? texto : null;
  } catch (e) {
    console.warn(`${intento.nombre}/${intento.model} falló: ${e.name === 'AbortError' ? 'tiempo agotado' : e.message}`);
    return null;
  } finally {
    clearTimeout(temporizador);
  }
}

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

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { messages, stream = true } = body;

    const hasImage = !!messages && messages.some((m) =>
      Array.isArray(m.content) && m.content.some((c) => c.type === 'image_url')
    );
    const intentos = armarIntentos(hasImage);

    if (!intentos.length) {
      console.error('Ni ROUTER9_API_KEY ni NVIDIA_API_KEY están configuradas en Vercel.');
      if (stream) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: 'Disculpa, el sistema está en mantenimiento. Puedes escribirnos directamente por WhatsApp. [BOTON_WHATSAPP]' } }] })}\n\ndata: [DONE]\n\n`);
        return res.end();
      }
      return res.status(200).json({
        choices: [{ message: { content: 'Disculpa, el sistema está en mantenimiento. Puedes escribirnos directamente por WhatsApp. [BOTON_WHATSAPP]' } }],
      });
    }

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      for (const intento of intentos) {
        const enviados = await transmitir(intento, messages, res);
        if (enviados > 0) {
          res.write('data: [DONE]\n\n');
          return res.end();
        }
      }
      res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: MENSAJE_WHATSAPP } }] })}\n\ndata: [DONE]\n\n`);
      return res.end();
    }

    for (const intento of intentos) {
      const texto = await responderSinStream(intento, messages);
      if (texto) return res.status(200).json({ choices: [{ message: { content: texto } }] });
    }
    return res.status(200).json({ choices: [{ message: { content: MENSAJE_WHATSAPP } }] });
  } catch (error) {
    console.error('Serverless Chat Error:', error.message);
    if (!res.headersSent) {
      return res.status(500).json({ error: 'No pudimos procesar tu mensaje. Escríbenos por WhatsApp.' });
    }
    res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: ' Escríbenos directamente por WhatsApp. [BOTON_WHATSAPP]' } }] })}\n\ndata: [DONE]\n\n`);
    return res.end();
  }
}
