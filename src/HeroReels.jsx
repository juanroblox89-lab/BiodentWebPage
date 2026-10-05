import { useEffect, useRef, useState } from 'react'

// Escenario de reels en el hero (estilo rohlfingconcept, sin inclinación 3D):
// un marco vertical 9:16 donde los videos reales se pasan solos con fundido,
// título abajo a la izquierda, contador "01 / 09" abajo a la derecha,
// barra de progreso dorada arriba y miniaturas debajo para saltar.
// Solo el video ACTIVO se monta (los demás solo aportan su carátula).
const DURACION_MS = 4500;
// Ángulos fijos (grados) para que la pila se vea desordenada pero estable, no aleatoria en cada recarga.
const ANGULOS = [-5, 4, -3, 6, -6, 3, -4, 5, -2];
const DESPLAZ = [[-14, 10], [16, 14], [-10, 20], [12, 8], [-16, 16], [10, 22], [-12, 12], [14, 18], [-8, 24]];

export default function HeroReels({ videos = [], ctaHref = null }) {
  const [idx, setIdx] = useState(0);
  const [saliente, setSaliente] = useState(null); // hoja que se va volando al pasar al siguiente
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
    const t = setInterval(() => avanzarA(idx + 1), DURACION_MS);
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
  function avanzarA(i) {
    const destino = ((i % total) + total) % total;
    if (destino === idx) return;
    setSaliente(idx);
    setIdx(destino);
    setTimeout(() => setSaliente(null), 600);
  }
  const irA = avanzarA;

  const hoja = (k) => {
    const j = (idx + k) % total;
    const [dx, dy] = DESPLAZ[j % DESPLAZ.length];
    return { j, rot: ANGULOS[j % ANGULOS.length], dx, dy };
  };
  const atras = total > 2 ? [3, 2, 1] : total > 1 ? [1] : [];

  return (
    <div ref={marcoRef} className="w-full" aria-label="Videos de casos reales">
      <div className="relative">
        {/* Hojas de atrás: las carátulas de los siguientes videos, una encima de otra y desordenadas */}
        {atras.map((k) => {
          const h = hoja(k);
          return (
            <div
              key={`atras-${h.j}`}
              aria-hidden="true"
              className="hero-reels-hoja pointer-events-none absolute inset-0 overflow-hidden rounded-[22px] border border-brand-gold/25 bg-black shadow-[0_14px_36px_rgba(0,0,0,0.55)]"
              style={{
                transform: `translate(${h.dx * k * 0.9}px, ${h.dy * k * 0.45}px) rotate(${h.rot * (1 + k * 0.2) * 1.4}deg) scale(${1 - k * 0.02})`,
                zIndex: 3 - k,
              }}
            >
              <img src={`/videos/posters/${videos[h.j].id}.jpg`} alt="" loading="lazy" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-black/30"></div>
            </div>
          );
        })}

        {/* La hoja que se va: sale volando hacia un lado antes de mostrar la siguiente */}
        {saliente !== null && saliente !== idx && (
          <div
            key={`sale-${saliente}-${idx}`}
            aria-hidden="true"
            className="hero-reels-sale pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-[22px] border border-brand-gold/30 bg-black shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            style={{ '--giro': `${ANGULOS[saliente % ANGULOS.length] > 0 ? 16 : -16}deg` }}
          >
            <img src={`/videos/posters/${videos[saliente].id}.jpg`} alt="" className="h-full w-full object-cover" />
          </div>
        )}

      <div
        className="hero-reels-frente relative z-10 aspect-[9/16] w-full overflow-hidden rounded-[22px] border border-brand-gold/40 bg-black shadow-[0_24px_60px_rgba(0,0,0,0.6)]"
        style={{ transform: `rotate(${ANGULOS[idx % ANGULOS.length] * 0.3}deg)` }}
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

      </div>

      {/* CTA del video que se está viendo: lleva a WhatsApp con el tratamiento ya escrito */}
      {ctaHref && (
        <a
          href={ctaHref(actual)}
          target="_blank"
          rel="noopener noreferrer"
          className="cta-valoracion mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-brand-gold px-4 py-3 font-heading text-xs font-bold uppercase tracking-wider text-[#0A0A0A] transition-colors hover:bg-brand-glow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold"
        >
          Quiero este resultado
          <span aria-hidden="true">&rarr;</span>
        </a>
      )}

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
