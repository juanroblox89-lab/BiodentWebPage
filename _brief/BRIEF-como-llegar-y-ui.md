# BRIEF - BioDent: apartado "Cómo llegar" con video + pulido de interfaz (Sonnet 5.5)

Proyecto: `C:\Users\USUARIO\Desktop\jestalvz\proyectos\biodent` (React 19 + Vite 8 + Tailwind 4; la página principal está en `src/App.jsx` y `src/HeroReels.jsx`; estilos en `src/index.css`). Producción: https://www.biodent.site. Estilo: negro + dorado ("lujo silencioso"), compacto, MÓVIL PRIMERO (la mayoría de los pacientes entra desde el celular).

## Reglas duras
- NO commits, NO push, NO `git checkout/reset/stash/clean`. El director revisa y publica.
- NO toques `.env*`, `api/`, `vercel.json`. Sin dependencias nuevas (solo React + Tailwind/CSS).
- Sin emojis en la interfaz (íconos SVG coherentes). Sin degradados raros. Español neutro con "tú".
- NADA falso: no inventes datos, cifras, reseñas, precios ni tiempos. Solo lo que está en este brief o ya publicado por la clínica.
- Un solo servidor de desarrollo (`npm run dev -- --port 5180`) a la vez; mátalo al terminar (la máquina tiene 8 GB de RAM). No lances subagentes.
- Verifica TODO con capturas a 375 px y 1280 px (y 768 px). Revisa las capturas tú mismo antes de decir que terminaste. Borra capturas temporales al terminar.
- Las páginas estáticas de `public/<slug>/index.html` NO se editan a mano: salen del generador `scripts/generar-seo.mjs` (`node scripts/generar-seo.mjs`). Edita el generador y vuelve a correrlo.

## PARTE A. Apartado "Cómo llegar" con el video (que sea OBVIO y pese en la página)
Hay un video vertical (540x960, 40 s, con audio) que muestra el recorrido a pie desde la calle (zona del Parque de Bello, frente al Éxito) hasta el consultorio en el segundo piso (se ve el aviso de BioDent en la escalera). Ya está en `public/videos/como-llegar.mp4` con carátula `public/videos/posters/como-llegar.jpg`.

1. Crea la sección `id="como-llegar"` en `src/App.jsx`, colocada INMEDIATAMENTE después del hero (antes de las "cuatro columnas"/pilares), para que sea de lo primero que se vea al bajar. Debe pesar visualmente: ancho completo, fondo propio distinto del resto (por ejemplo panel oscuro con borde dorado y brillo suave), título grande "Cómo llegar a BioDent", subtítulo "Mira el recorrido en video: de la calle al consultorio".
2. Diseño: en celular, columna: título, el video (marco vertical 9:16, ancho ~280 px, centrado, esquinas redondeadas, borde dorado, gran botón de play dorado sobre la carátula; al tocar se reproduce con `controls` y SONIDO, `playsInline`; carga el MP4 solo al tocar `preload="none"` hasta entonces), debajo los datos y los botones. En escritorio, dos columnas: video a un lado y a la otra los datos.
3. Datos (solo estos, reales): Dirección: "Calle 50 #48-34, segundo piso, junto al Éxito del Parque de Bello, Antioquia". Horario: "Lunes a viernes de 9:00 a. m. a 6:00 p. m. y sábados de 9:00 a. m. a 1:00 p. m.". Tres pasos cortos que describan SOLO lo que muestra el video: "1. Llega al Parque de Bello y ubica el Éxito.  2. Camina hasta la Calle 50 #48-34.  3. Sube las escaleras al segundo piso: ahí está BioDent."
4. Botones grandes (estilo de los botones dorados llenos del sitio; clase `cta-valoracion` existe en `index.css`): "Abrir en Google Maps" → `https://www.google.com/maps/search/?api=1&query=Calle+50+%2348-34+Bello+Antioquia`  (nueva pestaña, `rel="noopener noreferrer"`) y "Pedir indicaciones por WhatsApp" → usa los helpers que ya existen en `App.jsx`: `waLink(mensajeWeb("quiero que me ayuden a llegar al consultorio."))`.
5. Hazlo OBVIO desde otros lugares: (a) en el menú de escritorio (`nav`) agrega el enlace "Cómo llegar" → `#como-llegar` (antes de "Contacto"); (b) en el hero, un botón secundario "Cómo llegar" (junto a los de Instagram/Facebook) con ícono de ubicación que baje a `#como-llegar`; (c) en la sección de contacto, justo bajo la dirección, un enlace "Ver cómo llegar en video" → `#como-llegar`.
6. Datos para Google: en `index.html` agrega en el JSON-LD de la clínica `"hasMap": "https://www.google.com/maps/search/?api=1&query=Calle+50+%2348-34+Bello+Antioquia"`. En `scripts/generar-seo.mjs` agrega, en la caja de datos al final de cada página y en la página `dentista-en-bello`, un enlace "Cómo llegar (video)" → `https://www.biodent.site/#como-llegar`. Corre el generador.
7. Accesibilidad: el botón de play con `aria-label="Reproducir video: cómo llegar a BioDent"`, foco visible, y el video con `<track>` no es necesario.

## PARTE B. Pulido de interfaz, responsividad, bugs y texto sin sentido
Revisa TODA la página principal (`#inicio`, `#como-llegar`, pilares, `#servicios` con sus 3 bloques grandes Prótesis Flexible/Total/Acker y la rejilla "Más tratamientos", `#doctora`, `#casos`, testimonios, `#contacto`, footer, y el chat) y las 8 páginas estáticas del generador.

B1. UI que se ve "sin diseño":
- Los 3 bloques grandes de `#servicios` (Prótesis Flexible, Total, Acker): jerarquía visual clara, imágenes con proporción consistente y bien recortadas, espaciado parejo, que en celular queden compactos (hoy son largos), viñetas con íconos SVG que SÍ signifiquen lo que dicen (hoy tienen íconos al azar, p. ej. una flecha de navegación para "LIGERA Y FLEXIBLE" y un círculo para "ESTÉTICA Y DISCRETA"). Cambia a íconos coherentes o a viñetas simples de marca.
- Páginas estáticas del generador (por ejemplo `/protesis-flexible-bello/`): hoy son solo texto sobre negro. Dales el mismo nivel de diseño que la página principal: cabecera con logo, bloque inicial (hero) con título, frase y el botón dorado; si la página tiene `video`, muéstralo con carátula y botón de play grande (no un reproductor pelado); tarjetas con íconos para los beneficios; preguntas frecuentes mejor diseñadas; botón de WhatsApp fijo abajo en celular (barra delgada, que no tape contenido). Mantén CERO JavaScript pesado, carga rápida y los datos estructurados intactos.
- Consistencia: tamaños de título, espacios entre secciones, radios y bordes iguales en todo el sitio. Revisa contraste del texto gris sobre negro (que se lea bien en celular al sol).
B2. Responsividad (375, 768, 1280, 1920): nada se sale de la pantalla ni genera scroll horizontal, nada se corta, los botones se pueden tocar (mín. 44 px de alto), el chat flotante no tapa botones importantes, la pila de videos del hero sigue funcionando.
B3. Bugs: busca y arregla lo que encuentres (consola del navegador sin errores, enlaces rotos, imágenes sin `alt` útil, botones que no hacen nada, focos, textos cortados). Arregla también el aviso de `npm run lint` si es trivial. No cambies la lógica del chat ni del hero salvo bugs reales.
B4. TEXTO SIN SENTIDO / INVENTADO — quítalo o reemplázalo:
- Los tres testimonios con nombre (Mariana Gutiérrez, Dr. Carlos Restrepo, Helena de Samper) son inventados: elimina esa sección completa (o conviértela en un bloque corto que invite a ver el video del testimonio real que ya está en el hero, sin nombres inventados).
- Cifras sin respaldo en `#doctora`: "2,000+ sonrisas diseñadas", "100% biocompatibilidad" y los "años de trayectoria" si no hay un dato real: quítalas (o deja solo datos que ya publica la clínica). "Firma autorizada" y otros adornos sin significado, fuera.
- La imagen antes/después en inglés ("BEFORE / AFTER") de `#casos` es de banco de imágenes: reemplázala por un bloque con 2 o 3 de las carátulas REALES de `public/videos/posters/` (antes-despues*.jpg) que lleven a los videos, o quítala. Nada de imágenes de banco presentadas como casos de la clínica.
- Frases de relleno repetidas, textos en mayúsculas sostenidas que cansan, lemas vacíos ("Tu sonrisa, nuestra pasión" repetido, etc.): déjalos en una sola aparición con sentido o quítalos. Prefiere frases cortas y concretas basadas en lo que la clínica realmente hace.
- Revisa ortografía y tildes.
Anota en el reporte CADA texto que quitaste o cambiaste (para que el director lo apruebe).

## Verificación obligatoria
1. `npm run build` OK; `npm run lint` sin errores nuevos; `node scripts/generar-seo.mjs` OK y que cada página generada tenga un solo `<h1>` y su JSON-LD válido.
2. Capturas a 375 / 768 / 1280 px de: hero, `#como-llegar` (con el video reproduciéndose y sin reproducir), `#servicios`, `#doctora`, `#casos`, `#contacto`, y de al menos 3 páginas estáticas (`/protesis-flexible-bello/`, `/dentista-en-bello/`, `/limpieza-y-blanqueamiento-dental-bello/`). Para ver las páginas estáticas usa `npm run build` y sirve la carpeta `dist` (`python -m http.server 5182 --directory dist`), porque `npm run dev` no sirve esas carpetas. MATA los servidores al terminar (solo los que tú arrancaste, por su puerto).
3. Comprueba en Network que el MP4 de "Cómo llegar" NO se descarga hasta tocar play.

## Reporte
Escribe `HARNESS-REPORTE-ui.md` en la raíz: qué hiciste por parte, archivos tocados, la lista de textos eliminados/cambiados, capturas revisadas, pendientes, y termina con `UI TERMINADO`.
