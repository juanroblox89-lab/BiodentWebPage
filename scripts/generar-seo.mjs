// Genera las páginas de posicionamiento (una por tratamiento) y el sitemap.
// Uso: node scripts/generar-seo.mjs   (escribe en public/<slug>/index.html y public/sitemap.xml)
//
// Reglas del contenido (no inventar):
// - Solo hechos que la clínica ya publica: tratamientos, dirección, horario, teléfonos, "valoración sin costo".
// - Nada de precios, tiempos, cifras de pacientes ni resultados garantizados.
// - La información general aclara que no reemplaza la valoración de la odontóloga.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITIO = 'https://www.biodent.site';
const HOY = new Date().toISOString().slice(0, 10);

const CLINICA = {
  nombre: 'BioDent',
  doctora: 'Dra. Claudia Mabel Tapias',
  direccion: 'Calle 50 #48-34, segundo piso, junto al Éxito del Parque de Bello, Antioquia',
  wa: '573148091585',
  telefono: '+57 314 809 1585',
  otros: [['+57 311 434 5328', '573114345328'], ['+57 314 530 4329', '573145304329']],
  horario: 'Lunes a viernes de 9:00 a. m. a 6:00 p. m. y sábados de 9:00 a. m. a 1:00 p. m.',
  instagram: 'https://www.instagram.com/biodent_parquedebello/',
  facebook: 'https://www.facebook.com/people/Dra-Claudia-Mabel-Tapias/61587872871889/',
};

const AVISO = 'La información de esta página es general y no reemplaza la valoración de la odontóloga: cada caso es distinto.';

const FAQ_COMUN = {
  costo: ['¿Cuánto cuesta?', 'El valor depende de cada caso: cantidad de dientes, materiales y tipo de tratamiento. Por eso el primer paso es la valoración, que es sin costo, y ahí la Dra. Claudia te explica las opciones.'],
  valoracion: ['¿La valoración tiene costo?', 'No. La valoración es sin costo. Puedes agendarla por WhatsApp al +57 314 809 1585.'],
  tiempo: ['¿Cuánto tarda el tratamiento?', 'Depende de cada caso. En la valoración la Dra. Claudia te cuenta los pasos y los tiempos que corresponden a tu situación.'],
  donde: ['¿Dónde queda BioDent en Bello?', `En la ${CLINICA.direccion}.`],
  horario: ['¿Qué horario tienen?', CLINICA.horario],
};

// ── Páginas ─────────────────────────────────────────────────────────────
const PAGINAS = [
  {
    slug: 'dentista-en-bello',
    nombreCorto: 'Dentista en Bello',
    title: 'Dentista en Bello, Antioquia | BioDent Dra. Claudia',
    desc: 'Odontología en Bello, Antioquia con la Dra. Claudia Mabel Tapias: prótesis, diseño de sonrisa, limpieza y aclaramiento. Valoración sin costo.',
    h1: 'Dentista en Bello, Antioquia',
    intro: 'BioDent es el consultorio odontológico de la Dra. Claudia Mabel Tapias en Bello, Antioquia. Atendemos a quienes buscan una sonrisa más sana, natural y cómoda: prótesis dentales, diseño de sonrisa, limpieza y aclaramiento dental y rehabilitación oral.',
    secciones: [
      ['Odontología en Bello: lo que hacemos', [
        'Si estás buscando un dentista en Bello, en BioDent encuentras atención odontológica enfocada en la estética y la función de tu sonrisa. Estos son nuestros tratamientos:',
      ], 'lista-tratamientos'],
      ['Cómo llegar y cuándo atendemos', [
        `Estamos en la ${CLINICA.direccion}. ${CLINICA.horario}`,
        'Mira el recorrido en video, de la calle al consultorio: <<Cómo llegar (video)|' + SITIO + '/#como-llegar>>.',
        'Puedes escribirnos por WhatsApp al +57 314 809 1585 para agendar tu valoración sin costo o resolver dudas antes de venir.',
      ]],
      ['Tu primera visita: la valoración sin costo', [
        'La valoración es el primer paso: la Dra. Claudia revisa tu caso, resuelve tus preguntas y te explica las opciones que existen para ti. Así decides con información clara, sin compromiso.',
      ]],
    ],
    faq: [FAQ_COMUN.valoracion, FAQ_COMUN.donde, FAQ_COMUN.horario,
      ['¿Qué tratamientos ofrece BioDent?', 'Prótesis flexible, prótesis parcial flexible, prótesis total, prótesis Acker (incluida la semi flexible), diseño de sonrisa en resina, microdiseño, limpieza y aclaramiento dental y rehabilitación oral.'],
      ['¿Cómo agendo una cita?', 'Escribiendo por WhatsApp al +57 314 809 1585. Cuéntanos qué tratamiento te interesa y agendamos tu valoración.'],
    ],
    mensaje: 'quiero agendar una valoración sin costo.',
    servicio: null,
    video: 'como-llegar',
  },
  {
    slug: 'protesis-dentales-bello',
    nombreCorto: 'Prótesis dentales en Bello',
    title: 'Prótesis dentales en Bello, Antioquia | BioDent',
    desc: 'Prótesis dentales en Bello: flexibles, parciales, totales y Acker, hechas a tu medida con la Dra. Claudia Mabel Tapias. Valoración sin costo.',
    h1: 'Prótesis dentales en Bello, Antioquia',
    intro: 'En BioDent elaboramos prótesis dentales pensadas para devolverte función, estética y confianza. Cada prótesis se adapta a tu boca y a lo que necesitas, desde reemplazar algunos dientes hasta rehabilitar una arcada completa.',
    secciones: [
      ['Tipos de prótesis dentales que trabajamos', [
        'Estas son las opciones. En la valoración, la Dra. Claudia te orienta sobre cuál puede ser la indicada para tu caso.',
      ], 'lista-protesis'],
      ['¿Qué buscar en una prótesis dental?', [
        'Que sea cómoda para hablar y masticar, que se vea natural y que se adapte bien a tu boca. Por eso trabajamos materiales estéticos y cada prótesis se ajusta a tu caso.',
      ]],
    ],
    faq: [FAQ_COMUN.costo, FAQ_COMUN.valoracion, FAQ_COMUN.tiempo,
      ['¿Cuál prótesis es la mejor para mí?', 'Depende de cuántos dientes faltan, de la salud de tu boca y de lo que buscas. La Dra. Claudia lo define contigo en la valoración sin costo.'],
      FAQ_COMUN.donde,
    ],
    mensaje: 'quiero agendar una valoración sin costo para una prótesis dental.',
    servicio: 'Prótesis dentales',
  },
  {
    slug: 'protesis-flexible-bello',
    nombreCorto: 'Prótesis flexible',
    title: 'Prótesis flexible en Bello, Antioquia | BioDent',
    desc: 'Prótesis flexible y prótesis parcial flexible superior e inferior en Bello: livianas, estéticas y cómodas. Valoración sin costo en BioDent.',
    h1: 'Prótesis flexible en Bello, Antioquia',
    intro: 'La prótesis flexible es una prótesis removible elaborada en materiales flexibles y estéticos. Se adapta cómodamente a tu boca y se integra de forma natural. En BioDent también hacemos prótesis parciales flexibles, superiores e inferiores.',
    secciones: [
      ['Qué la hace especial', [
        'Su base es altamente translúcida, lo que permite que el color natural de la encía se trasluzca y la estética sea discreta.',
        'Es ligera y flexible, estética y discreta, cómoda y resistente: comodidad, estética y confianza.',
      ]],
      ['Prótesis parcial flexible: superior e inferior', [
        'Cuando faltan algunos dientes, la prótesis parcial flexible los reemplaza con estética natural y atención profesional. Se puede realizar en la parte superior, en la inferior o en ambas.',
      ]],
    ],
    faq: [FAQ_COMUN.costo, FAQ_COMUN.valoracion, FAQ_COMUN.tiempo,
      ['¿La prótesis flexible es removible?', 'Sí, es una prótesis removible. En la valoración la Dra. Claudia te explica cómo se coloca, cómo se cuida y si es la opción adecuada para ti.'],
    ],
    mensaje: 'quiero agendar una valoración sin costo para una prótesis flexible.',
    servicio: 'Prótesis flexible',
    video: 'parcial-flexible',
  },
  {
    slug: 'protesis-total-dentadura-bello',
    nombreCorto: 'Prótesis total (dentadura)',
    title: 'Prótesis total o dentadura en Bello | BioDent',
    desc: 'Prótesis total (dentadura) en Bello, Antioquia: reemplaza todos los dientes y devuelve función, estética y confianza. Valoración sin costo.',
    h1: 'Prótesis total (dentadura) en Bello, Antioquia',
    intro: 'La prótesis total es la solución completa para reemplazar todos los dientes y devolver función, estética y confianza. Se elabora con materiales acrílicos caracterizados de alta densidad, para soportar de manera óptima las fuerzas de masticación y restaurar las facciones naturales del rostro.',
    secciones: [
      ['Para qué sirve', [
        'Restaura la función masticatoria, mejora la estética facial y aporta más comodidad y confianza.',
        'En el lenguaje de todos los días también se le conoce como dentadura o dentadura postiza.',
      ]],
    ],
    faq: [FAQ_COMUN.costo, FAQ_COMUN.valoracion, FAQ_COMUN.tiempo, FAQ_COMUN.donde],
    mensaje: 'quiero agendar una valoración sin costo para una prótesis total.',
    servicio: 'Prótesis total',
  },
  {
    slug: 'protesis-acker-bello',
    nombreCorto: 'Prótesis Acker',
    title: 'Prótesis Acker y semi flexible en Bello | BioDent',
    desc: 'Prótesis Acker y Acker semi flexible en Bello, Antioquia: reemplaza dientes faltantes de forma discreta y cómoda. Valoración sin costo.',
    h1: 'Prótesis Acker en Bello, Antioquia',
    intro: 'La prótesis Acker es una prótesis removible parcial flexible y estética que se adapta cómodamente y reemplaza dientes faltantes de manera discreta. Tiene una sujeción firme que utiliza la anatomía de los dientes remanentes para un anclaje seguro y cómodo. En BioDent también la hacemos en versión semi flexible.',
    secciones: [
      ['Lo que ofrece', [
        'Es ligera y flexible, estética y discreta, cómoda y resistente.',
      ]],
    ],
    faq: [FAQ_COMUN.costo, FAQ_COMUN.valoracion, FAQ_COMUN.tiempo,
      ['¿Qué es una prótesis Acker semi flexible?', 'Es una variante de la prótesis Acker. En la valoración la Dra. Claudia te explica en qué casos se usa y si es la opción adecuada para ti.'],
    ],
    mensaje: 'quiero agendar una valoración sin costo para una prótesis Acker.',
    servicio: 'Prótesis Acker',
    video: 'acker-semiflexible',
  },
  {
    slug: 'diseno-de-sonrisa-bello',
    nombreCorto: 'Diseño de sonrisa',
    title: 'Diseño de sonrisa en resina en Bello | BioDent',
    desc: 'Diseño de sonrisa, carillas y microdiseño en resina de alta estética en Bello, Antioquia con la Dra. Claudia Tapias. Valoración sin costo.',
    h1: 'Diseño de sonrisa en Bello, Antioquia',
    intro: 'El diseño de sonrisa en resina de alta estética busca darle un giro total a tu sonrisa con un resultado natural y atención profesional. En BioDent también trabajamos el microdiseño de sonrisa y las carillas en resina.',
    secciones: [
      ['Diseño, microdiseño y carillas en resina', [
        'Cada sonrisa es distinta. En la valoración la Dra. Claudia revisa tu caso y te cuenta qué opciones de diseño en resina son posibles para ti.',
        'Puedes ver casos reales de la clínica en los videos de nuestra página principal.',
      ]],
    ],
    faq: [FAQ_COMUN.costo, FAQ_COMUN.valoracion, FAQ_COMUN.tiempo,
      ['¿Qué materiales usan?', 'Trabajamos con resina de alta estética. La Dra. Claudia te explica en la valoración qué opción corresponde a tu caso.'],
    ],
    mensaje: 'quiero agendar una valoración sin costo para un diseño de sonrisa en resina.',
    servicio: 'Diseño de sonrisa en resina',
    video: 'diseno-resina',
  },
  {
    slug: 'limpieza-y-blanqueamiento-dental-bello',
    nombreCorto: 'Limpieza y aclaramiento dental',
    title: 'Limpieza y aclaramiento dental en Bello | BioDent',
    desc: 'Limpieza dental y aclaramiento (blanqueamiento) en Bello, Antioquia: elimina placa y sarro y logra dientes más blancos. Valoración sin costo.',
    h1: 'Limpieza y aclaramiento dental en Bello, Antioquia',
    intro: 'Una sonrisa limpia y más blanca refleja tu mejor versión. En BioDent combinamos la limpieza dental con el aclaramiento dental, también conocido como blanqueamiento dental.',
    secciones: [
      ['Qué incluye', [
        'Elimina placa y sarro, deja los dientes más blancos y brillantes, protege tu salud bucal y te da más confianza y más seguridad al sonreír.',
      ]],
    ],
    faq: [FAQ_COMUN.costo, FAQ_COMUN.valoracion, FAQ_COMUN.tiempo,
      ['¿Aclaramiento y blanqueamiento dental es lo mismo?', 'Son nombres que se usan para el mismo tipo de tratamiento: dejar los dientes más claros. En la valoración la Dra. Claudia te dice si es adecuado para ti.'],
    ],
    mensaje: 'quiero agendar una valoración sin costo para una limpieza y aclaramiento dental.',
    servicio: 'Limpieza y aclaramiento dental',
    video: 'antes-despues',
  },
  {
    slug: 'rehabilitacion-oral-bello',
    nombreCorto: 'Rehabilitación oral',
    title: 'Rehabilitación oral en Bello, Antioquia | BioDent',
    desc: 'Rehabilitación oral en Bello, Antioquia: estética natural y atención profesional para recuperar tu sonrisa. Valoración sin costo en BioDent.',
    h1: 'Rehabilitación oral en Bello, Antioquia',
    intro: 'La rehabilitación oral busca devolverle función y estética a tu boca. En BioDent la Dra. Claudia Mabel Tapias planea contigo el tratamiento que corresponde a tu caso, con estética natural y atención profesional.',
    secciones: [
      ['Cómo empezar', [
        'El primer paso es la valoración sin costo: revisamos tu caso, resolvemos tus dudas y te explicamos las opciones, que pueden incluir prótesis, diseño de sonrisa en resina u otros tratamientos de la clínica.',
      ]],
    ],
    faq: [FAQ_COMUN.costo, FAQ_COMUN.valoracion, FAQ_COMUN.tiempo, FAQ_COMUN.donde],
    mensaje: 'quiero agendar una valoración sin costo para una rehabilitación oral.',
    servicio: 'Rehabilitación oral',
    video: 'rehabilitacion-oral',
  },
];

const LISTA_TRATAMIENTOS = [
  ['protesis-dentales-bello', 'Prótesis dentales', 'Flexibles, parciales, totales y Acker.'],
  ['protesis-flexible-bello', 'Prótesis flexible', 'Ligeras, estéticas y cómodas; también parciales superiores e inferiores.'],
  ['protesis-total-dentadura-bello', 'Prótesis total (dentadura)', 'Reemplaza todos los dientes.'],
  ['protesis-acker-bello', 'Prótesis Acker', 'Incluida la versión semi flexible.'],
  ['diseno-de-sonrisa-bello', 'Diseño de sonrisa en resina', 'Resina de alta estética, microdiseño y carillas.'],
  ['limpieza-y-blanqueamiento-dental-bello', 'Limpieza y aclaramiento dental', 'Placa, sarro y dientes más blancos.'],
  ['rehabilitacion-oral-bello', 'Rehabilitación oral', 'Función y estética para tu boca.'],
];

// ── Utilidades ──────────────────────────────────────────────────────────
const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const waUrl = (resto) => `https://wa.me/${CLINICA.wa}?text=${encodeURIComponent('Hola, los vi en la página web y ' + resto)}`;

const ICONOS = {
  check: '<path d="M5 13l4 4L19 7"/>',
  escudo: '<path d="M9 12l2 2 4-4m5.6-4a12 12 0 01-8.6-3 12 12 0 01-8.6 3A12 12 0 003 9c0 5.6 3.8 10.3 9 11.6 5.2-1.3 9-6 9-11.6 0-1-.1-2-.4-3z"/>',
  brillo: '<path d="M5 3v4M3 5h4M6 17v4M4 19h4M13 3l2.5 5.5L21 11l-5.5 2.5L13 19l-2.5-5.5L5 11l5.5-2.5L13 3z"/>',
  sonrisa: '<path d="M14.8 14.8a4 4 0 01-5.6 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>',
  diente: '<path d="M12 4c2.5 0 4 1.5 4 4s-.5 4-1 6.5S14 20 12 20s-3-3.5-3-5.5.5-4-1-6.5 1.5-4 4-4z"/>',
  lugar: '<path d="M17.7 16.7l-4.3 4.2a2 2 0 01-2.8 0l-4.3-4.2a8 8 0 1111.4 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"/>',
  reloj: '<path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>',
};
const BENEFICIOS_BASE = [['escudo', 'Valoración sin costo'], ['diente', 'Atención de la Dra. Claudia'], ['lugar', 'Junto al Éxito del Parque de Bello']];
const BENEFICIOS = {
  'protesis-flexible-bello': [['brillo', 'Ligera y flexible'], ['sonrisa', 'Estética y discreta'], ['escudo', 'Cómoda y resistente'], ['check', 'Base translúcida que deja ver el color de la encía']],
  'protesis-total-dentadura-bello': [['diente', 'Restaura la función masticatoria'], ['sonrisa', 'Mejora la estética facial'], ['escudo', 'Más comodidad y confianza']],
  'protesis-acker-bello': [['brillo', 'Ligera y flexible'], ['sonrisa', 'Estética y discreta'], ['escudo', 'Cómoda y resistente'], ['check', 'Sujeción firme en los dientes que conservas']],
  'limpieza-y-blanqueamiento-dental-bello': [['check', 'Elimina placa y sarro'], ['brillo', 'Dientes más blancos y brillantes'], ['escudo', 'Protege tu salud bucal'], ['sonrisa', 'Más confianza al sonreír']],
};
const svgIco = (k) => `<span class="ico"><svg viewBox="0 0 24 24" aria-hidden="true">${ICONOS[k]}</svg></span>`;
const PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
const WA_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.62.962 3.21 1.493 4.904 1.496 5.434.004 9.859-4.417 9.862-9.857.002-2.636-1.023-5.11-2.884-6.974C16.672 1.955 14.195.932 11.56.932c-5.443 0-9.87 4.42-9.873 9.861-.001 1.776.479 3.51 1.39 5.048l-.946 3.453 3.536-.93c1.558.847 3.11 1.29 4.39 1.29z"/></svg>';
const CSS = `
:root{--bg:#0a0a0a;--panel:#100e09;--oro:#c9a961;--oro2:#e8c878;--txt:#f5f0e8;--sec:#b9b3a5;--linea:rgba(201,169,97,.28)}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%;scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--txt);font:16px/1.65 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;padding-bottom:64px}
a{color:var(--oro)}a:hover{color:var(--oro2)}
a:focus-visible,button:focus-visible,summary:focus-visible{outline:3px solid var(--oro2);outline-offset:2px}
.cab{position:sticky;top:0;z-index:5;background:rgba(10,10,10,.94);backdrop-filter:blur(8px);border-bottom:1px solid var(--linea)}
.cab>div{max-width:1040px;margin:0 auto;padding:10px 18px;display:flex;align-items:center;justify-content:space-between;gap:12px}
.marca{display:flex;align-items:center;gap:10px;min-height:44px;text-decoration:none;color:var(--txt);font-weight:700;letter-spacing:.2em;font-size:13px}
.marca img{width:36px;height:36px;border-radius:50%;border:1px solid var(--linea)}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:46px;background:var(--oro);color:#0a0a0a;text-decoration:none;font-weight:700;padding:11px 22px;border-radius:999px;font-size:14px;text-align:center}
.btn:hover{background:var(--oro2);color:#0a0a0a}
.btn.chico{min-height:44px;padding:8px 16px;font-size:13px}
.btn svg{width:18px;height:18px;fill:currentColor;flex:none}
main{max-width:1040px;margin:0 auto;padding:18px 18px 40px}
.migas{font-size:13px;color:var(--sec);margin:0 0 14px}.migas a{color:var(--sec)}
.hero{display:grid;gap:22px;align-items:center;border:1px solid var(--linea);border-radius:24px;background:radial-gradient(ellipse at 20% 0,rgba(201,169,97,.14),transparent 60%),var(--panel);padding:26px 20px}
.hero .tag{display:block;font-size:12px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--oro);margin-bottom:10px}
h1{font-size:clamp(27px,6vw,42px);line-height:1.15;margin:0 0 14px;letter-spacing:.01em}
.intro{font-size:17px;color:#e6e0d4;margin:0 0 20px}
.hero .btn{width:100%}
.video{position:relative;width:min(100%,260px);aspect-ratio:9/16;margin:0 auto;border-radius:20px;overflow:hidden;border:2px solid var(--oro);background:#000;box-shadow:0 0 36px rgba(201,169,97,.22)}
.video img,.video video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.play{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.28);border:0;cursor:pointer;text-decoration:none}
.play span{width:72px;height:72px;border-radius:50%;background:var(--oro);display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 8px rgba(201,169,97,.25),0 10px 30px rgba(0,0,0,.5)}
.play svg{width:34px;height:34px;fill:#0a0a0a;margin-left:4px}
.play:hover span{background:var(--oro2)}
.vtxt{position:absolute;left:0;right:0;bottom:0;background:rgba(0,0,0,.72);text-align:center;font-size:12px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;padding:8px;color:var(--txt)}
h2{font-size:22px;line-height:1.25;margin:40px 0 12px;color:var(--oro)}
p{margin:0 0 12px}
.beneficios{list-style:none;margin:14px 0 0;padding:0;display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}
.beneficios li{display:flex;align-items:center;gap:12px;border:1px solid var(--linea);border-radius:16px;padding:14px;background:var(--panel);font-weight:600}
.ico{flex:none;width:40px;height:40px;border-radius:50%;border:1px solid var(--linea);background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;color:var(--oro)}
.ico svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
.tarjetas{display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));margin:14px 0}
.tarjeta{display:block;border:1px solid var(--linea);border-radius:16px;padding:16px;text-decoration:none;color:var(--txt);background:var(--panel);min-height:44px}
.tarjeta:hover{border-color:var(--oro)}.tarjeta b{display:block;color:var(--oro);margin-bottom:2px}.tarjeta span{color:var(--sec);font-size:14px}
.cta{margin:34px 0;padding:22px 18px;border:1px solid var(--linea);border-radius:20px;background:var(--panel);text-align:center}
.cta p{margin:0 0 14px;font-size:17px}
details{border:1px solid var(--linea);border-radius:14px;margin:8px 0;background:var(--panel)}
details[open]{border-color:var(--oro)}
summary{cursor:pointer;padding:15px 16px;font-weight:600;list-style:none;display:flex;justify-content:space-between;gap:12px;min-height:48px;align-items:center}summary::-webkit-details-marker{display:none}
summary::after{content:"+";color:var(--oro);font-size:22px;line-height:1}details[open] summary::after{content:"\\2013"}
details p{padding:0 16px 16px;margin:0;color:#d8d2c6}
.datos{border-top:1px solid var(--linea);margin-top:40px;padding-top:20px;font-size:14px;color:var(--sec)}
.aviso{font-size:13px;color:var(--sec);margin-top:22px}
footer{border-top:1px solid var(--linea);padding:22px 18px;text-align:center;font-size:13px;color:var(--sec)}
.barra{position:fixed;left:0;right:0;bottom:0;z-index:6;background:rgba(10,10,10,.96);border-top:1px solid var(--linea);padding:8px 14px;display:flex;justify-content:center}
.barra .btn{width:100%;max-width:460px;min-height:46px}
@media(min-width:760px){
.hero{grid-template-columns:1.4fr 1fr;padding:38px 36px;gap:34px}.hero .btn{width:auto}
.hero.sinvideo{grid-template-columns:1fr}
body{padding-bottom:0}.barra{display:none}
}
`;
function listaTratamientos(actual) {
  return `<div class="tarjetas">${LISTA_TRATAMIENTOS.filter(([s]) => s !== actual)
    .map(([s, t, d]) => `<a class="tarjeta" href="/${s}/"><b>${esc(t)}</b><span>${esc(d)}</span></a>`).join('')}</div>`;
}

function render(p) {
  const url = `${SITIO}/${p.slug}/`;
  const faqLd = p.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }));
  const grafo = [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'BioDent', item: `${SITIO}/` },
        ...(p.slug === 'dentista-en-bello' ? [] : [{ '@type': 'ListItem', position: 2, name: 'Tratamientos en Bello', item: `${SITIO}/dentista-en-bello/` }]),
        { '@type': 'ListItem', position: p.slug === 'dentista-en-bello' ? 2 : 3, name: p.nombreCorto, item: url },
      ],
    },
    { '@type': 'FAQPage', mainEntity: faqLd },
  ];
  if (p.servicio) {
    grafo.push({
      '@type': 'Service',
      name: p.servicio,
      serviceType: p.servicio,
      description: p.desc,
      areaServed: { '@type': 'City', name: 'Bello' },
      provider: { '@id': `${SITIO}/#clinica` },
      url,
    });
  } else {
    grafo.push({ '@type': 'WebPage', '@id': url, url, name: p.title, description: p.desc, inLanguage: 'es-CO', about: { '@id': `${SITIO}/#clinica` } });
  }
  const ld = JSON.stringify({ '@context': 'https://schema.org', '@graph': grafo });

  const secciones = p.secciones.map(([titulo, parrafos, extra]) => {
    const ps = parrafos.map((t) => `<p>${esc(t).replace(/&lt;&lt;(.+?)\|(.+?)&gt;&gt;/g, '<a href="$2">$1</a>')}</p>`).join('');
    const bloque = extra === 'lista-tratamientos' ? listaTratamientos(null) : extra === 'lista-protesis' ? listaTratamientos(null).replace(/<a class="tarjeta" href="\/(diseno|limpieza|rehabilitacion)[^]*?<\/a>/g, '') : '';
    return `<h2>${esc(titulo)}</h2>${ps}${bloque}`;
  }).join('');

  const esCaso = p.video && p.video !== 'como-llegar';
  const etiquetaVideo = p.video === 'como-llegar' ? 'Mira cómo llegar' : 'Mira un caso real';
  const alVideo = p.video === 'como-llegar' ? 'Video: recorrido a pie hasta el consultorio de BioDent' : 'Video de un caso real de la clínica';
  const onclick = `var b=this.parentNode;b.innerHTML='<video controls autoplay playsinline src=&quot;/videos/${p.video}.mp4&quot; poster=&quot;/videos/posters/${p.video}.jpg&quot; aria-label=&quot;${alVideo}&quot;></video>'`;
  const video = p.video ? `<div class="video"><img src="/videos/posters/${p.video}.jpg" alt="" width="540" height="960" loading="eager"><button type="button" class="play" aria-label="Reproducir video: ${esc(p.nombreCorto)}" onclick="${onclick}"><span>${PLAY}</span></button><div class="vtxt">${etiquetaVideo}</div></div>` : '';
  const lista = BENEFICIOS[p.slug] || BENEFICIOS_BASE;
  const beneficios = `<ul class="beneficios">${lista.map(([k, t]) => `<li>${svgIco(k)}<span>${esc(t)}</span></li>`).join('')}</ul>`;
  const faq = p.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('');
  const otros = p.slug === 'dentista-en-bello' ? '' : `<h2>Otros tratamientos en BioDent</h2>${listaTratamientos(p.slug)}`;
  void esCaso;
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.desc)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<meta name="theme-color" content="#0A0A0A">
<meta name="geo.region" content="CO-ANT"><meta name="geo.placename" content="Bello, Antioquia">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="shortcut icon" href="/favicon.ico">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta property="og:type" content="website"><meta property="og:site_name" content="BioDent">
<meta property="og:url" content="${url}"><meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(p.desc)}">
<meta property="og:image" content="${SITIO}/og-biodent.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:locale" content="es_CO">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(p.title)}">
<meta name="twitter:description" content="${esc(p.desc)}"><meta name="twitter:image" content="${SITIO}/og-biodent.jpg">
<script type="application/ld+json">${ld}</script>
<style>${CSS}</style>
</head>
<body>
<header class="cab"><div>
<a class="marca" href="/"><img src="/logo-biodent-96.png" alt="BioDent" width="36" height="36">BIODENT</a>
<a class="btn chico" href="${waUrl(p.mensaje)}" rel="noopener">Agenda tu valoración</a>
</div></header>
<main>
<nav class="migas" aria-label="Migas de pan"><a href="/">BioDent</a> › ${p.slug === 'dentista-en-bello' ? '' : '<a href="/dentista-en-bello/">Tratamientos en Bello</a> › '}${esc(p.nombreCorto)}</nav>
<section class="hero${p.video ? '' : ' sinvideo'}">
<div>
<span class="tag">BioDent · Bello, Antioquia</span>
<h1>${esc(p.h1)}</h1>
<p class="intro">${esc(p.intro)}</p>
<a class="btn" href="${waUrl(p.mensaje)}" rel="noopener">${WA_SVG}Quiero mi valoración sin costo</a>
</div>
${video}
</section>
<h2>Lo que debes saber</h2>
${beneficios}
${secciones}
<h2>Preguntas frecuentes</h2>
${faq}
<div class="cta"><p>¿Listo para dar el primer paso? Escríbenos y agendamos tu valoración.</p><a class="btn" href="${waUrl(p.mensaje)}" rel="noopener">${WA_SVG}Escribir por WhatsApp</a></div>
${otros}
<div class="datos">
<p><b>BioDent - ${esc(CLINICA.doctora)}</b><br>${esc(CLINICA.direccion)}<br>${esc(CLINICA.horario)}</p>
<p>WhatsApp de la clínica: <a href="https://wa.me/${CLINICA.wa}">${CLINICA.telefono}</a>. Otras líneas: ${CLINICA.otros.map(([t, n]) => `<a href="https://wa.me/${n}">${t}</a>`).join(' y ')}.</p>
<p><a href="${SITIO}/#como-llegar">Cómo llegar (video)</a></p>
<p><a href="${CLINICA.instagram}" rel="noopener">Instagram</a> · <a href="${CLINICA.facebook}" rel="noopener">Facebook</a> · <a href="/">Inicio</a></p>
<p class="aviso">${esc(AVISO)}</p>
</div>
</main>
<div class="barra"><a class="btn" href="${waUrl(p.mensaje)}" rel="noopener">${WA_SVG}Escribir por WhatsApp</a></div>
<footer>&copy; 2026 BioDent. Odontología en Bello, Antioquia.</footer>
</body>
</html>
`;
}

for (const p of PAGINAS) {
  const carpeta = join(RAIZ, 'public', p.slug);
  mkdirSync(carpeta, { recursive: true });
  writeFileSync(join(carpeta, 'index.html'), render(p), 'utf8');
}

const urls = [`${SITIO}/`, ...PAGINAS.map((p) => `${SITIO}/${p.slug}/`)];
writeFileSync(join(RAIZ, 'public', 'sitemap.xml'),
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map((u, i) => `  <url>\n    <loc>${u}</loc>\n    <lastmod>${HOY}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${i === 0 ? '1.0' : '0.8'}</priority>\n  </url>`).join('\n') +
  '\n</urlset>\n', 'utf8');

console.log(`${PAGINAS.length} páginas y sitemap con ${urls.length} direcciones.`);
