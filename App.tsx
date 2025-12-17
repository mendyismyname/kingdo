import React, { useState, useEffect } from 'react';
import { Onboarding } from './components/Onboarding';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { HabitTracker } from './components/HabitTracker';
import { StudySession } from './components/StudySession';
import { Library } from './components/Library';
import { Profile } from './components/Profile';
import { Community } from './components/Community';
import { LandingPage } from './components/LandingPage';
import { UserProfile, Habit, BookProgress, Demographic, AppTheme, AppLanguage } from './types';

const App: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [habits, setHabits] = useState<Habit[]>([]);
  const [bookProgress, setBookProgress] = useState<BookProgress[]>([]);
  const [showLanding, setShowLanding] = useState(true);
  
  // Mobile Study Mode: 'text' (default) or 'chat'
  const [mobileStudyMode, setMobileStudyMode] = useState<'text' | 'chat'>('text');

  // Theme Management
  useEffect(() => {
      const theme = profile?.theme || 'mint';
      document.body.className = `theme-${theme}`;
  }, [profile?.theme]);

  // Load state
  useEffect(() => {
    const savedProfile = localStorage.getItem('king_profile');
    const savedHabits = localStorage.getItem('king_habits');
    const savedBooks = localStorage.getItem('king_books');
    if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        setProfile({ ...parsed, totalStudyMinutes: parsed.totalStudyMinutes || 0 });
        // If profile exists, skip landing page
        setShowLanding(false);
    }
    if (savedHabits) {
        const parsed = JSON.parse(savedHabits);
        setHabits(parsed.map((h: any) => ({
            ...h,
            history: h.history || (h.completed ? { [new Date().toISOString().split('T')[0]]: true } : {}),
            currentStreak: h.currentStreak || 0
        })));
    }
    if (savedBooks) setBookProgress(JSON.parse(savedBooks));
  }, []);

  // Save state
  useEffect(() => {
    if (profile) localStorage.setItem('king_profile', JSON.stringify(profile));
    if (habits) localStorage.setItem('king_habits', JSON.stringify(habits));
    if (bookProgress) localStorage.setItem('king_books', JSON.stringify(bookProgress));
  }, [profile, habits, bookProgress]);

  const handleOnboardingComplete = (newProfile: UserProfile) => {
    setProfile({ ...newProfile, totalStudyMinutes: 0, theme: 'mint', language: AppLanguage.ENGLISH });
    
    // Assign habits based on demographic
    let initialHabits: Habit[] = [];
    if (newProfile.demographic === Demographic.NON_JEWISH) {
        initialHabits = [
            { id: '1', title: 'Daily Prayer', category: 'SPEECH', history: {}, frequency: 'DAILY', currentStreak: 0 },
            { id: '2', title: 'Give Charity', category: 'ACTION', history: {}, frequency: 'DAILY', currentStreak: 0 },
            { id: '3', title: 'Act of Kindness', category: 'ACTION', history: {}, frequency: 'DAILY', currentStreak: 0 },
        ];
    } else {
        initialHabits = [
            { id: '1', title: 'Morning Brachos', category: 'SPEECH', history: {}, frequency: 'DAILY', currentStreak: 0 },
            { id: '2', title: 'Tefillin', category: 'ACTION', history: {}, frequency: 'DAILY', currentStreak: 0 },
            { id: '3', title: 'Chesed Action', category: 'ACTION', history: {}, frequency: 'DAILY', currentStreak: 0 },
        ];
    }
    
    setHabits(initialHabits);
  };

  const toggleHabit = (id: string, dateStr: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
          const newHistory = { ...h.history, [dateStr]: !h.history[dateStr] };
          if (!newHistory[dateStr]) delete newHistory[dateStr];
          
          let streak = 0;
          if (newHistory[new Date().toISOString().split('T')[0]]) streak = 1;
          
          return { ...h, history: newHistory, currentStreak: streak };
      }
      return h;
    }));
  };

  const addHabit = (title: string, category: 'THOUGHT' | 'SPEECH' | 'ACTION') => {
    setHabits(prev => [...prev, {
      id: Date.now().toString(),
      title,
      category,
      history: {},
      frequency: 'DAILY',
      currentStreak: 0
    }]);
  };

  const updateBookProgress = (bookId: string, chapter: number) => {
      setBookProgress(prev => {
          const existing = prev.findIndex(p => p.bookId === bookId);
          if (existing > -1) {
              const updated = [...prev];
              updated[existing] = { ...updated[existing], currentChapter: chapter };
              return updated;
          }
          return [...prev, { bookId, currentChapter: chapter }];
      });
  };

  const updateTheme = (theme: AppTheme) => {
      if (profile) setProfile({ ...profile, theme });
  };

  const updateLanguage = (language: AppLanguage) => {
      if (profile) setProfile({ ...profile, language });
  }

  const updateCommunity = (community: string) => {
      if (profile) setProfile({ ...profile, community });
  }

  const updateName = (name: string) => {
      if (profile) setProfile({ ...profile, name });
  }

  const resetProfile = () => {
      if(confirm("Reset all data?")) {
          localStorage.clear();
          setProfile(null);
          setHabits([]);
          setBookProgress([]);
          setShowLanding(true); // Go back to landing page on reset
      }
  }

  // Reset mobile mode if navigating away from study
  const handleTabChange = (tab: string) => {
      setActiveTab(tab);
      if (tab !== 'study' && tab !== 'library') {
          setMobileStudyMode('text');
      }
  }

  // ROUTING LOGIC
  if (showLanding && !profile) {
      return <LandingPage onEnter={() => setShowLanding(false)} />;
  }

  if (!profile) return <Onboarding onComplete={handleOnboardingComplete} />;

  return (
    <Layout 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        userProfile={profile}
        hideMobileNav={(activeTab === 'study' || activeTab === 'library') && mobileStudyMode === 'chat'}
    >
      
      {/* DASHBOARD */}
      {activeTab === 'dashboard' && (
        <Dashboard 
          userProfile={profile} 
          habits={habits}
          onAddHabit={addHabit}
          onNavigate={handleTabChange}
          onToggleHabit={toggleHabit}
        />
      )}

      {/* BUILDER */}
      {activeTab === 'habits' && (
        <HabitTracker 
          habits={habits} 
          onToggle={toggleHabit} 
          onAdd={addHabit}
        />
      )}

      {/* STUDY - SPLIT VIEW LOGIC */}
      {(activeTab === 'study' || activeTab === 'library') && (
        <div className="h-full w-full flex flex-col md:flex-row overflow-hidden relative">
             
             {/* LEFT PANE: Library/Text */}
             {/* Mobile: Visible if mode is 'text'. Desktop: Always visible. */}
             <div className={`${mobileStudyMode === 'text' ? 'flex' : 'hidden'} md:flex flex-1 h-full relative border-r border-stone-200 overflow-hidden`}>
                <Library 
                    userProfile={profile}
                    progress={bookProgress}
                    onUpdateProgress={updateBookProgress}
                    onAddHabit={addHabit}
                    className="w-full h-full"
                    autoSelect={true}
                    onOpenChat={() => setMobileStudyMode('chat')}
                />
             </div>

             {/* RIGHT PANE: Companion/Chat */}
             {/* Mobile: Visible if mode is 'chat'. Desktop: Always visible. */}
             <div className={`${mobileStudyMode === 'chat' ? 'flex fixed inset-0 z-50' : 'hidden'} md:static md:flex w-full md:w-[400px] h-full bg-white flex-col border-l border-stone-50`}>
                <StudySession 
                    userProfile={profile}
                    onAddHabit={addHabit}
                    onSessionComplete={(m) => setProfile(p => p ? ({...p, totalStudyMinutes: (p.totalStudyMinutes||0)+m}) : null)}
                    onNavigateToLibrary={() => setMobileStudyMode('text')} // Close chat on mobile
                    embedded={true}
                    mobileMode={mobileStudyMode === 'chat'} // Flag to show back button on mobile
                />
             </div>
        </div>
      )}

      {/* COMMUNITY */}
      {activeTab === 'community' && (
          <Community userProfile={profile} />
      )}

      {/* PROFILE */}
      {activeTab === 'profile' && (
        <Profile 
            profile={profile} 
            habits={habits} 
            onReset={resetProfile}
            onUpdateTheme={updateTheme}
            onUpdateLanguage={updateLanguage}
            onUpdateCommunity={updateCommunity}
            onUpdateName={updateName}
        />
      )}
    </Layout>
  );
};

export default App;