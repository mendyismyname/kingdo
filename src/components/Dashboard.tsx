import React, { useEffect, useState } from 'react';
import { UserProfile, Insight, Habit, NewsItem } from '../types';
import { generateDailyInsight } from '../services/geminiService';

interface DashboardProps {
  userProfile: UserProfile;
  habits: Habit[];
  onAddHabit: (title: string, category: 'THOUGHT' | 'SPEECH' | 'ACTION') => void;
  onNavigate: (tab: string) => void;
  onToggleHabit: (id: string, date: string) => void;
}

const HARDCODED_NEWS_FEED: NewsItem[] = [
  {
    id: 'news-1',
    category: 'Fashion & Lifestyle',
    headline: "The Quiet Luxury of Modesty: Fall Trends 2025",
    summary: "High fashion houses are pivoting towards covered elegance. We explore how external garments reflect internal dignity (Kavod HaBriyot).",
    spiritualInsight: "Clothing is the interface between the soul and the world. When we dress with dignity, we declare that what is inside is sacred and worthy of protection.",
    imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800",
    author: "Vogue / Tznius.co",
    date: "2 hrs ago"
  },
  {
    id: 'news-2',
    category: 'Hip Hop & Culture',
    headline: "Rhythm and Flow: Finding the Heartbeat of Creation",
    summary: "Top producers discuss the spiritual origins of beat-making. A look at how repetitive loops mirror the constant renewal of creation.",
    spiritualInsight: "Music (Neginah) comes from a higher world than speech. A broken heart can be healed by a melody because the tune touches the essence of the soul where words cannot reach.",
    imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800",
    author: "Rolling Stone / Anash",
    date: "4 hrs ago"
  },
  {
    id: 'news-3',
    category: 'Architecture',
    headline: "Building Sanctuaries: Minimalist Design Meets Sacred Space",
    summary: "Architects are rediscovering the power of 'empty space' to create focus. How physical structures can become dwelling places for the Divine.",
    spiritualInsight: "The purpose of a home is not the walls, but the space inside that hosts guests and Torah. We build physical vessels to hold infinite light (Dirah BeTachtonim).",
    imageUrl: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80&w=800",
    author: "Architectural Digest",
    date: "6 hrs ago"
  },
  {
    id: 'news-4',
    category: 'Business & Tech',
    headline: "The AI Revolution: Efficiency as a Tool for Kindness",
    summary: "New automation tools are freeing up thousands of hours. The question remains: Will we use this time for leisure or for more connection?",
    spiritualInsight: "Technology is a neutral beast. Its holiness comes from its use. If an algorithm saves you time, that time belongs to your Creator. Invest it in a Mitzvah.",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
    author: "Wall Street Journal",
    date: "12 hrs ago"
  }
];

const HARDCODED_ARTICLE = `
The world is not a barrier to G-dliness; it is the very material from which we construct a home for the Divine. In Chassidus, we learn that there is no place void of Him. This means that the studio, the runway, the boardroom, and the gym are not "secular" spaces—they are simply unrefined. They are waiting for a King.

**The Beat of the Soul**
When a hip hop artist constructs a flow, they are tapping into the rhythm of the universe. The heartbeat, the seasons, the breath—all operate in loops. By elevating the lyrics to praise the Creator or inspire hope, the "shell" (Kelipah) of the music falls away, revealing the spark.

**The Fabric of Reality**
Fashion is often dismissed as vanity. But the Kohen Gadol (High Priest) wore specific, beautiful garments to serve in the Temple. Why? Because beauty inspires awe. When we dress with intention, we are not hiding; we are framing the Divine image within us.

**Actionable Insight**
Take the thing you love most—be it coding, running, or painting—and ask: "How can this serve the King?" Do not abandon your talents. Sanctify them.
`;

const HARDCODED_UPDATES = [
  {
    title: 'Mincha Schedule Change',
    body: 'Starting Sunday, Mincha will be at 4:30 PM due to early sunset. Please check the new winter schedule.',
    type: 'ALERT'
  },
  {
    title: 'Tonight: Farbrengen',
    body: 'Join us at the Main Shul for a Yud Tes Kislev gathering. 8:00 PM. Guest speaker Rabbi Jacobson.',
    type: 'EVENT'
  },
  {
    title: 'Job Fair Next Week',
    body: 'The annual community Parnassah Expo is happening Tuesday at the Event Hall. Bring your resumes.',
    type: 'INFO'
  },
  {
    title: 'New Mikvah Hours',
    body: 'Women\'s Mikvah is now open until 11:00 PM on weeknights.',
    type: 'INFO'
  }
];

export const Dashboard: React.FC<DashboardProps> = ({ userProfile, habits, onAddHabit, onNavigate, onToggleHabit }) => {
  const [insight, setInsight] = useState<Insight | null>(null);
  const [news, setNews] = useState<NewsItem[]>(HARDCODED_NEWS_FEED);
  const [loading, setLoading] = useState(true);
  const [dateDisplay, setDateDisplay] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<NewsItem | null>(null);

  // Helper to strip markdown (bolding)
  const cleanText = (text: string | undefined) => {
    if (!text) return "";
    return text.replace(/\*\*/g, '').replace(/\*/g, '');
  };

  useEffect(() => {
    try {
      const date = new Date();
      const formatter = new Intl.DateTimeFormat('en-u-ca-hebrew', { day: 'numeric', month: 'long', year: 'numeric' });
      setDateDisplay(formatter.format(date));
    } catch (e) {
      setDateDisplay(new Date().toDateString());
    }

    let isMounted = true;
    const fetchData = async () => {
      const today = new Date().toDateString();
      const storedInsight = localStorage.getItem(`king_insight_${today}`);
      if (storedInsight) {
        setInsight(JSON.parse(storedInsight));
        setLoading(false);
        return;
      }

      // Fetch fresh data (Only Insight is AI now, News is hardcoded)
      const newInsight = await generateDailyInsight(userProfile);
      if (isMounted) {
        setInsight(newInsight);
        setLoading(false);
        localStorage.setItem(`king_insight_${today}`, JSON.stringify(newInsight));
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [userProfile]);

  const todayStr = new Date().toISOString().split('T')[0];

  // Profile progress calculation
  const levelProgress = ((userProfile.level % 1) + 0.7) * 100; // Mock progress for visual
  const radius = 24; // Increased slightly for better visual
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (levelProgress / 100) * circumference;

  const formatArticleContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      const cleaned = cleanText(line);
      if (line.includes('The Beat of the Soul') || line.includes('The Fabric of Reality')) {
        return <h3 key={i} className="font-display font-bold text-lg mt-6 mb-2 text-king-text">{cleaned}</h3>;
      }
      if (line.trim() === '') return <div key={i} className="h-2" />;
      return <p key={i} className="mb-4 text-stone-600 leading-relaxed font-serif">{cleaned}</p>;
    });
  };

  return (
    <div className="relative min-h-full">
      <div className="p-6 md:p-12 max-w-5xl mx-auto space-y-12 pb-24">
        {/* Header */}
        <header className="flex justify-between items-center pt-4 animate-fade-in">
          <div className="flex flex-col gap-2">
            <h2 className="text-xs font-bold text-stone-400 uppercase tracking-[0.2em]">{dateDisplay}</h2>
            <h1 className="font-display text-3xl md:text-5xl text-king-text font-bold tracking-tight">
              Greetings, {userProfile.name}
            </h1>
          </div>

          {/* Profile Progress Circle - Centering Fix */}
          <div 
            className="relative w-14 h-14 cursor-pointer group flex-shrink-0 active:scale-95 transition-transform" 
            onClick={() => onNavigate('profile')}
          >
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 60 60">
              <circle cx="30" cy="30" r={radius} stroke="#E5E7EB" strokeWidth="4" fill="none" />
              <circle cx="30" cy="30" r={radius} stroke="var(--king-primary)" strokeWidth="4" fill="none" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-9 h-9 rounded-full bg-king-surface shadow-sm border border-stone-100 flex items-center justify-center text-xs font-bold text-king-text group-hover:scale-105 transition-transform">
                {userProfile.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* SECTION 1: Daily Avodah (Habits) */}
        <section className="animate-slide-up">
          <div className="flex justify-between items-center mb-6 px-2 border-b border-stone-100 pb-4">
            <h3 className="font-display text-xl text-king-text font-bold">Daily Avodah</h3>
            <button 
              onClick={() => onNavigate('habits')} 
              className="text-xs font-bold text-king-primary uppercase tracking-wider hover:underline active:opacity-70"
            >
              View All
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {habits.slice(0, 4).map((habit, idx) => {
              const isCompleted = habit.history[todayStr];
              return (
                <div 
                  key={habit.id} 
                  onClick={() => onToggleHabit(habit.id, todayStr)}
                  className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center gap-4 group h-full animate-slide-up ${
                    isCompleted 
                      ? 'bg-king-primary/5 border-king-primary/20 shadow-inner' 
                      : 'bg-white border-stone-100 shadow-sm hover:shadow-card-hover hover:-translate-y-1 hover:border-king-primary/20 active:scale-98'
                  }`}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className={`w-8 h-8 shrink-0 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-king-primary border-king-primary text-white scale-110' 
                      : 'border-stone-200 text-transparent group-hover:border-king-primary/50'
                  }`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className={`text-sm font-bold truncate transition-all ${isCompleted ? 'text-king-primary line-through opacity-60' : 'text-king-text'}`}>{habit.title}</span>
                    <span className="text-[10px] text-stone-400 uppercase tracking-wider">{habit.category}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* SECTION 2: Hero Insight Card */}
        <section className="bg-king-gradient text-white p-8 md:p-10 rounded-[2rem] shadow-glow relative overflow-hidden group animate-slide-up delay-100 transition-transform hover:scale-[1.01] duration-500 active:scale-[0.99] cursor-default">
          {/* Abstract Shapes */}
          <div className="absolute -right-10 -top-10 w-80 h-80 bg-white/10 rounded-full blur-3xl mix-blend-overlay"></div>
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-black/10 rounded-full blur-3xl mix-blend-overlay"></div>

          {loading ? (
            <div className="animate-pulse space-y-6 max-w-xl">
              <div className="h-2 bg-white/20 w-1/4 rounded mb-8"></div>
              <div className="h-4 bg-white/20 w-3/4 rounded"></div>
              <div className="h-4 bg-white/20 w-1/2 rounded"></div>
            </div>
          ) : (
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-6 opacity-80">
                  <div className="p-1.5 bg-white/20 rounded-full backdrop-blur-sm">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                  </div>
                  <span className="text-xs font-bold tracking-widest uppercase">Daily Insight</span>
                </div>
                <p className="font-serif text-xl md:text-2xl leading-relaxed mb-8 drop-shadow-sm italic text-white/95">
                  "{cleanText(insight?.content)}"
                </p>
                <p className="text-xs text-white/70 uppercase tracking-widest font-bold">
                  — {cleanText(insight?.source)}
                </p>
              </div>
              {insight?.actionableStep && (
                <div className="md:self-end">
                  <button 
                    onClick={() => {
                      onAddHabit(cleanText(insight.actionableStep), 'ACTION');
                      onNavigate('habits');
                    }}
                    className="bg-white text-king-primary px-6 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-opacity-95 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 flex items-center gap-3 group/btn"
                  >
                    <span>Accept Mission</span>
                    <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* SECTION 3: Royal News Feed */}
        <section className="animate-slide-up delay-200">
          <div className="flex justify-between items-end mb-6 px-2 border-b border-stone-100 pb-4">
            <div>
              <h3 className="font-display text-2xl text-king-text font-bold flex items-center gap-3">
                Royal Report
                <span className="text-[10px] bg-king-secondary text-white px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm font-sans transform -translate-y-1">Latest</span>
              </h3>
              <p className="text-xs text-stone-400 font-serif italic mt-1">Bringing the Divine into Fashion, Business, Music & More.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {news.map((item, idx) => (
              <article 
                key={idx} 
                onClick={() => setSelectedArticle(item)}
                className="bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-card hover:shadow-card-hover hover:-translate-y-1 active:scale-[0.99] transition-all duration-300 group cursor-pointer h-full flex flex-col"
              >
                {/* Image Container */}
                <div className="relative aspect-video overflow-hidden bg-stone-100">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.headline} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  ) : (
                    <div className="w-full h-full bg-king-primary/10 flex items-center justify-center text-king-primary/30 text-4xl font-display">♔</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/95 backdrop-blur text-king-text text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3 text-[10px] text-stone-400 font-medium uppercase tracking-wider">
                    <span className="text-king-primary">{item.author}</span>
                    <span>•</span>
                    <span>{item.date}</span>
                  </div>
                  <h4 className="font-serif font-bold text-xl text-king-text mb-3 leading-snug group-hover:text-king-primary transition-colors">
                    {cleanText(item.headline)}
                  </h4>
                  <p className="text-sm text-stone-500 mb-6 line-clamp-2 leading-relaxed font-sans">
                    {cleanText(item.summary)}
                  </p>
                  <div className="mt-auto bg-stone-50 rounded-xl p-4 border border-stone-100 relative">
                    <div className="absolute -top-3 left-4 bg-king-secondary text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded shadow-sm">
                      King's Take
                    </div>
                    <p className="text-xs text-stone-600 font-serif italic leading-relaxed">
                      "{cleanText(item.spiritualInsight)}"
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* SECTION 4: Continue Reading */}
        <section className="animate-slide-up delay-300">
          <h3 className="font-display text-xl text-king-text font-bold mb-6 px-2 border-b border-stone-100 pb-4">Continue Reading</h3>
          <div 
            onClick={() => onNavigate('library')}
            className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm hover:shadow-card-hover hover:-translate-y-1 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-20 bg-king-text rounded shadow-md flex items-center justify-center text-white/20 text-3xl font-display">
                T
              </div>
              <div>
                <div className="text-[10px] text-king-primary font-bold uppercase tracking-widest mb-1">Current Study</div>
                <h4 className="font-display text-lg font-bold text-king-text">Tanya: Chapter 1</h4>
                <p className="text-sm text-stone-400 font-serif italic">The struggle of the intermediate...</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-stone-50 text-king-primary flex items-center justify-center group-hover:bg-king-primary group-hover:text-white transition-colors">
              →
            </div>
          </div>
        </section>

        {/* SECTION 5: Community Happenings (New) */}
        <section className="animate-slide-up delay-400">
          <h3 className="font-display text-xl text-king-text font-bold mb-6 px-2 border-b border-stone-100 pb-4">Community Happenings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {HARDCODED_UPDATES.map((update, idx) => (
              <div 
                key={idx} 
                className={`p-6 rounded-3xl border flex gap-4 transition-all hover:-translate-y-1 hover:shadow-md ${
                  update.type === 'ALERT' 
                    ? 'bg-amber-50 border-amber-100' 
                    : 'bg-white border-stone-100'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  update.type === 'ALERT' 
                    ? 'bg-amber-200 text-amber-700' 
                    : 'bg-king-primary/10 text-king-primary'
                }`}>
                  {update.type === 'ALERT' ? '!' : '📅'}
                </div>
                <div>
                  <h4 className={`font-bold text-sm mb-1 ${
                    update.type === 'ALERT' 
                      ? 'text-amber-900' 
                      : 'text-king-text'
                  }`}>{update.title}</h4>
                  <p className="text-xs text-stone-500 leading-relaxed">{update.body}</p>
                  {update.type === 'ALERT' && (
                    <button 
                      onClick={() => onNavigate('community')} 
                      className="text-[10px] font-bold uppercase tracking-widest text-amber-700 mt-2 hover:underline"
                    >
                      View Board
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Article Side Sheet */}
      {selectedArticle && (
        <>
          <div 
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-40 transition-opacity duration-500" 
            onClick={() => setSelectedArticle(null)}
          />
          <div className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-king-cream z-50 shadow-2xl overflow-y-auto animate-slide-in-right flex flex-col">
            {/* Cover Image */}
            <div className="relative h-64 md:h-80 shrink-0">
              {selectedArticle.imageUrl ? (
                <img src={selectedArticle.imageUrl} className="w-full h-full object-cover" alt="Article Cover"/>
              ) : (
                <div className="w-full h-full bg-king-primary/10" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-king-cream to-transparent"></div>
              <button 
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-king-primary transition-all shadow-lg border border-white/20"
              >
                ✕
              </button>
            </div>
            <div className="px-8 md:px-12 pb-12 -mt-20 relative">
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-stone-100">
                <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-widest text-king-primary">
                  <span>{selectedArticle.category}</span>
                  <span className="text-stone-300">•</span>
                  <span className="text-stone-400">{selectedArticle.date}</span>
                </div>
                <h2 className="font-display text-2xl md:text-4xl text-king-text font-bold mb-6 leading-tight">
                  {cleanText(selectedArticle.headline)}
                </h2>
                <p className="text-lg font-serif italic text-stone-500 mb-8 leading-relaxed">
                  {cleanText(selectedArticle.summary)}
                </p>
                <div className="prose prose-stone prose-lg">
                  {formatArticleContent(HARDCODED_ARTICLE)}
                </div>
                <div className="mt-12 pt-8 border-t border-stone-100">
                  <div className="bg-king-primary/5 rounded-2xl p-6 border border-king-primary/10">
                    <h4 className="font-display text-sm font-bold text-king-primary uppercase tracking-widest mb-2">The King's Take</h4>
                    <p className="font-serif italic text-stone-700">
                      "{cleanText(selectedArticle.spiritualInsight)}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};