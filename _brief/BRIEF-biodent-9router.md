# BRIEF - BioDent: el chatbot usa 9router (con respaldo a NVIDIA)

Archivo a tocar: `api/chat.js` (función serverless de Vercel, Node, ES module). El cliente (`src/App.jsx`, función `processChatMessage`) llama a `/api/chat` con `{ messages, stream }` y espera SSE estilo OpenAI (`data: {"choices":[{"delta":{"content":"..."}}]}` y `data: [DONE]`). NO cambies el formato de respuesta ni `src/App.jsx` salvo lo estrictamente necesario.

## Reglas duras
- NO commits, NO push, NO `git checkout/reset/stash`. NO toques `.env*`. No escribas claves en ningún archivo.
- Nada de dependencias nuevas (usa `fetch` nativo).
- No imprimas ni registres (console.log) claves ni el contenido completo de los mensajes del usuario.

## Qué hacer
Hoy `api/chat.js` solo llama a NVIDIA (`NVIDIA_API_KEY`). Hay que hacer que **use primero el 9router del dueño** y caiga a NVIDIA si falla:

1. Variables de entorno (se configuran en Vercel, NO en el código):
   - `ROUTER9_API_KEY` (obligatoria para usar 9router; si falta, se salta 9router y se usa NVIDIA como hoy).
   - `ROUTER9_URL` (opcional; por defecto `https://r3w75ds.abc-tunnel.us/v1`). Es compatible con OpenAI: `POST {ROUTER9_URL}/chat/completions` con `Authorization: Bearer <key>`.
   - `ROUTER9_MODELS` (opcional; lista separada por comas para texto; por defecto `oc/big-pickle(xhigh),oc/mimo-v2.6-flash-free(xhigh)`).
   - `ROUTER9_VISION_MODEL` (opcional; por defecto `C-O-5`, que acepta imágenes).
2. Orden de intento, en streaming y sin streaming:
   - Mensajes con imagen (`content` es array con `image_url`): modelo de visión de 9router → luego los modelos de visión de NVIDIA que ya están.
   - Solo texto: cada modelo de `ROUTER9_MODELS` en orden → luego los modelos NVIDIA que ya están.
   - Cada intento con tiempo máximo (usa `AbortController`, 12 s para texto, 20 s para imagen). Si un modelo responde error, vacío o se pasa del tiempo, se pasa al siguiente.
3. Detalles de 9router que hay que respetar:
   - Siempre manda `"stream": true` o `"stream": false` EXPLÍCITO (sin él puede contestar SSE aunque no lo pidas).
   - `max_tokens` debe ser ≥ 16 (hoy es 120: déjalo).
   - Algunos modelos devuelven razonamiento (`reasoning_content`) en el delta: NO lo reenvíes al cliente; solo `content`. Si en streaming el chunk trae solo `reasoning_content`, descártalo (no lo escribas al cliente).
   - Cloudflare puede bloquear el User-Agent por defecto de algunos clientes: manda `User-Agent: Go-http-client/1.1`.
4. Si TODOS fallan, el comportamiento de error sigue igual que hoy (mensaje de WhatsApp con `[BOTON_WHATSAPP]`).
5. Arregla de paso el texto "escrébenos" (typo) por "escríbenos" en `api/chat.js` y en `src/App.jsx` (línea ~207 y ~222).
6. Agrega al final de `README.md` del proyecto una sección corta "Chatbot" que explique las variables `ROUTER9_API_KEY`, `ROUTER9_URL`, `ROUTER9_MODELS`, `ROUTER9_VISION_MODEL` y `NVIDIA_API_KEY` y que el chatbot depende de que el PC del dueño tenga 9router y su túnel encendidos (si no, usa NVIDIA).

## Verificación
- `npm run build` y `npm run lint` sin errores nuevos.
- Escribe un script de prueba temporal `_brief/probar_chat.mjs` que importe el handler y lo pruebe con `fetch` simulado (mock): (a) 9router responde bien en streaming → se reenvía solo `content`; (b) 9router da 500 → se usa NVIDIA; (c) sin `ROUTER9_API_KEY` → va directo a NVIDIA; (d) todo falla → mensaje de WhatsApp; (e) un chunk con solo `reasoning_content` no llega al cliente. Corre el script y pega el resultado en el reporte. Bórralo al terminar.
- NO hagas llamadas reales a internet con claves.

## Reporte
Actualiza `HARNESS-REPORTE.md` (sección nueva "9router") con los archivos tocados, el resultado de las pruebas, y termina con `BIODENT 9ROUTER TERMINADO`.
