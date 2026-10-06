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

const CSS = `
:root{--bg:#0a0a0a;--oro:#c9a961;--oro2:#e8c878;--txt:#f5f0e8;--sec:#a39d8f;--linea:rgba(201,169,97,.22)}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--txt);font:16px/1.65 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
a{color:var(--oro)}a:hover{color:var(--oro2)}
.cab{position:sticky;top:0;z-index:5;background:rgba(10,10,10,.92);backdrop-filter:blur(8px);border-bottom:1px solid var(--linea)}
.cab>div{max-width:860px;margin:0 auto;padding:10px 18px;display:flex;align-items:center;justify-content:space-between;gap:12px}
.marca{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--txt);font-weight:700;letter-spacing:.2em;font-size:13px}
.marca img{width:36px;height:36px;border-radius:50%}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:var(--oro);color:#0a0a0a;text-decoration:none;font-weight:700;padding:11px 18px;border-radius:999px;font-size:14px}
.btn:hover{background:var(--oro2);color:#0a0a0a}
.btn.chico{padding:8px 14px;font-size:12px}
main{max-width:860px;margin:0 auto;padding:22px 18px 70px}
.migas{font-size:13px;color:var(--sec);margin-bottom:14px}.migas a{color:var(--sec)}
h1{font-size:clamp(26px,5.5vw,40px);line-height:1.15;margin:0 0 14px;letter-spacing:.02em}
h2{font-size:21px;margin:34px 0 10px;color:var(--oro)}
p{margin:0 0 12px}
.intro{font-size:18px;color:#e6e0d4}
.tarjetas{display:grid;gap:10px;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));margin:14px 0}
.tarjeta{display:block;border:1px solid var(--linea);border-radius:14px;padding:14px 16px;text-decoration:none;color:var(--txt);background:#101010}
.tarjeta:hover{border-color:var(--oro)}.tarjeta b{display:block;color:var(--oro);margin-bottom:2px}.tarjeta span{color:var(--sec);font-size:14px}
.cta{margin:26px 0;padding:18px;border:1px solid var(--linea);border-radius:16px;background:#101010;text-align:center}
.cta p{margin:0 0 12px}
details{border:1px solid var(--linea);border-radius:12px;margin:8px 0;background:#101010}
summary{cursor:pointer;padding:13px 16px;font-weight:600;list-style:none}summary::-webkit-details-marker{display:none}
summary::after{content:"+";float:right;color:var(--oro)}details[open] summary::after{content:"–"}
details p{padding:0 16px 14px;margin:0;color:#d8d2c6}
video{width:100%;max-width:300px;border-radius:16px;border:1px solid var(--linea);display:block;margin:14px 0;background:#000}
.datos{border-top:1px solid var(--linea);margin-top:34px;padding-top:18px;font-size:14px;color:var(--sec)}
.aviso{font-size:13px;color:var(--sec);margin-top:22px}
footer{border-top:1px solid var(--linea);padding:22px 18px;text-align:center;font-size:13px;color:var(--sec)}
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
    const ps = parrafos.map((t) => `<p>${esc(t)}</p>`).join('');
    const bloque = extra === 'lista-tratamientos' ? listaTratamientos(null) : extra === 'lista-protesis' ? listaTratamientos(null).replace(/<a class="tarjeta" href="\/(diseno|limpieza|rehabilitacion)[^]*?<\/a>/g, '') : '';
    return `<h2>${esc(titulo)}</h2>${ps}${bloque}`;
  }).join('');

  const video = p.video ? `<video controls preload="none" playsinline poster="/videos/posters/${p.video}.jpg" src="/videos/${p.video}.mp4" aria-label="Video de un caso real de la clínica"></video>` : '';
  const faq = p.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('');
  const otros = p.slug === 'dentista-en-bello' ? '' : `<h2>Otros tratamientos en BioDent</h2>${listaTratamientos(p.slug)}`;

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
<h1>${esc(p.h1)}</h1>
<p class="intro">${esc(p.intro)}</p>
<div class="cta"><p><b>Valoración sin costo con la ${esc(CLINICA.doctora)}.</b></p><a class="btn" href="${waUrl(p.mensaje)}" rel="noopener">Quiero mi valoración sin costo</a></div>
${secciones}
${video}
<h2>Preguntas frecuentes</h2>
${faq}
<div class="cta"><p>¿Listo para dar el primer paso? Escríbenos y agendamos tu valoración.</p><a class="btn" href="${waUrl(p.mensaje)}" rel="noopener">Escribir por WhatsApp</a></div>
${otros}
<div class="datos">
<p><b>BioDent - ${esc(CLINICA.doctora)}</b><br>${esc(CLINICA.direccion)}<br>${esc(CLINICA.horario)}</p>
<p>WhatsApp de la clínica: <a href="https://wa.me/${CLINICA.wa}">${CLINICA.telefono}</a>. Otras líneas: ${CLINICA.otros.map(([t, n]) => `<a href="https://wa.me/${n}">${t}</a>`).join(' y ')}.</p>
<p><a href="${CLINICA.instagram}" rel="noopener">Instagram</a> · <a href="${CLINICA.facebook}" rel="noopener">Facebook</a> · <a href="/">Inicio</a></p>
<p class="aviso">${esc(AVISO)}</p>
</div>
</main>
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
