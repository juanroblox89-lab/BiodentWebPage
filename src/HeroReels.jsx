import { useEffect, useRef, useState } from 'react'

// Escenario de reels en el hero (estilo rohlfingconcept, sin inclinación 3D):
// un marco vertical 9:16 donde los videos reales se pasan solos con fundido,
// título abajo a la izquierda, contador "01 / 09" abajo a la derecha,
// barra de progreso dorada arriba y miniaturas debajo para saltar.
// Solo el video ACTIVO se monta (los demás solo aportan su carátula).
const DURACION_MS = 4500;

export default function HeroReels({ videos = [] }) {
  const [idx, setIdx] = useState(0);
  const [hover, setHover] = useState(false);
  const [foco, setFoco] = useState(false);
  const [toque, setToque] = useState(false);
  const [sonido, setSonido] = useState(false);
  const [visible, setVisible] = useState(true);
  const [oculta, setOculta] = useState(false);
  const [movimientoReducido, setMovimientoReducido] = useState(false);
  const marcoRef = useRef(null);
  const videoRef = useRef(null);
  const total = videos.length;

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setMovimientoReducido(mq.matches);
    const onChange = (e) => setMovimientoReducido(e.matches);
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange);
    };
  }, []);

  useEffect(() => {
    const onVis = () => setOculta(document.hidden);
    setOculta(document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  useEffect(() => {
    const el = marcoRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(
      (entries) => setVisible(entries[0].isIntersecting),
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const pausadoPorUsuario = hover || foco || toque || sonido;
  const rotar = !movimientoReducido && visible && !oculta && !pausadoPorUsuario && total > 1;

  useEffect(() => {
    if (!rotar) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % total), DURACION_MS);
    return () => clearInterval(t);
  }, [rotar, total, idx]);

  // Fuera de pantalla o pestaña oculta: pausa el video y la rotación.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (!visible || oculta) {
      v.pause();
    } else {
      v.play().catch(() => {});
    }
  }, [visible, oculta, idx]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !sonido;
    if (sonido) v.play().catch(() => {});
  }, [sonido, idx]);

  if (total === 0) return null;
  const actual = videos[idx];
  const pad = (n) => String(n).padStart(2, '0');
  const irA = (i) => setIdx(((i % total) + total) % total);

  return (
    <div ref={marcoRef} className="w-full" aria-label="Videos de casos reales">
      <div
        className="relative aspect-[9/16] w-full overflow-hidden rounded-[22px] border border-brand-gold/30 bg-black shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => { setHover(false); setToque(false); }}
        onTouchStart={() => setToque(true)}
        onTouchEnd={() => setToque(false)}
        onFocus={() => setFoco(true)}
        onBlur={() => setFoco(false)}
      >
        {/* Carátula de fondo para que el cambio funda sobre algo */}
        <img
          src={`/videos/posters/${actual.id}.jpg`}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Solo el video activo se monta: no se descargan los 9 MP4 al abrir */}
        <video
          key={actual.id}
          ref={videoRef}
          src={`/videos/${actual.id}.mp4`}
          poster={`/videos/posters/${actual.id}.jpg`}
          className="hero-reels-fade absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted={!sonido}
          loop
          playsInline
          preload="metadata"
          onError={() => irA(idx + 1)}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/25"></div>

        {/* Barra de progreso dorada: avanza durante los 4,5 s */}
        {!movimientoReducido && rotar && (
          <div
            key={`prog-${actual.id}`}
            className="hero-reels-progreso absolute left-0 top-0 z-10 h-[3px] bg-brand-gold"
          ></div>
        )}

        {/* Título y detalle abajo a la izquierda, sonido y contador abajo a la derecha */}
        <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-2 p-3">
          <div className="min-w-0 flex-1 text-left">
            <p className="font-heading block text-[12px] font-bold uppercase leading-tight tracking-wider text-white drop-shadow-md">
              {actual.titulo}
            </p>
            <p className="font-sans block line-clamp-2 text-[11px] font-light leading-snug text-brand-white/85">
              {actual.detalle}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setSonido((s) => !s)}
              aria-pressed={sonido}
              aria-label={sonido ? 'Silenciar video' : 'Activar sonido del video'}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-gold/50 bg-black/55 text-brand-gold backdrop-blur-sm transition-colors hover:bg-brand-gold hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
            >
              {sonido ? (
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z" />
                </svg>
              ) : (
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.6 3 2.7-2.7-1.4-1.4-2.7 2.7-2.7-2.7-1.4 1.4 2.7 2.7-2.7 2.7 1.4 1.4 2.7-2.7 2.7 2.7 1.4-1.4-2.7-2.7z" />
                </svg>
              )}
            </button>
            <span className="rounded-full border border-white/20 bg-black/45 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-white backdrop-blur-md">
              {pad(idx + 1)} / {pad(total)}
            </span>
          </div>
        </div>
      </div>

      {/* Miniaturas para saltar de video */}
      <div className="scroll-limpio mt-3 flex gap-1.5 overflow-x-auto pb-1 lg:grid lg:grid-cols-9 lg:overflow-visible" role="group" aria-label="Elegir video">
        {videos.map((v, i) => (
          <button
            key={v.id}
            type="button"
            onClick={() => irA(i)}
            aria-label={`Ver: ${v.titulo} ${v.detalle}`}
            aria-current={i === idx ? true : undefined}
            className={`relative h-10 w-9 shrink-0 overflow-hidden rounded-md border transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold lg:w-full ${
              i === idx
                ? 'border-brand-gold shadow-[0_0_12px_rgba(201,169,97,0.45)]'
                : 'border-brand-gold/20 opacity-70 hover:opacity-100'
            }`}
          >
            <img
              src={`/videos/posters/${v.id}.jpg`}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
