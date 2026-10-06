# HARNESS-REPORTE-ui

Sin commits, sin push, sin subagentes. No toqué `.env*`, `api/` ni `vercel.json`, y no agregué dependencias.

## Limitación importante
El modelo que ejecutó esto **no puede abrir imágenes**. Hice las capturas con Edge headless (a 375, 768, 1280 y 1920 px), pero **no las vi**. Verifiqué con mediciones del DOM: scroll horizontal, alto de los botones, orden de las secciones, peticiones de red, errores de consola y textos prohibidos. Las capturas se borraron al terminar.
**Pendiente para el director:** mirar a ojo en el celular el aspecto visual de `#como-llegar`, `#servicios`, `#casos` y las páginas estáticas.

## Parte A: Cómo llegar
- La sección `id="como-llegar"` está en `src/App.jsx`, como componente `ComoLlegar`, justo después del hero. Se confirmó que su elemento anterior es el hero.
- Es un panel de ancho completo con borde dorado, fondo propio y brillo suave. Tiene título grande y subtítulo, como pide el brief.
- Marco 9:16 de 280 px con carátula y botón de play dorado grande. `aria-label="Reproducir video: cómo llegar a BioDent"` y foco visible.
- Al tocar el play se monta `<video controls autoPlay playsInline preload="none">` con sonido.
  - La prueba lo confirmó: `paused=false`, `muted=false`, `controls=true`.
- El MP4 **no se descarga hasta tocar play**. En Network, antes del toque solo se pidió `testimonio.mp4`, que es del hero. `como-llegar.mp4` se pidió solo después del clic.
- Datos: dirección, horario y 3 pasos, con el texto exacto del brief.
- Botones: "Abrir en Google Maps" (nueva pestaña, `rel="noopener noreferrer"`) y "Pedir indicaciones por WhatsApp" (con `waLink(mensajeWeb(...))`). Miden entre 52 y 56 px de alto.
- En escritorio van dos columnas (video a un lado, datos al otro). En celular van en columna.
- Enlaces al apartado:
  - "Cómo llegar" en el menú de escritorio, antes de "Contacto".
  - Botón secundario "Cómo llegar" con ícono de ubicación en el hero.
  - "Ver cómo llegar en video" bajo la dirección en `#contacto`.
- Google:
  - `index.html`: se agregó `"hasMap"` al JSON-LD de la clínica.
  - `scripts/generar-seo.mjs`: enlace "Cómo llegar (video)" → `https://www.biodent.site/#como-llegar` en la caja de datos de las 8 páginas.
  - En `dentista-en-bello` hay un enlace extra en la sección "Cómo llegar y cuándo atendemos".
  - El generador se volvió a correr.

## Parte B
- **Orden de secciones** (medido): inicio, como-llegar, servicios, doctora, casos, contacto, odontologia-en-bello.
- **Servicios**:
  - Los 3 bloques grandes son ahora tarjetas con imagen 16:10 en celular y 50/50 en escritorio, alternando lados.
  - Las viñetas usan un check simple y el texto en minúsculas normales. Se quitaron los íconos al azar (flecha, círculo).
  - Más compactos en celular.
  - Los datos de las tarjetas "Más tratamientos" son los mismos de antes.
- **Pilares**: se reemplazaron por 4 tarjetas con íconos y solo hechos reales (ver textos cambiados).
- **#doctora**: reescrito sin cifras ni adornos.
- **#casos**: se reemplazó la imagen de banco "BEFORE/AFTER" por 4 carátulas reales con botón de play (`VideoTarjeta`). Cada una carga su MP4 solo al tocar.
- **Testimonios**: sección eliminada por completo.
- **Páginas estáticas** (generador):
  - Cabecera con logo y botón.
  - Hero con título, frase y botón dorado, con ícono de WhatsApp.
  - Video con carátula y play grande, sin reproductor pelado, con JS mínimo en línea (un `onclick`).
  - Tarjetas con íconos para los beneficios.
  - Preguntas frecuentes en acordeón, con filas de 48 px o más.
  - Barra fija de WhatsApp en celular, con `body` con padding inferior para no tapar contenido. Se oculta en pantallas de 760 px o más.
  - `dentista-en-bello` ahora muestra como video el de "cómo llegar".
  - JSON-LD intacto.
- **Consistencia**:
  - Secciones con `py-16 md:py-24`, títulos con el mismo tamaño, radios `rounded-2xl/3xl` y botón dorado único (`BTN_ORO`).
  - Contraste: `--color-brand-secondary` pasó de `#8A8577` a `#B3AD9F` y varios textos pequeños a `#B9B3A5`. Los textos `text-xs` de contacto pasaron a `text-sm`.
- **Táctil (mín. 44 px)**: botones del hero, cabecera, iconos sociales, botones del chat, miniaturas de HeroReels, botón de sonido, píldora del chat y teléfonos. La barra de navegación quedó en 54 px de alto. Tras los ajustes, en 375 px no queda ningún botón por debajo de 44 px fuera del pie y la lista de enlaces SEO. En escritorio los enlaces del menú miden 40 px (no se tocan con el dedo).
- **Responsividad**: sin scroll horizontal en 375, 768, 1280 y 1920 (`scrollWidth == clientWidth`). La pila del hero sigue rotando.
- **Bugs**:
  - Consola sin errores en todas las pruebas, y sin imágenes rotas.
  - Todos los `alt` están presentes.
  - Los enlaces `#` apuntan a ids que existen.
  - Se quitó el `handleCtaClick` sin uso, que llamaba a un `setShowCta` inexistente. Era un bug latente.
  - Se arregló `catch (e) {}`.
  - Los `title` de los botones del chat pasaron a `aria-label`.
- **Lint**: antes 3 avisos, ahora 1 (`avanzarA` en `HeroReels.jsx`). No lo toqué porque cambiaría la lógica del hero.
- **Verificación**:
  - `npm run build` OK.
  - `node scripts/generar-seo.mjs` OK: las 8 páginas tienen 1 `<h1>`, JSON-LD válido y el enlace a `#como-llegar`.
  - Se probaron 3 páginas estáticas a 375, 768 y 1280 px (`/protesis-flexible-bello/`, `/dentista-en-bello/` y `/limpieza-y-blanqueamiento-dental-bello/`): sin scroll horizontal ni errores.
  - En `/protesis-flexible-bello/`, el play monta el video y lo reproduce, y el MP4 no se pide antes del toque.
  - Los servidores (5180 y 5182) se mataron por puerto.

## Textos quitados o cambiados (para aprobación)
**Eliminados**
1. Sección completa "La voz de nuestros pacientes", con los 3 testimonios inventados (Mariana Gutiérrez, Dr. Carlos Restrepo, Helena de Samper).
2. En `#doctora`: "15+ años de trayectoria", "2,000+ sonrisas diseñadas", "100% biocompatibilidad", "Firma autorizada" y la firma en script.
3. En `#doctora`: los dos párrafos que mencionaban "más de 15 años", "análisis biométrico digital", "cerámica", "supervisa cada paso del laboratorio" y "lujo silencioso".
4. Pilares "Calidad Premium" y "Tecnología de Vanguardia".
5. Imagen de banco `beautiful_smile.png` y las etiquetas "Estado inicial (Antes)" y "Resultado final (Después)". Se quitó solo el import; el archivo sigue en `src/assets`.
6. Lema "TU SONRISA, NUESTRA PASIÓN", "COMODIDAD, ESTÉTICA Y CONFIANZA" (se repetía en cada bloque) y el sub-banner "Cuidamos tu sonrisa, transformamos tu vida."
7. `Agenda tu valoración sin costo` repetido bajo "Más tratamientos".
8. Emoji 🗑️ del chat.
9. Imagen de fondo + texto "Office Backdrop" (`alt`) en secciones eliminadas.

**Cambiados**
1. Hero: "Contamos con los mejores tipos de prótesis para devolverte función, estética y confianza." → "Prótesis, diseño de sonrisa y rehabilitación oral para devolverte función, estética y confianza." También se quitó el texto degradado del titular ("nuestra especialidad" ahora dorado liso).
2. Pilares → "Valoración sin costo", "Prótesis a tu medida", "Resultados naturales", "Junto al Éxito / Parque de Bello".
3. Títulos de `#servicios`: "Especialistas en Prótesis" → "Especialistas en prótesis". Se normalizaron mayúsculas en etiquetas.
4. Textos de Prótesis flexible, total y Acker acortados a una frase de 1 a 2 líneas, sin datos nuevos.
5. `#doctora`: etiqueta "Dirección médica" → "Tu odontóloga"; subtítulo "Especialista en Rehabilitación Oral y Prótesis" → "Prótesis y rehabilitación oral en Bello". Se agregó una lista corta con datos reales: valoración sin costo, lunes a sábado, junto al Éxito.
6. `#casos`: título "Transformaciones invisibles" → "Mira los resultados". La descripción "Un cambio estético absoluto y clínicamente perfecto…" → "Videos de trabajos hechos en la clínica. Toca para verlos."
7. `#contacto`:
   - "¿Listo para transformar tu sonrisa?" → "¿Listo para tu valoración?".
   - "Estaremos encantados de asesorarte…" → "Te ayudamos a agendar tu valoración sin costo con la Dra. Claudia."
   - Horario "Lunes a Viernes: 9:00 AM – 6:00 PM" → formato "a. m./p. m." igual al de la clínica.
   - "Líneas de Atención" y "Horario de Atención" pasaron a minúscula normal.
8. Chat: "Historial en Memoria" → "Historial". Se quitó "de forma segura".
9. `alt`: "Dra. Claudia Backdrop" → vacío (imagen decorativa); otros a descripciones útiles.

## Pendientes
- Revisión visual del director (ver la limitación arriba).
- El aviso de lint de `HeroReels.jsx` (`avanzarA` en las dependencias del efecto).
- `src/assets/beautiful_smile.png`, `hero.png`, `react.svg` y `vite.svg` ya no se usan (o nunca se usaron). Se pueden borrar si el director quiere.
- Menú de escritorio: sus enlaces miden 40 px de alto (no es táctil).
- `scripts/generar-seo.mjs`: el icono de WhatsApp está duplicado entre `App.jsx` y el generador.

UI TERMINADO
