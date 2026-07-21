import React, { useState, useRef, useEffect } from 'react'
import biodentLogoImg from './assets/biodent_logo.png'
import flexibleProsthesisImg from './assets/flexible_prosthesis.png'
import totalProsthesisImg from './assets/total_prosthesis.png'
import ackerProsthesisImg from './assets/acker_prosthesis.png'
import dentalOfficeImg from './assets/dental_office.png'
import drClaudiaImg from './assets/dr_claudia.png'
import beautifulSmileImg from './assets/beautiful_smile.png'

function App() {
  // Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [selectedImage, setSelectedImage] = useState(null); // base64 string
  const DEFAULT_GREETING = { role: 'assistant', content: '¡Hola! Bienvenido a BioDent. Con mucho gusto estoy para colaborar en lo que necesites sobre tus dientes y prótesis dentales. ¿En qué te podemos ayudar hoy? Si gustas, también puedes enviarme una foto de tus dientes.' };

  const [chatMessages, setChatMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('biodent_chat_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Could not load chat history:', e);
    }
    return [DEFAULT_GREETING];
  });

  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Save chat messages to localStorage whenever they change
  useEffect(() => {
    try {
      const cleanToSave = chatMessages.map(m => ({
        role: m.role,
        content: m.content,
        image: m.image ? '[Foto adjunta]' : undefined
      }));
      localStorage.setItem('biodent_chat_history', JSON.stringify(cleanToSave));
    } catch (e) {
      console.warn('Could not save chat history:', e);
    }
  }, [chatMessages]);

  const clearChatHistory = () => {
    setChatMessages([DEFAULT_GREETING]);
    try {
      localStorage.removeItem('biodent_chat_history');
    } catch (e) {}
  };

  // Chatbot CTAs State & Logic (Rotating every 10s)
  const ctas = [
    "💬 ¿Cuánto cuesta una prótesis flexible?",
    "📸 ¿Puedo enviar una foto de mis dientes?",
    "😁 Pregúntame por nuestros tratamientos",
    "📍 ¿Dónde están ubicados en Bello?",
    "⏰ ¿Qué horarios de atención tienen?",
    "✨ ¿Qué prótesis es la más recomendada?"
  ];
  const [currentCtaIndex, setCurrentCtaIndex] = useState(0);
  const [showCta, setShowCta] = useState(false);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  useEffect(() => {
    if (isChatOpen) {
      setShowCta(false);
      return;
    }

    const interval = setInterval(() => {
      setCurrentCtaIndex((prev) => (prev + 1) % ctas.length);
      setShowCta(true);

      setTimeout(() => {
        setShowCta(false);
      }, 6000);
    }, 10000);

    const initialTimer = setTimeout(() => {
      if (!isChatOpen) {
        setShowCta(true);
        setTimeout(() => {
          setShowCta(false);
        }, 6000);
      }
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimer);
    };
  }, [isChatOpen]);

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

    const userMsgObj = { 
      role: 'user', 
      content: textContent, 
      image: imageToSend 
    };

    const updatedHistory = [...chatMessages, userMsgObj];
    setChatMessages(updatedHistory);
    setChatInput('');
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsChatLoading(true);

    // Append initial empty assistant message for SSE streaming
    setChatMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    try {
      const systemPrompt = `Eres la recepcionista virtual de la clínica BioDent en Bello, Antioquia. Tu trato debe ser EXTREMADAMENTE AMABLE, educado, cálido y servicial. Usa expresiones amables como "Con mucho gusto", "Es un placer colaborarte" y "En BioDent nos encanta cuidar tu sonrisa". Jamás menciones que eres una IA, un bot ni un modelo de lenguaje.

REGLAS STRICTAS DE ÁMBITO:
1. EXCLUSIVO A DIENTES Y SALUD DENTAL: Tu ÚNICA función es responder sobre dientes, salud oral, prótesis dentales y servicios de la clínica BioDent. Si el usuario te pregunta sobre cualquier tema que NO sea de dientes u odontología (por ejemplo: política, deportes, cocina, tecnología, chistes, cultura general, etc.), responde de forma muy dulce y educada: "Con mucho gusto te atendería, pero como recepcionista de BioDent estoy dedicada exclusivamente a consultas sobre tus dientes y tu salud oral. ¿Tienes alguna inquietud sobre tu sonrisa, prótesis o agendamiento?"
2. BREVE Y CONCISO: Responde en máximo 2 a 3 frases cortas.
3. BOTÓN DE WHATSAPP: Cuando el usuario consulte precios o quiera agendar cita, incluye la palabra WhatsApp en tu respuesta de forma natural.

Información de BioDent:
- Especialidad: Prótesis flexibles (livianas, estéticas), prótesis totales y prótesis Acker parciales.
- Ubicación: Cerca al Parque Principal de Bello, Antioquia.
- Horarios: Lunes a Viernes 9am - 6pm | Sábados 9am - 1pm.`;

      const messagesToSend = [{ role: 'system', content: systemPrompt }];

      for (const m of chatMessages) {
        if (m.role === 'assistant') {
          if (m.content) messagesToSend.push({ role: 'assistant', content: m.content });
        } else {
          if (m.image) {
            messagesToSend.push({
              role: 'user',
              content: [
                { type: 'text', text: m.content || 'Adjunto foto dental' },
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

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const dataStr = trimmed.slice(6);
            if (dataStr === '[DONE]') break;

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
            } catch (e) {
              // Non-JSON line ignored
            }
          }
        }
      }

      if (!accumulatedContent) {
        setChatMessages((prev) => {
          const updated = [...prev];
          const lastIdx = updated.length - 1;
          if (lastIdx >= 0 && updated[lastIdx].role === 'assistant') {
            updated[lastIdx] = { 
              role: 'assistant', 
              content: 'Por favor escrébenos a nuestro WhatsApp para poder orientarte de inmediato: https://wa.me/573114345328' 
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
            content: 'Lo siento, hubo un problema al procesar la respuesta. Puedes escribirnos directamente a nuestro WhatsApp: https://wa.me/573114345328'
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

  const handleCtaClick = (ctaText) => {
    setIsChatOpen(true);
    setShowCta(false);
    const cleanQuestion = ctaText.replace(/^[^\wáéíóúñÁÉÍÓÚÑ¿?]+/, '').trim();
    processChatMessage(cleanQuestion, null);
  };

  const renderMessageContent = (content, role) => {
    if (!content) return null;

    const lower = content.toLowerCase();
    const hasWhatsapp = content.includes('[BOTON_WHATSAPP]') || content.includes('https://wa.me/') || lower.includes('whatsapp');

    let cleanText = content
      .replace(/https?:\/\/wa\.me\/[^\s)]+/g, '')
      .replace(/\[BOTON_WHATSAPP\]/g, '')
      .replace(/\[WhatsApp\]/g, '')
      .trim();

    return (
      <div className="space-y-2">
        {cleanText && <div>{cleanText}</div>}
        {hasWhatsapp && role === 'assistant' && (
          <a
            href="https://wa.me/573114345328"
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

  const getWhatsAppLink = (text) => {
    const phone = "573114345328"; // Real primary WhatsApp number
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

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
      <header className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 w-[94%] sm:w-[92%] max-w-6xl backdrop-blur-md bg-brand-bg/85 border border-brand-gold/15 rounded-full px-3.5 sm:px-6 py-2.5 sm:py-3.5 flex justify-between items-center z-50 transition-all duration-300 shadow-lg">
        {/* Brand Name */}
        <a href="#inicio" className="flex items-center gap-1.5 sm:gap-2 group shrink-0">
          <img src={biodentLogoImg} alt="BioDent Logo" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-brand-gold/20 object-contain" />
          <span className="font-heading font-bold text-brand-white text-xs sm:text-base tracking-[0.2em] sm:tracking-[0.25em] ml-0.5 sm:ml-1">BIODENT</span>
        </a>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#inicio" className="text-brand-secondary hover:text-brand-gold transition-colors font-heading text-xs font-semibold uppercase tracking-wider">Inicio</a>
          <a href="#servicios" className="text-brand-secondary hover:text-brand-gold transition-colors font-heading text-xs font-semibold uppercase tracking-wider">Tratamientos</a>
          <a href="#doctora" className="text-brand-secondary hover:text-brand-gold transition-colors font-heading text-xs font-semibold uppercase tracking-wider">La Doctora</a>
          <a href="#casos" className="text-brand-secondary hover:text-brand-gold transition-colors font-heading text-xs font-semibold uppercase tracking-wider">Casos</a>
          <a href="#contacto" className="text-brand-secondary hover:text-brand-gold transition-colors font-heading text-xs font-semibold uppercase tracking-wider">Contacto</a>
        </nav>

        {/* Right CTA and Social Icons - Visible on Mobile & Desktop */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3.5 border-r border-brand-gold/15 pr-2 sm:pr-4 text-[#C9A961]">
            {/* WhatsApp Icon */}
            <a href="https://wa.me/573114345328" target="_blank" rel="noopener noreferrer" className="hover:text-brand-glow hover:scale-110 transition-all p-1" title="WhatsApp">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.62.962 3.21 1.493 4.904 1.496 5.434.004 9.859-4.417 9.862-9.857.002-2.636-1.023-5.11-2.884-6.974C16.672 1.955 14.195.932 11.56.932c-5.443 0-9.87 4.42-9.873 9.861-.001 1.776.479 3.51 1.39 5.048l-.946 3.453 3.536-.93c1.558.847 3.11 1.29 4.39 1.29zM16.59 13.9c-.277-.14-1.643-.812-1.896-.905-.254-.094-.44-.14-.623.14-.184.278-.712.905-.873 1.09-.16.185-.32.207-.597.068-.277-.14-1.17-.43-2.228-1.374-.823-.734-1.38-1.64-1.54-1.92-.162-.276-.017-.426.12-.564.125-.124.277-.323.416-.484.14-.16.184-.277.277-.463.093-.185.047-.348-.024-.486-.07-.14-.622-1.5-.853-2.053-.225-.54-.452-.467-.622-.476-.16-.008-.344-.01-.528-.01-.184 0-.485.07-.738.348-.254.278-.97.948-.97 2.31 0 1.36.99 2.68 1.127 2.866.138.186 1.948 2.973 4.72 4.17 1.102.47 1.96.75 2.628.963.69.22 1.32.19 1.81.114.55-.085 1.643-.67 1.874-1.32.23-.65.23-1.205.162-1.32-.068-.113-.253-.185-.53-.325z" />
              </svg>
            </a>
            {/* Instagram Icon */}
            <a href="https://www.instagram.com/biodent_parquedebello/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-glow hover:scale-110 transition-all p-1" title="Instagram">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
            {/* Facebook Icon */}
            <a href="https://www.facebook.com/people/Dra-Claudia-Mabel-Tapias/61587872871889/" target="_blank" rel="noopener noreferrer" className="hover:text-brand-glow hover:scale-110 transition-all p-1" title="Facebook">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          </div>
          <a 
            href="https://wa.me/573114345328" 
            target="_blank"
            rel="noopener noreferrer"
            className="shimmer-btn relative overflow-hidden bg-transparent border border-brand-gold text-brand-gold px-3 sm:px-5 py-1.5 sm:py-2 rounded-full font-heading text-[10px] sm:text-xs font-semibold uppercase tracking-wider transition-all duration-300 hover:bg-brand-gold hover:text-brand-bg hover:shadow-[0_0_15px_rgba(201,169,97,0.3)] shrink-0"
          >
            Agendar Cita
          </a>
        </div>
      </header>

      {/* Hero Section with Responsive Mobile Doctor Backdrop */}
      <section id="inicio" className="relative min-h-screen flex flex-col justify-center items-start pt-28 pb-16 px-6 md:px-16 lg:px-24 z-10">
        
        {/* Doctor background image integration with object-top for mobile responsiveness */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex justify-end">
          <div className="w-full lg:w-4/5 h-full relative">
            <img 
              src={drClaudiaImg} 
              alt="Dra. Claudia Backdrop" 
              className="w-full h-full object-cover object-top lg:object-right opacity-75 sm:opacity-80" 
            />
            {/* Dark gradient overlay to preserve quiet luxury text contrast across all screen sizes */}
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/90 lg:via-[#0A0A0A]/60 to-transparent"></div>
          </div>
        </div>

        <div className="max-w-2xl text-left flex flex-col items-start relative z-10">
          
          {/* Logo with circular border - responsive scaling */}
          <div className="relative mb-6 select-none">
            <img 
              src={biodentLogoImg} 
              alt="BioDent Logo Oficial" 
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-brand-gold/40 shadow-2xl p-1 bg-black/60 object-contain" 
            />
          </div>

          {/* Doctor Signature */}
          <span className="font-script text-3xl md:text-5xl text-brand-gold tracking-wider mb-1 select-none">
            Dra. Claudia Mabel Tapias
          </span>
          
          {/* Brand Subtitle */}
          <span className="font-heading text-xs tracking-[0.3em] font-medium text-brand-secondary uppercase mb-5">
            — BIODENT —
          </span>

          {/* Tagline */}
          <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold tracking-wider text-brand-white uppercase leading-tight mb-6">
            Tu sonrisa,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-brand-glow to-brand-gold">nuestra especialidad</span>
          </h1>

          {/* Description banner (Heart icon) */}
          <div className="bg-brand-bg/90 backdrop-blur-sm border border-brand-gold/15 rounded-2xl p-4 mb-8 flex items-center gap-4 text-left shadow-lg max-w-lg">
            <div className="w-10 h-10 rounded-full border border-brand-gold/30 flex items-center justify-center text-brand-gold shrink-0 bg-black/30">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <p className="font-sans text-xs md:text-sm text-brand-white font-light leading-relaxed">
              Contamos con los mejores tipos de prótesis para devolverte <span className="text-brand-gold font-semibold">función, estética y confianza</span>.
            </p>
          </div>

          {/* CTA Buttons: WhatsApp, Instagram & Facebook links */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-stretch sm:items-center w-full">
            {/* WhatsApp Button */}
            <a 
              href={getWhatsAppLink("Hola Dra. Claudia, vi su publicación y me gustaría agendar una valoración para una prótesis dental.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 bg-brand-gold text-[#0A0A0A] px-6 py-3 rounded-full font-heading text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:bg-brand-glow hover:shadow-[0_0_20px_rgba(232,200,120,0.4)] group"
            >
              <svg className="w-4 h-4 fill-current transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.62.962 3.21 1.493 4.904 1.496 5.434.004 9.859-4.417 9.862-9.857.002-2.636-1.023-5.11-2.884-6.974C16.672 1.955 14.195.932 11.56.932c-5.443 0-9.87 4.42-9.873 9.861-.001 1.776.479 3.51 1.39 5.048l-.946 3.453 3.536-.93c1.558.847 3.11 1.29 4.39 1.29zM16.59 13.9c-.277-.14-1.643-.812-1.896-.905-.254-.094-.44-.14-.623.14-.184.278-.712.905-.873 1.09-.16.185-.32.207-.597.068-.277-.14-1.17-.43-2.228-1.374-.823-.734-1.38-1.64-1.54-1.92-.162-.276-.017-.426.12-.564.125-.124.277-.323.416-.484.14-.16.184-.277.277-.463.093-.185.047-.348-.024-.486-.07-.14-.622-1.5-.853-2.053-.225-.54-.452-.467-.622-.476-.16-.008-.344-.01-.528-.01-.184 0-.485.07-.738.348-.254.278-.97.948-.97 2.31 0 1.36.99 2.68 1.127 2.866.138.186 1.948 2.973 4.72 4.17 1.102.47 1.96.75 2.628.963.69.22 1.32.19 1.81.114.55-.085 1.643-.67 1.874-1.32.23-.65.23-1.205.162-1.32-.068-.113-.253-.185-.53-.325z" />
              </svg>
              WhatsApp de la Clínica
            </a>

            {/* Instagram Button */}
            <a 
              href="https://www.instagram.com/biodent_parquedebello/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 bg-black/60 border border-brand-gold/40 text-brand-white px-5 py-3 rounded-full font-heading text-xs font-semibold uppercase tracking-wider hover:border-brand-gold hover:text-brand-gold transition-all duration-300 group"
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
              className="flex items-center justify-center gap-2.5 bg-black/60 border border-brand-gold/40 text-brand-white px-5 py-3 rounded-full font-heading text-xs font-semibold uppercase tracking-wider hover:border-brand-gold hover:text-brand-gold transition-all duration-300 group"
            >
              <svg className="w-4 h-4 fill-current text-[#C9A961] transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook de la Clínica
            </a>
          </div>

        </div>
      </section>

      {/* Intermediary Section: Four Pillars with Consultorio Background Cover */}
      <section className="relative py-20 px-6 md:px-12 z-10 overflow-hidden text-center">
        {/* Background office image with semi-transparent dark overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={dentalOfficeImg} 
            alt="BioDent Office Backdrop" 
            className="w-full h-full object-cover filter brightness-[0.4]" 
          />
          <div className="absolute inset-0 bg-[#0A0A0A]/75"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {/* Pillar 1 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border border-brand-gold/40 flex items-center justify-center text-brand-gold mb-4 bg-brand-bg/60 shadow-lg">
                <svg className="w-7 h-7 fill-none stroke-current stroke-[1.5]" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="font-heading text-xs font-bold text-brand-white tracking-widest uppercase mb-1">Calidad</span>
              <span className="font-heading text-[10px] text-brand-gold tracking-widest uppercase">Premium</span>
            </div>

            {/* Pillar 2 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border border-brand-gold/40 flex items-center justify-center text-brand-gold mb-4 bg-brand-bg/60 shadow-lg">
                <svg className="w-7 h-7 fill-none stroke-current stroke-[1.5]" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4c2.5 0 4 1.5 4 4s-.5 4-1 6.5S14 20 12 20s-3-3.5-3-5.5.5-4-1-6.5 1.5-4 4-4z" />
                </svg>
              </div>
              <span className="font-heading text-xs font-bold text-brand-white tracking-widest uppercase mb-1">Soluciones</span>
              <span className="font-heading text-[10px] text-brand-gold tracking-widest uppercase">Personalizadas</span>
            </div>

            {/* Pillar 3 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border border-brand-gold/40 flex items-center justify-center text-brand-gold mb-4 bg-brand-bg/60 shadow-lg">
                <svg className="w-7 h-7 fill-none stroke-current stroke-[1.5]" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="font-heading text-xs font-bold text-brand-white tracking-widest uppercase mb-1">Resultados</span>
              <span className="font-heading text-[10px] text-brand-gold tracking-widest uppercase">Naturales</span>
            </div>

            {/* Pillar 4 */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border border-brand-gold/40 flex items-center justify-center text-brand-gold mb-4 bg-brand-bg/60 shadow-lg">
                <svg className="w-7 h-7 fill-none stroke-current stroke-[1.5]" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.857L13 21.714 10.714 14.857 5 12l5.714-2.857L13 2.286z" />
                </svg>
              </div>
              <span className="font-heading text-xs font-bold text-brand-white tracking-widest uppercase mb-1">Tecnología</span>
              <span className="font-heading text-[10px] text-brand-gold tracking-widest uppercase">De Vanguardia</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Showcase Section */}
      <section id="servicios" className="relative py-28 px-6 md:px-12 z-10 max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="mb-24 text-center">
          <span className="font-heading text-xs font-bold tracking-[0.25em] text-brand-gold uppercase block mb-3">
            Nuestros Tratamientos
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-wider text-brand-white uppercase">
            Especialistas en Prótesis
          </h2>
          <div className="h-[1px] w-20 bg-brand-gold mt-4 mx-auto"></div>
        </div>

        {/* Services Showcase Cards */}
        <div className="space-y-28">

          {/* Treatment 1: Prótesis Flexible */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Image Box */}
            <div className="col-span-1 lg:col-span-6 flex justify-center order-1 lg:order-2">
              <div className="relative p-2 rounded-2xl border border-brand-gold/20 shadow-2xl w-full max-w-md bg-black/40 group overflow-hidden">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-brand-gold rounded-tl-lg z-10"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-brand-gold rounded-br-lg z-10"></div>
                <img 
                  src={flexibleProsthesisImg} 
                  alt="Prótesis Flexible BioDent" 
                  className="rounded-xl w-full aspect-square object-cover filter contrast-[1.03] group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-bg/80 via-transparent to-transparent opacity-50"></div>
              </div>
            </div>
            {/* Description Box */}
            <div className="col-span-1 lg:col-span-6 order-2 lg:order-1">
              <span className="font-heading text-[10px] font-bold tracking-[0.25em] text-brand-gold uppercase block mb-2">
                Rehabilitación Removible
              </span>
              <h3 className="font-heading text-3xl md:text-4xl font-bold tracking-wide text-brand-white uppercase mb-6">
                Prótesis Flexible
              </h3>
              <p className="font-sans text-sm md:text-base text-brand-secondary font-light leading-relaxed mb-8">
                Prótesis removible elaborada en materiales <span className="text-brand-white font-medium">flexibles y estéticos</span>, que se adapta cómodamente a tu boca y se integra de forma natural. Su base altamente translúcida permite que el color natural de la encía se trasluzca, logrando una estética imperceptible.
              </p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full border border-brand-gold/30 flex items-center justify-center text-brand-gold shrink-0 bg-black/30">
                    <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                  <span className="font-heading text-xs font-bold tracking-wider text-brand-white uppercase">LIVIANA Y FLEXIBLE</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full border border-brand-gold/30 flex items-center justify-center text-brand-gold shrink-0 bg-black/30">
                    <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="font-heading text-xs font-bold tracking-wider text-brand-white uppercase">ESTÉTICA Y DISCRETA</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full border border-brand-gold/30 flex items-center justify-center text-brand-gold shrink-0 bg-black/30">
                    <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <span className="font-heading text-xs font-bold tracking-wider text-brand-white uppercase">CÓMODA Y RESISTENTE</span>
                </li>
              </ul>
              
              <div className="border-t border-brand-gold/10 pt-4 flex justify-between items-center">
                <span className="font-heading text-[10px] tracking-widest text-brand-gold uppercase">COMODIDAD, ESTÉTICA Y CONFIANZA</span>
                <a 
                  href={getWhatsAppLink("Hola Dra. Claudia, deseo agendar una valoración para una Prótesis Flexible.")} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-heading text-xs font-bold uppercase tracking-wider text-brand-white hover:text-brand-gold transition-colors flex items-center gap-1.5"
                >
                  Agendar valoración &rarr;
                </a>
              </div>
            </div>
          </div>

          {/* Treatment 2: Prótesis Total */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Image Box */}
            <div className="col-span-1 lg:col-span-6 flex justify-center">
              <div className="relative p-2 rounded-2xl border border-brand-gold/20 shadow-2xl w-full max-w-md bg-black/40 group overflow-hidden">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-brand-gold rounded-tl-lg z-10"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-brand-gold rounded-br-lg z-10"></div>
                <img 
                  src={totalProsthesisImg} 
                  alt="Prótesis Total BioDent" 
                  className="rounded-xl w-full aspect-square object-cover filter contrast-[1.03] group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-bg/80 via-transparent to-transparent opacity-50"></div>
              </div>
            </div>
            {/* Description Box */}
            <div className="col-span-1 lg:col-span-6">
              <span className="font-heading text-[10px] font-bold tracking-[0.25em] text-brand-gold uppercase block mb-2">
                Rehabilitación Completa
              </span>
              <h3 className="font-heading text-3xl md:text-4xl font-bold tracking-wide text-brand-white uppercase mb-6">
                Prótesis Total
              </h3>
              <p className="font-sans text-sm md:text-base text-brand-secondary font-light leading-relaxed mb-8">
                Solución completa para reemplazar todos los dientes y <span className="text-brand-white font-medium">devolver función, estética y confianza</span>. Elaboradas con materiales acrílicos caracterizados de alta densidad para soportar de manera óptima las fuerzas de masticación y restaurar las facciones naturales del rostro.
              </p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full border border-brand-gold/30 flex items-center justify-center text-brand-gold shrink-0 bg-black/30">
                    <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4c2.5 0 4 1.5 4 4s-.5 4-1 6.5S14 20 12 20s-3-3.5-3-5.5.5-4-1-6.5 1.5-4 4-4z" />
                    </svg>
                  </div>
                  <span className="font-heading text-xs font-bold tracking-wider text-brand-white uppercase">RESTAURA LA FUNCIÓN MASTICATORIA</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full border border-brand-gold/30 flex items-center justify-center text-brand-gold shrink-0 bg-black/30">
                    <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="font-heading text-xs font-bold tracking-wider text-brand-white uppercase">MEJORA LA ESTÉTICA FACIAL</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full border border-brand-gold/30 flex items-center justify-center text-brand-gold shrink-0 bg-black/30">
                    <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.857L13 21.714 10.714 14.857 5 12l5.714-2.857L13 2.286z" />
                    </svg>
                  </div>
                  <span className="font-heading text-xs font-bold tracking-wider text-brand-white uppercase">MÁS COMODIDAD Y CONFIANZA</span>
                </li>
              </ul>
              
              <div className="border-t border-brand-gold/10 pt-4 flex justify-between items-center">
                <span className="font-heading text-[10px] tracking-widest text-brand-gold uppercase">TU SONRISA, NUESTRA PASIÓN</span>
                <a 
                  href={getWhatsAppLink("Hola Dra. Claudia, deseo agendar una valoración para una Prótesis Total.")} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-heading text-xs font-bold uppercase tracking-wider text-brand-white hover:text-brand-gold transition-colors flex items-center gap-1.5"
                >
                  Agendar valoración &rarr;
                </a>
              </div>
            </div>
          </div>

          {/* Treatment 3: Prótesis Acker */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Image Box */}
            <div className="col-span-1 lg:col-span-6 flex justify-center order-1 lg:order-2">
              <div className="relative p-2 rounded-2xl border border-brand-gold/20 shadow-2xl w-full max-w-md bg-black/40 group overflow-hidden">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-brand-gold rounded-tl-lg z-10"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-brand-gold rounded-br-lg z-10"></div>
                <img 
                  src={ackerProsthesisImg} 
                  alt="Prótesis Acker BioDent" 
                  className="rounded-xl w-full aspect-square object-cover filter contrast-[1.03] group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-bg/80 via-transparent to-transparent opacity-50"></div>
              </div>
            </div>
            {/* Description Box */}
            <div className="col-span-1 lg:col-span-6 order-2 lg:order-1">
              <span className="font-heading text-[10px] font-bold tracking-[0.25em] text-brand-gold uppercase block mb-2">
                Rehabilitación Parcial
              </span>
              <h3 className="font-heading text-3xl md:text-4xl font-bold tracking-wide text-brand-white uppercase mb-6">
                Prótesis Acker
              </h3>
              <p className="font-sans text-sm md:text-base text-brand-secondary font-light leading-relaxed mb-8">
                Prótesis removible parcial <span className="text-brand-white font-medium">flexible y estética</span>, que se adapta cómodamente y reemplaza dientes faltantes de manera discreta. Sujeción firme que utiliza la anatomía de los dientes remanentes para un anclaje seguro y cómodo.
              </p>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full border border-brand-gold/30 flex items-center justify-center text-brand-gold shrink-0 bg-black/30">
                    <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </div>
                  <span className="font-heading text-xs font-bold tracking-wider text-brand-white uppercase">LIGERA Y FLEXIBLE</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full border border-brand-gold/30 flex items-center justify-center text-brand-gold shrink-0 bg-black/30">
                    <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="font-heading text-xs font-bold tracking-wider text-brand-white uppercase">ESTÉTICA Y DISCRETA</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full border border-brand-gold/30 flex items-center justify-center text-brand-gold shrink-0 bg-black/30">
                    <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <span className="font-heading text-xs font-bold tracking-wider text-brand-white uppercase">CÓMODA Y RESISTENTE</span>
                </li>
              </ul>
              
              <div className="border-t border-brand-gold/10 pt-4 flex justify-between items-center">
                <span className="font-heading text-[10px] tracking-widest text-brand-gold uppercase">COMODIDAD, ESTÉTICA Y CONFIANZA</span>
                <a 
                  href={getWhatsAppLink("Hola Dra. Claudia, deseo agendar una valoración para una Prótesis Acker.")} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="font-heading text-xs font-bold uppercase tracking-wider text-brand-white hover:text-brand-gold transition-colors flex items-center gap-1.5"
                >
                  Agendar valoración &rarr;
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Center Sub-banner matching post style */}
        <div className="mt-28 text-center select-none">
          <span className="font-script text-4xl md:text-5xl text-brand-gold block mb-2">
            Cuidamos tu sonrisa,
          </span>
          <span className="font-heading text-2xl md:text-3xl font-bold tracking-widest text-brand-white uppercase">
            transformamos tu vida.
          </span>
        </div>
      </section>

      {/* Doctor Bio Section */}
      <section id="doctora" className="relative py-28 px-6 md:px-12 z-10 max-w-6xl mx-auto bg-radial-corner-glow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Doctor Portrait Image Left */}
          <div className="col-span-1 lg:col-span-5 flex justify-center">
            <div className="relative p-2 rounded-2xl border border-brand-gold/20 shadow-2xl max-w-sm group">
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-brand-gold rounded-tl-lg"></div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-brand-gold rounded-br-lg"></div>
              
              <img 
                src={drClaudiaImg} 
                alt="Dra. Claudia Mabel Tapias" 
                className="rounded-xl w-full object-cover filter contrast-[1.05]" 
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-brand-bg via-transparent to-transparent opacity-45"></div>
            </div>
          </div>

          {/* Narrative Content Right */}
          <div className="col-span-1 lg:col-span-7">
            <span className="font-heading text-xs font-bold tracking-[0.25em] text-brand-gold uppercase block mb-3">
              Dirección Médica
            </span>
            <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-wider text-brand-white uppercase mb-2">
              Dra. Claudia Mabel Tapias
            </h2>
            <span className="font-serif-italic text-lg md:text-xl text-brand-gold block mb-6">
              Especialista en Rehabilitación Oral y Prótesis
            </span>
            
            <div className="h-[1px] w-20 bg-brand-gold mb-8"></div>
            
            <div className="space-y-6 text-brand-secondary font-light leading-relaxed text-sm md:text-base">
              <p>
                Con más de 15 años de trayectoria profesional en odontología estética y restaurativa, la Dra. Claudia se ha especializado en devolver sonrisas con un enfoque de <strong>"lujo silencioso"</strong>. Su visión se opone al estándar de prótesis artificialmente perfectas que gritan su presencia; en su lugar, busca crear piezas que se fundan invisiblemente con la fisonomía única de cada paciente.
              </p>
              <p>
                Cada paciente es tratado como un lienzo único. Desde el análisis biométrico digital de la sonrisa hasta la selección minuciosa del color y la textura de la cerámica, la Dra. Claudia supervisa de manera artesanal cada paso del laboratorio para garantizar que el resultado final posea la calidez y las sutiles imperfecciones de los dientes naturales.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 pt-8 border-t border-brand-gold/10">
              <div>
                <span className="font-heading text-xl md:text-2xl font-bold text-brand-white block mb-1">15+</span>
                <span className="font-heading text-[10px] tracking-wider text-brand-secondary uppercase font-semibold">Años de Trayectoria</span>
              </div>
              <div>
                <span className="font-heading text-xl md:text-2xl font-bold text-brand-white block mb-1">2,000+</span>
                <span className="font-heading text-[10px] tracking-wider text-brand-secondary uppercase font-semibold">Sonrisas Diseñadas</span>
              </div>
              <div>
                <span className="font-heading text-xl md:text-2xl font-bold text-brand-white block mb-1">100%</span>
                <span className="font-heading text-[10px] tracking-wider text-brand-secondary uppercase font-semibold">Biocompatibilidad</span>
              </div>
            </div>

            <div className="mt-8 select-none">
              <span className="font-script text-3xl text-brand-gold block">
                Claudia Mabel Tapias
              </span>
              <span className="text-[10px] tracking-[0.2em] font-heading font-medium text-brand-secondary uppercase">
                Firma Autorizada
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* Before / After Static Section (No drag handle slider) */}
      <section id="casos" className="relative py-28 px-6 md:px-12 z-10 max-w-5xl mx-auto text-center">
        
        {/* Section Title */}
        <div className="mb-16">
          <span className="font-heading text-xs font-bold tracking-[0.25em] text-brand-gold uppercase block mb-3">
            Resultados Clínicos
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-wider text-brand-white uppercase mb-4">
            Transformaciones Invisibles
          </h2>
          <p className="font-sans text-sm md:text-base text-brand-secondary max-w-xl mx-auto font-light leading-relaxed">
            Consulte la integración natural de nuestras prótesis. Un cambio estético absoluto y clínicamente perfecto, respetando la armonía facial de cada paciente.
          </p>
          <div className="h-[1px] w-20 bg-brand-gold mt-6 mx-auto"></div>
        </div>

        {/* Single Split Image Showcase */}
        <div className="relative max-w-3xl mx-auto rounded-2xl overflow-hidden border border-brand-gold/30 shadow-2xl bg-black/40 group">
          {/* Badge Left (Before) */}
          <div className="absolute top-4 left-4 z-20 bg-[#0A0A0A]/90 border border-brand-gold/30 text-brand-gold font-heading text-[10px] sm:text-xs tracking-widest uppercase font-bold py-1.5 px-4 rounded-full shadow-lg backdrop-blur-sm">
            Estado Inicial (Antes)
          </div>

          {/* Badge Right (After) */}
          <div className="absolute top-4 right-4 z-20 bg-brand-gold text-[#0A0A0A] font-heading text-[10px] sm:text-xs tracking-widest uppercase font-bold py-1.5 px-4 rounded-full shadow-lg">
            Resultado Final (Después)
          </div>

          {/* Single Image displaying both Before (left) and After (right) */}
          <img 
            src={beautifulSmileImg} 
            alt="Caso Clínico Antes y Después BioDent" 
            className="w-full h-auto object-cover rounded-xl filter contrast-[1.03]" 
          />
        </div>
      </section>

      {/* Testimonials Section (Wood Wall background cover with overlay) */}
      <section className="relative py-28 px-6 md:px-12 z-10 overflow-hidden">
        {/* Wooden office background cover */}
        <div className="absolute inset-0 z-0">
          <img 
            src={dentalOfficeImg} 
            alt="Office Backdrop Testimonials" 
            className="w-full h-full object-cover filter brightness-[0.3]" 
          />
          <div className="absolute inset-0 bg-[#0A0A0A]/75"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <span className="font-heading text-xs font-bold tracking-[0.25em] text-brand-gold uppercase block mb-3">
              Opiniones
            </span>
            <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-wider text-brand-white uppercase mb-2">
              La voz de nuestros pacientes
            </h2>
            <div className="h-[1px] w-20 bg-brand-gold mt-4 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Card 1 */}
            <div className="lg:col-span-4 bg-[#0A0A0A]/90 backdrop-blur-sm gold-glow-border rounded-xl p-8 flex flex-col justify-between lg:translate-y-4 shadow-xl">
              <div className="mb-8">
                <span className="font-heading text-5xl text-brand-gold/20 block mb-2 leading-none">“</span>
                <p className="font-sans text-sm md:text-base text-brand-secondary font-light leading-relaxed italic">
                  "la verdad quede muy contenta, no pensé que me fuera a adaptar tan rapido. Siento la prótesis super liviana y no se nota nada."
                </p>
              </div>
              <div>
                <div className="h-[1px] bg-brand-gold/10 w-full mb-4"></div>
                <span className="font-heading text-xs font-bold tracking-wider uppercase text-brand-white block">Mariana Gutiérrez</span>
                <span className="text-[10px] tracking-wider text-brand-secondary uppercase block">Paciente de Prótesis Flexible</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="lg:col-span-4 bg-[#0A0A0A]/95 backdrop-blur-sm gold-glow-border rounded-xl p-8 md:p-10 flex flex-col justify-between border-brand-gold/30 shadow-[0_0_20px_rgba(201,169,97,0.05)]">
              <div className="mb-8">
                <span className="font-heading text-5xl text-brand-gold/30 block mb-2 leading-none">“</span>
                <p className="font-sans text-base text-brand-white font-light leading-relaxed italic">
                  "el resultado fue mejor de lo que esperaba, la corona de zirconio se ve demasiado natural. la atencion de la doctora y la precision fue de otro nivel."
                </p>
              </div>
              <div>
                <div className="h-[1px] bg-brand-gold/15 w-full mb-4"></div>
                <span className="font-heading text-sm font-bold tracking-wider uppercase text-brand-gold block">Dr. Carlos Restrepo</span>
                <span className="text-[10px] tracking-wider text-brand-secondary uppercase block">Paciente de Prótesis Fija</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="lg:col-span-4 bg-[#0A0A0A]/90 backdrop-blur-sm gold-glow-border rounded-xl p-8 flex flex-col justify-between lg:-translate-y-4 shadow-xl">
              <div className="mb-8">
                <span className="font-heading text-5xl text-brand-gold/20 block mb-2 leading-none">“</span>
                <p className="font-sans text-sm md:text-base text-brand-secondary font-light leading-relaxed italic">
                  "después de tantas vueltas en otros lados, aqui encontre la solucion. la protesis quedo muy firme y ahora puedo comer sin ningun miedo, muy recomendada la doctora claudia."
                </p>
              </div>
              <div>
                <div className="h-[1px] bg-brand-gold/10 w-full mb-4"></div>
                <span className="font-heading text-xs font-bold tracking-wider uppercase text-brand-white block">Helena de Samper</span>
                <span className="text-[10px] tracking-wider text-brand-secondary uppercase block">Paciente de Prótesis sobre Implantes</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Appointment and Location Section */}
      <section id="contacto" className="relative py-28 px-6 md:px-12 z-10 max-w-5xl mx-auto">
        <div className="bg-[#0A0A0A] border border-brand-gold/25 rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2 shadow-2xl">
          
          {/* Info Side */}
          <div className="p-8 md:p-12 flex flex-col justify-between gap-8">
            <div>
              <span className="font-heading text-xs font-bold tracking-[0.25em] text-brand-gold uppercase block mb-3">
                Contacto Directo
              </span>
              <h2 className="font-heading text-2xl md:text-3xl font-bold tracking-wider text-brand-white uppercase mb-4">
                ¿Listo para transformar tu sonrisa?
              </h2>
              <p className="font-sans text-sm text-brand-secondary leading-relaxed font-light mb-8">
                Escríbenos directamente y cuéntanos tu caso. Estaremos encantados de asesorarte y agendar una valoración personalizada con la Dra. Claudia.
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
                    <p className="font-sans text-xs text-brand-secondary font-light">
                      Cerca al Parque Principal de Bello, Antioquia
                    </p>
                  </div>
                </div>

                {/* Schedule */}
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <span className="font-heading text-[10px] font-bold tracking-wider text-brand-white uppercase block">Horario de Atención</span>
                    <p className="font-sans text-xs text-brand-secondary font-light">
                      Lunes a Viernes: 9:00 AM – 6:00 PM<br />Sábados: 9:00 AM – 1:00 PM
                    </p>
                  </div>
                </div>

                {/* WhatsApp numbers */}
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div>
                    <span className="font-heading text-[10px] font-bold tracking-wider text-brand-white uppercase block">Líneas de Atención</span>
                    <p className="font-sans text-xs text-brand-secondary font-light">
                      WhatsApp Principal: +57 311 434 5328<br />
                      WhatsApp Consulta: +57 314 809 1585
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Call-to-action */}
            <a 
              href="https://wa.me/573114345328"
              target="_blank"
              rel="noopener noreferrer"
              className="shimmer-btn relative overflow-hidden w-full text-center bg-brand-gold text-[#0A0A0A] py-3.5 rounded-xl font-heading text-xs font-bold uppercase tracking-widest hover:bg-brand-glow hover:shadow-[0_0_15px_rgba(232,200,120,0.3)] transition-all mt-4"
            >
              Escríbenos por WhatsApp
            </a>
          </div>

          {/* Map / Cover image Side */}
          <div className="relative min-h-[300px]">
            <img 
              src={dentalOfficeImg} 
              alt="Consultorio BioDent" 
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

      {/* Floating Chatbot Widget */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        
        {/* Automatic CTA Tooltip Bubble (Every 10 seconds) - Clicking sends the question! */}
        {showCta && !isChatOpen && (
          <div 
            onClick={() => handleCtaClick(ctas[currentCtaIndex])}
            className="mb-3 bg-[#16140F] border border-[#C9A961] text-white rounded-2xl py-3 px-4 shadow-[0_8px_30px_rgba(201,169,97,0.35),0_0_20px_rgba(0,0,0,0.9)] cursor-pointer flex items-center gap-2.5 max-w-[300px] animate-fade-in transition-all duration-300 hover:scale-105 hover:border-brand-glow group select-none relative z-10"
          >
            <span className="text-xs font-semibold leading-snug text-brand-white group-hover:text-brand-gold transition-colors">
              {ctas[currentCtaIndex]}
            </span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowCta(false);
              }}
              className="text-brand-secondary hover:text-white text-base font-bold ml-1 p-0.5 shrink-0"
              aria-label="Cerrar aviso"
            >
              &times;
            </button>
          </div>
        )}

        {/* Chat window panel - LIGHT CREAM THEME */}
        {isChatOpen && (
          <div className="w-[calc(100vw-2rem)] max-w-[360px] h-[480px] max-h-[75vh] bg-[#FAF7F2] border border-[#C9A961]/60 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.4),0_0_25px_rgba(201,169,97,0.2)] flex flex-col overflow-hidden mb-4 relative z-50 animate-fade-in">
            
            {/* Header - Dark gold strip */}
            <div className="bg-gradient-to-r from-[#1A1814] to-[#2A2520] border-b border-[#C9A961]/40 p-3.5 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <img src={biodentLogoImg} alt="BioDent Mini Logo" className="w-7 h-7 rounded-full border border-brand-gold/40 object-contain bg-white/10" />
                <div>
                  <h4 className="font-heading text-xs font-bold text-white tracking-widest uppercase">Atención BioDent</h4>
                  <span className="text-[9px] text-emerald-400 tracking-wider uppercase font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    En línea
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={clearChatHistory}
                  className="text-gray-400 hover:text-red-400 text-xs transition-colors p-1.5 rounded-lg border border-transparent hover:border-red-400/20"
                  title="Nueva conversación / Limpiar historial"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                  </svg>
                </button>
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="text-gray-400 hover:text-white text-lg transition-colors p-1"
                  aria-label="Cerrar asistente"
                >
                  &times;
                </button>
              </div>
            </div>

            {/* Messages Body - LIGHT CREAM */}
            <div className="flex-grow p-4 overflow-y-auto space-y-3.5 scrollbar-thin scrollbar-thumb-[#C9A961]/30 scrollbar-track-transparent bg-[#FAF7F2]">
              {chatMessages.map((m, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                      m.role === 'user' 
                        ? 'bg-gradient-to-r from-[#C9A961] to-[#E8C878] text-[#1A1A1A] font-semibold rounded-tr-none shadow-md' 
                        : 'bg-white text-[#2A2520] rounded-tl-none border border-[#C9A961]/25 shadow-sm'
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
                      renderMessageContent(m.content, m.role)
                    ) : (m.role === 'assistant' && isChatLoading && idx === chatMessages.length - 1 ? (
                      <span className="animate-pulse text-[#C9A961] font-medium">Escribiendo...</span>
                    ) : '')}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input Footer - Light */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-[#C9A961]/25 bg-[#F0EDE6] flex flex-col gap-2">
              
              {/* Selected Image Thumbnail Preview */}
              {selectedImage && (
                <div className="relative inline-block self-start mb-1">
                  <img src={selectedImage} alt="Vista previa dental" className="w-14 h-14 object-cover rounded-lg border border-brand-gold/50" />
                  <button
                    type="button"
                    onClick={removeSelectedImage}
                    className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold hover:bg-red-700"
                    title="Quitar foto"
                  >
                    &times;
                  </button>
                </div>
              )}

              <div className="flex gap-2 items-center">
                {/* File input for photos */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/*" 
                  onChange={handleImageSelect} 
                  className="hidden" 
                />
                
                {/* Attachment Clip Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isChatLoading}
                  className={`w-9 h-9 rounded-xl bg-white border ${selectedImage ? 'border-[#C9A961] text-[#C9A961]' : 'border-[#D5CFC4] text-[#8A8577]'} flex items-center justify-center shrink-0 hover:text-[#C9A961] hover:border-[#C9A961] disabled:opacity-50 transition-colors`}
                  title="Adjuntar foto de mis dientes"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z" />
                  </svg>
                </button>

                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={selectedImage ? "Pregunta algo sobre la foto..." : "Escribe tu mensaje aquí..."}
                  disabled={isChatLoading}
                  className="flex-grow bg-white border border-[#D5CFC4] rounded-xl px-3.5 py-2 text-xs text-[#2A2520] placeholder-[#8A8577] focus:outline-none focus:border-[#C9A961] disabled:opacity-50 transition-colors"
                />
                <button 
                  type="submit"
                  disabled={isChatLoading || (!chatInput.trim() && !selectedImage)}
                  className="w-9 h-9 rounded-xl bg-gradient-to-r from-[#C9A961] to-[#E8C878] text-[#1A1A1A] flex items-center justify-center shrink-0 hover:shadow-lg disabled:opacity-50 transition-all font-bold shadow-md"
                  aria-label="Enviar mensaje"
                >
                  <svg className="w-4 h-4 fill-current transform rotate-45" viewBox="0 0 24 24">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </button>
              </div>
            </form>

          </div>
        )}

        {/* HIGH VISIBILITY Floating Custom Tooth Button */}
        <div className="relative flex items-center gap-3">
          
          {/* Permanent Floating Gold Label when chat is closed and popups are not active */}
          {!isChatOpen && !showCta && (
            <button
              onClick={() => setIsChatOpen(true)}
              className="bg-[#16140F] border border-[#C9A961] text-brand-gold px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-[0_4px_15px_rgba(201,169,97,0.3)] hover:scale-105 transition-all flex items-center gap-1.5 cursor-pointer animate-fade-in"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>¿Dudas con tus dientes?</span>
            </button>
          )}

          {/* Button Container with Radar Ripple Effect */}
          <div className="relative">
            {/* Outer Glowing Golden Radar Rings */}
            {!isChatOpen && (
              <>
                <div className="absolute inset-0 rounded-full border-2 border-brand-gold opacity-75 animate-radar-ripple pointer-events-none"></div>
                <div className="absolute inset-0 rounded-full bg-brand-gold/25 blur-md animate-pulse pointer-events-none"></div>
              </>
            )}

            {/* Notification Badge */}
            {!isChatOpen && (
              <span className="absolute -top-1 -right-1 z-20 w-5 h-5 bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-[10px] font-black rounded-full flex items-center justify-center shadow-lg border border-black animate-bounce">
                1
              </span>
            )}

            <button 
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="w-[62px] h-[62px] rounded-full bg-[#0A0A0A] border-2 border-[#C9A961] flex items-center justify-center shadow-[0_0_25px_rgba(201,169,97,0.55)] hover:shadow-[0_0_35px_rgba(201,169,97,0.9)] hover:scale-110 active:scale-95 transition-all duration-300 group shrink-0 relative z-10 cursor-pointer"
              aria-label="Abrir asistente de chat"
            >
              {/* Custom SVG: Tooth in gold + Robot face */}
              <svg className="w-9 h-9 text-[#C9A961] transition-transform group-hover:rotate-12" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Tooth Outline */}
                <path d="M16 4.5C11.5 4.5 8 7 8 11.5C8 15.5 9.5 19.5 11.5 24.5C12.3 26.5 13.5 28 14.5 28C15.3 28 15.6 26.5 16 25C16.4 26.5 16.7 28 17.5 28C18.5 28 19.7 26.5 20.5 24.5C22.5 19.5 24 15.5 24 11.5C24 7 20.5 4.5 16 4.5Z" 
                      stroke="#C9A961" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                
                {/* Antenna */}
                <line x1="16" y1="7" x2="16" y2="9.5" stroke="#C9A961" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="16" cy="6.2" r="1.1" fill="#C9A961" />
                
                {/* Robot Head Box */}
                <rect x="11.5" y="9.5" width="9" height="7" rx="1.5" stroke="#C9A961" strokeWidth="1.5" fill="#0A0A0A" />
                
                {/* Square Eyes */}
                <rect x="13.2" y="11.8" width="1.8" height="1.8" fill="#C9A961" rx="0.3" />
                <rect x="17" y="11.8" width="1.8" height="1.8" fill="#C9A961" rx="0.3" />
                
                {/* Robot Mouth */}
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
