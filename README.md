# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## Chatbot

El asistente de la página llama a `/api/chat` (función de Vercel en `api/chat.js`). Primero intenta con el **9router** del dueño y, si falla, usa **NVIDIA**. Si ninguno responde, el paciente ve el botón de WhatsApp.

Variables de entorno en Vercel (Settings, Environment Variables):

| Variable | Para qué sirve |
|---|---|
| `ROUTER9_API_KEY` | Clave de 9router. Sin ella se salta 9router y se usa NVIDIA. |
| `ROUTER9_URL` | Opcional. Por defecto `https://r3w75ds.abc-tunnel.us/v1`. |
| `ROUTER9_MODELS` | Opcional. Modelos de texto, separados por coma. Por defecto `oc/big-pickle(xhigh),oc/mimo-v2.6-flash-free(xhigh)`. |
| `ROUTER9_VISION_MODEL` | Opcional. Modelo que acepta fotos. Por defecto `C-O-5`. |
| `ROUTER9_MAX_TOKENS` | Opcional. Por defecto 500 (los modelos que razonan gastan tokens pensando). |
| `NVIDIA_API_KEY` | Respaldo. |

El chatbot solo usa 9router mientras el PC del dueño tenga 9router y su túnel encendidos. Si no, cae a NVIDIA.
