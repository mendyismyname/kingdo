import React, { useState, useEffect } from 'react';
import { Demographic, UserProfile } from '../types';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const INTERESTS = [
    "Chassidus & Kabbalah",
    "Business & Tech",
    "Hip Hop & Culture",
    "Fashion & Art",
    "Litvish World",
    "Israel News",
    "Self Improvement",
    "Psychology"
];

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0); 
  const [name, setName] = useState('');
  const [demographic, setDemographic] = useState<Demographic | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [inviteCode, setInviteCode] = useState('');
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStep(1), 2500);
    return () => clearTimeout(timer);
  }, []);

  const toggleInterest = (interest: string) => {
      if (selectedInterests.includes(interest)) {
          setSelectedInterests(selectedInterests.filter(i => i !== interest));
      } else {
          setSelectedInterests([...selectedInterests, interest]);
      }
  };

  const handleNext = () => {
    if (step === 1 && name.trim()) {
       setStep(2);
    } else if (step === 2 && demographic) {
       setStep(3);
    } else if (step === 3 && selectedInterests.length > 0) {
       setStep(4);
    } else if (step === 4) {
       setIsExiting(true);
       setTimeout(() => {
           onComplete({
            name,
            demographic: demographic!,
            level: 1,
            streak: 0,
            totalStudyMinutes: 0,
            newsInterests: selectedInterests
          });
       }, 800);
    }
  };

  // 1. Splash Screen
  if (step === 0) {
      return (
          <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50 text-king-text">
              <div className="text-8xl text-king-primary mb-6 animate-pulse-slow">
                  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="url(#grad1)">
                    <defs>
                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--king-primary)" />
                        <stop offset="100%" stopColor="var(--king-primary-light)" />
                        </linearGradient>
                    </defs>
                    <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V18H19V19Z" />
                  </svg>
              </div>
              <h1 className="font-display text-5xl font-bold tracking-tight mb-4 text-gradient opacity-0 animate-[fadeIn_1s_ease-out_0.5s_forwards]">King.do</h1>
              <p className="font-serif italic text-stone-400 text-sm tracking-widest opacity-0 animate-[fadeIn_1s_ease-out_1s_forwards]">Kingdom of Heaven</p>
              
              <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
              `}</style>
          </div>
      )
  }

  // 2. Onboarding Steps
  return (
    <div className={`fixed inset-0 bg-white flex flex-col items-center justify-center p-6 transition-all duration-700 ease-in-out ${isExiting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        
        {/* Progress */}
        <div className="absolute top-12 md:top-20 flex gap-2">
            <div className={`h-1 rounded-full transition-all duration-500 ${step >= 1 ? 'w-8 bg-king-primary' : 'w-2 bg-stone-200'}`} />
            <div className={`h-1 rounded-full transition-all duration-500 ${step >= 2 ? 'w-8 bg-king-primary' : 'w-2 bg-stone-200'}`} />
            <div className={`h-1 rounded-full transition-all duration-500 ${step >= 3 ? 'w-8 bg-king-primary' : 'w-2 bg-stone-200'}`} />
            <div className={`h-1 rounded-full transition-all duration-500 ${step >= 4 ? 'w-8 bg-king-primary' : 'w-2 bg-stone-200'}`} />
        </div>

        <div className="max-w-md w-full text-center">
            <div className="w-12 h-12 mx-auto text-king-primary mb-12 opacity-80">
                 <svg width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V18H19V19Z" />
                  </svg>
            </div>

            <div className="min-h-[300px] flex flex-col justify-center">
                {step === 1 && (
                    <div className="animate-[fadeIn_0.5s_ease-out]">
                        <h2 className="font-display text-4xl text-king-text font-bold mb-3">Identity</h2>
                        <p className="font-serif text-stone-400 italic mb-12">How shall you be known?</p>
                        
                        <div className="relative group max-w-xs mx-auto">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Name"
                                className="w-full bg-transparent border-b-2 border-stone-200 text-center text-3xl text-king-text py-4 focus:outline-none focus:border-king-primary transition-colors placeholder-stone-200 font-display"
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                            />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-[fadeIn_0.5s_ease-out]">
                        <h2 className="font-display text-4xl text-king-text font-bold mb-3">Path</h2>
                        <p className="font-serif text-stone-400 italic mb-8">Choose your gate.</p>
                        
                        <div className="grid gap-3 max-h-[40vh] overflow-y-auto no-scrollbar py-2 px-4">
                            {Object.values(Demographic).map((d) => (
                                <button
                                    key={d}
                                    onClick={() => setDemographic(d)}
                                    className={`p-4 rounded-xl border transition-all text-sm font-bold tracking-wide relative overflow-hidden group
                                        ${demographic === d 
                                            ? 'bg-king-primary border-king-primary text-white shadow-lg shadow-glow' 
                                            : 'bg-white border-stone-100 text-stone-400 hover:border-king-primary/50 hover:text-king-primary'
                                        }
                                    `}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                
                {step === 3 && (
                    <div className="animate-[fadeIn_0.5s_ease-out]">
                        <h2 className="font-display text-4xl text-king-text font-bold mb-3">Interests</h2>
                        <p className="font-serif text-stone-400 italic mb-8">Filter the world.</p>
                        
                        <div className="grid grid-cols-2 gap-3 max-h-[40vh] overflow-y-auto no-scrollbar py-2 px-1">
                            {INTERESTS.map((interest) => (
                                <button
                                    key={interest}
                                    onClick={() => toggleInterest(interest)}
                                    className={`p-3 rounded-xl border transition-all text-xs font-bold uppercase tracking-wide relative overflow-hidden
                                        ${selectedInterests.includes(interest)
                                            ? 'bg-king-primary text-white border-king-primary shadow-md' 
                                            : 'bg-white border-stone-100 text-stone-400 hover:border-king-primary/50'
                                        }
                                    `}
                                >
                                    {interest}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="animate-[fadeIn_0.5s_ease-out]">
                        <h2 className="font-display text-4xl text-king-text font-bold mb-3">Community</h2>
                        <p className="font-serif text-stone-400 italic mb-12">Enter invite code (Optional)</p>
                        
                        <div className="relative group max-w-xs mx-auto">
                            <input
                                type="text"
                                value={inviteCode}
                                onChange={(e) => setInviteCode(e.target.value)}
                                placeholder="KING-2025"
                                className="w-full bg-transparent border-b-2 border-stone-200 text-center text-2xl text-king-text py-4 focus:outline-none focus:border-king-primary transition-colors placeholder-stone-200 font-sans tracking-widest uppercase"
                                onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-12 h-14">
                 <button
                    onClick={handleNext}
                    disabled={(step === 1 && !name) || (step === 2 && !demographic) || (step === 3 && selectedInterests.length === 0)}
                    className={`px-12 py-4 rounded-full font-bold uppercase tracking-[0.2em] text-[10px] transition-all duration-500 transform
                        ${(step === 1 && name) || (step === 2 && demographic) || (step === 3 && selectedInterests.length > 0) || step === 4
                            ? 'bg-king-text text-white hover:bg-king-primary hover:shadow-glow hover:scale-105 translate-y-0 opacity-100 shadow-xl' 
                            : 'bg-stone-100 text-transparent opacity-0 translate-y-4 pointer-events-none'
                        }
                    `}
                >
                    {step < 4 ? 'Continue' : 'Enter Kingdom'}
                </button>
            </div>
        </div>
        
        <style>{`
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
    </div>
  );
};