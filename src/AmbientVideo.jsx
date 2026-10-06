import { useEffect, useRef } from 'react'

/**
 * Video ambient que se auto-reproduce al entrar al viewport y se pausa al salir.
 * Sin controles, sin sonido — solo visual decorativo.
 *
 * Props:
 *   src     - ruta al mp4 (ej. "/videos/demo-acker-1.mp4")
 *   poster  - ruta al jpg del poster
 *   side    - "left" | "right" — de qué lado del contenido central aparece
 *   className - clases extra para ajustar posición vertical
 */
export default function AmbientVideo({ src, poster, side = 'right', className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return

    // Respeta prefers-reduced-motion
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.25 }
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  const sideClass = side === 'left'
    ? 'left-0 -translate-x-1/2 xl:-translate-x-1/4'
    : 'right-0 translate-x-1/2 xl:translate-x-1/4'

  return (
    <div
      className={`absolute ${sideClass} top-0 hidden lg:block w-[200px] xl:w-[230px] aspect-[9/16] rounded-2xl overflow-hidden border border-brand-gold/25 shadow-[0_0_30px_rgba(201,169,97,0.08)] pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        className="w-full h-full object-cover"
      />
    </div>
  )
}
