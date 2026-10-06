# BRIEF - BioDent: videos reales + servicios nuevos + WhatsApp

Proyecto: `C:\Users\USUARIO\Desktop\jestalvz\proyectos\biodent` (React 19 + Vite 8 + Tailwind 4, una sola página en `src/App.jsx`, estilos en `src/index.css`). Es la web de la Dra. Claudia Mabel Tapias, clínica BioDent en Bello, Antioquia. Hoy corre en https://biodentweb.vercel.app. Estilo de la página: negro + dorado ("lujo silencioso"), tipografías ya definidas. NO cambies la identidad visual.

## Reglas duras
- NO commits, NO push, NO `git checkout/reset/stash`. Solo trabaja en el árbol. El director revisa, hace commit y publica.
- NO toques `.env*`, `api/chat.js` ni el chatbot (solo lo pedido abajo).
- Un solo servidor de desarrollo a la vez (`npm run dev`, puerto 5173); mátalo al terminar. La máquina tiene 8 GB de RAM.
- Sin emojis en la interfaz: íconos SVG. Sin degradados raros. Español neutro con tú.
- NADA falso: no inventes servicios, precios, cifras, reseñas ni afirmaciones médicas. Solo el texto que está en este brief.
- Móvil primero (375 px), compacto, que cargue rápido. Revisa capturas a 375 px y a 1280 px antes de decir que terminaste.

## Estado actual (ya hecho por el director, NO lo deshagas)
- `src/App.jsx`: en "Líneas de Atención" ya están los 3 WhatsApp con enlace, incluido el nuevo +57 314 530 4329 ("WhatsApp Adicional").
- `index.html`: la descripción ya dice Bello, Antioquia.
- `public/videos/` ya contiene los MP4 (≈13 MB, ya livianos) y `public/videos/posters/` sus carátulas JPG. No los recomprimas.
- `_videos_origen/` está ignorado por git; no lo uses.
- `_brief/referencia_parche.py` es un parche YA ESCRITO por el director con el código de las partes 1 y 2 de abajo (constantes, componente `CasosVideos`, tarjetas de servicios). Úsalo como base: puedes aplicarlo (`python _brief/referencia_parche.py`, revisa antes que cada texto ancla exista) o escribirlo tú mismo a mano mejorándolo. Añade el video `microdiseno` a la lista.

## Parte 1. Videos reales ("Casos reales en video")
En la sección `#casos` (ya existe, con la imagen antes/después), debajo de la imagen, un carrusel horizontal de tarjetas verticales 9:16:
- Deslizable con el dedo (scroll-snap), sin barra visible; cada tarjeta ~58 vw en móvil (máx. 250 px).
- Muestra la carátula (`/videos/posters/<id>.jpg`, `loading="lazy"`) con un botón de play dorado. Al tocar, se reemplaza por `<video controls autoPlay playsInline>` con sonido. Solo un video activo a la vez. `preload` solo después del toque (no cargar los MP4 al abrir la página).
- Debajo de cada tarjeta, título y detalle cortos. Lista, en este orden (id = nombre de archivo sin extensión):

| id | título | detalle |
|---|---|---|
| testimonio | Testimonio real | Una paciente cuenta su experiencia |
| antes-despues-carillas | Antes y después | Prótesis flexible superior y carillas en resina |
| parcial-flexible | Prótesis parcial flexible | Superior e inferior |
| diseno-resina | Diseño de sonrisa | En resina de alta estética |
| diseno-sonrisa | Diseño de sonrisa | Un cambio total |
| microdiseno | Microdiseño | Detalle y estética |
| acker-semiflexible | Prótesis Acker | Semi flexible |
| rehabilitacion-oral | Rehabilitación oral | Atención profesional |
| antes-despues | Antes y después | Limpieza y aclaramiento dental |

- Accesibilidad: el botón de play con `aria-label` que diga el título; foco visible.
- Revisa cada carátula: si alguna sale borrosa o con algo raro, avísalo en el reporte (no la cambies tú).

## Parte 2. Servicios nuevos, conectados a WhatsApp
Debajo de los 3 bloques grandes que ya existen (Prótesis Flexible, Total, Acker) y antes del "Center Sub-banner", una sección compacta "Más tratamientos" (título "Y también"), con la línea "Agenda tu valoración sin costo". Tarjetas en rejilla: 1 columna en móvil, 2 en tablet, 3 en escritorio. Cada tarjeta: ícono SVG dorado en círculo, nombre, una frase y el enlace "Agendar valoración" a WhatsApp con mensaje prellenado usando el `getWhatsAppLink` que ya existe en `App.jsx` (número principal 573114345328). Servicios y frases EXACTAS:

1. Limpieza y aclaramiento dental: "Elimina placa y sarro. Dientes más blancos y brillantes." Mensaje: "Hola Dra. Claudia, deseo agendar una valoración para Limpieza y aclaramiento dental."
2. Diseño de sonrisa en resina: "Estética natural con resina de alta estética." Mensaje: "... para Diseño de sonrisa en resina."
3. Prótesis parcial flexible: "Superior e inferior, con estética natural y atención profesional." Mensaje: "... para una Prótesis parcial flexible (superior e inferior)."
4. Prótesis Acker semi flexible: "Una opción semi flexible para recuperar tu sonrisa." Mensaje: "... para una Prótesis Acker semi flexible."
5. Rehabilitación oral: "Atención profesional para devolverle función y estética a tu boca." Mensaje: "... para Rehabilitación oral."

## Parte 3. Otros arreglos pequeños
- En el menú superior (`nav`) el enlace "Tratamientos" y "Casos" ya existen; en móvil el menú de escritorio está oculto: NO agregues menú hamburguesa, no hace falta.
- `og:` y `meta`: agrega en `index.html` `<meta property="og:title">`, `og:description` (igual a la descripción actual), `og:locale` es_CO. Sin imágenes inventadas.
- Que `npm run build` y `npm run lint` pasen sin errores nuevos.

## Verificación (obligatoria)
1. `npm run build` OK.
2. `npm run dev`, capturas a 375 px y 1280 px de: la sección de servicios nuevos, el carrusel de videos (con un video reproduciéndose), y el bloque de contacto con los 3 números. Revisa las capturas tú mismo (no te lo asumas).
3. Comprueba que al tocar play carga SOLO ese video (Network) y que no se descargan MP4 al abrir la página.
4. Mata el servidor de desarrollo y borra capturas temporales.

## Reporte
Escribe `HARNESS-REPORTE.md` en la raíz del proyecto: qué hiciste, qué archivos tocaste, qué quedó pendiente o raro (carátulas, textos), y al final `ESTADO PARA RETOMAR` + la línea `BIODENT TERMINADO`.
