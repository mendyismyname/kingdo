import React, { ReactNode, useState } from 'react';
import { UserProfile, AppLanguage } from '../../types';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  userProfile: UserProfile | null;
  hideMobileNav?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, userProfile, hideMobileNav = false }) => {
  // Collapsed by default
  const [isCollapsed, setIsCollapsed] = useState(true);
  
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: (active: boolean) => (
      <svg className="w-6 h-6" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" />
      </svg>
    )},
    { id: 'study', label: 'Study', icon: (active: boolean) => (
      <svg className="w-6 h-6" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )},
    { id: 'habits', label: 'Builder', icon: (active: boolean) => (
      <svg className="w-6 h-6" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
    { id: 'community', label: 'Community', icon: (active: boolean) => (
      <svg className="w-6 h-6" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )},
  ];

  const level = userProfile?.level || 1;
  const lang = userProfile?.language || AppLanguage.ENGLISH;
  
  // Logic to determine if "Frum" mode is active for branding changes
  const isFrumMode = [AppLanguage.YESHIVISH, AppLanguage.FRUM, AppLanguage.CHASSIDISH, AppLanguage.HEBREW, AppLanguage.YIDDISH, AppLanguage.SEFARDI].includes(lang);

  return (
    <div className="h-screen w-full flex flex-col md:flex-row bg-king-cream font-sans text-king-text selection:bg-king-primary selection:text-white overflow-hidden fixed inset-0">
      {/* Sidebar (Desktop) */}
      <aside className={`hidden md:flex flex-col bg-king-surface border-r border-stone-100 h-full transition-all duration-300 relative z-50 ${isCollapsed ? 'w-24 items-center' : 'w-72'}`}>
        {/* Toggle Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-12 w-6 h-6 bg-white border border-stone-200 rounded-full flex items-center justify-center text-stone-400 hover:text-king-primary shadow-sm z-50 active:scale-90 transition-transform"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transform transition-transform ${isCollapsed ? 'rotate-180' : ''}`}>
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div className={`p-10 ${isCollapsed ? 'px-4 py-8' : ''}`}>
          {isCollapsed ? (
            <div className="font-display text-2xl font-bold text-gradient mb-2 text-center animate-fade-in">K</div>
          ) : (
            <div className="animate-fade-in">
              {isFrumMode ? (
                <div className="mb-4">
                  <h1 className="font-serif text-3xl font-bold text-king-secondary mb-2">צבאות השם</h1>
                  <div className="font-display text-xs tracking-[0.2em] font-bold text-king-text opacity-60 uppercase">King.do</div>
                </div>
              ) : (
                <h1 className="font-display text-4xl tracking-tight font-bold text-gradient mb-2">King.do</h1>
              )}
              <p className={`text-[10px] text-king-muted uppercase tracking-[0.2em] whitespace-nowrap overflow-hidden ${isFrumMode ? 'font-serif text-sm tracking-normal opacity-80' : ''}`}>
                {isFrumMode ? "שוויתי ה' לנגדי תמיד" : 'Kingdom of Heaven'}
              </p>
            </div>
          )}
        </div>
        
        <nav className={`flex-1 space-y-2 ${isCollapsed ? 'px-4' : 'px-6'}`}>
          {tabs.map((tab) => (
            <button 
              key={tab.id} 
              onClick={() => onTabChange(tab.id)}
              className={`w-full text-left rounded-xl transition-all duration-300 flex items-center group relative active:scale-95 ${
                isCollapsed ? 'justify-center p-3' : 'px-5 py-4 gap-4'
              } ${
                activeTab === tab.id 
                  ? 'bg-king-primary text-white shadow-mint' 
                  : 'text-stone-500 hover:bg-stone-50'
              }`}
            >
              <span className={`transition-transform group-hover:scale-110 duration-300`}>
                {tab.icon(activeTab === tab.id)}
              </span>
              {!isCollapsed && (
                <span className="tracking-wide text-sm font-medium">{tab.label}</span>
              )}
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-4 bg-stone-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  {tab.label}
                </div>
              )}
            </button>
          ))}
        </nav>
        
        {/* Profile / Bottom Section */}
        <div className={`p-4 mt-auto mb-4 ${isCollapsed ? 'px-4' : 'px-6'}`}>
          <button 
            onClick={() => onTabChange('profile')}
            className={`w-full rounded-2xl transition-all duration-300 border border-transparent hover:border-stone-100 hover:bg-white hover:shadow-sm active:scale-95 ${
              activeTab === 'profile' ? 'bg-white border-stone-100 shadow-sm' : ''
            } ${
              isCollapsed ? 'p-2 flex justify-center' : 'p-3 flex items-center gap-3'
            }`}
          >
            {isCollapsed ? (
              <div className="w-10 h-10 rounded-full bg-king-primary text-white flex items-center justify-center font-display font-bold text-lg">
                {userProfile?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-king-primary text-white flex items-center justify-center font-display font-bold text-lg">
                  {userProfile?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1 text-left overflow-hidden">
                  <div className="font-bold text-sm text-king-text truncate">{userProfile?.name || 'User'}</div>
                  <div className="text-[10px] text-stone-400 uppercase tracking-wider">Level {level}</div>
                </div>
              </>
            )}
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative scroll-smooth bg-king-cream w-full">
        <div className={`min-h-full ${hideMobileNav ? '' : 'pb-32'} md:pb-12`}>
          {children}
        </div>
      </main>
      
      {/* Mobile Nav - Sticky Footer */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 glass-nav border-t border-stone-100 flex justify-around items-center px-4 py-3 z-40 shadow-[0_-5px_20px_rgba(0,0,0,0.03)] transition-transform duration-300 ${hideMobileNav ? 'translate-y-full' : 'translate-y-0'}`}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button 
              key={tab.id} 
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center w-full gap-1 transition-all active:scale-90 ${
                isActive ? 'text-king-primary' : 'text-stone-400'
              }`}
            >
              <div className={`transition-all duration-300 ${isActive ? 'translate-y-0' : 'translate-y-1'}`}>
                {tab.icon(isActive)}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0 h-0'}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
        {/* Mobile Profile Tab */}
        <button 
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center justify-center w-full gap-1 transition-all active:scale-90 ${
            activeTab === 'profile' ? 'text-king-primary' : 'text-stone-400'
          }`}
        >
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-all ${
            activeTab === 'profile' 
              ? 'border-king-primary bg-king-primary text-white' 
              : 'border-current'
          }`}>
            {userProfile?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-widest transition-opacity duration-300 ${activeTab === 'profile' ? 'opacity-100' : 'opacity-0 h-0'}`}>
            Profile
          </span>
        </button>
      </nav>
    </div>
  );
};