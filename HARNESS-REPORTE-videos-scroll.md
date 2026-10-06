# HARNESS-REPORTE-videos-scroll

- Archivos: nuevo src/AmbientVideo.jsx; modificado src/App.jsx (import + 3 bloques entre servicios/doctora, doctora/casos, casos/contacto).
- Videos: demo-acker-5 (derecha), testimonio-2 (izquierda), demo-acker-1 (derecha).
- Último commit local: 2778577 (sin commits nuevos).
- Ajustes: ancho 140px (lg) / 170px (xl) / 220px (2xl); posición left-2/right-2 (8 en 2xl); en <2xl opacidad 35% porque con max-w-6xl a 1280px no hay margen y quedan detrás del texto (z-0, pointer-events-none). Se ocultan en <lg. IntersectionObserver 0.25, play().catch, respeta prefers-reduced-motion (solo poster).
- NO verificado en Chrome (solo npm run build, que pasa).
- Estado: LISTO (pendiente revisión visual)
