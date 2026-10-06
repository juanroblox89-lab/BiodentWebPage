import os

os.chdir(r'C:\Users\USUARIO\Desktop\jestalvz\proyectos\biodent')


def rw(p, subs):
    s = open(p, encoding='utf-8', newline='').read()
    crlf = '\r\n' in s
    s = s.replace('\r\n', '\n')
    for a, b in subs:
        assert a in s, (p, a[:70])
        s = s.replace(a, b, 1)
    if crlf:
        s = s.replace('\n', '\r\n')
    open(p, 'w', encoding='utf-8', newline='').write(s)


CONSTANTES = '''
// Videos reales de la clínica (public/videos). Se cargan solo cuando alguien toca el play.
const VIDEOS_CASOS = [
  { id: 'testimonio', titulo: 'Testimonio real', detalle: 'Una paciente cuenta su experiencia' },
  { id: 'antes-despues-carillas', titulo: 'Antes y después', detalle: 'Prótesis flexible superior y carillas en resina' },
  { id: 'parcial-flexible', titulo: 'Prótesis parcial flexible', detalle: 'Superior e inferior' },
  { id: 'diseno-resina', titulo: 'Diseño de sonrisa', detalle: 'En resina de alta estética' },
  { id: 'diseno-sonrisa', titulo: 'Diseño de sonrisa', detalle: 'Un cambio total' },
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
    icono: 'M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm5 7h8M12 8v8',
  },
];

// Carrusel de videos verticales: deslizable en el celular, un solo video suena a la vez.
function CasosVideos() {
  const [activo, setActivo] = useState(null);
  return (
    <div className="mt-14">
      <span className="font-heading text-[10px] font-bold tracking-[0.25em] text-brand-gold uppercase block mb-1">
        Casos reales
      </span>
      <h3 className="font-heading text-xl md:text-2xl font-bold tracking-wider text-brand-white uppercase mb-5">
        En video
      </h3>
      <div className="scroll-limpio flex gap-3 overflow-x-auto snap-x snap-mandatory pb-3 -mx-6 px-6 md:mx-0 md:px-0" aria-label="Videos de casos reales">
        {VIDEOS_CASOS.map((v) => (
          <figure key={v.id} className="snap-center shrink-0 w-[58vw] max-w-[250px] text-left">
            <div className="relative aspect-[9/16] rounded-2xl overflow-hidden border border-brand-gold/20 bg-black">
              {activo === v.id ? (
                <video
                  src={`/videos/${v.id}.mp4`}
                  poster={`/videos/posters/${v.id}.jpg`}
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  playsInline
                  preload="auto"
                  onEnded={() => setActivo(null)}
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setActivo(v.id)}
                  className="group absolute inset-0 w-full h-full"
                  aria-label={`Reproducir video: ${v.titulo}. ${v.detalle}`}
                >
                  <img
                    src={`/videos/posters/${v.id}.jpg`}
                    alt=""
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></span>
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black/55 border border-brand-gold/60 flex items-center justify-center text-brand-gold group-hover:bg-brand-gold group-hover:text-black transition-colors">
                    <svg className="w-6 h-6 ml-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
                  </span>
                </button>
              )}
            </div>
            <figcaption className="mt-2">
              <span className="font-heading text-[11px] font-bold tracking-wider text-brand-white uppercase block">{v.titulo}</span>
              <span className="font-sans text-[11px] text-brand-secondary font-light block leading-snug">{v.detalle}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

function App() {'''

GRID = '''        {/* Más tratamientos: tarjetas compactas con WhatsApp */}
        <div className="mt-24">
          <div className="mb-8 text-center">
            <span className="font-heading text-xs font-bold tracking-[0.25em] text-brand-gold uppercase block mb-2">
              Y también
            </span>
            <h3 className="font-heading text-2xl md:text-3xl font-bold tracking-wider text-brand-white uppercase">
              Más tratamientos
            </h3>
            <p className="font-sans text-xs text-brand-secondary font-light mt-3">Agenda tu valoración sin costo</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {SERVICIOS_EXTRA.map((s) => (
              <article key={s.nombre} className="flex flex-col gap-3 p-4 rounded-2xl border border-brand-gold/20 bg-black/40">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full border border-brand-gold/30 flex items-center justify-center text-brand-gold shrink-0 bg-black/30">
                    <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d={s.icono} />
                    </svg>
                  </div>
                  <h4 className="font-heading text-sm font-bold tracking-wider text-brand-white uppercase leading-tight">{s.nombre}</h4>
                </div>
                <p className="font-sans text-xs text-brand-secondary font-light leading-relaxed flex-1">{s.texto}</p>
                <a
                  href={getWhatsAppLink(`Hola Dra. Claudia, deseo agendar una valoración para ${s.mensaje}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-heading text-xs font-bold uppercase tracking-wider text-brand-gold hover:text-brand-white transition-colors"
                >
                  Agendar valoración &rarr;
                </a>
              </article>
            ))}
          </div>
        </div>

        {/* Center Sub-banner matching post style */}'''

rw('src/App.jsx', [
    ("\nfunction App() {", CONSTANTES),
    ("        {/* Center Sub-banner matching post style */}", GRID),
    ("      </section>\n\n      {/* Testimonials Section", "        <CasosVideos />\n      </section>\n\n      {/* Testimonials Section"),
])

with open('src/index.css', 'a', encoding='utf-8', newline='') as f:
    f.write('''
/* Carruseles deslizables sin barra visible */
.scroll-limpio { scrollbar-width: none; -webkit-overflow-scrolling: touch; }
.scroll-limpio::-webkit-scrollbar { display: none; }
''')
print('ok')
