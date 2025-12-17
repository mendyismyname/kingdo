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
import { supabase } from '.src/lib/supabase';
import { Auth } from './components/Auth';
// Import the test component
import { EnvTest } from './components/EnvTest';

const App: React.FC = () => {
  const [session, setSession] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [habits, setHabits] = useState<Habit[]>([]);
  const [bookProgress, setBookProgress] = useState<BookProgress[]>([]);
  const [isOnboardingNeeded, setIsOnboardingNeeded] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [mobileStudyMode, setMobileStudyMode] = useState<'text' | 'chat'>('text');
  // State for showing the env test
  const [showEnvTest, setShowEnvTest] = useState(true);

  // Theme Management
  useEffect(() => {
    const theme = profile?.theme || 'mint';
    document.body.className = `theme-${theme}`;
  }, [profile?.theme]);

  // Supabase Session Management
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        setShowLanding(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setShowLanding(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load user profile and data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error && error.code === 'PGRST116') {
            setIsOnboardingNeeded(true);
            setProfile(null);
            return;
          } else if (error) {
            throw error;
          }

          if (data) {
            setProfile({
              id: data.id,
              name: data.name,
              demographic: data.demographic,
              level: data.level || 1,
              streak: data.streak || 0,
              totalStudyMinutes: data.total_study_minutes || 0,
              theme: data.theme || 'mint',
              language: data.language || AppLanguage.ENGLISH,
              community: data.community,
              newsInterests: data.news_interests || []
            });
            setIsOnboardingNeeded(false);

            const savedHabits = localStorage.getItem(`king_habits_${session.user.id}`);
            const savedBooks = localStorage.getItem(`king_books_${session.user.id}`);
            if (savedHabits) {
              const parsed = JSON.parse(savedHabits);
              setHabits(parsed.map((h: any) => ({
                ...h,
                history: h.history || (h.completed ? { [new Date().toISOString().split('T')[0]]: true } : {}),
                currentStreak: h.currentStreak || 0
              })));
            }
            if (savedBooks) setBookProgress(JSON.parse(savedBooks));
          }
        } catch (error: any) {
          console.error('Error fetching user profile:', error.message);
        }
      } else {
        setProfile(null);
        setHabits([]);
        setBookProgress([]);
        setIsOnboardingNeeded(false);
      }
    };

    fetchUserProfile();
  }, [session]);

  // Save state to local storage
  useEffect(() => {
    if (profile && session?.user?.id) {
      localStorage.setItem(`king_profile_${session.user.id}`, JSON.stringify(profile));
      localStorage.setItem(`king_habits_${session.user.id}`, JSON.stringify(habits));
      localStorage.setItem(`king_books_${session.user.id}`, JSON.stringify(bookProgress));
    }
  }, [profile, habits, bookProgress, session]);

  const handleOnboardingComplete = async (newProfileData: Omit<UserProfile, 'id' | 'totalStudyMinutes' | 'theme' | 'language'>) => {
    if (!session?.user) {
      console.error('No active session to complete onboarding.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: session.user.id,
          name: newProfileData.name,
          demographic: newProfileData.demographic,
          level: 1,
          streak: 0,
          total_study_minutes: 0,
          theme: 'mint',
          language: AppLanguage.ENGLISH,
          community: newProfileData.community,
          news_interests: newProfileData.newsInterests
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const createdProfile: UserProfile = {
          id: data.id,
          name: data.name,
          demographic: data.demographic,
          level: data.level,
          streak: data.streak,
          totalStudyMinutes: data.total_study_minutes,
          theme: data.theme,
          language: data.language,
          community: data.community,
          newsInterests: data.news_interests
        };
        setProfile(createdProfile);
        setIsOnboardingNeeded(false);

        let initialHabits: Habit[] = [];
        if (createdProfile.demographic === Demographic.NON_JEWISH) {
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
      }
    } catch (error: any) {
      console.error('Error completing onboarding:', error.message);
    }
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
    setHabits(prev => [...prev, { id: Date.now().toString(), title, category, history: {}, frequency: 'DAILY', currentStreak: 0 }]);
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

  const updateTheme = async (theme: AppTheme) => {
    if (profile && session?.user) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ theme })
          .eq('id', session.user.id);
        if (error) throw error;
        setProfile({ ...profile, theme });
      } catch (error: any) {
        console.error('Failed to update theme: ' + error.message);
      }
    }
  };

  const updateLanguage = async (language: AppLanguage) => {
    if (profile && session?.user) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ language })
          .eq('id', session.user.id);
        if (error) throw error;
        setProfile({ ...profile, language });
      } catch (error: any) {
        console.error('Failed to update language: ' + error.message);
      }
    }
  }

  const updateCommunity = async (community: string) => {
    if (profile && session?.user) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ community })
          .eq('id', session.user.id);
        if (error) throw error;
        setProfile({ ...profile, community });
      } catch (error: any) {
        console.error('Failed to update community: ' + error.message);
      }
    }
  }

  const updateName = async (name: string) => {
    if (profile && session?.user) {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ name })
          .eq('id', session.user.id);
        if (error) throw error;
        setProfile({ ...profile, name });
      } catch (error: any) {
        console.error('Failed to update name: ' + error.message);
      }
    }
  }

  const resetProfile = async () => {
    if (confirm("Reset all data? This will sign you out and delete your profile from Supabase.")) {
      try {
        const { error: deleteProfileError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', session?.user?.id);
        if (deleteProfileError) throw deleteProfileError;

        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) throw signOutError;

        localStorage.clear();
        setProfile(null);
        setHabits([]);
        setBookProgress([]);
        setSession(null);
        setIsOnboardingNeeded(false);
        setShowLanding(true);
      } catch (error: any) {
        console.error('Failed to reset profile: ' + error.message);
      }
    }
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab !== 'study' && tab !== 'library') {
      setMobileStudyMode('text');
    }
  }

  // Show environment test component first
  if (showEnvTest) {
    return (
      <div className="min-h-screen bg-king-cream p-6">
        <div className="max-w-4xl mx-auto">
          <EnvTest />
          <button 
            onClick={() => setShowEnvTest(false)}
            className="mt-4 px-4 py-2 bg-king-primary text-white rounded-lg"
          >
            Continue to App
          </button>
        </div>
      </div>
    );
  }

  // ROUTING LOGIC
  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }

  if (!session) {
    return <Auth onAuthSuccess={() => { /* Session change handled by useEffect */ }} />;
  }

  if (isOnboardingNeeded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (!profile) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-king-cream">
        <p className="text-king-text font-display text-2xl animate-pulse">Loading Profile...</p>
      </div>
    );
  }

  return (
    <Layout activeTab={activeTab} onTabChange={handleTabChange} userProfile={profile} hideMobileNav={(activeTab === 'study' || activeTab === 'library') && mobileStudyMode === 'chat'}>
      {/* DASHBOARD */}
      {activeTab === 'dashboard' && (
        <Dashboard userProfile={profile} habits={habits} onAddHabit={addHabit} onNavigate={handleTabChange} onToggleHabit={toggleHabit} />
      )}

      {/* BUILDER */}
      {activeTab === 'habits' && (
        <HabitTracker habits={habits} onToggle={toggleHabit} onAdd={addHabit} />
      )}

      {/* STUDY - SPLIT VIEW LOGIC */}
      {(activeTab === 'study' || activeTab === 'library') && (
        <div className="h-full w-full flex flex-col md:flex-row overflow-hidden relative">
          {/* LEFT PANE: Library/Text */}
          <div className={`${mobileStudyMode === 'text' ? 'flex' : 'hidden'} md:flex flex-1 h-full relative border-r border-stone-200 overflow-hidden`}>
            <Library userProfile={profile} progress={bookProgress} onUpdateProgress={updateBookProgress} onAddHabit={addHabit} className="w-full h-full" autoSelect={true} onOpenChat={() => setMobileStudyMode('chat')} />
          </div>

          {/* RIGHT PANE: Companion/Chat */}
          <div className={`${mobileStudyMode === 'chat' ? 'flex fixed inset-0 z-50' : 'hidden'} md:static md:flex w-full md:w-[400px] h-full bg-white flex-col border-l border-stone-50`}>
            <StudySession userProfile={profile} onAddHabit={addHabit} onSessionComplete={(m) => setProfile(p => p ? ({...p, totalStudyMinutes: (p.totalStudyMinutes||0)+m}) : null)} onNavigateToLibrary={() => setMobileStudyMode('text')} embedded={true} mobileMode={mobileStudyMode === 'chat'} />
          </div>
        </div>
      )}

      {/* COMMUNITY */}
      {activeTab === 'community' && (
        <Community userProfile={profile} />
      )}

      {/* PROFILE */}
      {activeTab === 'profile' && (
        <Profile profile={profile} habits={habits} onReset={resetProfile} onUpdateTheme={updateTheme} onUpdateLanguage={updateLanguage} onUpdateCommunity={updateCommunity} onUpdateName={updateName} />
      )}
    </Layout>
  );
};

export default App;