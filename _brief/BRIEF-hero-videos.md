# BRIEF - BioDent: los videos van en el HERO (estilo rohlfingconcept.com)

Proyecto: `C:\Users\USUARIO\Desktop\jestalvz\proyectos\biodent` (React 19 + Vite + Tailwind 4, todo en `src/App.jsx`, estilos en `src/index.css`). Sitio en producción: https://www.biodent.site

## Reglas duras
- NO commits, NO push, NO `git checkout/reset/stash`. NO toques `.env*`, `api/`, `index.html`, `vercel.json`.
- SIN dependencias nuevas (no framer-motion): solo React + CSS/Tailwind.
- Sin emojis; íconos SVG. Español neutro. Nada falso (los textos de los videos están abajo).
- Móvil primero (375 px), compacto. Un solo `npm run dev` a la vez; mátalo al terminar (8 GB de RAM).
- No uses subagentes.

## Referencia (léela)
`C:\Users\USUARIO\Desktop\jestalvz\proyectos\Frontend-Agent-Kit\projects\rohlfingconcept\src\components\HeroShowcase.tsx`: escenario de reels en el hero de rohlfingconcept.com. Un marco vertical 9:16 con bordes redondeados donde los videos reales se van pasando solos (crossfade cada ~4,3 s), nombre abajo a la izquierda, contador "01 / 07" abajo a la derecha, barra de progreso fina arriba, y una fila de miniaturas debajo para saltar. Los videos son `autoPlay muted loop playsInline preload="metadata"` con `poster`. Hay que reproducir ese patrón en BioDent con colores negro + dorado (`brand-gold`, `brand-bg`...), SIN la inclinación 3D.

## Qué hacer
1. Crea el componente `HeroReels` en `src/App.jsx` (o un archivo `src/HeroReels.jsx` importado) y ponlo en el HERO (`<section id="inicio">`):
   - Escritorio (lg): a la DERECHA del texto del hero, ancho máx. ~300 px, el marco 9:16 centrado verticalmente.
   - Móvil: debajo de los botones de WhatsApp/Instagram/Facebook, ancho máx. ~230 px, centrado, para que el hero siga siendo compacto (que el texto principal y los botones se vean sin hacer scroll en 375x667 — el marco puede quedar debajo del primer pantallazo).
2. Los videos ya existen en `public/videos/<id>.mp4` y carátulas en `public/videos/posters/<id>.jpg`. Usa la lista `VIDEOS_CASOS` que ya está en `App.jsx` (id, titulo, detalle), en ese orden. NO agregues ni quites videos.
3. Comportamiento:
   - Solo el video ACTIVO se monta (los otros solo su miniatura/poster), para no descargar los 9 MP4 al abrir la página. `preload="metadata"`, `muted`, `loop`, `playsInline`, `autoPlay`, `poster`.
   - Rotación automática cada 4,5 s con crossfade (opacidad con CSS, ~600 ms). Se detiene al pasar el mouse / al tocar el marco / con foco de teclado, y mientras la pestaña está oculta (`document.hidden`), y fuera de pantalla (IntersectionObserver: si el hero no se ve, pausa el video y la rotación).
   - `prefers-reduced-motion: reduce`: no rotar solo; mostrar el primer video y las miniaturas para cambiar a mano.
   - Barra de progreso dorada fina arriba del marco, avanza durante los 4,5 s (animación CSS), se reinicia al cambiar.
   - Título (`titulo`) y detalle (`detalle`) abajo a la izquierda sobre un degradado oscuro; contador "01 / 09" abajo a la derecha.
   - Botón pequeño de sonido (ícono SVG altavoz) abajo en el marco: por defecto SILENCIO; al tocar activa el sonido del video actual (y detiene la rotación automática mientras tenga sonido). Con `aria-label` y `aria-pressed`.
   - Fila de miniaturas debajo del marco (las 9 carátulas, `loading="lazy"`, alto ~40 px, la activa con borde dorado). En móvil con scroll horizontal sin barra visible (usa la clase `scroll-limpio` que ya existe en `index.css`). Cada miniatura es un botón con `aria-label="Ver: <título> <detalle>"`.
   - Si un video falla al cargar (`onError`), salta al siguiente sin romper nada.
4. QUITA el carrusel viejo `<CasosVideos />` de la sección `#casos` y borra su componente `CasosVideos` (ya no se usa). Deja intacta la imagen antes/después y el resto de `#casos`.
5. No cambies textos, números de teléfono ni otras secciones.

## Verificación (obligatoria)
1. `npm run build` OK y `npm run lint` sin errores NUEVOS.
2. `npm run dev` y capturas a 375 px y a 1280 px del hero (con un video corriendo). Revísalas tú mismo: nada cortado, el texto del hero legible, el marco sin salirse de la pantalla, miniaturas visibles.
3. Comprueba en Network que al abrir la página SOLO se pide el MP4 activo (no los 9) y que al pasar al siguiente se pide el siguiente.
4. Mata el servidor y borra capturas temporales.

## Reporte
Escribe `HARNESS-REPORTE-hero.md` en la raíz: qué hiciste, archivos tocados, capturas revisadas, qué quedó raro, y termina con `HERO TERMINADO`.
