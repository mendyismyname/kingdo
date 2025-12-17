import React, { useState, useEffect, useRef } from 'react';
import { TempleScene } from './TempleScene';

interface LandingPageProps {
  onEnter: () => void;
}

type Mode = 'JEWISH' | 'NOAHIDE' | 'SEEKING';

// Replace HTML string wrapper with fragment for React rendering
const KEY = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const CONTENT = {
    JEWISH: {
        subtitle: "קבלת עול מלכות שמים",
        appSub: "The central hub of your Avodah.",
        quoteText: <KEY>Build me a<br className="hidden md:block" /> Sanctuary</KEY>,
        quoteSource: "Exodus 25:8",
        tablet1: { title: "Daily Avodah", sub: "Action", iconType: "Hammer" },
        tablet2: { title: "Sacred Study", sub: "Intellect", iconType: "BookOpen" },
        phone1: { title: "Sanctify the Morning" },
        phone2: { title: "Tanya", chapter: "53", text: '"It is explicitly stated in the oath..."' },
        phone3: { name: "King David" },
        nodes: [
            { id: 'tzedakah', label: "Giving", val: "$18.00" },
            { id: 'study', label: "Study", val: "Ch. 41" },
            { id: 'mincha', label: "Prayer", val: "4:30 PM" },
            { id: 'date', label: "Calendar", val: "19 Kislev" }
        ],
        feed: {
            heroTitle: "Mincha",
            heroSub: "4:30 PM • Main Shul",
            item1Title: "Tzedakah",
            item1Sub: "Daily Giving",
            item2Title: "Tanya",
            item2Sub: "Chapter 41"
        },
        orbit: [
            { type: 'EVENT', title: 'Grand Farbrengen', sub: 'Tonight • 8:00 PM', color: 'amber', radiusMultiplier: 0.8, angle: 0, speed: 1, opacity: 1, blur: 0 },
            { type: 'MENTOR', title: 'Mentor', sub: 'Online Now', color: 'indigo', radiusMultiplier: 1.1, angle: 45, speed: 0.7, opacity: 0.6, blur: 1.5 },
            { type: 'STUDY', title: 'Chavrusa', sub: 'Study Tanya', color: 'emerald', radiusMultiplier: 0.8, angle: 120, speed: 1.1, opacity: 0.8, blur: 0.5 },
            { type: 'REMINDER', title: 'Mincha', sub: 'In 15 Minutes', color: 'rose', radiusMultiplier: 1.1, angle: 180, speed: 0.8, opacity: 0.4, blur: 2 },
            { type: 'MISSION', title: 'Daily Mitzvah', sub: 'Give Tzedakah', color: 'purple', radiusMultiplier: 0.8, angle: 240, speed: 0.95, opacity: 1, blur: 0 },
            { type: 'ALERT', title: 'Update', sub: 'Winter Schedule', color: 'orange', radiusMultiplier: 1.1, angle: 300, speed: 0.6, opacity: 0.7, blur: 1 },
            { type: 'GOAL', title: '$1,800', sub: 'Giving Goal', color: 'teal', radiusMultiplier: 0.8, angle: 60, speed: 1.2, opacity: 0.5, blur: 1.2 }
        ]
    },
    NOAHIDE: {
        subtitle: "The Seven Laws of Noah",
        appSub: "The foundation of your Divine service.",
        quoteText: <KEY>A House of Prayer<br className="hidden md:block" /> for All Peoples</KEY>,
        quoteSource: "Isaiah 56:7",
        tablet1: { title: "Divine Code", sub: "Justice", iconType: "Hammer" },
        tablet2: { title: "Moral Study", sub: "Intellect", iconType: "BookOpen" },
        phone1: { title: "Morning Gratitude" },
        phone2: { title: "Divine Code", chapter: "7", text: '"The foundation of a civilized world..."' },
        phone3: { name: "Adam Noah" },
        nodes: [
            { id: 'charity', label: "Charity", val: "$10.00" },
            { id: 'study', label: "Study", val: "Gate 1" },
            { id: 'prayer', label: "Prayer", val: "Sunset" },
            { id: 'date', label: "Calendar", val: "Nov 12" }
        ],
        feed: {
            heroTitle: "Prayer",
            heroSub: "Sunset • Personal",
            item1Title: "Charity",
            item1Sub: "Kindness",
            item2Title: "Study",
            item2Sub: "Divine Code"
        },
        orbit: [
            { type: 'LAW', title: 'Divine Code', sub: 'Prohibition of Theft', color: 'amber', radiusMultiplier: 0.8, angle: 0, speed: 1, opacity: 1, blur: 0 },
            { type: 'JUSTICE', title: 'Court Session', sub: '2:00 PM Today', color: 'indigo', radiusMultiplier: 1.1, angle: 60, speed: 0.7, opacity: 0.5, blur: 2 },
            { type: 'MISSION', title: 'Kindness', sub: 'Anonymous Act', color: 'emerald', radiusMultiplier: 0.8, angle: 140, speed: 1.1, opacity: 0.8, blur: 0.5 },
            { type: 'STUDY', title: 'Noahide Center', sub: 'Live Class Now', color: 'teal', radiusMultiplier: 1.1, angle: 200, speed: 0.8, opacity: 0.7, blur: 1 },
            { type: 'WISDOM', title: 'Psalms', sub: 'Chapter 23', color: 'purple', radiusMultiplier: 0.8, angle: 280, speed: 0.9, opacity: 0.4, blur: 2.5 }
        ]
    },
    SEEKING: {
        subtitle: "The Architecture of the Soul",
        appSub: "Your digital blueprint for Self-Mastery.",
        quoteText: <KEY><span className="md:whitespace-nowrap">The Soul of Man is</span><br className="hidden md:block" /> <span className="md:whitespace-nowrap">the Candle of G-d</span></KEY>,
        quoteSource: "Proverbs 20:27",
        tablet1: { title: "Self-Mastery", sub: "Discipline", iconType: "Compass" },
        tablet2: { title: "Higher Wisdom", sub: "Intellect", iconType: "BookOpen" },
        phone1: { title: "Morning Alignment" },
        phone2: { title: "Wisdom", chapter: "12", text: '"To know yourself is the beginning..."' },
        phone3: { name: "Architect" },
        nodes: [
            { id: 'giving', label: "Altruism", val: "Daily" },
            { id: 'study', label: "Insight", val: "Lesson 4" },
            { id: 'meditate', label: "Focus", val: "20 min" },
            { id: 'date', label: "Journal", val: "Entry 82" }
        ],
        feed: {
            heroTitle: "Focus",
            heroSub: "20 min • Solitude",
            item1Title: "Altruism",
            item1Sub: "Anonymous Act",
            item2Title: "Wisdom",
            item2Sub: "Ancient Stoics"
        },
        orbit: [
            { type: 'FOCUS', title: 'Solitude', sub: '20m Focused Silence', color: 'amber', radiusMultiplier: 0.8, angle: 0, speed: 1, opacity: 1, blur: 0 },
            { type: 'WISDOM', title: 'Meditations', sub: 'Marcus Aurelius', color: 'indigo', radiusMultiplier: 1.1, angle: 90, speed: 0.6, opacity: 0.5, blur: 1.5 },
            { type: 'ALIGN', title: 'Alignment', sub: 'Morning Routine', color: 'teal', radiusMultiplier: 0.8, angle: 180, speed: 1.2, opacity: 0.8, blur: 0.5 },
            { type: 'JOURNAL', title: 'Reflection', sub: 'Virtue Check', color: 'emerald', radiusMultiplier: 1.1, angle: 270, speed: 0.8, opacity: 0.4, blur: 2.5 }
        ]
    }
};

// --- Icons ---
const Globe = (props: any) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
const ChevronRight = (props: any) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="9 18 15 12 9 6"/></svg>;
const Compass = (props: any) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>;
const Lock = (props: any) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const Crown = (props: any) => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none" {...props}><path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5ZM19 19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V18H19V19Z"/></svg>;
const Hammer = (props: any) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15 12l-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"/><path d="M17.64 15L22 10.64"/><path d="M20.91 11.7l-1.25-1.25c-.6-.6-.93-1.4-.93-2.25V7.86c0-.55-.45-1-1-1H16.4c-.84 0-1.65-.33-2.25-.93L12.9 4.68"/></svg>;
const BookOpen = (props: any) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
const Check = (props: any) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="20 6 9 17 4 12"/></svg>;

const Volume2 = (props: any) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>;
const VolumeX = (props: any) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>;

// --- SUB-COMPONENTS ---

const PhoneMockup = ({ children, style, className, rotateX = 0, rotateY = 0 }: any) => (
  <div 
    className={`relative w-[300px] md:w-[320px] h-[640px] bg-[#121212] rounded-[3.5rem] border-[6px] border-[#2a2a2a] shadow-2xl mx-auto will-change-transform ${className}`} 
    style={{
        transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transformStyle: 'preserve-3d',
        boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.6), inset 0 0 20px rgba(255,255,255,0.05)',
        ...style
    }}
  >
    <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-tr from-white/5 to-transparent pointer-events-none z-50"></div>
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-50 flex items-center justify-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a]"></div>
        <div className="w-10 h-1.5 rounded-full bg-[#1a1a1a]/50"></div>
    </div>
    
    <div className="w-full h-full bg-white rounded-[3rem] overflow-hidden relative flex flex-col backface-hidden">
      {children}
    </div>
  </div>
);

const StoneTablet = ({ style, title, subtitle, icon }: any) => (
  <div className="absolute bg-[#FDFBF7] rounded-[2rem] p-6 w-64 h-auto shadow-[0_20px_40px_-5px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)] text-stone-800 select-none flex flex-col justify-between origin-center overflow-hidden" style={style}>
    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')] mix-blend-multiply pointer-events-none"></div>
    
    <div className="relative z-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 border border-stone-200">
            {icon}
        </div>
        <div>
            <div className="font-display font-bold text-lg leading-tight">{title}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{subtitle}</div>
        </div>
      </div>
      <div className="h-1 w-full bg-stone-100 rounded-full mb-3 overflow-hidden">
          <div className="h-full bg-stone-800 w-2/3 rounded-full"></div>
      </div>
      <div className="flex gap-1">
           <div className="h-1.5 w-1.5 rounded-full bg-stone-300"></div>
           <div className="h-1.5 w-12 rounded-full bg-stone-100"></div>
      </div>
    </div>
  </div>
);

const GlassArtifact = ({ style, label, value, variant = 'light' }: any) => (
  <div className={`absolute backdrop-blur-xl border rounded-[2rem] p-6 w-60 h-60 shadow-2xl select-none flex flex-col items-center justify-center text-center origin-center ${
      variant === 'dark' 
      ? 'bg-stone-900/5 border-stone-900/10 text-stone-900' 
      : 'bg-white/10 border-white/20 text-white'
  }`} style={style}>
      <div className={`text-5xl font-display font-bold mb-2 drop-shadow-sm ${variant === 'dark' ? 'text-stone-900' : 'text-white'}`}>{value}</div>
      <div className={`text-xs font-bold uppercase tracking-[0.2em] ${variant === 'dark' ? 'text-stone-600' : 'text-white/90'}`}>{label}</div>
  </div>
);

const SatelliteCard = ({ children, radius, angle, currentOrbit, speed = 1, opacity = 1, blur = 0 }: any) => {
    const totalRotation = angle + (currentOrbit * speed);
    return (
        <div 
            className="absolute inset-0 pointer-events-none flex items-center justify-center will-change-transform"
            style={{ 
                transform: `rotate(${totalRotation}deg)`,
                transformStyle: 'preserve-3d',
                opacity: opacity
            }}
        >
            <div 
                className="pointer-events-auto transition-transform duration-500 hover:scale-110"
                style={{ 
                    transform: `translateY(${-radius}px) rotate(${-totalRotation}deg)`,
                    filter: blur > 0 ? `blur(${blur}px)` : 'none'
                }}
            >
                {children}
            </div>
        </div>
    );
};

// --- MAIN CONTENT COMPONENT ---

const LandingContent: React.FC<LandingPageProps & { hasEntered: boolean }> = ({ onEnter, hasEntered }) => {
  const [scrollY, setScrollY] = useState(0);
  const [mode, setMode] = useState<Mode>('JEWISH');
  const [isMuted, setIsMuted] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const T = CONTENT[mode];
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    const handleScroll = () => {
        setScrollY(window.scrollY);
    };
    window.addEventListener('resize', checkMobile);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const toggleMute = () => {
      const nextMuted = !isMuted;
      setIsMuted(nextMuted);
      if (audioRef.current) {
          if (nextMuted) {
              audioRef.current.pause();
          } else {
              // Re-play explicitly to handle browser interaction requirement
              audioRef.current.play().catch(e => console.log("Audio play blocked", e));
          }
      }
  };

  const getProgress = (start: number, end: number) => {
    return Math.min(Math.max((scrollY - start) / (end - start), 0), 1);
  };

  const pStairs = getProgress(0, 10000); 
  const heroOpacity = 1 - (pStairs * 1.5);
  const heroY = pStairs * -200;

  const pNarrative = getProgress(8000, 15000);
  const narrativeOpacity = pNarrative < 0.2 ? pNarrative * 5 : (pNarrative > 0.8 ? (1 - pNarrative) * 5 : 1);
  const narrativeScale = 0.9 + (pNarrative * 0.1); 

  const pCards = getProgress(10000, 14000);
  const flyIn = (val: number) => 1 - Math.min(val * 1.5, 1); 

  const pApp = getProgress(15000, 22000);
  const appOpacity = pApp < 0.1 ? pApp * 10 : (pApp > 0.9 ? (1 - pApp) * 10 : 1);
  
  let phoneY = 150; 
  if (pApp > 0.1 && pApp <= 0.2) {
      phoneY = 150 - ((pApp - 0.1) * 1500); 
  } else if (pApp > 0.2 && pApp <= 0.8) {
      phoneY = 0; 
  } else if (pApp > 0.8) {
      phoneY = -((pApp - 0.8) * 500); 
  }

  const screenIdx = pApp < 0.33 ? 0 : pApp < 0.66 ? 1 : 2;

  const pConnect = getProgress(22000, 28000);
  const connectOpacity = pConnect < 0.1 ? pConnect * 10 : (pConnect > 0.9 ? (1 - pConnect) * 10 : 1);
  const orbitRotation = pConnect * 360;

  const pSimple = getProgress(28000, 34000);
  const simpleOpacity = pSimple < 0.1 ? pSimple * 10 : (pSimple > 0.9 ? (1 - pSimple) * 10 : 1);
  const textReveal = Math.min(pSimple * 150, 100);

  const pEverything = getProgress(34000, 40000);
  const everythingOpacity = pEverything < 0.1 ? pEverything * 10 : (pEverything > 0.9 ? (1 - pEverything) * 10 : 1);

  const pAscend = getProgress(40000, 42000);

  const showFixedButton = scrollY > 300 && pAscend <= 0.5;

  const nodes = [
    { ...T.nodes[0], x: -280, y: -180, color: "bg-amber-100 text-amber-600", delay: 0 },
    { ...T.nodes[1], x: 280, y: -120, color: "bg-indigo-100 text-indigo-600", delay: 100 },
    { ...T.nodes[2], x: -280, y: 120, color: "bg-emerald-100 text-emerald-600", delay: 200 },
    { ...T.nodes[3], x: 280, y: 180, color: "bg-stone-100 text-stone-600", delay: 300 }
  ];

  return (
    <div className={`font-sans selection:bg-amber-100 selection:text-amber-900 overflow-x-hidden transition-opacity duration-1000 ${hasEntered ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      
      {/* Background Music */}
      <audio 
        ref={audioRef}
        src="https://assets.mixkit.co/music/preview/mixkit-ethereal-meditation-149.mp3" 
        loop 
        autoPlay={false}
      />

      <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4 md:py-8 flex justify-between items-center transition-all duration-300 text-white mix-blend-difference">
        <div className="flex items-center gap-2">
           <span className="font-display font-bold text-lg md:text-xl tracking-[0.1em] md:tracking-[0.2em] uppercase">King.do</span>
        </div>
        
        {/* MODE SWITCHER - ALIGNED LEFT ON MOBILE */}
        <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 flex bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/20 z-50 shadow-lg">
            {['Noahide', 'Jewish', 'Seeking'].map((m) => (
              <button 
                key={m}
                onClick={() => {
                    setMode(m.toUpperCase() as Mode);
                    // Force audio play on interaction if desired but keep it silent by default
                }}
                className={`px-2 md:px-3 py-1.5 md:py-1 text-[8px] md:text-[10px] font-bold uppercase tracking-widest rounded-full transition-all ${mode === m.toUpperCase() ? 'bg-white text-black shadow-sm scale-105' : 'text-white/70 hover:text-white hover:bg-white/5'}`}
              >
                {m}
              </button>
            ))}
        </div>

        <div className="flex items-center gap-2 md:gap-6">
           <button 
                onClick={toggleMute} 
                className="w-10 h-10 rounded-full border border-white/20 bg-white/5 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-all"
            >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} className="animate-pulse" />}
           </button>
           <button onClick={() => {
               if (audioRef.current && !isMuted) audioRef.current.play();
               onEnter();
           }} className="hidden md:block bg-white text-black px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-widest shadow-lg hover:scale-105 transition-transform">
             Enter
           </button>
        </div>
      </nav>

      <div className="fixed top-0 left-0 w-full h-screen overflow-hidden">
        
        {/* --- LAYER 1: HERO --- */}
        <div 
            className="absolute inset-0 flex flex-col items-center justify-center text-center z-40 pointer-events-none pb-20"
            style={{ opacity: heroOpacity, transform: `translateY(${heroY}px)` }}
        >
            <div className="relative mb-12 flex flex-col items-center px-4">
                <span className="block text-[10px] md:text-sm font-display text-amber-200/80 tracking-[0.4em] md:tracking-[0.8em] uppercase mb-6 animate-[fadeIn_2s_ease-out] drop-shadow-md">The Path of Ascent</span>
                
                <h1 className="relative flex flex-col items-center justify-center text-center z-40 drop-shadow-2xl">
                    <span className="text-5xl md:text-[8rem] font-display font-bold tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-white to-amber-200 drop-shadow-[0_0_40px_rgba(251,191,36,0.3)] py-2 px-4">
                        KINGDOM
                    </span>
                    <span className="text-3xl md:text-[6rem] font-display font-bold tracking-tighter leading-none text-white/90 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] -mt-1 md:-mt-6">
                        OF HEAVEN
                    </span>
                </h1>
                
                <div className="font-serif text-amber-100/60 text-base md:text-xl mt-6 tracking-widest drop-shadow-md animate-[fadeIn_2s_ease-out_1.5s_forwards] opacity-0 transition-all">
                    {T.subtitle}
                </div>
            </div>

            <div className="absolute bottom-12 flex flex-col items-center gap-3 animate-pulse-slow">
                <div className="w-px h-16 bg-gradient-to-b from-transparent via-amber-200/50 to-transparent"></div>
                <div className="p-3 rounded-full border border-amber-200/20 bg-amber-900/10 backdrop-blur-sm">
                    <Compass className="text-amber-200 w-6 h-6 animate-[spin_10s_linear_infinite]" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-amber-100/70 font-bold drop-shadow-md">Begin Ascent</span>
            </div>
        </div>

        {/* --- LAYER 2: NARRATIVE --- */}
        <div 
            className="absolute inset-0 bg-[#F5F2EA] flex items-center justify-center pointer-events-none transition-opacity duration-300"
            style={{ opacity: narrativeOpacity }}
        >
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')] opacity-30 mix-blend-multiply"></div>
             
             <div className="absolute text-center px-6 max-w-5xl" style={{ transform: `scale(${narrativeScale})` }}>
                  <h2 className="text-[#2C2924] text-4xl md:text-8xl font-display font-bold tracking-tighter leading-[0.9] mb-8 drop-shadow-sm transition-all duration-500">
                      {T.quoteText}
                  </h2>
                  <div className="w-16 md:w-24 h-1 bg-[#2C2924] mx-auto mb-8"></div>
                  <p className="font-serif italic text-xl md:text-3xl text-stone-600">{T.quoteSource}</p>
             </div>
             
             <div className="absolute inset-0 flex items-center justify-center" style={{ display: pCards <= 0 ? 'none' : 'flex' }}>
                 <div className="relative w-full h-full max-w-6xl">
                    <StoneTablet 
                        title={T.tablet1.title} 
                        subtitle={T.tablet1.sub} 
                        icon={T.tablet1.iconType === 'Compass' ? <Compass className="text-xl text-stone-600" /> : <Hammer className="text-xl text-stone-600" />}
                        style={{ top: '25%', left: '15%', transform: `translate3d(${-100 * flyIn(pCards)}px, ${100 * flyIn(pCards)}px, 0) rotate(-5deg)` }} 
                    />
                    <StoneTablet 
                        title={T.tablet2.title} 
                        subtitle={T.tablet2.sub} 
                        icon={<BookOpen className="text-xl text-stone-600" />}
                        style={{ bottom: '25%', right: '15%', transform: `translate3d(${100 * flyIn(pCards)}px, ${-100 * flyIn(pCards)}px, 0) rotate(5deg)` }} 
                    />
                    <GlassArtifact 
                        value="12" 
                        label="Streak Days" 
                        variant="dark" 
                        style={{ top: '20%', right: '25%', transform: `translate3d(${50 * flyIn(pCards)}px, ${-200 * flyIn(pCards)}px, 0) scale(0.8)` }} 
                    />
                 </div>
             </div>
        </div>

        {/* --- LAYER 3: APP SHOWCASE --- */}
        <div 
            className="absolute inset-0 bg-gradient-to-b from-[#0F172A] to-[#1e293b] flex flex-col items-center justify-center transition-opacity duration-300"
            style={{ opacity: appOpacity, pointerEvents: appOpacity > 0.1 ? 'auto' : 'none' }}
        >
             <div className="absolute top-[12%] w-full text-center z-10 px-4">
                 <h2 className="text-white text-5xl md:text-8xl font-display font-bold tracking-tight mb-4 drop-shadow-lg">One App.</h2>
                 <p className="text-indigo-200 font-serif italic text-xl md:text-2xl opacity-90">{T.appSub}</p>
                 
                 <div className="flex gap-4 justify-center mt-8">
                     {[0,1,2].map(i => (
                         <div key={i} className={`h-1 transition-all duration-500 rounded-full ${screenIdx === i ? 'bg-white w-12 shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'bg-white/10 w-4'}`} />
                     ))}
                 </div>
             </div>
             
             <div className="absolute top-[35%]" style={{ transform: `translateY(${phoneY}px)` }}>
                <PhoneMockup>
                    {/* Screen 1 */}
                    <div className={`absolute inset-0 bg-stone-50 flex flex-col transition-opacity duration-500 ${screenIdx === 0 ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="p-6 pt-12 bg-white rounded-b-3xl shadow-sm z-10">
                            <div className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Today's Mission</div>
                            <div className="font-display text-2xl font-bold text-stone-900">{T.phone1.title}</div>
                        </div>
                        <div className="p-6 space-y-3">
                            {[1,2,3].map(i => (
                                <div key={i} className="h-16 bg-white rounded-2xl border border-stone-100 shadow-sm flex items-center px-4 gap-4">
                                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${i === 1 ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-stone-200'}`}>
                                        {i === 1 && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg>}
                                    </div>
                                    <div className="flex-1">
                                        <div className="w-32 h-2.5 bg-stone-800 rounded mb-1.5 opacity-80"></div>
                                        <div className="w-20 h-2 bg-stone-200 rounded"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Screen 2 */}
                    <div className={`absolute inset-0 bg-[#FDFBF7] flex flex-col transition-opacity duration-500 ${screenIdx === 1 ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="p-6 pt-12 flex justify-between items-end border-b border-stone-200">
                             <div>
                                <div className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">Library</div>
                                <div className="font-display text-2xl font-bold text-stone-900">{T.phone2.title}</div>
                             </div>
                             <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 text-xs font-bold">{T.phone2.chapter}</div>
                        </div>
                        <div className="p-8 font-serif text-lg leading-relaxed text-stone-700">
                            <p className="mb-4">{T.phone2.text}</p>
                            <p className="text-stone-400 text-sm">Chapter 1</p>
                        </div>
                        <div className="mt-auto bg-white p-4 m-4 rounded-2xl border border-stone-100 shadow-lg flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                            </div>
                            <div className="font-bold text-sm text-stone-600">Resume Audio</div>
                        </div>
                    </div>

                    {/* Screen 3 */}
                    <div className={`absolute inset-0 bg-stone-900 flex flex-col items-center justify-center transition-opacity duration-500 text-white ${screenIdx === 2 ? 'opacity-100' : 'opacity-0'}`}>
                         <div className="w-24 h-24 rounded-full border-4 border-white/20 flex items-center justify-center text-4xl font-display mb-6 shadow-[0_0_30px_rgba(255,255,255,0.1)]">{T.phone3.name.charAt(0)}</div>
                         <div className="font-display text-3xl font-bold mb-2">{T.phone3.name}</div>
                         <div className="text-xs font-bold uppercase tracking-widest text-stone-500 mb-8">Level 7 Builder</div>
                    </div>
                </PhoneMockup>
             </div>
        </div>

        {/* --- LAYER 4: CONNECT (REVOLVING UNIVERSE) --- */}
        <div 
            className="absolute inset-0 bg-black flex items-center justify-center perspective-1000 overflow-hidden"
            style={{ opacity: connectOpacity, pointerEvents: connectOpacity > 0.1 ? 'auto' : 'none' }}
        >
             <div className="absolute inset-0 opacity-50">
                 {[...Array(150)].map((_, i) => (
                     <div key={i} className="absolute bg-white rounded-full" style={{
                         top: `${Math.random() * 100}%`,
                         left: `${Math.random() * 100}%`,
                         width: `${Math.random() * 2}px`,
                         height: `${Math.random() * 2}px`,
                         opacity: Math.random()
                     }}></div>
                 ))}
             </div>

             <div className="absolute top-[8%] w-full text-center z-40 px-4">
                 <h2 className="text-5xl md:text-[7rem] font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 leading-none drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]">
                     Universe
                 </h2>
                 <p className="font-serif italic text-lg md:text-2xl text-stone-400 mt-4 px-8">Everything revolves around you.</p>
             </div>
                 
             <div className="relative w-full h-full flex items-center justify-center overflow-visible">
                 {/* Solar Center */}
                 <div className="absolute z-30">
                    <div className="w-[180px] h-[180px] md:w-[200px] md:h-[200px] rounded-full flex items-center justify-center relative">
                        {mode === 'SEEKING' ? (
                            <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full shadow-[0_0_80px_#fff,0_0_120px_rgba(255,255,255,0.6)] animate-pulse"></div>
                        ) : (
                            <div className="w-32 h-32 md:w-44 md:h-44 rounded-full overflow-hidden border-2 border-blue-500/30 shadow-[0_0_60px_rgba(59,130,246,0.4)] relative">
                                <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/2/22/Earth_Western_Hemisphere_transparent_background.png')] bg-cover bg-center animate-[spin_120s_linear_infinite]"></div>
                                <div className="absolute inset-0 bg-gradient-to-tr from-black/60 to-transparent"></div>
                            </div>
                        )}
                    </div>
                 </div>

                 {/* Orbital Rings - Visual Guides */}
                 <div className="absolute w-[300px] h-[300px] md:w-[350px] md:h-[350px] border border-white/10 rounded-full"></div>
                 <div className="absolute w-[450px] h-[450px] md:w-[550px] md:h-[550px] border border-white/5 rounded-full"></div>

                 {/* Ring 1: MOON - ENHANCED */}
                 <div className="absolute w-[300px] h-[300px] md:w-[350px] md:h-[350px] animate-[spin_15s_linear_infinite]">
                     <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 md:-mt-6 w-8 h-8 md:w-12 md:h-12 bg-stone-300 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.3)] border border-stone-400/50 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')]"></div>
                        <div className="w-full h-full bg-gradient-to-br from-white/20 to-black/20"></div>
                     </div>
                 </div>

                 {/* Ring 2: SUN - ENHANCED */}
                 <div className="absolute w-[450px] h-[450px] md:w-[550px] md:h-[550px] animate-[spin_40s_linear_infinite_reverse]">
                     <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -mb-8 md:-mb-10 w-12 h-12 md:w-20 md:h-20 bg-amber-400 rounded-full shadow-[0_0_60px_rgba(251,191,36,0.9),0_0_120px_rgba(251,191,36,0.4)] border-2 border-amber-300 relative overflow-visible">
                        <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full"></div>
                     </div>
                 </div>

                 {/* MODE SPECIFIC SATELLITE CARDS */}
                 {T.orbit?.map((card, i) => (
                    <SatelliteCard 
                        key={`${mode}-${i}`}
                        radius={card.radiusMultiplier * (isMobile ? 180 : 400)} 
                        angle={card.angle} 
                        currentOrbit={orbitRotation} 
                        speed={card.speed}
                        opacity={card.opacity}
                        blur={card.blur}
                    >
                        <div className={`w-32 md:w-44 bg-white/10 backdrop-blur-xl p-2 md:p-3 rounded-2xl border border-white/20 text-white shadow-2xl flex items-center gap-2 md:gap-3`}>
                             <div className={`w-7 h-7 md:w-10 md:h-10 rounded-full border border-white/30 flex items-center justify-center font-bold text-[10px] md:text-xs bg-${card.color}-500/20 text-${card.color}-400`}>
                                 {card.type.charAt(0)}
                             </div>
                             <div className="overflow-hidden">
                                 <div className="font-display font-bold text-[9px] md:text-sm leading-none mb-1 truncate">{card.title}</div>
                                 <div className={`text-[7px] md:text-[10px] text-${card.color}-400 uppercase font-bold truncate`}>{card.sub}</div>
                             </div>
                        </div>
                    </SatelliteCard>
                 ))}
             </div>
        </div>

        {/* --- LAYER 5: SIMPLICITY --- */}
        <div 
            className="absolute inset-0 bg-[#0A0A0A] flex items-center justify-center text-white"
            style={{ opacity: simpleOpacity, pointerEvents: simpleOpacity > 0.1 ? 'auto' : 'none' }}
        >
             <div className="max-w-7xl w-full h-full flex flex-col md:flex-row items-center justify-center gap-12 px-8">
                 <div className="flex-1 text-center md:text-left">
                     <div className="flex items-center justify-center md:justify-start gap-3 text-emerald-500 mb-6">
                         <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                         <span className="text-xs font-bold uppercase tracking-[0.2em]">Encrypted</span>
                     </div>
                     <div className="relative overflow-hidden mb-8">
                         <h2 
                            className="text-5xl md:text-9xl font-display font-bold leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-stone-600 whitespace-nowrap"
                            style={{ clipPath: `polygon(0 0, ${textReveal}% 0, ${textReveal}% 100%, 0 100%)` }}
                         >
                             Divine<br/>Simplicity
                         </h2>
                     </div>
                     <p className="text-stone-500 font-serif text-lg md:text-2xl max-w-lg leading-relaxed">
                         The holiest place was the empty space. We strip away the noise so you can focus on the connection.
                     </p>
                 </div>
                 
                 <div className="flex-1 flex justify-center">
                     <div className="relative w-[280px] md:w-[300px] h-[360px] md:h-[400px] bg-gradient-to-br from-stone-800 to-black rounded-[3rem] border border-stone-800 shadow-2xl flex flex-col items-center justify-center p-8 text-center group hover:border-emerald-500/30 transition-colors">
                         <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-black border border-stone-800 flex items-center justify-center mb-8 shadow-inner group-hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-shadow duration-500">
                             <Lock size={48} className="text-stone-600 group-hover:text-emerald-500 transition-colors" />
                         </div>
                         <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-2">Sacred Privacy</h3>
                         <p className="text-xs md:text-sm text-stone-500 mb-6">Your spiritual data is sealed. We do not sell your soul.</p>
                         <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-950/30 px-4 py-2 rounded-full border border-emerald-900">
                             AES-256 Encrypted
                         </div>
                     </div>
                 </div>
             </div>
        </div>

        {/* --- LAYER 6: EVERYTHING --- */}
        <div 
            className="absolute inset-0 bg-[#FDFBF7] flex flex-col items-center justify-center overflow-hidden"
            style={{ opacity: everythingOpacity, pointerEvents: everythingOpacity > 0.1 ? 'auto' : 'none' }}
        >
             <div className="absolute inset-0 flex items-center justify-center z-10 select-none overflow-hidden">
                 <h1 className="text-[8rem] md:text-[20rem] font-display font-bold text-stone-900/5 whitespace-nowrap tracking-tighter leading-none transform -translate-y-8">
                     EVERYTHING.
                 </h1>
             </div>

             <div className="relative z-30 flex flex-col items-center mb-8">
                 <div className="bg-white/50 backdrop-blur-sm border border-stone-200 px-4 py-1.5 rounded-full shadow-sm mb-4">
                    <span className="font-serif italic text-base md:text-lg text-stone-500">Unified in one vessel.</span>
                 </div>
             </div>

             <div className="relative w-full max-w-7xl h-[800px] flex items-center justify-center z-20">
                 
                 <PhoneMockup className="z-30 bg-stone-50 border-stone-200 shadow-2xl scale-[0.7] md:scale-100 transition-transform">
                    <div className="h-full flex flex-col bg-stone-50 overflow-hidden relative">
                        <div className="px-6 pt-5 pb-2 flex justify-between items-center text-[10px] font-bold text-stone-900">
                            <span>12:00</span>
                            <div className="flex gap-1.5">
                                <div className="w-4 h-2.5 rounded-sm border border-stone-300"></div>
                                <div className="w-0.5 h-2.5 bg-stone-300 rounded-full"></div>
                            </div>
                        </div>

                        <div className="px-6 py-4 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-20">
                            <span className="font-display font-bold text-lg">King.do</span>
                            <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-[10px] font-bold">D</div>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-4 no-scrollbar">
                             <div className="bg-stone-900 text-white p-5 rounded-2xl shadow-xl relative overflow-hidden">
                                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                                 <div className="relative z-10">
                                     <div className="flex justify-between items-start mb-3">
                                         <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Next Action</span>
                                         <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                     </div>
                                     <h3 className="font-display text-xl font-bold mb-1">{T.feed.heroTitle}</h3>
                                     <p className="text-xs text-stone-400 font-serif mb-4">{T.feed.heroSub}</p>
                                     <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                                         <div className="h-full bg-white w-2/3"></div>
                                     </div>
                                 </div>
                             </div>

                             <div className="flex gap-3">
                                 <div className="flex-1 bg-white p-3 rounded-2xl border border-stone-100 shadow-sm flex flex-col items-center justify-center gap-1">
                                     <div className="text-2xl text-amber-500">★</div>
                                     <span className="text-[10px] font-bold text-stone-400 uppercase">12 Day</span>
                                 </div>
                                 <div className="flex-1 bg-white p-3 rounded-2xl border border-stone-100 shadow-sm flex flex-col items-center justify-center gap-1">
                                     <div className="text-2xl text-amber-500">★</div>
                                     <span className="text-[10px] font-bold text-stone-400 uppercase">Level 7</span>
                                 </div>
                             </div>

                             <div className="space-y-2">
                                 <div className="text-[10px] font-bold uppercase tracking-widest text-stone-400 ml-1">Today's Missions</div>
                                 
                                 <div className="bg-white p-3 rounded-xl border border-stone-100 shadow-sm flex items-center gap-3">
                                     <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shadow-inner font-bold">$</div>
                                     <div className="flex-1">
                                         <div className="text-xs font-bold text-stone-800">{T.feed.item1Title}</div>
                                         <div className="text-[10px] text-stone-400">{T.feed.item1Sub}</div>
                                     </div>
                                     <div className="w-5 h-5 rounded-full border border-stone-200"></div>
                                 </div>

                                 <div className="bg-white p-3 rounded-xl border border-stone-100 shadow-sm flex items-center gap-3">
                                     <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner font-bold">W</div>
                                     <div className="flex-1">
                                         <div className="text-xs font-bold text-stone-800">{T.feed.item2Title}</div>
                                         <div className="text-[10px] text-stone-400">{T.feed.item2Sub}</div>
                                     </div>
                                     <Check className="w-5 h-5 text-indigo-600" />
                                 </div>
                             </div>
                        </div>

                        <div className="h-16 bg-white border-t border-stone-100 flex justify-around items-center px-2">
                            {[1,2,3,4].map(i => (
                                <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center ${i===1 ? 'text-stone-900' : 'text-stone-300'}`}>
                                    <div className="w-5 h-5 rounded-md bg-current opacity-20"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                 </PhoneMockup>

                 <div className="absolute inset-0 pointer-events-none z-20 overflow-visible">
                     <svg className="w-full h-full overflow-visible">
                         <defs>
                             <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                 <stop offset="0%" stopColor="#e5e7eb" stopOpacity="0" />
                                 <stop offset="50%" stopColor="#d6d3d1" stopOpacity="1" />
                                 <stop offset="100%" stopColor="#e5e7eb" stopOpacity="0" />
                             </linearGradient>
                         </defs>
                         {nodes.map((node, i) => {
                             const d = `M ${window.innerWidth/2 + node.x} ${400 + node.y} C ${window.innerWidth/2 + node.x*0.5} ${400 + node.y}, ${window.innerWidth/2 + node.x*0.5} 400, ${window.innerWidth/2} 400`;
                             return (
                                 <path
                                    key={i}
                                    d={d}
                                    fill="none"
                                    stroke="url(#lineGrad)"
                                    strokeWidth="2"
                                    className="opacity-60"
                                 />
                             )
                         })}
                     </svg>
                 </div>

                 {nodes.map((node, i) => (
                     <div 
                        key={i}
                        className="absolute bg-white/90 backdrop-blur-md p-4 pr-6 rounded-2xl shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)] border border-white/50 flex items-center gap-4 min-w-[150px] md:min-w-[180px] z-20 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                        style={{ 
                            transform: `translate(${node.x}px, ${node.y}px) scale(${window.innerWidth < 768 ? 0.8 : 1})`,
                        }}
                     >
                         <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center font-bold text-base md:text-lg shadow-inner ${node.color}`}>
                             {node.label.charAt(0)}
                         </div>
                         <div>
                             <div className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-0.5">{node.label}</div>
                             <div className="font-display font-bold text-base md:text-xl text-stone-800">{node.val}</div>
                         </div>
                     </div>
                 ))}

             </div>
        </div>

        {/* --- LAYER 7: ASCEND --- */}
        <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center transition-all duration-700"
            style={{ opacity: Math.min(1, Math.max(0, (pAscend - 0.2) * 5)), pointerEvents: pAscend > 0.5 ? 'auto' : 'none' }}
        >
             <div className="relative z-10 text-center px-6">
                 <div className="mb-12 transform transition-transform hover:scale-105 duration-500 cursor-pointer" onClick={() => {
                     if (audioRef.current && !isMuted) audioRef.current.play();
                     onEnter();
                 }}>
                    <div className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-8 rounded-full border-2 border-white/20 flex items-center justify-center animate-[pulse_3s_infinite]">
                        <Crown className="text-white w-6 h-6 md:w-10 md:h-10" />
                    </div>
                    <h2 className="text-5xl md:text-[10rem] font-display font-bold text-white tracking-tighter mb-4 leading-none drop-shadow-2xl">Ascend.</h2>
                    <p className="text-lg md:text-3xl font-serif italic text-white/80 mt-8 px-4">Your sanctuary awaits.</p>
                 </div>

                 <button onClick={() => {
                     if (audioRef.current && !isMuted) audioRef.current.play();
                     onEnter();
                 }} className="px-10 py-4 md:px-16 md:py-6 bg-white text-black rounded-full font-bold text-base md:text-xl hover:bg-stone-200 transition-all shadow-[0_0_50px_rgba(255,255,255,0.3)] hover:-translate-y-1 uppercase tracking-widest">
                     Enter the Kingdom
                 </button>
                 
                 <div className="mt-16 md:mt-20 text-white/30 text-[10px] font-bold uppercase tracking-[0.3em]">
                     © 2025 King.do
                 </div>
             </div>
        </div>

      </div>

      <div className="h-[42000px]"></div>

      <div className={`fixed bottom-10 left-0 right-0 z-50 flex justify-center transition-opacity duration-300 ${showFixedButton ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
         <div onClick={() => {
             if (audioRef.current && !isMuted) audioRef.current.play();
             onEnter();
         }} className="bg-black/90 backdrop-blur-md p-1.5 rounded-full shadow-2xl flex items-center gap-1 cursor-pointer group hover:scale-105 transition-transform border border-white/10">
            <div className="bg-white/20 text-white p-3 rounded-full">
               <ChevronRight size={20} />
            </div>
            <button className="px-6 py-2 rounded-full text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
               Enter
            </button>
         </div>
      </div>
      
      <style>{`
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .perspective-1000 { perspective: 1000px; }
      `}</style>
    </div>
  );
};

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  const [hasEntered, setHasEntered] = useState(false);

  const handleEnter = () => {
      setHasEntered(true);
      setTimeout(() => {
          onEnter();
      }, 1000);
  };

  return (
    <>
      <TempleScene isActive={!hasEntered} />
      <LandingContent onEnter={handleEnter} hasEntered={hasEntered} />
    </>
  );
};