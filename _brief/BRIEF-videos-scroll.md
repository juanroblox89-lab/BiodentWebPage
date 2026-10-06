# BRIEF: Videos ambient que aparecen mientras bajas la página

## Objetivo
Conforme el usuario baja por la página de BioDent, quiere ver videos reales de la clínica reproduciéndose solos a los lados — como detalles decorativos ambient. No son una sección aparte: aparecen intercalados entre las secciones existentes, pegados al borde izquierdo o derecho, como si "enmarcaran" el contenido central. En mobile se ocultan o se muestran en ancho completo de forma compacta para no romper el layout.

## Comportamiento esperado
- Los videos se **auto-reproducen** (autoPlay, muted, loop, playsInline) cuando entran al viewport (IntersectionObserver threshold 0.3).
- Se **pausan** cuando salen del viewport (para no gastar batería).
- **Sin controles**, sin sonido, sin overlay de play — son puramente ambient/decorativos.
- Se respeta `prefers-reduced-motion`: si está activo, se muestra solo el poster estático.
- En **desktop (lg+)**: flotan a izquierda o derecha del contenido principal, con `position: sticky` o absoluto, tamaño ~200–260px de ancho, aspecto 9/16, con borde dorado sutil `border border-brand-gold/30`, `rounded-2xl`, ligera sombra.
- En **mobile (< lg)**: se muestran en línea, ancho ~140px, a la izquierda o derecha, permitiendo que el texto fluya al lado; o si no hay espacio, se ocultan con `hidden lg:block` según el diseño que quede mejor — lo que importa es que NO rompan el layout móvil.
- Aparecen intercalados entre las secciones ya existentes (entre servicios y doctora, entre doctora y casos, entre casos y contacto). No reemplazar nada existente.

## Videos disponibles (ya en public/videos/)
Landscape 1920×1080 originales, comprimidos a 540p, sin audio:

**Demo prótesis Acker semiflexible** (son del mismo paciente mostrando su prótesis):
- `demo-acker-1.mp4` / poster `demo-acker-1.jpg` (~9s)
- `demo-acker-2.mp4` / poster `demo-acker-2.jpg` (~8s)
- `demo-acker-3.mp4` / poster `demo-acker-3.jpg` (~5s)
- `demo-acker-4.mp4` / poster `demo-acker-4.jpg` (~3s)
- `demo-acker-5.mp4` / poster `demo-acker-5.jpg` (~14s)
- `demo-acker-6.mp4` / poster `demo-acker-6.jpg` (~3s)
- `demo-acker-7.mp4` / poster `demo-acker-7.jpg` (~26s)
- `demo-acker-8.mp4` / poster `demo-acker-8.jpg` (~4s)

**Testimonios** (paciente hablando):
- `testimonio-2.mp4` / poster `testimonio-2.jpg` (~9s)
- `testimonio-3.mp4` / poster `testimonio-3.jpg` (~8s)
- `testimonio-4.mp4` / poster `testimonio-4.jpg` (~8s)
- `testimonio-5.mp4` / poster `testimonio-5.jpg` (~15s)

No es necesario usar todos. Usar los que queden mejor visualmente (preferir los que duran más y tienen mejor imagen: demo-acker-1, demo-acker-2, demo-acker-5, demo-acker-7, testimonio-2, testimonio-5).

## Implementación sugerida

### Componente `AmbientVideo`
Crear `src/AmbientVideo.jsx`:
```jsx
// AmbientVideo: video ambient que se reproduce solo al entrar al viewport
// Props: src, poster, side ('left'|'right'), className extra
```
- `useRef` al `<video>`.
- `useEffect` con `IntersectionObserver` (threshold 0.25): `play()` al entrar, `pause()` al salir.
- Si `window.matchMedia('(prefers-reduced-motion: reduce)').matches`, no llamar `play()`.
- Render: `<video autoPlay muted loop playsInline preload="none" poster={poster} ...>`.
- Clases base desktop: `hidden lg:block absolute w-[220px] aspect-[9/16] rounded-2xl border border-brand-gold/30 overflow-hidden object-cover shadow-[0_0_30px_rgba(201,169,97,0.10)]`.
- Side left: posición `left-0` o `-left-4`; side right: `right-0` o `-right-4`.

### En `App.jsx`
Importar `AmbientVideo` y colocar al menos 3–4 instancias entre secciones, así:

```jsx
{/* Entre #servicios y #doctora */}
<div className="relative hidden lg:block h-0">
  <AmbientVideo src="/videos/demo-acker-5.mp4" poster="/videos/posters/demo-acker-5.jpg" side="right" className="top-[-200px]" />
</div>

{/* Entre #doctora y #casos */}
<div className="relative hidden lg:block h-0">
  <AmbientVideo src="/videos/testimonio-2.mp4" poster="/videos/posters/testimonio-2.jpg" side="left" className="top-[-180px]" />
</div>

{/* Entre #casos y #contacto */}
<div className="relative hidden lg:block h-0">
  <AmbientVideo src="/videos/demo-acker-1.mp4" poster="/videos/posters/demo-acker-1.jpg" side="right" className="top-[-160px]" />
</div>
```

Ajustar posiciones para que se vean bien y no tapen el texto central (el contenido central tiene `max-w-6xl mx-auto px-5`; en pantallas de 1280px los ambient videos pueden ir fuera del max-w).

## Reglas duras
- NO toques `.env*`
- NO hagas push ni commit
- NO lances subagentes
- NO toques `public/videos/` (los archivos ya están), solo referéncialos
- Autor git: `juanroblox89-lab <juanroblox89@gmail.com>` (ya configurado en el repo)
- El build debe pasar: `npm run build` sin errores

## Verificación
1. `npm run build` sin errores.
2. `npm run dev` y verificar en Chrome:
   - Desktop 1280px: los videos ambient aparecen a los lados mientras bajas.
   - Mobile 375px: el layout central no se rompe.
3. Al entrar/salir del viewport, el video pausa/reanuda (consola: no debe haber errores de DOMException en play()).

## Reporte
Al terminar: `HARNESS-REPORTE-videos-scroll.md` con:
- Qué archivos modificaste
- Hash del último commit local
- Cualquier ajuste de posicionamiento que hayas hecho
- Estado: LISTO / BLOQUEADO
