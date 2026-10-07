import React, { useState, useRef, useEffect } from 'react'
import biodentLogoImg from './assets/biodent_logo.png'
import flexibleProsthesisImg from './assets/flexible_prosthesis.png'
import totalProsthesisImg from './assets/total_prosthesis.png'
import ackerProsthesisImg from './assets/acker_prosthesis.png'
import dentalOfficeImg from './assets/dental_office.png'
import drClaudiaImg from './assets/dr_claudia_hd.jpg'
import HeroReels from './HeroReels.jsx'

// WhatsApp de la clínica de Bello: todos los botones y mensajes salen de aquí.
const WHATSAPP_CLINICA = '573148091585';
const waLink = (texto) => `https://wa.me/${WHATSAPP_CLINICA}?text=${encodeURIComponent(texto)}`;
// Todo mensaje que llega a la clínica empieza igual, para saber que viene de la página.
const mensajeWeb = (resto) => `Hola, los vi en la página web y ${resto}`;

// Preguntas rápidas del chat: un toque y se envía.
const SUGERENCIAS_CHAT = [
  { etiqueta: 'Tratamientos', texto: '¿Qué tratamientos ofrecen?' },
  { etiqueta: 'Valoración sin costo', texto: 'Quiero agendar una valoración sin costo' },
  { etiqueta: 'Ubicación y horario', texto: '¿Dónde están ubicados y cuál es el horario?' },
  { etiqueta: 'Prótesis flexible', texto: 'Cuéntame sobre la prótesis flexible' },
];

// Videos reales de la clínica (public/videos). Solo se descargan cuando alguien toca el play.
const VIDEOS_CASOS = [
  { id: 'testimonio', titulo: 'Testimonio real', detalle: 'Una paciente cuenta su experiencia' },
  { id: 'antes-despues-carillas', titulo: 'Antes y después', detalle: 'Prótesis flexible superior y carillas en resina' },
  { id: 'parcial-flexible', titulo: 'Prótesis parcial flexible', detalle: 'Superior e inferior' },
  { id: 'diseno-resina', titulo: 'Diseño de sonrisa', detalle: 'En resina de alta estética' },
  { id: 'diseno-sonrisa', titulo: 'Diseño de sonrisa', detalle: 'Un cambio total' },
  { id: 'microdiseno', titulo: 'Microdiseño', detalle: 'Detalle y estética' },
  { id: 'acker-semiflexible', titulo: 'Prótesis Acker', detalle: 'Semi flexible' },
  { id: 'rehabilitacion-oral', titulo: 'Rehabilitación oral', detalle: 'Atención profesional' },
  { id: 'antes-despues', titulo: 'Antes y después', detalle: 'Limpieza y aclaramiento dental' },
];

// Tratamientos adicionales: tarjetas compactas, cada una con su mensaje de WhatsApp.
const SERVICIOS_EXTRA = [
  {
    nombre: 'Limpieza y aclaramiento dental',
    texto: 'Elimina placa y sarro. Dientes más blancos y brillantes.',
    mensaje: 'Limpieza y aclaramiento dental',
    icono: 'M5 3v4M3 5h4M6 17v4M4 19h4M13 3l2.5 5.5L21 11l-5.5 2.5L13 19l-2.5-5.5L5 11l5.5-2.5L13 3z',
  },
  {
    nombre: 'Diseño de sonrisa en resina',
    texto: 'Estética natural con resina de alta estética.',
    mensaje: 'Diseño de sonrisa en resina',
    icono: 'M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z',
  },
  {
    nombre: 'Prótesis parcial flexible',
    texto: 'Superior e inferior, con estética natural y atención profesional.',
    mensaje: 'una Prótesis parcial flexible (superior e inferior)',
    icono: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
  },
  {
    nombre: 'Prótesis Acker semi flexible',
    texto: 'Una opción semi flexible para recuperar tu sonrisa.',
    mensaje: 'una Prótesis Acker semi flexible',
    icono: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
  {
    nombre: 'Rehabilitación oral',
    texto: 'Atención profesional para devolverle función y estética a tu boca.',
    mensaje: 'Rehabilitación oral',
    icono: 'M12 4c2.5 0 4 1.5 4 4s-.5 4-1 6.5S14 20 12 20s-3-3.5-3-5.5.5-4-1-6.5 1.5-4 4-4z',
  },
];

const BTN_ORO = 'cta-valoracion inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-brand-gold px-6 py-3 text-center font-heading text-xs font-bold uppercase tracking-wider text-[#0A0A0A] transition-colors hover:bg-brand-glow';

const PROTESIS = [
  {
    nombre: 'Prótesis flexible',
    etiqueta: 'Rehabilitación removible',
    img: flexibleProsthesisImg,
    alt: 'Prótesis flexible de BioDent',
    texto: 'Prótesis removible en materiales flexibles y estéticos que se adapta a tu boca. Su base translúcida deja ver el color natural de la encía.',
    puntos: ['Liviana y flexible', 'Estética y discreta', 'Cómoda y resistente'],
  },
  {
    nombre: 'Prótesis total',
    etiqueta: 'Rehabilitación completa',
    img: totalProsthesisImg,
    alt: 'Prótesis total de BioDent',
    texto: 'Reemplaza todos los dientes. Se elabora en acrílico de alta densidad para soportar la masticación y restaurar las facciones naturales del rostro.',
    puntos: ['Restaura la función masticatoria', 'Mejora la estética facial', 'Más comodidad y confianza'],
  },
  {
    nombre: 'Prótesis Acker',
    etiqueta: 'Rehabilitación parcial',
    img: ackerProsthesisImg,
    alt: 'Prótesis Acker de BioDent',
    texto: 'Prótesis removible parcial, flexible y estética, que reemplaza dientes faltantes. Se sujeta en los dientes que conservas para un anclaje firme.',
    puntos: ['Ligera y flexible', 'Estética y discreta', 'Cómoda y resistente'],
  },
];

const TIRAS_PROTESIS = {
  'Prótesis flexible': { grupo: 'flexible', titulo: 'Prótesis flexible en casos reales', subtitulo: 'Trabajos hechos en la clínica. Desliza y toca para ver.' },
  'Prótesis total': { grupo: 'total', titulo: 'Rehabilitación con prótesis', subtitulo: 'Un caso real de la clínica. Toca para verlo.' },
  'Prótesis Acker': { grupo: 'acker', titulo: 'Acker flexible en casos reales', subtitulo: 'Desliza para ver más casos de la clínica.' },
};
const CASOS_DESTACADOS = ['testimonio', 'antes-despues-carillas', 'antes-despues', 'diseno-sonrisa'].map((id) => VIDEOS_CASOS.find((v) => v.id === id));

// Solo un video suena a la vez: al activar uno se avisa a los demás para que vuelvan a su carátula.
const EVENTO_VIDEO = 'biodent:video-activo';
function useVideoUnico(token, activo, setActivo) {
  useEffect(() => {
    if (activo) window.dispatchEvent(new CustomEvent(EVENTO_VIDEO, { detail: token }));
  }, [activo, token]);
  useEffect(() => {
    const alOtro = (e) => { if (e.detail !== token) setActivo(false); };
    window.addEventListener(EVENTO_VIDEO, alOtro);
    return () => window.removeEventListener(EVENTO_VIDEO, alOtro);
  }, [token, setActivo]);
}
// Tarjeta de video: muestra la carátula y solo pide el MP4 al tocar.
function VideoTarjeta({ id, titulo, detalle = '' }) {
  const [activo, setActivo] = useState(false);
  const token = useRef(Symbol('video')).current;
  useVideoUnico(token, activo, setActivo);
  return (
    <figure className="m-0">
      <div className="relative aspect-[9/16] overflow-hidden rounded-2xl border border-brand-gold/40 bg-black">
        {activo ? (
          <video className="h-full w-full object-cover" src={`/videos/${id}.mp4`} poster={`/videos/posters/${id}.jpg`} controls autoPlay playsInline preload="none" aria-label={`Video: ${titulo}${detalle ? `. ${detalle}` : ''}`} />
        ) : (
          <button
            type="button"
            onClick={() => setActivo(true)}
            aria-label={`Reproducir video: ${titulo}${detalle ? `. ${detalle}` : ''}`}
            className="group absolute inset-0 block h-full w-full cursor-pointer focus-visible:outline focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-brand-glow"
          >
            <img src={`/videos/posters/${id}.jpg`} alt="" loading="lazy" className="h-full w-full object-cover" />
            <span className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/10"></span>
            <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-gold text-[#0A0A0A] shadow-[0_0_0_6px_rgba(201,169,97,0.25)]">
              <svg className="ml-0.5 h-6 w-6 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
            </span>
          </button>
        )}
      </div>
      <figcaption className="mt-2 text-left">
        <span className="block font-heading text-xs font-bold uppercase tracking-wider text-brand-white">{titulo}</span>
        {detalle && <span className="block font-sans text-xs leading-snug text-[#B9B3A5]">{detalle}</span>}
      </figcaption>
    </figure>
  );
}

// Galería de la clínica (public/videos/g). Los títulos son los de la página de Facebook; cada MP4 se pide solo al tocar play.
const GALERIA = [
  { id: '1090847400357143', titulo: 'Prótesis parcial removible superior', grupo: 'flexible' },
  { id: '2124245435197598', titulo: 'Prótesis flexible superior y carillas en resina', grupo: 'flexible' },
  { id: '4476906885914705', titulo: 'Rehabilitación con prótesis en alta estética', grupo: 'total' },
  { id: '4093938577402828', titulo: 'Acker flexible superior · caso 1', grupo: 'acker' },
  { id: '1571426944245720', titulo: 'Acker flexible superior · caso 2', grupo: 'acker' },
  { id: '1605121888020350', titulo: 'Acker flexible · caso 1', grupo: 'acker' },
  { id: '4660831370864697', titulo: 'Acker flexible · caso 2', grupo: 'acker' },
  { id: '1062673213405352', titulo: 'Acker flexible · caso 3', grupo: 'acker' },
  { id: '4402731709991864', titulo: 'Acker flexible · caso 4', grupo: 'acker' },
  { id: '1395917162694530', titulo: 'Diseño de sonrisa en resina · caso 1', grupo: 'diseno' },
  { id: '1397754392509318', titulo: 'Diseño de sonrisa en resina · caso 2', grupo: 'diseno' },
  { id: '1736946967419303', titulo: 'Diseño de sonrisa en resina · caso 3', grupo: 'diseno' },
  { id: '1985836905369888', titulo: 'Aclaramiento dental y armonización de bordes en resina', grupo: 'aclaramiento' },
  { id: '1710454407265580', titulo: 'Segunda sesión de aclaramiento dental · caso 1', grupo: 'aclaramiento' },
  { id: '2153799578852662', titulo: 'Segunda sesión de aclaramiento dental · caso 2', grupo: 'aclaramiento' },
  { id: '886925041017833', titulo: 'Segunda sesión de aclaramiento dental · caso 3', grupo: 'aclaramiento' },
  { id: '1043173052082339', titulo: 'Cuidados de un aclaramiento dental', grupo: 'aclaramiento' },
  { id: '1407839157521670', titulo: 'Microdiseño · caso 1', grupo: 'microdiseno' },
  { id: '1352741603304004', titulo: 'Microdiseño · caso 2', grupo: 'microdiseno' },
  { id: '4539025719676088', titulo: 'Caso real', grupo: 'casos' },
];
const galeriaDe = (grupo) => GALERIA.filter((v) => v.grupo === grupo).map((v) => ({ ...v, id: `g/${v.id}` }));

// Tira horizontal deslizable de videos verticales, para repartir entre las secciones.
function TiraVideos({ titulo, subtitulo, videos }) {
  return (
    <div className="py-10 md:py-14">
      <div className="mb-5 text-center md:mb-6">
        <span className="block font-heading text-xs font-bold uppercase tracking-[0.25em] text-brand-gold">{titulo}</span>
        <p className="mx-auto mt-2 max-w-xl font-sans text-sm font-light text-brand-secondary md:text-base">{subtitulo}</p>
      </div>
      <ul className="scroll-limpio -mx-5 flex scroll-px-5 sm:scroll-px-8 md:scroll-px-12 snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1 sm:-mx-8 sm:px-8 md:-mx-12 md:px-12" aria-label={titulo}>
        {videos.map((v) => (
          <li key={v.id} className="w-[46vw] max-w-[220px] shrink-0 snap-start first:ml-auto last:mr-auto">
            <VideoTarjeta {...v} />
          </li>
        ))}
      </ul>
    </div>
  );
}
const DIRECCION = 'Calle 50 #48-34, segundo piso, junto al Éxito del Parque de Bello, Antioquia';
const HORARIO = 'Lunes a viernes de 9:00 a. m. a 6:00 p. m. y sábados de 9:00 a. m. a 1:00 p. m.';
const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Calle+50+%2348-34+Bello+Antioquia';
const PASOS_LLEGAR = [
  'Llega al Parque de Bello y ubica el Éxito.',
  'Camina hasta la Calle 50 #48-34.',
  'Sube las escaleras al segundo piso: ahí está BioDent.',
];

const RUTA_UBICACION = 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z';
const RUTA_RELOJ = 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z';

function Icono({ d, className = 'w-5 h-5' }) {
  return (
    <svg className={`${className} fill-none stroke-current`} strokeWidth="1.6" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

const WA_PATH = 'M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.62.962 3.21 1.493 4.904 1.496 5.434.004 9.859-4.417 9.862-9.857.002-2.636-1.023-5.11-2.884-6.974C16.672 1.955 14.195.932 11.56.932c-5.443 0-9.87 4.42-9.873 9.861-.001 1.776.479 3.51 1.39 5.048l-.946 3.453 3.536-.93c1.558.847 3.11 1.29 4.39 1.29z';

// Cómo llegar: video vertical del recorrido. El MP4 no se pide hasta que la persona toca el play.
function ComoLlegar() {
  const [reproduciendo, setReproduciendo] = useState(false);
  const token = useRef(Symbol('video')).current;
  useVideoUnico(token, reproduciendo, setReproduciendo);
  return (
    <section id="como-llegar" aria-labelledby="titulo-como-llegar" className="relative z-10 scroll-mt-24 px-4 py-14 sm:px-6 md:py-20">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-brand-gold/50 bg-[#100E09] shadow-[0_0_60px_rgba(201,169,97,0.14)]">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[34rem] -translate-x-1/2 rounded-full bg-brand-gold/15 blur-[90px]"></div>
        <div className="relative grid grid-cols-1 items-center gap-8 px-5 py-10 sm:px-10 lg:grid-cols-12 lg:gap-14 lg:px-14 lg:py-14">
          <div className="text-center lg:col-span-12">
            <span className="mb-3 block font-heading text-xs font-bold uppercase tracking-[0.25em] text-brand-gold">Ubicación</span>
            <h2 id="titulo-como-llegar" className="font-heading text-3xl font-bold uppercase tracking-wider text-brand-white md:text-5xl">Cómo llegar a BioDent</h2>
            <p className="mx-auto mt-3 max-w-xl font-sans text-base font-light text-brand-secondary md:text-lg">Mira el recorrido en video: de la calle al consultorio</p>
            <div className="mx-auto mt-5 h-px w-20 bg-brand-gold"></div>
          </div>

          <div className="flex justify-center lg:col-span-5">
            <div className="relative aspect-[9/16] w-[280px] max-w-full overflow-hidden rounded-2xl border-2 border-brand-gold bg-black shadow-[0_0_40px_rgba(201,169,97,0.25)]">
              {reproduciendo ? (
                <video
                  className="h-full w-full object-cover"
                  src="/videos/como-llegar.mp4"
                  poster="/videos/posters/como-llegar.jpg"
                  controls
                  autoPlay
                  playsInline
                  preload="none"
                  aria-label="Video: recorrido a pie hasta el consultorio de BioDent"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setReproduciendo(true)}
                  aria-label="Reproducir video: cómo llegar a BioDent"
                  className="group absolute inset-0 block h-full w-full cursor-pointer focus-visible:outline focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-brand-glow"
                >
                  <img src="/videos/posters/como-llegar.jpg" alt="Entrada al consultorio de BioDent, segundo piso" className="h-full w-full object-cover" />
                  <span className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/15"></span>
                  <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-gold text-[#0A0A0A] shadow-[0_0_0_8px_rgba(201,169,97,0.25),0_10px_30px_rgba(0,0,0,0.5)] transition-transform group-hover:scale-105">
                    <svg className="ml-1 h-9 w-9 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
                  </span>
                  <span className="absolute inset-x-0 bottom-0 bg-black/70 px-3 py-2 text-center font-heading text-[11px] font-semibold uppercase tracking-widest text-brand-white">Toca para ver con sonido</span>
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-7">
            <ul className="space-y-5">
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-gold/40 bg-black/40 text-brand-gold"><Icono d={RUTA_UBICACION} /></span>
                <div>
                  <span className="block font-heading text-xs font-bold uppercase tracking-wider text-brand-white">Dirección</span>
                  <p className="font-sans text-sm leading-relaxed text-[#B9B3A5]">{DIRECCION}</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-gold/40 bg-black/40 text-brand-gold"><Icono d={RUTA_RELOJ} /></span>
                <div>
                  <span className="block font-heading text-xs font-bold uppercase tracking-wider text-brand-white">Horario</span>
                  <p className="font-sans text-sm leading-relaxed text-[#B9B3A5]">{HORARIO}</p>
                </div>
              </li>
            </ul>

            <ol className="mt-7 space-y-3">
              {PASOS_LLEGAR.map((paso, i) => (
                <li key={paso} className="flex items-center gap-4 rounded-2xl border border-brand-gold/20 bg-black/40 p-3.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-gold font-heading text-sm font-bold text-[#0A0A0A]">{i + 1}</span>
                  <span className="font-sans text-sm leading-snug text-brand-white md:text-base">{paso}</span>
                </li>
              ))}
            </ol>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-valoracion inline-flex min-h-[52px] flex-1 items-center justify-center gap-2.5 rounded-full bg-brand-gold px-6 py-3 text-center font-heading text-xs font-bold uppercase tracking-wider text-[#0A0A0A] transition-colors hover:bg-brand-glow"
              >
                <Icono d={RUTA_UBICACION} className="w-5 h-5 shrink-0" />
                Abrir en Google Maps
              </a>
              <a
                href={waLink(mensajeWeb('quiero que me ayuden a llegar al consultorio.'))}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-valoracion inline-flex min-h-[52px] flex-1 items-center justify-center gap-2.5 rounded-full bg-brand-gold px-6 py-3 text-center font-heading text-xs font-bold uppercase tracking-wider text-[#0A0A0A] transition-colors hover:bg-brand-glow"
              >
                <svg className="h-5 w-5 shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true"><path d={WA_PATH} /></svg>
                Pedir indicaciones por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function App() {
  // Chatbot State (Recreated From Scratch)
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const messagesContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  const DEFAULT_GREETING = { 
    role: 'assistant', 
    content: '¡Hola! Bienvenido a BioDent Bello. Soy tu asistente de recepción virtual y estoy encantada de colaborarte con tus dudas sobre dientes, tratamientos y prótesis dentales. ¿En qué puedo ayudarte hoy? Si deseas, también puedes enviarme una foto de tus dientes.' 
  };

  const [chatMessages, setChatMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('biodent_chat_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Could not load chat history:', e);
    }
    return [DEFAULT_GREETING];
  });

  // Save chat to localStorage with try/catch safety
  useEffect(() => {
    try {
      const cleanToSave = chatMessages.map(m => ({
        role: m.role,
        content: m.content,
        image: m.image ? '[Foto adjunta]' : undefined
      }));
      localStorage.setItem('biodent_chat_v4', JSON.stringify(cleanToSave));
    } catch (e) {
      console.warn('Could not save chat history:', e);
    }
  }, [chatMessages]);

  const clearChatHistory = () => {
    setChatMessages([DEFAULT_GREETING]);
    try {
      localStorage.removeItem('biodent_chat_v4');
    } catch { /* sin almacenamiento disponible */ }
    setShowHistoryModal(false);
  };

  // Scroll to bottom of chat list inside container only
  useEffect(() => {
    if (isChatOpen && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatMessages, isChatOpen]);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('La foto es muy pesada. Por favor elige una imagen menor a 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const processChatMessage = async (textToSend, imageToSend = null) => {
    const textContent = (textToSend || '').trim();
    if (!textContent && !imageToSend) return;

    const userMsgObj = { role: 'user', content: textContent, image: imageToSend };
    const updatedHistory = [...chatMessages, userMsgObj];
    setChatMessages(updatedHistory);
    setChatInput('');
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsChatLoading(true);

    // Append initial empty assistant message for SSE streaming
    setChatMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    try {
      const systemPrompt = `Eres la recepcionista virtual de BioDent, la clínica dental de la Dra. Claudia Mabel Tapias en Bello, Antioquia. Hablas en español de Colombia, con un trato amable, cálido y profesional.

Qué haces: respondes dudas generales sobre salud oral y los tratamientos de la clínica, y ayudas a agendar una valoración.

Tratamientos de la clínica: prótesis flexible, prótesis parcial flexible (superior e inferior), prótesis total, prótesis Acker (incluida la semi flexible), diseño de sonrisa en resina, microdiseño, limpieza y aclaramiento dental, y rehabilitación oral.
Datos reales: la Dra. Claudia Mabel Tapias tiene 25 años de trayectoria profesional. La valoración es sin costo. Dirección: Calle 50 #48-34, segundo piso, junto al Éxito del Parque de Bello, Antioquia. Horario: lunes a viernes de 9:00 a. m. a 6:00 p. m. y sábados de 9:00 a. m. a 1:00 p. m. WhatsApp de la clínica: +57 314 809 1585.

Reglas:
1. Solo hablas de dientes, salud oral y la clínica. Si preguntan por otro tema, responde con amabilidad que solo puedes ayudar con la salud oral y la clínica, y ofrece ayuda con eso.
2. Respuestas cortas: de 2 a 4 frases. Sin listas largas ni formato especial.
3. No inventes precios, descuentos, tiempos de tratamiento ni resultados garantizados. Si piden precio o tiempos, explica que depende de cada caso y que se define en la valoración sin costo; invítalos a escribir por WhatsApp.
4. No des diagnósticos ni recetes medicamentos. Si envían una foto, comenta lo que ves de forma general y aclara que la Dra. Claudia debe valorar el caso en persona.
5. Cuando la persona quiera agendar, cotizar o tenga una urgencia, invítala a escribir por WhatsApp (+57 314 809 1585) e incluye la palabra WhatsApp en tu respuesta.
6. Si hay dolor fuerte, inflamación o sangrado que no para, recomienda acudir cuanto antes a atención odontológica o de urgencias.`;

      const messagesToSend = [{ role: 'system', content: systemPrompt }];

      for (const m of chatMessages.slice(-10)) {
        if (m.role === 'assistant') {
          if (m.content) messagesToSend.push({ role: 'assistant', content: m.content });
        } else {
          if (m.image) {
            messagesToSend.push({
              role: 'user',
              content: [
                { type: 'text', text: m.content || 'Foto adjunta' },
                { type: 'image_url', image_url: { url: m.image } }
              ]
            });
          } else {
            messagesToSend.push({ role: 'user', content: m.content });
          }
        }
      }

      if (imageToSend) {
        messagesToSend.push({
          role: 'user',
          content: [
            { type: 'text', text: textContent || 'Adjunto foto de mis dientes para orientación' },
            { type: 'image_url', image_url: { url: imageToSend } }
          ]
        });
      } else {
        messagesToSend.push({ role: 'user', content: textContent });
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messagesToSend, stream: true })
      });

      if (!response.ok) {
        throw new Error(`Servidor API error status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedContent = '';
      let pendiente = '';

      const procesarLinea = (linea) => {
        const trimmed = linea.trim();
        if (!trimmed.startsWith('data:')) return;
        const dataStr = trimmed.slice(5).trim();
        if (!dataStr || dataStr === '[DONE]') return;
        try {
          const parsed = JSON.parse(dataStr);
          const deltaContent = parsed.choices?.[0]?.delta?.content || parsed.choices?.[0]?.message?.content || '';
          if (deltaContent) {
            accumulatedContent += deltaContent;
            setChatMessages((prev) => {
              const updated = [...prev];
              const lastIdx = updated.length - 1;
              if (lastIdx >= 0 && updated[lastIdx].role === 'assistant') {
                updated[lastIdx] = { role: 'assistant', content: accumulatedContent };
              }
              return updated;
            });
          }
        } catch {
          // línea que no es JSON: se ignora
        }
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        // Un trozo de red puede cortar una línea a la mitad: se guarda lo incompleto para el siguiente.
        pendiente += decoder.decode(value, { stream: true });
        const lineas = pendiente.split('\n');
        pendiente = lineas.pop() ?? '';
        lineas.forEach(procesarLinea);
      }
      if (pendiente) procesarLinea(pendiente);

      if (!accumulatedContent) {
        setChatMessages((prev) => {
          const updated = [...prev];
          const lastIdx = updated.length - 1;
          if (lastIdx >= 0 && updated[lastIdx].role === 'assistant') {
            updated[lastIdx] = { 
              role: 'assistant', 
              content: 'Por favor escríbenos a nuestro WhatsApp para poder orientarte de inmediato. [BOTON_WHATSAPP]' 
            };
          }
          return updated;
        });
      }

    } catch (error) {
      console.error('Error en el chat:', error);
      setChatMessages((prev) => {
        const updated = [...prev];
        const lastIdx = updated.length - 1;
        if (lastIdx >= 0 && updated[lastIdx].role === 'assistant') {
          updated[lastIdx] = {
            role: 'assistant',
            content: 'Lo siento, tuve un problema para responderte. Puedes volver a intentarlo o escribirnos directamente por WhatsApp. [BOTON_WHATSAPP]'
          };
        }
        return updated;
      });
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (isChatLoading) return;
    processChatMessage(chatInput, selectedImage);
  };

  const renderMessageContent = (content, role, esUltimo = false) => {
    if (!content) return null;

    const lower = content.toLowerCase();
    const hasWhatsapp = content.includes('[BOTON_WHATSAPP]') || content.includes('https://wa.me/') || lower.includes('whatsapp');

    let cleanText = content
      .replace(/https?:\/\/wa\.me\/[^\s)]+/g, '')
      .replace(/\[BOTON_WHATSAPP\]/g, '')
      .replace(/\[WhatsApp\]/g, '')
      .trim();

    const ultimaPregunta = [...chatMessages].reverse().find((m) => m.role === 'user' && m.content)?.content || '';
    const hrefWhatsApp = waLink(mensajeWeb(
      ultimaPregunta
        ? `estuve hablando con el asistente y mi pregunta fue: "${ultimaPregunta.slice(0, 140)}". Quiero agendar una valoración.`
        : 'quiero agendar una valoración sin costo.'
    ));

    return (
      <div className="space-y-2">
        {cleanText && <div>{cleanText}</div>}
        {hasWhatsapp && role === 'assistant' && esUltimo && (
          <a
            href={hrefWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2.5 inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-[#25D366] text-white font-bold text-xs shadow-md hover:bg-[#20bd5a] hover:scale-[1.02] transition-all w-full text-center no-underline"
          >
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.62.962 3.21 1.493 4.904 1.496 5.434.004 9.859-4.417 9.862-9.857.002-2.636-1.023-5.11-2.884-6.974C16.672 1.955 14.195.932 11.56.932c-5.443 0-9.87 4.42-9.873 9.861-.001 1.776.479 3.51 1.39 5.048l-.946 3.453 3.536-.93c1.558.847 3.11 1.29 4.39 1.29z" />
            </svg>
            Contactar por WhatsApp
          </a>
        )}
      </div>
    );
  };

  const getWhatsAppLink = (text) => waLink(text);

  return (
    <div className="min-h-screen bg-brand-bg text-brand-white relative overflow-hidden font-sans selection:bg-brand-gold selection:text-brand-bg">
      
      {/* Decorative Background Curves */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <svg className="absolute top-0 left-0 w-full h-[4500px] opacity-[0.06] text-brand-gold" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M -200,300 C 300,100 800,900 1400,200" stroke="currentColor" strokeWidth="1.5" />
          <path d="M 1400,1000 C 800,1500 400,700 -200,1200" stroke="currentColor" strokeWidth="1.5" />
          <path d="M -200,2100 C 400,2400 900,1800 1400,2500" stroke="currentColor" strokeWidth="1.5" />
          <path d="M 1400,3200 C 700,3700 300,3200 -200,3800" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        {/* Subtle radial glow in background */}
        <div className="absolute top-[3%] left-[15%] w-[600px] h-[600px] rounded-full bg-brand-gold/5 blur-[130px] animate-slow-pulse"></div>
        <div className="absolute top-[35%] right-[5%] w-[600px] h-[600px] rounded-full bg-brand-glow/4 blur-[160px] animate-slow-pulse"></div>
        <div className="absolute bottom-[20%] left-[5%] w-[500px] h-[500px] rounded-full bg-brand-gold/4 blur-[130px] animate-slow-pulse"></div>
      </div>

      {/* Floating Navigation Bar */}
      <header className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 w-[94%] sm:w-[92%] max-w-6xl backdrop-blur-md bg-brand-bg/85 border border-brand-gold/15 rounded-full px-3.5 sm:px-6 py-1 sm:py-1.5 flex justify-between items-center z-50 transition-all duration-300 shadow-lg">
        {/* Brand Name */}
        <a href="#inicio" className="flex min-h-[44px] items-center gap-1.5 sm:gap-2 group shrink-0">
          <img src={biodentLogoImg} alt="BioDent Logo" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-brand-gold/20 object-contain" />
          <span className="font-heading font-bold text-brand-white text-xs sm:text-base tracking-[0.2em] sm:tracking-[0.25em] ml-0.5 sm:ml-1">BIODENT</span>
        </a>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#inicio" className="text-brand-secondary hover:text-brand-gold transition-colors font-heading text-xs font-semibold uppercase tracking-wider py-3">Inicio</a>
          <a href="#servicios" className="text-brand-secondary hover:text-brand-gold transition-colors font-heading text-xs font-semibold uppercase tracking-wider py-3">Tratamientos</a>
          <a href="#doctora" className="text-brand-secondary hover:text-brand-gold transition-colors font-heading text-xs font-semibold uppercase tracking-wider py-3">La Doctora</a>
          <a href="#casos" className="text-brand-secondary hover:text-brand-gold transition-colors font-heading text-xs font-semibold uppercase tracking-wider py-3">Casos</a>
          <a href="#como-llegar" className="text-brand-secondary hover:text-brand-gold transition-colors font-heading text-xs font-semibold uppercase tracking-wider py-3">Cómo llegar</a>
          <a href="#contacto" className="text-brand-secondary hover:text-brand-gold transition-colors font-heading text-xs font-semibold uppercase tracking-wider py-3">Contacto</a>
        </nav>

        {/* Right CTA and Social Icons - Visible on Mobile & Desktop */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3.5 border-r border-brand-gold/15 pr-2 sm:pr-4 text-[#C9A961]">
            {/* WhatsApp Icon */}
            <a href={waLink(mensajeWeb("quiero más información."))} target="_blank" rel="noopener noreferrer" className="flex h-11 w-9 items-center justify-center hover:text-brand-glow hover:scale-110 transition-all" title="WhatsApp">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.62.962 3.21 1.493 4.904 1.496 5.434.004 9.859-4.417 9.862-9.857.002-2.636-1.023-5.11-2.884-6.974C16.672 1.955 14.195.932 11.56.932c-5.443 0-9.87 4.42-9.873 9.861-.001 1.776.479 3.51 1.39 5.048l-.946 3.453 3.536-.93c1.558.847 3.11 1.29 4.39 1.29zM16.59 13.9c-.277-.14-1.643-.812-1.896-.905-.254-.094-.44-.14-.623.14-.184.278-.712.905-.873 1.09-.16.185-.32.207-.597.068-.277-.14-1.17-.43-2.228-1.374-.823-.734-1.38-1.64-1.54-1.92-.162-.276-.017-.426.12-.564.125-.124.277-.323.416-.484.14-.16.184-.277.277-.463.093-.185.047-.348-.024-.486-.07-.14-.622-1.5-.853-2.053-.225-.54-.452-.467-.622-.476-.16-.008-.344-.01-.528-.01-.184 0-.485.07-.738.348-.254.278-.97.948-.97 2.31 0 1.36.99 2.68 1.127 2.866.138.186 1.948 2.973 4.72 4.17 1.102.47 1.96.75 2.628.963.69.22 1.32.19 1.81.114.55-.085 1.643-.67 1.874-1.32.23-.65.23-1.205.162-1.32-.068-.113-.253-.185-.53-.325z" />
              </svg>
            </a>
            {/* Instagram Icon */}
            <a href="https://www.instagram.com/biodent_parquedebello/" target="_blank" rel="noopener noreferrer" className="flex h-11 w-9 items-center justify-center hover:text-brand-glow hover:scale-110 transition-all" title="Instagram">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
            {/* Facebook Icon */}
            <a href="https://www.facebook.com/people/Dra-Claudia-Mabel-Tapias/61587872871889/" target="_blank" rel="noopener noreferrer" className="flex h-11 w-9 items-center justify-center hover:text-brand-glow hover:scale-110 transition-all" title="Facebook">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          </div>
          <a 
            href={waLink(mensajeWeb("quiero más información."))} 
            target="_blank"
            rel="noopener noreferrer"
            className="shimmer-btn relative overflow-hidden bg-transparent border border-brand-gold text-brand-gold px-3 sm:px-5 min-h-[44px] inline-flex items-center rounded-full font-heading text-[10px] sm:text-xs font-semibold uppercase tracking-wider transition-all duration-300 hover:bg-brand-gold hover:text-brand-bg hover:shadow-[0_0_15px_rgba(201,169,97,0.3)] shrink-0"
          >
            Agendar Cita
          </a>
        </div>
      </header>

      {/* Hero Section with Responsive Mobile Doctor Backdrop */}
      <section id="inicio" className="relative min-h-screen flex flex-col justify-center items-start lg:flex-row lg:items-center lg:justify-between lg:gap-10 pt-28 pb-16 px-6 md:px-16 lg:px-24 z-10">
        
        {/* Computador: la doctora es la protagonista del hero, a plena calidad y con más luz */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden hidden lg:flex justify-end">
          <div className="relative flex items-end justify-center lg:absolute lg:inset-y-0 lg:left-[35%] 2xl:left-[28%] lg:right-[26%]">
            {/* Halo cálido y suave detrás del marco */}
            <div className="absolute inset-x-[4%] bottom-0 top-[6%] bg-[radial-gradient(ellipse_at_50%_35%,rgba(232,200,120,0.16),transparent_68%)] blur-2xl"></div>
            {/* Marco en arco con contorno dorado */}
            <div className="relative h-[90%] max-w-full aspect-[4/5] overflow-hidden rounded-t-[999px] border-x border-t border-brand-gold/65 bg-black shadow-[0_0_46px_rgba(201,169,97,0.20)]">
              <img
                src={drClaudiaImg}
                alt="Dra. Claudia Mabel Tapias, odontóloga de BioDent"
                className="h-full w-full object-cover object-top brightness-[1.08] contrast-[1.05] saturate-[0.9]"
              />
            </div>
          </div>
        </div>

        {/* Cabecera compacta (solo celular): logo y nombre, y justo debajo los videos */}
        <div className="relative z-10 order-first -mt-2 mb-4 flex w-full items-center justify-center gap-3 self-center lg:hidden">
          <img
            src={biodentLogoImg}
            alt="BioDent"
            className="h-12 w-12 shrink-0 rounded-full border border-brand-gold/40 bg-black/60 object-contain p-0.5"
          />
          <div className="text-left leading-tight">
            <span className="font-heading block text-sm font-bold uppercase tracking-[0.25em] text-brand-white">BioDent Bello</span>
            <span className="font-script block text-xl text-brand-gold">Dra. Claudia Mabel Tapias</span>
          </div>
        </div>

        <div className="max-w-2xl text-left flex flex-col items-start relative z-10">
          
          {/* Logo with circular border - responsive scaling */}
          <div className="relative mb-6 select-none hidden lg:block">
            <img 
              src={biodentLogoImg} 
              alt="BioDent Logo Oficial" 
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-brand-gold/40 shadow-2xl p-1 bg-black/60 object-contain" 
            />
          </div>

          {/* Doctor Signature */}
          <span className="font-script hidden lg:block text-3xl md:text-4xl 2xl:text-5xl text-brand-gold tracking-wider mb-1 select-none">
            Dra. Claudia Mabel Tapias
          </span>
          
          {/* Tagline */}
          <h1 className="font-heading text-3xl md:text-5xl lg:text-5xl 2xl:text-6xl font-bold tracking-wider text-brand-white uppercase leading-tight mb-6">
            <span className="block font-heading text-xs tracking-[0.3em] font-medium text-brand-secondary uppercase mb-4">— BioDent Bello —</span>
            Tu sonrisa,<br />
            <span className="text-brand-gold">nuestra especialidad</span>
          </h1>

          {/* Description banner (Heart icon) */}
          <div className="bg-brand-bg/90 backdrop-blur-sm border border-brand-gold/15 rounded-2xl p-4 mb-8 flex items-center gap-4 text-left shadow-lg max-w-lg">
            <div className="w-10 h-10 rounded-full border border-brand-gold/30 flex items-center justify-center text-brand-gold shrink-0 bg-black/30">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <p className="font-sans text-xs md:text-sm text-brand-white font-light leading-relaxed">
              Prótesis, diseño de sonrisa y rehabilitación oral para devolverte <span className="text-brand-gold font-semibold">función, estética y confianza</span>.
            </p>
          </div>

          {/* CTA Buttons: WhatsApp, Instagram & Facebook links */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-stretch sm:items-center w-full">
            {/* WhatsApp Button */}
            <a 
              href={getWhatsAppLink(mensajeWeb("quiero agendar una valoración sin costo."))}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[46px] items-center justify-center gap-2.5 bg-brand-gold text-[#0A0A0A] px-6 py-3 rounded-full font-heading text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:bg-brand-glow hover:shadow-[0_0_20px_rgba(232,200,120,0.4)] group"
            >
              <svg className="w-4 h-4 fill-current transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.62.962 3.21 1.493 4.904 1.496 5.434.004 9.859-4.417 9.862-9.857.002-2.636-1.023-5.11-2.884-6.974C16.672 1.955 14.195.932 11.56.932c-5.443 0-9.87 4.42-9.873 9.861-.001 1.776.479 3.51 1.39 5.048l-.946 3.453 3.536-.93c1.558.847 3.11 1.29 4.39 1.29zM16.59 13.9c-.277-.14-1.643-.812-1.896-.905-.254-.094-.44-.14-.623.14-.184.278-.712.905-.873 1.09-.16.185-.32.207-.597.068-.277-.14-1.17-.43-2.228-1.374-.823-.734-1.38-1.64-1.54-1.92-.162-.276-.017-.426.12-.564.125-.124.277-.323.416-.484.14-.16.184-.277.277-.463.093-.185.047-.348-.024-.486-.07-.14-.622-1.5-.853-2.053-.225-.54-.452-.467-.622-.476-.16-.008-.344-.01-.528-.01-.184 0-.485.07-.738.348-.254.278-.97.948-.97 2.31 0 1.36.99 2.68 1.127 2.866.138.186 1.948 2.973 4.72 4.17 1.102.47 1.96.75 2.628.963.69.22 1.32.19 1.81.114.55-.085 1.643-.67 1.874-1.32.23-.65.23-1.205.162-1.32-.068-.113-.253-.185-.53-.325z" />
              </svg>
              Agenda tu valoración sin costo
            </a>

            {/* Instagram Button */}
            <a 
              href="https://www.instagram.com/biodent_parquedebello/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[46px] items-center justify-center gap-2.5 bg-black/60 border border-brand-gold/40 text-brand-white px-5 py-3 rounded-full font-heading text-xs font-semibold uppercase tracking-wider hover:border-brand-gold hover:text-brand-gold transition-all duration-300 group"
            >
              <svg className="w-4 h-4 fill-current text-[#C9A961] transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
              Instagram de la Clínica
            </a>

            {/* Facebook Button */}
            <a 
              href="https://www.facebook.com/people/Dra-Claudia-Mabel-Tapias/61587872871889/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[46px] items-center justify-center gap-2.5 bg-black/60 border border-brand-gold/40 text-brand-white px-5 py-3 rounded-full font-heading text-xs font-semibold uppercase tracking-wider hover:border-brand-gold hover:text-brand-gold transition-all duration-300 group"
            >
              <svg className="w-4 h-4 fill-current text-[#C9A961] transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook de la Clínica
            </a>

            {/* Cómo llegar: baja al apartado con el video */}
            <a
              href="#como-llegar"
              className="flex min-h-[46px] items-center justify-center gap-2.5 bg-black/60 border border-brand-gold/40 text-brand-white px-5 py-3 rounded-full font-heading text-xs font-semibold uppercase tracking-wider hover:border-brand-gold hover:text-brand-gold transition-all duration-300 group"
            >
              <Icono d={RUTA_UBICACION} className="w-4 h-4 shrink-0 text-[#C9A961] transition-transform group-hover:scale-110" />
              Cómo llegar
            </a>
          </div>

        </div>
        {/* Celular: la doctora, a plena luz y debajo de los videos */}
        <figure className="relative z-10 order-[-9998] mb-8 w-full max-w-[300px] self-center lg:hidden">
          <div className="overflow-hidden rounded-t-[999px] rounded-b-3xl border border-brand-gold/65 bg-black shadow-[0_0_40px_rgba(201,169,97,0.18)]">
            <img
              src={drClaudiaImg}
              alt="Dra. Claudia Mabel Tapias, odontóloga de BioDent"
              className="aspect-[4/5] w-full object-cover object-top brightness-[1.06] contrast-[1.04] saturate-[0.9]"
            />
          </div>
          <figcaption className="mt-3 text-center">
            <span className="block font-script text-3xl text-brand-gold">Dra. Claudia Mabel Tapias</span>
            <span className="block font-heading text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-secondary">Odontóloga · 25 años de trayectoria</span>
          </figcaption>
        </figure>

        {/* Videos reales de la clínica: escenario tipo reel en el hero */}
        <div className="relative z-10 order-first mb-8 self-center w-full max-w-[300px] lg:order-none lg:mb-0 lg:mt-0 lg:max-w-none lg:shrink-0 lg:w-[min(360px,calc((100vh_-_290px)*0.5625))] xl:w-[min(400px,calc((100vh_-_290px)*0.5625))]">
          <HeroReels videos={VIDEOS_CASOS} ctaHref={(v) => getWhatsAppLink(mensajeWeb(`vi el video "${v.titulo}: ${v.detalle}" y quiero agendar una valoración sin costo.`))} />
        </div>
      </section>

      <ComoLlegar />

      {/* Por qué BioDent: solo hechos que la clínica ya publica */}
      <section aria-label="Lo que encuentras en BioDent" className="relative z-10 mx-auto max-w-6xl px-5 pb-4 sm:px-8 md:px-12">
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {[
            ['M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', 'Valoración', 'sin costo'],
            ['M12 4c2.5 0 4 1.5 4 4s-.5 4-1 6.5S14 20 12 20s-3-3.5-3-5.5.5-4-1-6.5 1.5-4 4-4z', 'Prótesis', 'a tu medida'],
            ['M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', 'Resultados', 'naturales'],
            [RUTA_UBICACION, 'Junto al Éxito', 'Parque de Bello'],
          ].map(([d, a, b]) => (
            <li key={a} className="flex flex-col items-center rounded-2xl border border-brand-gold/20 bg-[#0F0E0B] px-3 py-5 text-center">
              <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-brand-gold/40 bg-black/40 text-brand-gold"><Icono d={d} className="h-6 w-6" /></span>
              <span className="font-heading text-xs font-bold uppercase tracking-wider text-brand-white">{a}</span>
              <span className="font-heading text-[11px] uppercase tracking-wider text-brand-gold">{b}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Tratamientos */}
      <section id="servicios" className="relative z-10 mx-auto max-w-6xl px-5 py-16 sm:px-8 md:px-12 md:py-24">
        <div className="mb-12 text-center md:mb-16">
          <span className="mb-3 block font-heading text-xs font-bold uppercase tracking-[0.25em] text-brand-gold">Nuestros tratamientos</span>
          <h2 className="font-heading text-3xl font-bold uppercase tracking-wider text-brand-white md:text-5xl">Especialistas en prótesis</h2>
          <div className="mx-auto mt-5 h-px w-20 bg-brand-gold"></div>
        </div>

        <div className="space-y-6 md:space-y-8">
          {PROTESIS.map((p, i) => (
            <React.Fragment key={p.nombre}>
            <article className="grid grid-cols-1 overflow-hidden rounded-3xl border border-brand-gold/25 bg-[#0F0E0B] lg:grid-cols-2">
              <div className={`relative aspect-[16/10] lg:aspect-auto lg:min-h-[360px] ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                <img src={p.img} alt={p.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              </div>
              <div className="flex flex-col p-6 sm:p-8 lg:p-10">
                <span className="mb-2 block font-heading text-[11px] font-bold uppercase tracking-[0.2em] text-brand-gold">{p.etiqueta}</span>
                <h3 className="mb-3 font-heading text-2xl font-bold uppercase tracking-wide text-brand-white md:text-3xl">{p.nombre}</h3>
                <p className="mb-5 font-sans text-sm font-light leading-relaxed text-brand-secondary md:text-base">{p.texto}</p>
                <ul className="mb-6 space-y-2.5">
                  {p.puntos.map((t) => (
                    <li key={t} className="flex items-center gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-gold/15 text-brand-gold"><Icono d="M5 13l4 4L19 7" className="h-3.5 w-3.5" /></span>
                      <span className="font-sans text-sm font-medium text-brand-white">{t}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={getWhatsAppLink(mensajeWeb(`quiero agendar una valoración sin costo para una ${p.nombre}.`))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${BTN_ORO} mt-auto w-full sm:w-auto sm:self-start`}
                >
                  Quiero mi valoración sin costo
                </a>
              </div>
            </article>
            {TIRAS_PROTESIS[p.nombre] && <TiraVideos {...TIRAS_PROTESIS[p.nombre]} videos={galeriaDe(TIRAS_PROTESIS[p.nombre].grupo)} />}
            </React.Fragment>
          ))}
        </div>

        {/* Más tratamientos */}
        <div className="mt-16 md:mt-20">
          <div className="mb-8 text-center">
            <span className="mb-2 block font-heading text-xs font-bold uppercase tracking-[0.25em] text-brand-gold">Y también</span>
            <h3 className="font-heading text-2xl font-bold uppercase tracking-wider text-brand-white md:text-3xl">Más tratamientos</h3>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3">
            {SERVICIOS_EXTRA.map((s) => (
              <article key={s.nombre} className="flex flex-col gap-3 rounded-2xl border border-brand-gold/25 bg-[#0F0E0B] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-gold/30 bg-black/30 text-brand-gold">
                    <Icono d={s.icono} className="h-4 w-4" />
                  </div>
                  <h4 className="font-heading text-sm font-bold uppercase leading-tight tracking-wider text-brand-white">{s.nombre}</h4>
                </div>
                <p className="flex-1 font-sans text-sm font-light leading-relaxed text-brand-secondary">{s.texto}</p>
                <a
                  href={getWhatsAppLink(mensajeWeb(`quiero agendar una valoración sin costo para ${s.mensaje}.`))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${BTN_ORO} w-full`}
                >
                  Quiero mi valoración sin costo
                </a>
              </article>
            ))}
          </div>
        </div>
        <TiraVideos titulo="Diseño de sonrisa en resina" subtitulo="Casos reales de diseño de sonrisa. Desliza y toca para ver." videos={galeriaDe('diseno')} />
        <TiraVideos titulo="Aclaramiento dental" subtitulo="Sesiones y cuidados del aclaramiento en la clínica." videos={galeriaDe('aclaramiento')} />
        <TiraVideos titulo="Microdiseño" subtitulo="Detalles de microdiseño hechos en la clínica." videos={galeriaDe('microdiseno')} />
      </section>

      {/* La doctora */}
      <section id="doctora" className="relative z-10 mx-auto max-w-6xl px-5 py-16 sm:px-8 md:px-12 md:py-24">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="flex justify-center lg:col-span-5">
            <div className="relative max-w-xs rounded-2xl border border-brand-gold/25 p-2 shadow-2xl sm:max-w-sm">
              <img src={drClaudiaImg} alt="Dra. Claudia Mabel Tapias, odontóloga de BioDent" loading="lazy" className="w-full rounded-xl object-cover" />
            </div>
          </div>
          <div className="lg:col-span-7">
            <span className="mb-3 block font-heading text-xs font-bold uppercase tracking-[0.25em] text-brand-gold">Tu odontóloga</span>
            <h2 className="mb-2 font-heading text-3xl font-bold uppercase tracking-wider text-brand-white md:text-5xl">Dra. Claudia Mabel Tapias</h2>
            <span className="mb-5 block font-serif-italic text-lg text-brand-gold md:text-xl">Prótesis y rehabilitación oral en Bello</span>
            <div className="mb-6 h-px w-20 bg-brand-gold"></div>
            <div className="space-y-4 font-sans text-sm font-light leading-relaxed text-brand-secondary md:text-base">
              <p>La Dra. Claudia Mabel Tapias, con 25 años de trayectoria profesional, atiende BioDent, su consultorio junto al Parque de Bello. Allí trabaja prótesis flexibles, totales y Acker, diseño de sonrisa en resina, limpieza y aclaramiento dental y rehabilitación oral.</p>
              <p>Busca que el resultado se vea natural y se integre con tu rostro. Cada caso se revisa en persona en la valoración, que es sin costo.</p>
            </div>
            <ul className="mt-6 flex flex-wrap gap-2">
              {['25 años de trayectoria profesional', 'Valoración sin costo', 'Lunes a sábado', 'Junto al Éxito del Parque de Bello'].map((t) => (
                <li key={t} className="rounded-full border border-brand-gold/30 bg-black/30 px-4 py-2 font-heading text-[11px] font-semibold uppercase tracking-wider text-brand-white">{t}</li>
              ))}
            </ul>
            <a
              href={getWhatsAppLink(mensajeWeb('quiero agendar una valoración sin costo con la Dra. Claudia.'))}
              target="_blank"
              rel="noopener noreferrer"
              className={`${BTN_ORO} mt-7 w-full sm:w-auto`}
            >
              Agendar con la Dra. Claudia
            </a>
          </div>
        </div>
      </section>

      {/* Casos reales: carátulas de los videos de la clínica */}
      <section id="casos" className="relative z-10 mx-auto max-w-6xl px-5 py-16 sm:px-8 md:px-12 md:py-24">
        <div className="mb-10 text-center md:mb-14">
          <span className="mb-3 block font-heading text-xs font-bold uppercase tracking-[0.25em] text-brand-gold">Casos reales</span>
          <h2 className="font-heading text-3xl font-bold uppercase tracking-wider text-brand-white md:text-5xl">Mira los resultados</h2>
          <p className="mx-auto mt-4 max-w-xl font-sans text-sm font-light leading-relaxed text-brand-secondary md:text-base">Videos de trabajos hechos en la clínica. Toca para verlos.</p>
          <div className="mx-auto mt-5 h-px w-20 bg-brand-gold"></div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:gap-5 md:grid-cols-5">
          {CASOS_DESTACADOS.map((v) => (
            <VideoTarjeta key={v.id} {...v} />
          ))}
          {galeriaDe('casos').map((v) => (
            <VideoTarjeta key={v.id} {...v} />
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-xl text-center font-sans text-sm font-light text-brand-secondary">
          El primero es el testimonio de una paciente. Cada caso es distinto: la Dra. Claudia revisa el tuyo en la valoración sin costo.
        </p>
        <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <a href="https://www.facebook.com/people/Dra-Claudia-Mabel-Tapias/61587872871889/?sk=reels_tab" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-brand-gold/50 px-6 py-2.5 font-heading text-xs font-bold uppercase tracking-wider text-brand-gold transition-colors hover:bg-brand-gold/10">Ver más videos en Facebook</a>
          <a href="https://www.instagram.com/biodent_parquedebello/" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-brand-gold/50 px-6 py-2.5 font-heading text-xs font-bold uppercase tracking-wider text-brand-gold transition-colors hover:bg-brand-gold/10">Ver más en Instagram</a>
        </div>      </section>

      {/* Appointment and Location Section */}
      <section id="contacto" className="relative z-10 mx-auto max-w-5xl px-5 py-16 sm:px-8 md:px-12 md:py-24">
        <div className="bg-[#0A0A0A] border border-brand-gold/25 rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2 shadow-2xl">
          
          {/* Info Side */}
          <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-between gap-8">
            <div>
              <span className="font-heading text-xs font-bold tracking-[0.25em] text-brand-gold uppercase block mb-3">
                Contacto Directo
              </span>
              <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-wider text-brand-white uppercase mb-4">
                ¿Listo para tu valoración?
              </h2>
              <p className="font-sans text-sm text-brand-secondary leading-relaxed font-light mb-8">
                Escríbenos y cuéntanos tu caso. Te ayudamos a agendar tu valoración sin costo con la Dra. Claudia.
              </p>

              <div className="space-y-5">
                {/* Address */}
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <span className="font-heading text-[10px] font-bold tracking-wider text-brand-white uppercase block">Ubicación</span>
                    <p className="font-sans text-sm text-[#B9B3A5] font-light">
                      Calle 50 #48-34, segundo piso, junto al Éxito del Parque de Bello, Antioquia
                    </p>
                    <a href="#como-llegar" className="mt-1 inline-flex min-h-[44px] items-center font-sans text-xs font-semibold text-brand-gold underline underline-offset-4 hover:text-brand-white transition-colors">Ver cómo llegar en video</a>
                  </div>
                </div>

                {/* Schedule */}
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <span className="font-heading text-[10px] font-bold tracking-wider text-brand-white uppercase block">Horario de atención</span>
                    <p className="font-sans text-sm text-[#B9B3A5] font-light">
                      Lunes a viernes de 9:00 a. m. a 6:00 p. m.<br />Sábados de 9:00 a. m. a 1:00 p. m.
                    </p>
                  </div>
                </div>

                {/* WhatsApp numbers */}
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <span className="font-heading text-[10px] font-bold tracking-wider text-brand-white uppercase block">Líneas de atención</span>
                    <p className="font-sans text-sm text-[#B9B3A5] font-light">
                      WhatsApp de la clínica: <a href={waLink(mensajeWeb("quiero agendar una valoración sin costo."))} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center text-brand-gold hover:text-brand-white transition-colors font-semibold">+57 314 809 1585</a><br />
                      Otras líneas: <a href="https://wa.me/573114345328" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center text-brand-gold hover:text-brand-white transition-colors">+57 311 434 5328</a> y <a href="https://wa.me/573145304329" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center text-brand-gold hover:text-brand-white transition-colors">+57 314 530 4329</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Call-to-action */}
            <a 
              href={waLink(mensajeWeb("quiero agendar una valoración sin costo."))}
              target="_blank"
              rel="noopener noreferrer"
              className="shimmer-btn relative overflow-hidden w-full min-h-[48px] flex items-center justify-center text-center bg-brand-gold text-[#0A0A0A] py-3.5 rounded-full font-heading text-xs font-bold uppercase tracking-widest hover:bg-brand-glow hover:shadow-[0_0_15px_rgba(232,200,120,0.3)] transition-all mt-4"
            >
              Escríbenos por WhatsApp
            </a>
          </div>

          {/* Map / Cover image Side */}
          <div className="relative min-h-[300px]">
            <img 
              src={dentalOfficeImg} 
              alt="Consultorio de BioDent" 
              className="w-full h-full object-cover" 
            />
            {/* Dark wood overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/90 via-transparent to-transparent md:from-[#0A0A0A]/95"></div>
            
            {/* Overlay brand watermark */}
            <div className="absolute bottom-6 right-6 z-20 flex flex-col items-end text-right text-brand-white/80">
              <span className="font-heading text-xs font-bold tracking-widest uppercase">BioDent Clinic</span>
              <span className="font-sans text-[10px] font-light">Bello, Antioquia</span>
            </div>
          </div>

        </div>
      </section>

      {/* Odontología en Bello: texto y enlaces rastreables a cada tratamiento */}
      <section id="odontologia-en-bello" aria-labelledby="titulo-odontologia-bello" className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 py-14 border-t border-brand-gold/10">
        <h2 id="titulo-odontologia-bello" className="font-heading text-xl md:text-2xl font-bold tracking-wider text-brand-white uppercase mb-3">
          Odontología en Bello, Antioquia
        </h2>
        <p className="font-sans text-sm text-brand-secondary font-light leading-relaxed max-w-3xl mb-6">
          BioDent es el consultorio odontológico de la Dra. Claudia Mabel Tapias en Bello, Antioquia, junto al Éxito del Parque de Bello. Si buscas un dentista en Bello para prótesis dentales, diseño de sonrisa, limpieza y aclaramiento dental o rehabilitación oral, aquí te atendemos con una valoración sin costo.
        </p>
        <nav aria-label="Tratamientos odontológicos en Bello">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 font-sans text-sm">
            {[
              ['/dentista-en-bello/', 'Dentista en Bello'],
              ['/protesis-dentales-bello/', 'Prótesis dentales en Bello'],
              ['/protesis-flexible-bello/', 'Prótesis flexible'],
              ['/protesis-total-dentadura-bello/', 'Prótesis total (dentadura)'],
              ['/protesis-acker-bello/', 'Prótesis Acker'],
              ['/diseno-de-sonrisa-bello/', 'Diseño de sonrisa en resina'],
              ['/limpieza-y-blanqueamiento-dental-bello/', 'Limpieza y aclaramiento dental'],
              ['/rehabilitacion-oral-bello/', 'Rehabilitación oral'],
            ].map(([href, texto]) => (
              <li key={href}>
                <a href={href} className="text-brand-gold hover:text-brand-white transition-colors">{texto}</a>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      {/* Footer */}
      <footer className="relative py-10 px-6 md:px-12 z-10 border-t border-brand-gold/10 bg-[#070707] text-center">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <img src={biodentLogoImg} alt="BioDent Logo" className="w-6 h-6 rounded-full border border-brand-gold/30 object-contain" />
            <span className="font-heading font-bold text-brand-white text-xs tracking-[0.2em]">BIODENT</span>
          </div>
          <p className="font-sans text-[11px] text-brand-secondary font-light">
            &copy; 2026 BioDent. Todos los derechos reservados.
          </p>
          <div className="flex gap-4 text-[11px] font-heading font-semibold uppercase tracking-wider text-brand-secondary">
            <a href="#inicio" className="hover:text-brand-gold transition-colors">Volver arriba</a>
          </div>
        </div>
      </footer>

      {/* RECREATED CHATBOT WIDGET FROM SCRATCH */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
        
        {/* Chat Window Modal */}
        {isChatOpen && (
          <div className="w-[calc(100vw-2rem)] sm:w-[370px] h-[490px] max-h-[78vh] bg-[#121214] border border-[#C9A961]/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-3 relative z-50 animate-fade-in">
            
            {/* Header Bar */}
            <div className="bg-[#1C1C20] border-b border-[#C9A961]/25 px-4 py-3 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2.5">
                <img src={biodentLogoImg} alt="BioDent" className="w-7 h-7 rounded-full border border-brand-gold/40 object-contain" />
                <div>
                  <h4 className="font-heading text-xs font-bold text-white tracking-widest uppercase">BioDent Asistente</h4>
                  <span className="text-[10px] text-emerald-400 tracking-wider uppercase font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    En línea
                  </span>
                </div>
              </div>

              {/* Action Buttons: History, Clear, Close */}
              <div className="flex items-center gap-1 text-[#8A8577]">
                
                {/* History Drawer Toggle Button */}
                <button
                  type="button"
                  onClick={() => setShowHistoryModal(!showHistoryModal)}
                  className={`flex h-11 w-10 items-center justify-center rounded-lg transition-colors hover:text-white ${showHistoryModal ? 'bg-[#C9A961]/20 text-[#C9A961]' : ''}`}
                  title="Ver historial" aria-label="Ver historial"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6a7 7 0 1 1 7 7 6.97 6.97 0 0 1-5-2.14l-1.42 1.42A8.95 8.95 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
                  </svg>
                </button>

                {/* Clear Chat Button */}
                <button 
                  type="button"
                  onClick={clearChatHistory}
                  className="flex h-11 w-10 items-center justify-center rounded-lg transition-colors hover:text-red-400"
                  title="Borrar conversación" aria-label="Borrar conversación"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                  </svg>
                </button>

                {/* Close Button */}
                <button 
                  type="button"
                  onClick={() => { setIsChatOpen(false); setShowHistoryModal(false); }}
                  className="flex h-11 w-10 items-center justify-center text-2xl transition-colors hover:text-white leading-none"
                  aria-label="Cerrar ventana de chat"
                >
                  &times;
                </button>
              </div>
            </div>

            {/* History Panel Overlay */}
            {showHistoryModal ? (
              <div className="flex-grow p-4 bg-[#18181C] text-white flex flex-col justify-between overflow-y-auto">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-[#C9A961]/20 mb-3">
                    <h5 className="text-xs font-bold text-brand-gold uppercase tracking-wider flex items-center gap-1.5">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M13 3a9 9 0 0 0-9 9H1l3.89 3.89.07.14L9 12H6a7 7 0 1 1 7 7 6.97 6.97 0 0 1-5-2.14l-1.42 1.42A8.95 8.95 0 0 0 13 21a9 9 0 0 0 0-18zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
                      </svg>
                      Historial
                    </h5>
                    <span className="text-[10px] text-gray-400 font-mono">{chatMessages.length} mensajes</span>
                  </div>

                  <p className="text-[11px] text-gray-300 leading-relaxed mb-4">
                    Tu historial de conversación se guarda en la memoria de tu navegador .
                  </p>

                  <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                    {chatMessages.map((m, i) => (
                      <div key={i} className="text-[11px] p-2.5 rounded-lg bg-[#222228] border border-white/5">
                        <span className={`font-bold ${m.role === 'user' ? 'text-brand-gold' : 'text-emerald-400'}`}>
                          {m.role === 'user' ? 'Tú: ' : 'BioDent: '}
                        </span>
                        <span className="text-gray-200">
                          {m.content?.slice(0, 75)}{m.content?.length > 75 ? '...' : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#C9A961]/20 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowHistoryModal(false)}
                    className="flex-1 py-2 px-3 bg-[#2A2A32] text-white rounded-xl text-xs font-semibold hover:bg-[#33333E] transition-colors"
                  >
                    Volver al chat
                  </button>
                  <button
                    type="button"
                    onClick={clearChatHistory}
                    className="py-2 px-3 bg-red-600/80 text-white rounded-xl text-xs font-semibold hover:bg-red-600 transition-colors flex items-center gap-1"
                  >
                    Borrar
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Chat Messages Container */}
                <div 
                  ref={messagesContainerRef}
                  className="flex-grow p-3.5 overflow-y-auto space-y-3.5 bg-[#0A0A0C] overscroll-contain"
                >
                  {chatMessages.map((m, idx) => (
                    <div 
                      key={idx} 
                      className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                          m.role === 'user' 
                            ? 'bg-gradient-to-r from-[#C9A961] to-[#E8C878] text-[#121214] font-semibold rounded-tr-none shadow-md' 
                            : 'bg-[#1C1C22] text-[#F5F0E8] rounded-tl-none border border-[#C9A961]/25 shadow-sm'
                        }`}
                      >
                        {m.image && (
                          <img 
                            src={m.image} 
                            alt="Foto adjunta" 
                            className="w-44 h-auto max-h-44 object-cover rounded-xl mb-2 border border-brand-gold/40 shadow-md" 
                          />
                        )}
                        {m.content ? (
                          renderMessageContent(m.content, m.role, idx === chatMessages.length - 1 && !isChatLoading)
                        ) : (m.role === 'assistant' && isChatLoading && idx === chatMessages.length - 1 ? (
                          <span className="inline-flex items-center gap-1 py-0.5" role="status" aria-label="Escribiendo"><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-gold [animation-delay:-0.3s]"></span><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-gold [animation-delay:-0.15s]"></span><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-gold"></span></span>
                        ) : '')}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Input Area */}
                <form onSubmit={handleSendMessage} className="p-3 border-t border-[#C9A961]/25 bg-[#17171C] flex flex-col gap-2 shrink-0">
                  
                  {/* Selected Image Thumbnail Preview */}
                  {selectedImage && (
                    <div className="relative inline-block self-start">
                      <img src={selectedImage} alt="Foto seleccionada" className="w-12 h-12 object-cover rounded-lg border border-brand-gold/60" />
                      <button
                        type="button"
                        onClick={removeSelectedImage}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-[10px] font-bold shadow-md hover:bg-red-700"
                        title="Eliminar foto" aria-label="Eliminar foto"
                      >
                        &times;
                      </button>
                    </div>
                  )}

                  {!isChatLoading && !selectedImage && (
                    <div className="scroll-limpio -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-0.5" role="group" aria-label="Preguntas rápidas">
                      {SUGERENCIAS_CHAT.map((q) => (
                        <button
                          key={q.etiqueta}
                          type="button"
                          onClick={() => processChatMessage(q.texto)}
                          className="shrink-0 rounded-full border border-brand-gold/40 bg-[#22222A] px-3 py-1.5 text-[11px] font-semibold text-brand-gold transition-colors hover:bg-brand-gold hover:text-[#121214]"
                        >
                          {q.etiqueta}
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 items-center">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      accept="image/*" 
                      onChange={handleImageSelect} 
                      className="hidden" 
                    />
                    
                    {/* Attach Image Clip Button */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isChatLoading}
                      className={`w-9 h-9 rounded-xl bg-[#22222A] border ${selectedImage ? 'border-brand-gold text-brand-gold' : 'border-[#C9A961]/30 text-gray-400'} flex items-center justify-center shrink-0 hover:text-brand-gold hover:border-brand-gold disabled:opacity-50 transition-colors`}
                      title="Adjuntar foto de mis dientes" aria-label="Adjuntar foto de mis dientes"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z" />
                      </svg>
                    </button>

                    {/* Text Input */}
                    <input 
                      type="text" 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder={selectedImage ? "Describe la foto o pregunta..." : "Pregunta sobre tus dientes..."}
                      disabled={isChatLoading}
                      className="flex-grow bg-[#22222A] border border-[#C9A961]/30 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-brand-gold disabled:opacity-50 transition-colors"
                    />

                    {/* Submit Button */}
                    <button 
                      type="submit"
                      disabled={isChatLoading || (!chatInput.trim() && !selectedImage)}
                      className="w-9 h-9 rounded-xl bg-brand-gold text-[#121214] flex items-center justify-center shrink-0 hover:bg-brand-glow disabled:opacity-40 transition-colors font-bold shadow-md"
                      aria-label="Enviar mensaje"
                    >
                      <svg className="w-4 h-4 fill-current transform rotate-45" viewBox="0 0 24 24">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                      </svg>
                    </button>
                  </div>
                </form>
              </>
            )}

          </div>
        )}

        {/* Floating Tooth Button Trigger */}
        <div className="relative flex items-center gap-2.5">
          
          {/* Label Pill when chat is closed */}
          {!isChatOpen && (
            <button
              onClick={() => setIsChatOpen(true)}
              className="bg-[#16140F] border border-[#C9A961] text-brand-gold px-4 min-h-[44px] rounded-full text-xs font-bold tracking-wide shadow-lg hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer animate-fade-in"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>¿Dudas con tus dientes?</span>
            </button>
          )}

          {/* Golden Tooth Circular Button */}
          <div className="relative">
            {!isChatOpen && (
              <div className="absolute inset-0 rounded-full border-2 border-brand-gold opacity-70 animate-radar-ripple pointer-events-none"></div>
            )}
            <button 
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="w-14 h-14 rounded-full bg-[#121214] border-2 border-[#C9A961] flex items-center justify-center shadow-[0_0_20px_rgba(201,169,97,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 group shrink-0 relative z-10 cursor-pointer"
              aria-label="Abrir asistente de chat"
            >
              <svg className="w-8 h-8 text-[#C9A961] transition-transform group-hover:rotate-12" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 4.5C11.5 4.5 8 7 8 11.5C8 15.5 9.5 19.5 11.5 24.5C12.3 26.5 13.5 28 14.5 28C15.3 28 15.6 26.5 16 25C16.4 26.5 16.7 28 17.5 28C18.5 28 19.7 26.5 20.5 24.5C22.5 19.5 24 15.5 24 11.5C24 7 20.5 4.5 16 4.5Z" 
                      stroke="#C9A961" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <line x1="16" y1="7" x2="16" y2="9.5" stroke="#C9A961" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="16" cy="6.2" r="1.1" fill="#C9A961" />
                <rect x="11.5" y="9.5" width="9" height="7" rx="1.5" stroke="#C9A961" strokeWidth="1.5" fill="#121214" />
                <rect x="13.2" y="11.8" width="1.8" height="1.8" fill="#C9A961" rx="0.3" />
                <rect x="17" y="11.8" width="1.8" height="1.8" fill="#C9A961" rx="0.3" />
                <path d="M14 15H18" stroke="#C9A961" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

        </div>
      </div>

    </div>
  )
}

export default App
