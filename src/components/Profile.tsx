import React, { useState } from 'react';
import { UserProfile, Habit, AppTheme, AppLanguage } from '../types';
import { showSuccess, showError } from '../utils/toast'; // Import showSuccess and showError

interface ProfileProps {
  profile: UserProfile;
  habits: Habit[];
  onReset: () => void;
  onUpdateTheme: (theme: AppTheme) => void;
  onUpdateLanguage: (lang: AppLanguage) => void;
  onUpdateCommunity: (community: string) => void;
  onUpdateName: (name: string) => void;
}

// Community Data Structure
const COMMUNITIES: Record<string, string[]> = {
    "Chabad": ["Chabad Lubavitch (General)", "Crown Heights", "Rebbe MH'M", "Shluchim Network"],
    "Breslov": ["Breslov (General)", "Na Nach", "R' Itche Meir", "Uman Kibbutz"],
    "Chassidish": ["Satmar (General)", "Kahal Yatev Lev", "Vishnitz", "Ger", "Belz", "Skver", "Bobov"],
    "Yeshivish / Litvish": ["Litvish (General)", "Lakewood Kehilla", "Yeshivas Mir", "Brisk", "Ner Yisroel", "Chaim Berlin"],
    "Sefardi / Mizrahi": ["Sefardi (General)", "Moroccan", "Syrian / Shaare Zion", "Baba Sali", "Shas", "Persian"],
    "Dati Leumi / Zionist": ["Dati Leumi (General)", "Bnei Akiva", "Old City Yerushalaim", "Gush Katif Legacy", "Mizrachi"],
    "General / Outreach": ["Thank You Hashem", "Baal Teshuva Movement", "Aish HaTorah", "Chazaq"],
    "Non-Jewish / Noahide": ["Noahide World Center", "Bnei Noah", "Bnei Moshe"]
};

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

export const Profile: React.FC<ProfileProps> = ({ profile, habits, onReset, onUpdateTheme, onUpdateLanguage, onUpdateCommunity, onUpdateName }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState(profile.name);

  // Stats Calculation
  const totalMitzvos = habits.reduce((acc, h) => acc + Object.keys(h.history).length, 0);
  const categoryStats = habits.reduce((acc, h) => {
      const count = Object.keys(h.history).length;
      acc[h.category] = (acc[h.category] || 0) + count;
      return acc;
  }, { THOUGHT: 0, SPEECH: 0, ACTION: 0 } as Record<string, number>);

  // Activity Heatmap Calculation
  const generateHeatmapData = () => {
    const data = [];
    const today = new Date();
    // Generate last 112 days (16 weeks)
    for (let i = 111; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        
        // Count completions for this day
        const count = habits.filter(h => h.history[dateStr]).length;
        data.push({ date: dateStr, count });
    }
    return data;
  };
  const heatmapData = generateHeatmapData();

  const handleNameSave = () => {
      if (nameInput.trim() && nameInput.trim() !== profile.name) {
          onUpdateName(nameInput.trim());
          showSuccess('Name updated!'); // Toast notification
      } else if (nameInput.trim() === profile.name) {
          showError('Name is already the same.');
      } else {
          showError('Name cannot be empty.');
      }
  };

  const handleThemeUpdate = (theme: AppTheme) => {
      onUpdateTheme(theme);
      showSuccess(`Theme changed to ${theme}!`); // Toast notification
  };

  const handleLanguageUpdate = (lang: AppLanguage) => {
      onUpdateLanguage(lang);
      showSuccess(`Language changed to ${lang}!`); // Toast notification
  };

  const handleCommunityUpdate = (community: string) => {
      onUpdateCommunity(community);
      showSuccess(`Community set to ${community}!`); // Toast notification
  };

  const handleReset = () => {
      if(confirm("Are you sure you want to reset all your data? This action cannot be undone.")) {
          onReset();
          showSuccess('Profile data reset successfully!'); // Toast notification
      }
  };

  const THEMES: {id: AppTheme, color: string, label: string}[] = [
      { id: 'mint', color: '#14B8A6', label: 'King Mint' },
      { id: 'orange', color: '#EA580C', label: 'King Orange' },
      { id: 'blue', color: '#2563EB', label: 'Royal Blue' },
      { id: 'purple', color: '#7E22CE', label: 'Deep Purple' },
  ];

  const LANGUAGES = Object.values(AppLanguage);

  return (
    <div className="min-h-full px-6 py-8 flex flex-col animate-fade-in max-w-lg mx-auto pb-32">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <h1 className="font-display text-3xl text-king-text font-bold">Profile</h1>
        <button 
            onClick={() => setShowSettings(!showSettings)} 
            className={`w-10 h-10 flex items-center justify-center rounded-full border transition-colors ${showSettings ? 'bg-king-primary text-white border-king-primary' : 'bg-white border-stone-200 text-stone-400 hover:text-king-primary'}`}
            title="Settings"
        >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        </button>
      </header>

      {/* Settings Panel - Toggleable */}
      {showSettings ? (
          <div className="animate-slide-up space-y-6">
              
              {/* Name Change */}
               <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
                 <h3 className="font-display text-sm font-bold text-king-text mb-4">Identity</h3>
                 <div className="flex gap-2">
                     <input 
                        type="text" 
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        className="flex-1 border border-stone-200 rounded-xl px-4 py-2 focus:outline-none focus:border-king-primary"
                        placeholder="Your Name"
                     />
                     <button 
                        onClick={handleNameSave}
                        disabled={nameInput === profile.name}
                        className="bg-king-primary text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                         Save
                     </button>
                 </div>
               </div>

              {/* Theme Settings */}
              <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
                <h3 className="font-display text-sm font-bold text-king-text mb-4">Royal Robes (Theme)</h3>
                <div className="flex justify-between">
                    {THEMES.map(theme => (
                        <button 
                            key={theme.id}
                            onClick={() => handleThemeUpdate(theme.id)}
                            className={`flex flex-col items-center gap-2 group`}
                        >
                            <div 
                                className={`w-12 h-12 rounded-full border-4 transition-transform group-hover:scale-110 ${profile.theme === theme.id ? 'border-stone-900 scale-110' : 'border-transparent'}`}
                                style={{ backgroundColor: theme.color }}
                            ></div>
                            <span className="text-[10px] uppercase font-bold text-stone-400">{theme.label.split(' ')[1]}</span>
                        </button>
                    ))}
                </div>
              </div>

              {/* Language Settings */}
              <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
                 <h3 className="font-display text-sm font-bold text-king-text mb-4">Lashon (Language/Mode)</h3>
                 <div className="grid grid-cols-2 gap-3">
                     {LANGUAGES.map(lang => (
                         <button
                            key={lang}
                            onClick={() => handleLanguageUpdate(lang)}
                            className={`p-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all
                                ${profile.language === lang 
                                    ? 'bg-king-primary text-white border-king-primary shadow-md' 
                                    : 'bg-stone-50 text-stone-500 border-stone-100 hover:border-king-primary/50'
                                }
                            `}
                         >
                             {lang}
                         </button>
                     ))}
                 </div>
              </div>

               {/* Community Settings */}
               <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
                 <h3 className="font-display text-sm font-bold text-king-text mb-4">Kehilla (Community)</h3>
                 <div className="space-y-2">
                     {Object.entries(COMMUNITIES).map(([category, communities]) => (
                         <div key={category} className="border border-stone-100 rounded-xl overflow-hidden">
                             <button 
                                onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
                                className="w-full text-left p-3 bg-stone-50 hover:bg-stone-100 flex justify-between items-center transition-colors"
                             >
                                 <span className="font-bold text-xs text-king-text uppercase tracking-wide">{category}</span>
                                 <span className="text-stone-400 text-xs">{expandedCategory === category ? '−' : '+'}</span>
                             </button>
                             {expandedCategory === category && (
                                 <div className="bg-white p-2 grid gap-1">
                                     {communities.map(comm => (
                                         <button
                                            key={comm}
                                            onClick={() => handleCommunityUpdate(comm)}
                                            className={`text-left p-2 rounded-lg text-sm transition-colors ${
                                                profile.community === comm 
                                                    ? 'bg-king-primary/10 text-king-primary font-bold' 
                                                    : 'text-stone-500 hover:bg-stone-50'
                                            }`}
                                         >
                                             {comm}
                                         </button>
                                     ))}
                                 </div>
                             )}
                         </div>
                     ))}
                 </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-red-50 rounded-2xl p-6 border border-red-100 shadow-sm mt-8">
                  <h3 className="font-display text-sm font-bold text-red-800 mb-2">Danger Zone</h3>
                  <button 
                      onClick={handleReset} 
                      className="w-full bg-white text-red-500 border border-red-200 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-colors"
                  >
                      Reset All Data
                  </button>
              </div>

          </div>
      ) : (
          <div className="flex-1 flex flex-col w-full animate-fade-in space-y-6">
            
            {/* Main Profile Card */}
            <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-card flex flex-col items-center text-center relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-32 bg-king-gradient opacity-10"></div>
                 <div className="w-24 h-24 rounded-full bg-king-primary text-white flex items-center justify-center text-4xl font-display font-bold shadow-lg mb-4 relative z-10 border-4 border-white">
                     {profile.name.charAt(0).toUpperCase()}
                 </div>
                 <h2 className="font-display text-2xl font-bold text-king-text relative z-10">{profile.name}</h2>
                 <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1 relative z-10">{profile.community || profile.demographic}</p>
                 <span className="inline-block px-3 py-1 rounded-full bg-king-primary/10 text-king-primary text-[10px] font-bold uppercase tracking-wider relative z-10">Level {profile.level} Builder</span>
            </div>

            {/* GitHub Style Heatmap */}
            <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm">
                <div className="flex justify-between items-end mb-4">
                     <h3 className="font-display text-sm font-bold text-king-text">Activity Map</h3>
                     <span className="text-[10px] text-stone-400 uppercase tracking-wide">Last 112 Days</span>
                </div>
                <div className="flex flex-wrap gap-1">
                    {heatmapData.map((day, i) => {
                        let colorClass = 'bg-stone-100';
                        if (day.count >= 5) colorClass = 'bg-king-primary';
                        else if (day.count >= 3) colorClass = 'bg-king-primary/70';
                        else if (day.count >= 1) colorClass = 'bg-king-primary/40';

                        return (
                            <div 
                                key={i} 
                                title={`${day.date}: ${day.count} mitzvos`}
                                className={`w-2.5 h-2.5 rounded-sm ${colorClass}`}
                            ></div>
                        )
                    })}
                </div>
            </div>

            {/* Detailed Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm flex flex-col justify-center items-center">
                    <span className="text-3xl font-display font-bold text-king-secondary mb-1">{totalMitzvos}</span>
                    <span className="text-[10px] text-stone-400 uppercase tracking-widest text-center">Total Mitzvos</span>
                </div>
                <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm flex flex-col justify-center items-center">
                    <span className="text-3xl font-display font-bold text-king-teal mb-1">{profile.totalStudyMinutes}</span>
                    <span className="text-[10px] text-stone-400 uppercase tracking-widest text-center">Minutes Learned</span>
                </div>
                {/* Category Breakdown */}
                <div className="col-span-2 bg-white rounded-3xl p-6 border border-stone-100 shadow-sm">
                    <h3 className="font-display text-sm font-bold text-king-text mb-4 text-center">Mitzvah Distribution</h3>
                    <div className="flex justify-around items-end h-24 pb-2 border-b border-stone-50">
                        {Object.entries(categoryStats).map(([cat, count]) => {
                             // find max for scaling roughly
                             const val = count as number;
                             const allValues = Object.values(categoryStats) as number[];
                             const max = Math.max(...allValues, 1);
                             const height = Math.max((val / max) * 100, 10);
                             return (
                                 <div key={cat} className="flex flex-col items-center gap-2 w-1/3 group">
                                     <div className="w-full px-4 h-full flex items-end justify-center">
                                         <div 
                                            className={`w-full rounded-t-lg transition-all duration-1000 group-hover:opacity-80
                                                ${cat === 'THOUGHT' ? 'bg-indigo-400' : ''}
                                                ${cat === 'SPEECH' ? 'bg-king-secondary' : ''}
                                                ${cat === 'ACTION' ? 'bg-king-primary' : ''}
                                            `} 
                                            style={{ height: `${height}%` }}
                                         ></div>
                                     </div>
                                 </div>
                             )
                        })}
                    </div>
                    <div className="flex justify-around mt-2">
                         {Object.keys(categoryStats).map(cat => (
                             <span key={cat} className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">{cat}</span>
                         ))}
                    </div>
                </div>
            </div>

            {/* Tikkun / Soul Visualization */}
            <div className="w-full bg-white rounded-3xl p-6 border border-stone-100 shadow-sm">
                <h3 className="font-display text-sm font-bold text-king-text mb-4">Soul Correction (Tikkun)</h3>
                <div className="space-y-4">
                    {[
                        { label: 'Action (Asiyah)', val: 80, color: 'bg-king-primary' },
                        { label: 'Emotion (Yetzirah)', val: 45, color: 'bg-king-secondary' },
                        { label: 'Intellect (Beriah)', val: 20, color: 'bg-indigo-400' }
                    ].map((s) => (
                        <div key={s.label}>
                            <div className="flex justify-between text-xs mb-1 font-bold text-stone-500">
                                <span>{s.label}</span>
                                <span>{s.val}%</span>
                            </div>
                            <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.val}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </div>
      )}
    </div>
  );
};