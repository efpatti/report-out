"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
 X,
 ChevronLeft,
 ChevronRight,
 TrendingUp,
 Zap,
 Target,
 Award,
 CheckCircle2,
 Bike,
 Activity,
 BarChart3,
 Timer,
} from "lucide-react";
import Image from "next/image";

// --- TIPOS E INTERFACES ---
interface BulletPoint {
 text: string;
 subpoints?: string[];
 highlight?: boolean;
}

interface Slide {
 id: number;
 title: string;
 subtitle?: string;
 bullets?: BulletPoint[];
 highlight?: string;
 type: "cover" | "content" | "split" | "impact";
 duration: string;
 icon?: React.ElementType;
}

// Interface para as props do componente de visualização
interface PresentationViewProps {
 slide: Slide;
 total: number;
 current: number;
 onNext: () => void;
 onPrev: () => void;
 onExit: () => void;
}

// --- DADOS DA APRESENTAÇÃO (Narrativa Mottu) ---
const slides: Slide[] = [
 {
  id: 0,
  title: "Enzo Ferracini",
  subtitle: "FIELD SERVICES | REPORT OUT",
  highlight: "Julho - Dezembro 2025",
  type: "cover",
  duration: "0:30",
 },
 {
  id: 1,
  title: "Missão & Cultura",
  subtitle: "Empoderar quem nos move",
  icon: Bike,
  bullets: [
   { text: "Democratizar a geração de renda.", highlight: false },
   {
    text: "Meritocracia Radical: Quem entrega mais, ganha mais.",
    highlight: true,
   },
   {
    text: "Ambiente de alta performance e 'mão na graxa'.",
    highlight: false,
   },
   { text: "Foco obsessivo no cliente (O Entregador).", highlight: true },
  ],
  type: "content",
  duration: "0:45",
 },
 {
  id: 2,
  title: "O Problema",
  subtitle: "Falta de Clareza = Desconfiança",
  icon: Target,
  type: "split",
  bullets: [
   {
    text: "Bonificação 'Caixa Preta'",
    subpoints: [
     "Cálculo obscuro gerava tickets.",
     "O entregador não sabia como atingir a meta.",
    ],
   },
   {
    text: "Ineficiência Operacional",
    subpoints: [
     "Time de campo perdia 12h/quinzena explicando regras.",
     "Foco no problema, não na execução.",
    ],
   },
   { text: "Dor latente: Sentimento de injustiça na ponta.", highlight: true },
  ],
  duration: "1:15",
 },
 {
  id: 3,
  title: "A Virada",
  subtitle: "Inteligência & Automação",
  icon: Zap,
  type: "content",
  bullets: [
   {
    text: "Novo Motor de Cálculo (Pontos)",
    subpoints: [
     "Lógica simples: Mais entregas + Qualidade = Mais Dinheiro.",
     "Boost Domingo (25%) e Bônus Agilidade.",
    ],
   },
   {
    text: "Transparência Radical",
    subpoints: [
     "Extrato diário automatizado no e-mail.",
     "Visão clara de cada centavo (bônus e descontos).",
    ],
   },
   {
    text: "Solução escalável: Do zero ao 100% automatizado.",
    highlight: true,
   },
  ],
  duration: "1:15",
 },
 {
  id: 4,
  title: "Cultura de Dono",
  subtitle: "Meritocracia na Veia",
  icon: Award,
  type: "split",
  bullets: [
   {
    text: "Antes: Meta da filial travava o ganho individual.",
    highlight: false,
   },
   { text: "Agora: Fez 30+ pontos? O bônus é seu.", highlight: true },
   { text: "Resultado: Retenção dos top performers.", highlight: false },
   { text: "Quem tem cabeça de dono não depende da sorte.", highlight: true },
  ],
  duration: "1:05",
 },
 {
  id: 5,
  title: "Gamificação",
  subtitle: "Elevando a Barra",
  icon: TrendingUp,
  type: "content",
  bullets: [
   {
    text: "Ranking de Performance",
    subpoints: [
     "Visibilidade total para quem carrega o piano.",
     "Competição saudável entre bases.",
    ],
   },
   {
    text: "Premiação Desejável",
    subpoints: [
     "Capacete Spike (Mensal) & Jaquetas Mottu (Trimestral).",
     "R$ 7.270/ano investidos em reconhecimento direto.",
    ],
   },
   {
    text: "Roadmap: Metas e Extrato em tempo real no App.",
    highlight: true,
   },
  ],
  duration: "1:05",
 },
 {
  id: 6,
  title: "IMPACTO",
  subtitle: "Contra dados não há argumentos",
  type: "impact",
  bullets: [
   { text: "ZERO erro manual (Processo 100% Automatizado)", highlight: true },
   { text: "Economia de 20h+/mês do time de campo", highlight: true },
   { text: "Aumento da confiança e engajamento da frota", highlight: false },
   { text: "Cultura de Meritocracia consolidada", highlight: true },
  ],
  highlight: "Transformação Real",
  duration: "0:50",
 },
 {
  id: 7,
  title: "Legado",
  subtitle: "De Estagiário a Owner",
  icon: CheckCircle2,
  type: "content",
  bullets: [
   { text: "Reestruturação completa da bonificação.", highlight: false },
   { text: "Automação gerando eficiência operacional.", highlight: false },
   { text: "Ferramentas para o entregador ter autonomia.", highlight: true },
   { text: "Base sólida para escalar a operação nacional.", highlight: false },
  ],
  highlight: "Pronto para o próximo desafio.",
  duration: "0:15",
 },
];

// --- COMPONENTES VISUAIS AUXILIARES ---

// Background com Grid Tecnológico
const BackgroundGrid = () => (
 <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-zinc-950">
  {/* Grid Lines */}
  <div
   className="absolute inset-0 opacity-[0.05]"
   style={{
    backgroundImage: `linear-gradient(#05af31 1px, transparent 1px), linear-gradient(90deg, #05af31 1px, transparent 1px)`,
    backgroundSize: "50px 50px",
   }}
  />
  {/* Glow Superior */}
  <div className="absolute top-0 left-0 right-0 h-[400px] bg-gradient-to-b from-[#05af31]/10 to-transparent blur-3xl" />
  {/* Vignette */}
  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/50" />
 </div>
);

// Logo Mottu Estilizado
const MottuLogo = ({ className = "" }: { className?: string }) => (
 <div
  className={`font-black tracking-tighter flex items-center select-none ${className}`}
 >
  <Image src="/mottu_logo.ico" width={100} height={100} alt="Logo Mottu" />
  <div className="w-2 h-2 lg:w-3 lg:h-3 bg-[#05af31] rounded-full ml-1 animate-pulse shadow-[0_0_10px_#05af31]" />
 </div>
);

// Badge de Tempo
const TimeBadge = ({ time }: { time: string }) => (
 <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 border border-zinc-800 px-3 py-1 rounded-full">
  <Timer className="w-3 h-3" />
  <span>{time}</span>
 </div>
);

// --- COMPONENTE PRINCIPAL ---

export default function MottuPresentation() {
 const [currentSlide, setCurrentSlide] = useState<number>(0);
 const [viewMode, setViewMode] = useState<"grid" | "presentation">("grid");

 // Navegação
 const handleNext = useCallback(() => {
  if (currentSlide < slides.length - 1) setCurrentSlide((p) => p + 1);
 }, [currentSlide]);

 const handlePrev = useCallback(() => {
  if (currentSlide > 0) setCurrentSlide((p) => p - 1);
 }, [currentSlide]);

 // Teclado
 useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
   if (viewMode !== "presentation") return;
   if (e.key === "ArrowRight" || e.key === " ") handleNext();
   if (e.key === "ArrowLeft") handlePrev();
   if (e.key === "Escape") setViewMode("grid");
  };
  window.addEventListener("keydown", handleKeyPress);
  return () => window.removeEventListener("keydown", handleKeyPress);
 }, [viewMode, handleNext, handlePrev]);

 return (
  <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-[#05af31] selection:text-black overflow-hidden relative">
   <BackgroundGrid />

   <AnimatePresence mode="wait">
    {viewMode === "grid" ? (
     <GridView
      key="grid"
      slides={slides}
      onSelect={(id) => {
       setCurrentSlide(id);
       setViewMode("presentation");
      }}
     />
    ) : (
     <PresentationView
      key="presentation"
      slide={slides[currentSlide]}
      total={slides.length}
      current={currentSlide}
      onNext={handleNext}
      onPrev={handlePrev}
      onExit={() => setViewMode("grid")}
     />
    )}
   </AnimatePresence>
  </div>
 );
}

// --- SUB-COMPONENTES DE VISUALIZAÇÃO ---

const GridView = ({
 slides,
 onSelect,
}: {
 slides: Slide[];
 onSelect: (id: number) => void;
}) => (
 <motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
  transition={{ duration: 0.4 }}
  className="relative z-10 w-full max-w-[1600px] mx-auto p-6 lg:p-12 h-screen flex flex-col"
 >
  <div className="flex justify-between items-end mb-12 border-b border-zinc-800 pb-6">
   <div>
    <div className="flex items-center gap-3 mb-2">
     <span className="px-2 py-0.5 bg-[#05af31] text-black text-xs font-bold uppercase rounded-sm">
      Estágio
     </span>
     <span className="text-zinc-500 text-xs font-mono uppercase">
      Field Services
     </span>
    </div>
    <h1 className="text-4xl lg:text-6xl font-black tracking-tight text-white">
     REPORT OUT
    </h1>
    <p className="text-zinc-400 mt-2 text-lg">ENZO FERRACINI</p>
   </div>
   <MottuLogo className="text-4xl" />
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-y-auto pb-10">
   {slides.map((s, idx) => (
    <motion.button
     key={s.id}
     onClick={() => onSelect(s.id)}
     className="group relative flex flex-col justify-between bg-zinc-900/40 border border-zinc-800 hover:border-[#05af31] 
                     p-6 text-left rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(5,175,49,0.1)] h-[220px]"
     initial={{ opacity: 0, y: 20 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ delay: idx * 0.05 }}
    >
     <div className="w-full flex justify-between items-start">
      <span className="font-mono text-zinc-600 text-sm group-hover:text-[#05af31] transition-colors">
       {String(idx).padStart(2, "0")}
      </span>
      {s.icon ? (
       <s.icon className="w-5 h-5 text-zinc-600 group-hover:text-white transition-colors" />
      ) : (
       <Activity className="w-5 h-5 text-zinc-600" />
      )}
     </div>

     <div>
      <h3 className="text-xl font-bold leading-none mb-2 text-white group-hover:text-[#05af31] transition-colors">
       {s.title}
      </h3>
      {s.subtitle && (
       <p className="text-xs text-zinc-500 line-clamp-2">{s.subtitle}</p>
      )}
     </div>

     <div className="w-full flex justify-between items-center mt-4 border-t border-zinc-800/50 pt-3">
      <span className="text-[10px] uppercase tracking-wider text-zinc-500">
       {s.type}
      </span>
      <span className="text-[10px] text-zinc-600 group-hover:text-white transition-colors">
       {s.duration}
      </span>
     </div>
    </motion.button>
   ))}
  </div>
 </motion.div>
);

const PresentationView = ({
 slide,
 total,
 current,
 onNext,
 onPrev,
 onExit,
}: PresentationViewProps) => {
 const Icon = slide.icon;

 return (
  <motion.div
   className="relative w-full h-screen flex flex-col z-20"
   initial={{ opacity: 0 }}
   animate={{ opacity: 1 }}
   exit={{ opacity: 0 }}
  >
   {/* Top Bar */}
   <div className="absolute top-0 w-full p-6 lg:p-8 flex justify-between items-start z-30">
    <MottuLogo className="text-2xl" />
    <div className="flex flex-col items-end gap-2">
     <button
      onClick={onExit}
      className="p-2 hover:bg-white/10 rounded-full transition-colors group"
     >
      <X className="w-6 h-6 text-zinc-500 group-hover:text-white" />
     </button>
    </div>
   </div>

   {/* Main Slide Area */}
   <div className="flex-1 flex items-center justify-center p-6 lg:p-16 overflow-hidden">
    <AnimatePresence mode="wait">
     <motion.div
      key={slide.id}
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 1.05, filter: "blur(5px)" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} // Custom easing
      className="w-full max-w-[1400px] flex justify-center"
     >
      {slide.type === "cover" && <CoverSlide slide={slide} />}
      {slide.type === "content" && <ContentSlide slide={slide} Icon={Icon} />}
      {slide.type === "split" && <SplitSlide slide={slide} Icon={Icon} />}
      {slide.type === "impact" && <ImpactSlide slide={slide} />}
     </motion.div>
    </AnimatePresence>
   </div>

   {/* Footer / Controls */}
   <div className="absolute bottom-0 w-full p-6 lg:p-10 flex justify-between items-end z-30">
    <div className="flex flex-col gap-2">
     <span className="text-xs text-zinc-500 font-mono">
      SLIDE {String(current + 1).padStart(2, "0")} /{" "}
      {String(total).padStart(2, "0")}
     </span>
     <div className="flex gap-1">
      {Array.from({ length: total }).map((_, i) => (
       <div
        key={i}
        className={`h-1 rounded-full transition-all duration-300 ${
         i === current
          ? "w-12 bg-[#05af31] shadow-[0_0_10px_#05af31]"
          : "w-2 bg-zinc-800"
        }`}
       />
      ))}
     </div>
    </div>

    <div className="flex gap-4 items-center">
     <div className="hidden lg:flex items-center gap-2 mr-4">
      <span className="text-xs text-zinc-600 font-mono">NAVIGATE</span>
      <div className="flex gap-1">
       <kbd className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-500">
        ←
       </kbd>
       <kbd className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-500">
        space
       </kbd>
       <kbd className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-xs text-zinc-500">
        esc
       </kbd>
      </div>
     </div>
     <button
      onClick={onPrev}
      disabled={current === 0}
      className="p-3 bg-zinc-900 hover:bg-[#05af31] border border-zinc-800 hover:border-[#05af31] hover:text-black rounded-full disabled:opacity-20 disabled:hover:bg-zinc-900 disabled:hover:text-white transition-all"
     >
      <ChevronLeft className="w-6 h-6" />
     </button>
     <button
      onClick={onNext}
      disabled={current === total - 1}
      className="p-3 bg-zinc-900 hover:bg-[#05af31] border border-zinc-800 hover:border-[#05af31] hover:text-black rounded-full disabled:opacity-20 disabled:hover:bg-zinc-900 disabled:hover:text-white transition-all"
     >
      <ChevronRight className="w-6 h-6" />
     </button>
    </div>
   </div>
  </motion.div>
 );
};

// --- SLIDE TEMPLATES ---

const CoverSlide = ({ slide }: { slide: Slide }) => (
 <div className="text-center relative w-full flex flex-col items-center justify-center">
  <motion.div
   initial={{ height: 0 }}
   animate={{ height: "120px" }}
   transition={{ delay: 0.3, duration: 0.5 }}
   className="w-px bg-gradient-to-b from-transparent via-[#05af31] to-transparent mb-8"
  />

  <div className="relative">
   <motion.h2
    initial={{ opacity: 0, letterSpacing: "1em" }}
    animate={{ opacity: 1, letterSpacing: "0.3em" }}
    transition={{ duration: 0.8, ease: "circOut" }}
    className="text-[#05af31] font-mono text-sm lg:text-lg uppercase mb-4"
   >
    {slide.subtitle}
   </motion.h2>

   <motion.h1
    initial={{ opacity: 0, y: 40, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay: 0.1, duration: 0.6 }}
    className="text-7xl lg:text-[9rem] font-black tracking-tighter leading-[0.85] text-white uppercase mix-blend-screen"
   >
    {slide.title.split(" ")[0]}
    <span className="block text-transparent bg-clip-text bg-gradient-to-b from-zinc-600 to-zinc-900">
     {slide.title.split(" ")[1]}
    </span>
   </motion.h1>
  </div>

  <motion.div
   initial={{ opacity: 0 }}
   animate={{ opacity: 1 }}
   transition={{ delay: 0.5 }}
   className="mt-12 flex items-center gap-3 bg-zinc-900/80 backdrop-blur border border-zinc-800 px-6 py-2 rounded-full"
  >
   <div className="w-2 h-2 bg-[#05af31] rounded-full animate-pulse" />
   <span className="text-zinc-300 font-mono text-sm uppercase">
    {slide.highlight}
   </span>
  </motion.div>
 </div>
);

const ContentSlide = ({
 slide,
 Icon,
}: {
 slide: Slide;
 Icon: React.ElementType | undefined;
}) => (
 <div className="max-w-5xl w-full">
  <div className="flex flex-col lg:flex-row lg:items-end gap-6 mb-16 border-b border-zinc-800 pb-8">
   <div className="flex-1">
    <div className="flex items-center gap-3 mb-2">
     {Icon && <Icon className="w-6 h-6 text-[#05af31]" />}
     <span className="text-[#05af31] font-mono text-sm uppercase tracking-wider">
      {slide.subtitle}
     </span>
    </div>
    <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tight leading-none text-white">
     {slide.title}
    </h2>
   </div>
   <TimeBadge time={slide.duration} />
  </div>

  <div className="space-y-4">
   {slide.bullets?.map((bullet, i) => (
    <motion.div
     key={i}
     initial={{ opacity: 0, x: -30 }}
     animate={{ opacity: 1, x: 0 }}
     transition={{ delay: i * 0.1 + 0.3, type: "spring", stiffness: 100 }}
     className={`p-6 rounded-r-xl border-l-4 transition-all group
                    ${
                     bullet.highlight
                      ? "bg-gradient-to-r from-[#05af31]/10 to-transparent border-[#05af31]"
                      : "bg-transparent border-zinc-800 hover:bg-zinc-900/50 hover:border-zinc-600"
                    }`}
    >
     <div className="flex items-baseline gap-4">
      <span
       className={`text-sm font-mono ${
        bullet.highlight ? "text-[#05af31]" : "text-zinc-600"
       }`}
      >
       0{i + 1}
      </span>
      <div className="flex-1">
       <p
        className={`text-2xl lg:text-3xl font-bold leading-tight ${
         bullet.highlight
          ? "text-white"
          : "text-zinc-400 group-hover:text-zinc-200"
        }`}
       >
        {bullet.text}
       </p>
       {bullet.subpoints && (
        <div className="mt-3 flex flex-col gap-2">
         {bullet.subpoints.map((sub, j) => (
          <div key={j} className="flex items-center gap-2">
           <div className="w-1 h-1 bg-zinc-600 rounded-full" />
           <p className="text-zinc-500 text-base">{sub}</p>
          </div>
         ))}
        </div>
       )}
      </div>
     </div>
    </motion.div>
   ))}
  </div>
 </div>
);

const SplitSlide = ({
 slide,
 Icon,
}: {
 slide: Slide;
 Icon: React.ElementType | undefined;
}) => (
 <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
  {/* Left Side: Context */}
  <div className="relative">
   <div className="absolute -left-10 top-0 bottom-0 w-1 bg-zinc-800/50" />
   <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    className="inline-flex items-center gap-2 text-[#05af31] font-bold mb-6 border border-[#05af31]/30 px-4 py-1.5 rounded-full text-xs uppercase tracking-wider"
   >
    {Icon && <Icon className="w-4 h-4" />}
    Contexto
   </motion.div>
   <h2 className="text-6xl lg:text-8xl font-black uppercase leading-[0.9] mb-8 text-white">
    {slide.title}
    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-zinc-700 to-zinc-900">
     {slide.subtitle?.split(" ")[0]}
    </span>
   </h2>
   <p className="text-xl text-zinc-400 font-medium max-w-md">
    {slide.subtitle?.substring(slide.subtitle.indexOf(" ") + 1)}
   </p>
  </div>

  {/* Right Side: Data */}
  <div className="space-y-6">
   {slide.bullets?.map((bullet, i) => (
    <motion.div
     key={i}
     initial={{ opacity: 0, y: 30 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ delay: 0.2 + i * 0.1 }}
     className={`relative p-8 rounded-xl border transition-all hover:scale-[1.02]
                        ${
                         bullet.highlight
                          ? "bg-zinc-900 border-[#05af31] shadow-[0_0_30px_rgba(5,175,49,0.1)]"
                          : "bg-zinc-900/30 border-zinc-800"
                        }`}
    >
     {bullet.highlight && (
      <div className="absolute -top-3 -right-3 bg-[#05af31] text-black p-2 rounded-lg shadow-lg">
       <Zap className="w-5 h-5 fill-current" />
      </div>
     )}
     <h3
      className={`text-xl lg:text-2xl font-bold mb-3 ${
       bullet.highlight ? "text-white" : "text-zinc-300"
      }`}
     >
      {bullet.text}
     </h3>
     {bullet.subpoints && (
      <div className="space-y-2">
       {bullet.subpoints.map((s, k) => (
        <p
         key={k}
         className="text-sm text-zinc-500 font-mono pl-3 border-l border-zinc-700"
        >
         {s}
        </p>
       ))}
      </div>
     )}
    </motion.div>
   ))}
  </div>
 </div>
);

const ImpactSlide = ({ slide }: { slide: Slide }) => (
 <div className="w-full max-w-6xl flex flex-col items-center">
  <motion.div
   initial={{ scale: 0.8, opacity: 0 }}
   animate={{ scale: 1, opacity: 1 }}
   transition={{ type: "spring", bounce: 0.5 }}
   className="mb-16 text-center"
  >
   <h2 className="text-[12vw] lg:text-[10rem] font-black leading-none tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
    IMPACTO
   </h2>
   <div className="h-2 w-32 bg-[#05af31] mx-auto mt-4 rounded-full" />
  </motion.div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
   {slide.bullets?.map((bullet, i) => (
    <motion.div
     key={i}
     initial={{ opacity: 0, y: 50 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ delay: i * 0.1 + 0.4 }}
     className={`flex flex-col justify-between p-8 border hover:bg-zinc-900 transition-colors
                        ${
                         bullet.highlight
                          ? "border-[#05af31] bg-[#05af31]/5"
                          : "border-zinc-800 bg-zinc-900/20"
                        }`}
    >
     <BarChart3
      className={`w-8 h-8 mb-4 ${
       bullet.highlight ? "text-[#05af31]" : "text-zinc-600"
      }`}
     />
     <p
      className={`text-2xl lg:text-3xl font-bold leading-tight ${
       bullet.highlight ? "text-white" : "text-zinc-400"
      }`}
     >
      {bullet.text}
     </p>
    </motion.div>
   ))}
  </div>

  <motion.div
   initial={{ opacity: 0 }}
   animate={{ opacity: 1 }}
   transition={{ delay: 1.2 }}
   className="mt-20 px-8 py-3 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-400 font-mono text-sm tracking-widest uppercase flex items-center gap-2"
  >
   <div className="w-2 h-2 bg-[#05af31] rounded-full animate-ping" />
   {slide.highlight}
  </motion.div>
 </div>
);
