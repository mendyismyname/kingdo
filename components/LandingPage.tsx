import React, { useState, useEffect, useRef } from 'react';
import { TempleScene } from './TempleScene';

interface LandingPageProps {
  onEnter: () => void;
}

// --- Icons ---
const RefreshCw = (props: any) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>;
const BookOpen = (props: any) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
const MapPin = (props: any) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const Globe = (props: any) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
const ChevronRight = (props: any) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="9 18 15 12 9 6"/></svg>;
const Menu = (props: any) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const Zap = (props: any) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const Shield = (props: any) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const Lock = (props: any) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;

// --- SUB-COMPONENTS ---

const PhoneMockup = ({ children, style, className, rotateX = 0, rotateY = 0 }: any) => (
  <div 
    className={`relative w-[280px] md:w-[320px] h-[600px] bg-stone-900 rounded-[3rem] border-[8px] border-stone-900 shadow-2xl mx-auto will-change-transform ${className}`} 
    style={{
        transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transformStyle: 'preserve-3d',
        ...style
    }}
  >
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-stone-900 rounded-b-xl z-50"></div>
    <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden relative flex flex-col backface-hidden">
      {children}
    </div>
  </div>
);

const TealCard = ({ style }: any) => (
  <div className="absolute bg-[#0D9488] rounded-[2rem] p-6 w-64 h-64 shadow-xl text-white select-none flex flex-col justify-between origin-center" style={style}>
    <div>
      <div className="flex items-center gap-2 mb-4 opacity-80">
        <RefreshCw />
        <span className="font-medium font-display">Daily Avodah</span>
      </div>
      <div className="text-3xl font-bold tracking-tight">12/12</div>
      <div className="text-white/80 font-medium mt-1">Habits Completed</div>
    </div>
    <div className="bg-white/20 backdrop-blur-md w-fit px-4 py-1.5 rounded-full text-xs font-bold">Streak Active</div>
  </div>
);

const AmberCard = ({ style }: any) => (
    <div className="absolute bg-white rounded-[2rem] p-2 w-60 shadow-[0_20px_50px_rgba(0,0,0,0.1)] select-none origin-center border border-gray-100 overflow-hidden" style={style}>
      <div className="bg-[#D97706] p-4 rounded-[1.5rem] text-white mb-2">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen />
          <span className="font-bold font-display">Daily Study</span>
        </div>
        <div className="text-4xl font-bold mb-1">Ch. 41</div>
        <div className="text-amber-100 text-xs font-medium">Tanya</div>
      </div>
      <div className="w-full py-3 text-center text-gray-600 font-bold text-sm">Continue Reading</div>
    </div>
);

const PhotoCard = ({ style }: any) => (
    <div className="absolute w-64 h-64 rounded-[2.5rem] shadow-2xl overflow-hidden origin-center bg-gray-900 border-4 border-white" style={style}>
      <img src="https://images.unsplash.com/photo-1507692049790-de58293a469d?auto=format&fit=crop&q=80&w=600" alt="Jerusalem" className="w-full h-full object-cover opacity-90" />
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg">
        <MapPin className="text-gray-600"/>
        <span className="text-xs font-bold text-gray-800">Jerusalem</span>
      </div>
    </div>
);

// --- MAIN CONTENT COMPONENT ---

const LandingContent: React.FC<LandingPageProps & { hasEntered: boolean }> = ({ onEnter, hasEntered }) => {
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getProgress = (start: number, end: number) => {
    return Math.min(Math.max((scrollY - start) / (end - start), 0), 1);
  };

  // Phase Calculations (Scroll triggers)
  // EXTENDED SCROLL RANGES
  const pStairs = getProgress(0, 10000); // Extended initial phase
  const pText = getProgress(8000, 12000); 
  const textOpacity = pText < 0.5 ? pText * 3 : 1 - ((pText - 0.5) * 3);
  const textScale = 0.8 + (pText * 0.4);

  const pCards = getProgress(12000, 15000);
  const flyIn = (val: number) => 1 - Math.min(val * 1.5, 1);
  const cardsScale = 0.8 + (pCards * 0.2);
  const cardsExit = getProgress(14500, 15000); 
  const finalCardsOpacity = (pCards < 0.2 ? pCards * 5 : 1) * (1 - cardsExit);
  
  const pPhone1 = getProgress(15000, 20000);
  const bgOneAppOpacity = pPhone1 < 0.1 ? pPhone1 * 10 : (pPhone1 > 0.95 ? (1 - pPhone1) * 20 : 1);
  
  let phone1Y = 100; 
  if (pPhone1 > 0 && pPhone1 <= 0.2) {
      phone1Y = 100 - ((pPhone1 / 0.2) * 100); 
  } else if (pPhone1 > 0.2 && pPhone1 <= 0.9) {
      phone1Y = 0; 
  } else if (pPhone1 > 0.9) {
      phone1Y = -((pPhone1 - 0.9) / 0.1) * 50; 
  }
  
  const phoneScreenIndex = pPhone1 < 0.33 ? 0 : pPhone1 < 0.66 ? 1 : 2;

  const pConnect = getProgress(20000, 25000);
  const bgConnectOpacity = pConnect < 0.1 ? pConnect * 10 : (pConnect > 0.95 ? (1 - pConnect) * 20 : 1);
  const uiSpread = Math.min(pConnect * 2, 1) * 350; 

  const pSimple = getProgress(25000, 30000);
  const bgSimpleOpacity = pSimple < 0.1 ? pSimple * 10 : (pSimple > 0.95 ? (1 - pSimple) * 20 : 1);
  const textRevealWidth = Math.min(pSimple * 200, 100); 
  const pPrivacy = getProgress(27000, 28500); 

  const pAvodah = getProgress(30000, 35000);
  const bgAvodahOpacity = pAvodah < 0.1 ? pAvodah * 10 : (pAvodah > 0.9 ? (1 - pAvodah) * 10 : 1);
  const explode = (1 - Math.sin(pAvodah * Math.PI)) * 400; 

  const pAscend = getProgress(35000, 38000);

  return (
    <div className={`font-sans selection:bg-purple-200 selection:text-purple-900 overflow-x-hidden transition-opacity duration-1000 ${hasEntered ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      
      <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-8 flex justify-between items-center transition-all duration-300 mix-blend-difference text-white">
        <div className="flex items-center gap-2">
           <span className="font-display font-bold text-2xl tracking-tighter">King.do</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
           <div className="flex items-center gap-2 font-medium text-sm px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md cursor-pointer">
              <Globe size={16} />
              <span>EN</span>
              <ChevronRight className="rotate-90" />
           </div>
           <button onClick={onEnter} className="bg-white text-stone-900 px-6 py-2.5 rounded-[1rem] font-bold text-sm shadow-lg hover:scale-105 transition-transform">
             Enter Kingdom
           </button>
        </div>
      </nav>

      <div className="fixed top-0 left-0 w-full h-screen overflow-hidden">
        
        {/* Layer 1: Hero - TRANSPARENT to show 3D BG */}
        <div style={{ opacity: pAscend > 0.1 ? 0 : 1, transition: 'opacity 0.5s' }}>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <div style={} className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-gradient-radial from-white via-white/10 to-transparent opacity-40 animate-pulse-slow" />
            </div>
        </div>

        {/* Hero Title - Polished Typography */}
        <div 
            className="absolute inset-0 flex flex-col items-center justify-center text-center z-40 pointer-events-none pb-20"
            style={{ opacity: 1 - (pStairs * 1.5), transform: `translateY(${pStairs * -150}px)` }}
        >
            <div className="absolute top-[30%] left-[-50%] w-[150%] h-32 bg-white/40 blur-3xl animate-[slideInRight_20s_linear_infinite] pointer-events-none mix-blend-overlay z-50" />
            
            <div className="relative mb-8">
                <span className="block text-sm md:text-xl font-display text-white/80 tracking-[0.5em] uppercase mb-4 opacity-90 drop-shadow-lg">The Path of Ascent</span>
                
                <h1 className="relative flex flex-col items-center justify-center text-center z-40 drop-shadow-2xl">
                    <span className="text-7xl md:text-[10rem] font-display font-bold tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/80 drop-shadow-xl py-2">
                        KINGDOM
                    </span>
                    <span className="text-6xl md:text-[9rem] font-display font-bold tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-white/90 to-white/50 drop-shadow-xl -mt-4 md:-mt-8">
                        OF HEAVEN
                    </span>
                </h1>
            </div>

            <div className="mt-12 animate-bounce opacity-80 z-40 text-white flex flex-col items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest opacity-70">Begin Ascent</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
            </div>
        </div>

        {/* Layer 2: White Overlay */}
        <div 
            className="absolute inset-0 bg-white flex items-center justify-center pointer-events-none transition-opacity duration-500"
            style={{ opacity: pText > 0.1 && pPhone1 < 0.1 ? 1 : 0 }}
        >
             <div className="absolute text-center px-6" style={{ opacity: textOpacity, transform: `scale(${textScale})` }}>
                  <h2 className="text-stone-900 text-6xl md:text-9xl font-display font-bold tracking-tighter leading-none mb-4">
                      "Build me a<br/>Sanctuary"
                  </h2>
                  <p className="font-serif italic text-3xl text-stone-400 mt-6">Exodus 25:8</p>
             </div>
             
             <div className="absolute inset-0 flex items-center justify-center" style={{ opacity: finalCardsOpacity, transform: `scale(${cardsScale})`, display: pCards <= 0 ? 'none' : 'flex' }}>
                 <div className="relative w-[800px] h-[600px]">
                    <TealCard style={{ top: '20%', left: '10%', transform: `translate3d(${-400 * flyIn(pCards)}px, ${200 * flyIn(pCards)}px, 0)` }} />
                    <AmberCard style={{ top: '10%', right: '15%', transform: `translate3d(${400 * flyIn(pCards)}px, ${-200 * flyIn(pCards)}px, 0)` }} />
                    <PhotoCard style={{ bottom: '15%', right: '10%', transform: `translate3d(${400 * flyIn(pCards)}px, ${400 * flyIn(pCards)}px, 0)` }} />
                 </div>
             </div>
        </div>

        {/* Layer 3: One App */}
        <div 
            className="absolute inset-0 bg-orange-500 flex flex-col items-center justify-center transition-opacity duration-300"
            style={{ opacity: bgOneAppOpacity, pointerEvents: bgOneAppOpacity > 0 ? 'auto' : 'none' }}
        >
             <div className="absolute top-[15%] w-full text-center z-10 px-4">
                 <h2 className="text-white text-6xl md:text-8xl font-display font-bold tracking-tight mb-2">One App.</h2>
                 <p className="text-orange-50 font-serif italic text-2xl opacity-90">For all your spiritual needs.</p>
                 
                 <div className="flex gap-3 justify-center mt-8">
                     {[0,1,2].map(i => (
                         <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${phoneScreenIndex === i ? 'bg-white w-12' : 'bg-white/20 w-3'}`} />
                     ))}
                 </div>
             </div>
             
             <div className="absolute top-[40%] transform -translate-y-[10%]" style={{ transform: `translateY(${phone1Y}px)` }}>
                <PhoneMockup>
                    <div className="h-full bg-stone-50 flex flex-col p-4 relative">
                        <div className={`absolute inset-0 p-4 transition-opacity duration-500 flex flex-col ${phoneScreenIndex === 0 ? 'opacity-100' : 'opacity-0'}`}>
                            <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
                                <div className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Today</div>
                                <div className="font-display text-xl font-bold text-orange-600">My Avodah</div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-12 bg-white rounded-lg border border-stone-100 flex items-center px-3 gap-3">
                                    <div className="w-5 h-5 rounded-full border-2 border-orange-500 bg-orange-500 text-white flex items-center justify-center text-[10px]">✓</div>
                                    <div className="w-32 h-2 bg-stone-200 rounded"></div>
                                </div>
                                <div className="h-12 bg-white rounded-lg border border-stone-100 flex items-center px-3 gap-3">
                                    <div className="w-5 h-5 rounded-full border-2 border-stone-200"></div>
                                    <div className="w-24 h-2 bg-stone-200 rounded"></div>
                                </div>
                            </div>
                        </div>

                        <div className={`absolute inset-0 p-4 transition-opacity duration-500 flex flex-col bg-stone-50 ${phoneScreenIndex === 1 ? 'opacity-100' : 'opacity-0'}`}>
                             <div className="flex justify-between items-center mb-4">
                                 <h3 className="font-display font-bold text-stone-900">Library</h3>
                                 <div className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">Reading</div>
                             </div>
                             <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex-1">
                                 <div className="font-display text-lg text-amber-600 mb-2">Tanya: Ch. 41</div>
                                 <div className="space-y-3">
                                     <div className="w-full h-2 bg-stone-100 rounded"></div>
                                     <div className="w-full h-2 bg-stone-100 rounded"></div>
                                     <div className="w-2/3 h-2 bg-stone-100 rounded"></div>
                                 </div>
                             </div>
                        </div>

                        <div className={`absolute inset-0 p-4 transition-opacity duration-500 flex flex-col bg-stone-50 ${phoneScreenIndex === 2 ? 'opacity-100' : 'opacity-0'}`}>
                             <div className="flex items-center gap-3 mb-6 border-b border-stone-200 pb-2">
                                 <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">K</div>
                                 <h3 className="font-bold text-sm">King AI</h3>
                             </div>
                             <div className="space-y-4">
                                 <div className="bg-white p-3 rounded-tr-none rounded-2xl shadow-sm text-xs self-end ml-8">
                                     How do I increase my joy?
                                 </div>
                                 <div className="bg-purple-600 text-white p-3 rounded-tl-none rounded-2xl shadow-sm text-xs mr-8">
                                     Joy comes from purpose. Focus on gratitude.
                                 </div>
                             </div>
                        </div>
                    </div>
                </PhoneMockup>
             </div>
        </div>

        {/* Layer 4: Connect */}
        <div 
            className="absolute inset-0 bg-gradient-to-br from-[#F3E8FF] via-[#FFFBEB] to-[#F0FDFA] flex items-center justify-center perspective-1000"
            style={{ opacity: bgConnectOpacity, pointerEvents: bgConnectOpacity > 0 ? 'auto' : 'none' }}
        >
             <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-[800px] h-[800px] border border-purple-200 rounded-full opacity-30 animate-spin-slow"></div>
                 <div className="absolute w-[600px] h-[600px] border border-amber-200 rounded-full opacity-30 animate-reverse-spin"></div>
             </div>

             <div className="absolute top-[15%] w-full text-center z-10 px-4">
                 <h2 className="text-6xl md:text-8xl font-display font-bold text-stone-900 leading-none">
                     Connect<span className="text-purple-600">.</span>
                 </h2>
                 <p className="font-serif italic text-2xl text-stone-500 mt-4">Deeply rooted in community.</p>
             </div>
                 
             <div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-[10%] w-[300px] h-[500px] preserve-3d flex items-center justify-center">
                 
                 <div 
                    className="absolute bg-white p-5 rounded-3xl shadow-xl border border-stone-100 w-56 -left-20"
                    style={{ 
                        transform: `translateX(${-uiSpread}px) translateZ(20px)`,
                        opacity: Math.min(pConnect * 3, 1)
                    }}
                 >
                     <div className="flex items-center gap-3 mb-4">
                         <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 text-lg">📅</div>
                         <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Upcoming</div>
                     </div>
                     <div className="font-display font-bold text-stone-900 text-lg leading-tight mb-1">Grand Farbrengen</div>
                     <div className="text-xs text-stone-400 font-serif">Tonight • 8:00 PM</div>
                 </div>

                 <div 
                    className="absolute bg-white p-5 rounded-3xl shadow-xl border border-stone-100 w-56 -right-20"
                    style={{ 
                        transform: `translateX(${uiSpread}px) translateZ(20px)`,
                        opacity: Math.min(pConnect * 3, 1)
                    }}
                 >
                     <div className="flex items-center gap-3 mb-4">
                         <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-lg">💼</div>
                         <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">Opportunity</div>
                     </div>
                     <div className="font-display font-bold text-stone-900 text-lg leading-tight mb-1">React Developer</div>
                     <div className="text-xs text-stone-400 font-serif">Torah Tech • Remote</div>
                 </div>

                 <PhoneMockup className="shadow-2xl shadow-purple-200/50 z-10">
                     <div className="h-full bg-stone-50 flex flex-col p-4 relative overflow-hidden">
                         <div className="flex justify-between items-center mb-4 pb-2 border-b border-stone-200">
                             <div className="font-bold text-stone-800">Kehilla Feed</div>
                             <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                <Globe size={16} />
                             </div>
                         </div>
                         
                         <div className="space-y-4 flex-1 overflow-hidden relative">
                             <div className="bg-white p-3 rounded-xl shadow-sm border border-stone-100">
                                 <div className="flex items-center gap-2 mb-2">
                                     <div className="w-8 h-8 rounded-full bg-stone-200"></div>
                                     <div>
                                         <div className="h-2 w-20 bg-stone-800 rounded mb-1"></div>
                                         <div className="h-1.5 w-12 bg-stone-300 rounded"></div>
                                     </div>
                                 </div>
                                 <div className="h-16 w-full bg-stone-100 rounded-lg mb-2"></div>
                                 <div className="flex gap-2">
                                     <div className="h-4 w-4 rounded-full bg-red-100"></div>
                                     <div className="h-2 w-32 bg-stone-200 rounded mt-1"></div>
                                 </div>
                             </div>

                             <div className="bg-white p-3 rounded-xl shadow-sm border border-stone-100">
                                 <div className="flex items-center gap-2 mb-2">
                                     <div className="w-8 h-8 rounded-full bg-stone-200"></div>
                                     <div>
                                         <div className="h-2 w-24 bg-stone-800 rounded mb-1"></div>
                                         <div className="h-1.5 w-16 bg-stone-300 rounded"></div>
                                     </div>
                                 </div>
                                 <div className="space-y-1 mb-2">
                                     <div className="h-2 w-full bg-stone-200 rounded"></div>
                                     <div className="h-2 w-2/3 bg-stone-200 rounded"></div>
                                 </div>
                             </div>
                             
                             <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-stone-50 to-transparent"></div>
                         </div>
                         
                         <div className="mt-auto h-12 bg-white rounded-2xl flex items-center justify-around text-stone-300">
                             <div className="w-6 h-6 rounded bg-purple-500"></div>
                             <div className="w-6 h-6 rounded bg-stone-200"></div>
                             <div className="w-6 h-6 rounded bg-stone-200"></div>
                         </div>
                     </div>
                 </PhoneMockup>
             </div>
        </div>

        {/* Layer 5: Simplicity */}
        <div 
            className="absolute inset-0 bg-[#0F172A] flex items-center justify-center text-white"
            style={{ opacity: bgSimpleOpacity, pointerEvents: bgSimpleOpacity > 0 ? 'auto' : 'none' }}
        >
             <div className="max-w-5xl w-full h-full flex flex-col md:flex-row items-center justify-start md:justify-center gap-8 md:gap-20 px-8 pt-28 md:pt-0">
                 <div className="flex-1 text-center md:text-left shrink-0">
                     <div className="flex items-center justify-center md:justify-start gap-3 text-teal-400 mb-4 md:mb-8">
                         <Zap size={24} />
                         <span className="text-sm font-bold uppercase tracking-widest">Minimalism</span>
                     </div>
                     <div className="relative overflow-hidden mb-4 md:mb-8">
                         <h2 className="text-5xl md:text-7xl font-display font-bold leading-none text-white/10">Divine<br/>Simplicity</h2>
                         <h2 
                            className="text-5xl md:text-7xl font-display font-bold leading-none absolute top-0 left-0 text-white whitespace-nowrap overflow-hidden transition-all duration-75"
                            style={{ width: `${textRevealWidth}%` }}
                         >
                             Divine<br/>Simplicity
                         </h2>
                     </div>
                     <p className="text-stone-400 font-serif text-lg md:text-2xl max-w-sm mx-auto md:mx-0 leading-relaxed">Strip away the noise. Focus on the connection.</p>
                 </div>
                 
                 <div className="flex-1 relative w-full flex justify-center scale-75 md:scale-100 origin-top">
                     <div className="relative w-[300px] h-[600px] border border-teal-500/30 rounded-[3rem] p-4 flex flex-col gap-4">
                         <div className="absolute inset-0 bg-teal-500/5 rounded-[3rem]" style={{ clipPath: `inset(0 ${100 - textRevealWidth}% 0 0)` }}></div>
                         
                         <div className="h-32 rounded-xl border border-teal-500/50" style={{ transform: `translateX(${100 - textRevealWidth}px)`, opacity: textRevealWidth/100 }}></div>
                         <div className="flex-1 rounded-xl border border-teal-500/30" style={{ transform: `translateX(${-100 + textRevealWidth}px)`, opacity: textRevealWidth/100 }}></div>
                         
                         <div 
                            className="absolute inset-0 bg-[#0F172A]/90 backdrop-blur-md z-20 flex flex-col items-center justify-center text-center p-8 rounded-[3rem] border border-teal-500/50 transition-opacity duration-700"
                            style={{ opacity: pPrivacy > 0.1 ? 1 : 0 }}
                         >
                             <div className="w-24 h-24 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400 mb-8 animate-pulse">
                                 <Shield size={48} />
                             </div>
                             <h3 className="text-3xl font-display font-bold mb-3 text-white">Sacred Privacy</h3>
                             <p className="text-base text-stone-400 mb-8 leading-relaxed">Your spiritual data is encrypted. We do not sell your soul.</p>
                             <div className="flex gap-2 text-[10px] font-bold uppercase tracking-widest text-teal-400">
                                 <div className="bg-teal-950/50 px-4 py-2 rounded-full border border-teal-900 flex items-center gap-2"><Lock size={12}/> AES-256</div>
                             </div>
                         </div>
                     </div>
                 </div>
             </div>
        </div>

        {/* Layer 6: Everything in one place */}
        <div 
            className="absolute inset-0 bg-[#FDFBF7] flex items-center justify-center"
            style={{ opacity: bgAvodahOpacity, pointerEvents: bgAvodahOpacity > 0 ? 'auto' : 'none' }}
        >
             <div className="relative w-full h-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-start md:justify-between px-8 pt-28 md:pt-0">
                 
                 <div 
                    className="z-10 transition-all duration-500 text-center md:text-left md:flex-1 md:max-w-md mb-8 md:mb-0 shrink-0"
                    style={{ 
                        opacity: 0.8 + (1 - (explode/500)) * 0.2, 
                        transform: `translateX(${-explode/20}px)` 
                    }}
                 >
                     <h2 className="text-6xl md:text-8xl font-display font-bold text-stone-900 mb-4 md:mb-6 leading-none">Everything</h2>
                     <p className="text-2xl md:text-4xl font-serif italic text-stone-500 leading-tight">In one place.</p>
                     <p className="hidden md:block mt-8 text-stone-400 font-serif max-w-xs">Study, prayer, charity, and community. Unified in a single vessel.</p>
                 </div>

                 <div className="relative w-[300px] md:w-[320px] h-[600px] md:h-[640px] md:mr-20 scale-75 md:scale-100 origin-top">
                     <PhoneMockup className="absolute top-0 left-0 z-20 shadow-2xl border-stone-200 bg-stone-50">
                          <div className="h-full flex flex-col p-6 overflow-hidden">
                                <div className="flex items-center justify-between mb-8">
                                     <div className="flex items-center gap-3">
                                         <div className="w-10 h-10 rounded-full bg-stone-200"></div>
                                         <div>
                                            <div className="w-20 h-2.5 rounded bg-stone-800 mb-1.5"></div>
                                            <div className="w-12 h-2 rounded bg-stone-200"></div>
                                         </div>
                                     </div>
                                     <div className="w-8 h-8 rounded-full border border-stone-200"></div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                     <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex flex-col gap-3">
                                         <div className="w-8 h-8 rounded-full bg-amber-100"></div>
                                         <div className="h-2 w-16 bg-stone-200 rounded"></div>
                                     </div>
                                     <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex flex-col gap-3">
                                         <div className="w-8 h-8 rounded-full bg-teal-100"></div>
                                         <div className="h-2 w-16 bg-stone-200 rounded"></div>
                                     </div>
                                     <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex flex-col gap-3">
                                         <div className="w-8 h-8 rounded-full bg-purple-100"></div>
                                         <div className="h-2 w-16 bg-stone-200 rounded"></div>
                                     </div>
                                     <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex flex-col gap-3">
                                         <div className="w-8 h-8 rounded-full bg-blue-100"></div>
                                         <div className="h-2 w-16 bg-stone-200 rounded"></div>
                                     </div>
                                </div>

                                <div className="space-y-3">
                                     <div className="w-full h-14 rounded-xl bg-white border border-stone-100 shadow-sm flex items-center px-4 gap-3">
                                          <div className="w-8 h-8 rounded-lg bg-stone-100"></div>
                                          <div className="flex-1">
                                             <div className="w-24 h-2 rounded bg-stone-800 mb-1.5"></div>
                                             <div className="w-16 h-2 rounded bg-stone-200"></div>
                                          </div>
                                     </div>
                                     <div className="w-full h-14 rounded-xl bg-white border border-stone-100 shadow-sm flex items-center px-4 gap-3">
                                          <div className="w-8 h-8 rounded-lg bg-stone-100"></div>
                                          <div className="flex-1">
                                             <div className="w-20 h-2 rounded bg-stone-800 mb-1.5"></div>
                                             <div className="w-32 h-2 rounded bg-stone-200"></div>
                                          </div>
                                     </div>
                                </div>
                          </div>
                     </PhoneMockup>

                     <div 
                        className="absolute top-20 -left-40 w-48 bg-white p-4 rounded-2xl shadow-xl border border-stone-100 z-30"
                        style={{ transform: `translate(${explode * -2.5}px, ${explode * -0.8}px) rotate(${explode * -0.1}deg)` }}
                     >
                         <div className="text-xs font-bold text-amber-500 uppercase mb-1">Tzedakah</div>
                         <div className="text-2xl font-bold">$18.00</div>
                     </div>

                     <div 
                        className="absolute bottom-40 -right-32 w-48 bg-white p-4 rounded-2xl shadow-xl border border-stone-100 z-30"
                        style={{ transform: `translate(${explode * 2.5}px, ${explode * 0.8}px) rotate(${explode * 0.1}deg)` }}
                     >
                         <div className="text-xs font-bold text-purple-500 uppercase mb-1">Tanya</div>
                         <div className="text-lg font-bold">Chapter 41</div>
                     </div>

                      <div 
                        className="absolute top-1/2 -translate-y-1/2 right-full mr-12 w-40 bg-white p-4 rounded-2xl shadow-xl border border-stone-100 z-30"
                        style={{ transform: `translate(${explode * -3.5}px, 0px)` }}
                     >
                         <div className="flex items-center gap-2">
                             <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center">🙏</div>
                             <div className="font-bold">Mincha</div>
                         </div>
                     </div>

                      <div 
                        className="absolute bottom-20 -left-20 w-40 bg-white p-4 rounded-2xl shadow-xl border border-stone-100 z-10"
                        style={{ transform: `translate(${explode * -2}px, ${explode * 2}px) rotate(${explode * -0.2}deg)` }}
                     >
                         <div className="text-center">
                             <div className="text-xs text-stone-400 uppercase">Kislev</div>
                             <div className="text-3xl font-bold text-stone-900">19</div>
                         </div>
                     </div>

                      <div 
                        className="absolute top-10 -right-20 w-32 h-32 bg-stone-800 p-2 rounded-2xl shadow-xl border border-stone-600 z-10"
                        style={{ transform: `translate(${explode * 2}px, ${explode * -2}px) rotate(${explode * 0.2}deg)` }}
                     >
                         <div className="w-full h-full bg-stone-700 rounded-xl relative opacity-50">
                             <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-red-500 rounded-full border border-white"></div>
                         </div>
                     </div>
                 </div>
             </div>
        </div>

        {/* Layer 7: Ready to Ascend */}
        <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center transition-all duration-700"
            style={{ opacity: Math.min(1, Math.max(0, (pAscend - 0.2) * 5)), pointerEvents: pAscend > 0.5 ? 'auto' : 'none' }}
        >
             <div className="relative z-10 text-center px-6">
                 <div className="mb-12 transform transition-transform hover:scale-105 duration-500">
                    <h2 className="text-7xl md:text-[10rem] font-display font-bold text-white tracking-tighter mb-4 leading-none drop-shadow-2xl">Ascend.</h2>
                    <p className="text-2xl md:text-3xl font-serif italic text-white mt-8">Your sanctuary awaits.</p>
                 </div>

                 <div className="flex flex-col md:flex-row gap-6 justify-center">
                     <button onClick={onEnter} className="px-16 py-6 bg-white text-black rounded-full font-bold text-xl hover:bg-stone-200 transition-all shadow-xl hover:-translate-y-1">
                         Enter the Kingdom
                     </button>
                 </div>
                 
                 <div className="mt-20 text-white/50 text-sm font-serif">
                     © 2025 King.do
                 </div>
             </div>
        </div>

      </div>

      <div className="h-[40000px]"></div>

      <div className={`fixed bottom-10 left-0 right-0 z-50 flex justify-center transition-opacity duration-300 ${pAscend > 0.5 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
         <div onClick={onEnter} className="bg-stone-900/80 backdrop-blur-md p-1.5 rounded-full shadow-2xl flex items-center gap-1 cursor-pointer group hover:bg-stone-900 transition-colors">
            <div className="bg-white/10 text-white p-3 rounded-full">
               <Menu size={20} />
            </div>
            <button className="px-6 py-2 rounded-full text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
               Enter
               <ChevronRight className="opacity-60" />
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
      // Wait for the fade-out transition (1000ms defined in LandingContent) before unmounting
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