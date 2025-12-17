import React, { useState, useEffect } from 'react';
import { Book, BookProgress, UserProfile, BookLesson, Demographic } from '../types';

interface LibraryProps {
  userProfile: UserProfile;
  progress: BookProgress[];
  onUpdateProgress: (bookId: string, chapter: number) => void;
  onAddHabit: (title: string, category: 'THOUGHT' | 'SPEECH' | 'ACTION') => void;
  className?: string;
  autoSelect?: boolean;
  onOpenChat?: () => void;
}

const BOOKS: Book[] = [
  { id: 'tanya', title: 'Tanya', hebrewTitle: 'תניא', description: 'The fundamental work of Chabad Chassidus.', totalChapters: 53 },
  { id: 'tehillim', title: 'Tehillim', hebrewTitle: 'תהילים', description: 'Psalms of David.', totalChapters: 150 },
  { id: 'avot', title: 'Pirkei Avot', hebrewTitle: 'פרקי אבות', description: 'Ethics of the Fathers.', totalChapters: 6 },
  { id: 'mitzvos', title: 'Sefer HaMitzvos', hebrewTitle: 'ספר המצוות', description: 'The 613 Commandments.', totalChapters: 613 },
];

const NOAHIDE_BOOKS: Book[] = [
  { id: 'seven_laws', title: 'The Seven Laws', hebrewTitle: '', description: 'The Divine Code for all humanity.', totalChapters: 7 },
  { id: 'psalms', title: 'Psalms', hebrewTitle: '', description: 'Songs of King David.', totalChapters: 150 },
  { id: 'ethics', title: 'Ethics of Fathers', hebrewTitle: '', description: 'Timeless wisdom for character refinement.', totalChapters: 6 },
  { id: 'duties', title: 'Duties of the Heart', hebrewTitle: '', description: 'Gate of Trust and Unity.', totalChapters: 10 },
];

const HARDCODED_LESSONS: Record<string, BookLesson> = {
  'tanya-1': {
    title: "Chapter 1: The Two Souls",
    content: `We are taught: "An oath is administered to him [before birth]: 'Be righteous and be not wicked; and even if the whole world tells you that you are righteous, regard yourself as if you were wicked.'" This requires understanding. If one regards himself as wicked, he will be sad and depressed, unable to serve G-d with joy.\n\nRather, the explanation lies in the nature of the soul. Every Jew possesses two distinct souls. One is the "Animal Soul" (Nefesh HaBamis), derived from Kelipat Nogah, which drives natural instincts and desires. The other is the "G-dly Soul" (Nefesh HaElokis), which is literally a "part of G-d above."\n\nThe G-dly Soul desires only to unite with its source, G-d. The Animal Soul desires self-preservation and pleasure. The struggle between these two defines our lives.`,
    summary: "We have two souls: an Animal Soul focused on self, and a G-dly Soul focused on G-d.",
    practicalApplication: "Identify one impulse today as coming from your 'Animal Soul' and consciously choose to act with your 'G-dly Soul' instead."
  },
  'seven_laws-1': {
    title: "Introduction: The Foundation",
    content: `The Seven Noahide Laws are not merely a legal code, but a spiritual path designed by the Creator for all humanity. They represent the baseline for a civilized, ethical, and G-dly society.\n\nThese laws are: 1. Prohibition of Idolatry, 2. Prohibition of Blasphemy, 3. Prohibition of Murder, 4. Prohibition of Theft, 5. Prohibition of Sexual Immorality, 6. Prohibition of Eating a Limb from a Living Animal, 7. Requirement to Establish Courts of Justice.\n\nBy observing these, a person connects their soul to the Infinite, fulfilling their purpose in creation.`,
    summary: "The Seven Laws are the divine structure for a righteous world.",
    practicalApplication: "Reflect on how these 7 principles shape a just society."
  }
};

export const Library: React.FC<LibraryProps> = ({ userProfile, progress, onUpdateProgress, onAddHabit, className, autoSelect, onOpenChat }) => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [lesson, setLesson] = useState<BookLesson | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const isNoahide = userProfile.demographic === Demographic.NON_JEWISH;
  const activeBooks = isNoahide ? NOAHIDE_BOOKS : BOOKS;
  const getProgress = (bookId: string) => progress.find(p => p.bookId === bookId)?.currentChapter || 1;

  // Auto-select text on desktop (if autoSelect is true and window width is large)
  useEffect(() => {
    if (autoSelect && !selectedBook && window.innerWidth >= 768) {
      const defaultBook = activeBooks[0]; // Usually Tanya or Seven Laws
      handleBookSelect(defaultBook);
    }
  }, [autoSelect, isNoahide]);

  const handleBookSelect = (book: Book) => {
    setSelectedBook(book);
    const chapter = getProgress(book.id);
    const key = `${book.id}-${chapter}`;
    // Fallback for demo purposes
    const hardcoded = HARDCODED_LESSONS[key] || {
      title: `Chapter ${chapter}`,
      content: `Content for ${book.title} Chapter ${chapter} is loading from the archives. Please select Tanya Chapter 1 or Seven Laws Chapter 1 for demo content.`,
      summary: "Coming soon.",
      practicalApplication: "Patience is a virtue."
    };
    setLesson(hardcoded);
  };

  const toggleSpeech = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else if (lesson) {
      const utterance = new SpeechSynthesisUtterance(lesson.content);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  // READING VIEW
  if (selectedBook && lesson) {
    return (
      <div className={`flex flex-col relative h-full bg-king-cream ${className}`}>
        {/* Sticky Header */}
        <div className="px-6 py-4 bg-king-cream/95 backdrop-blur z-20 border-b border-stone-100 flex items-center justify-between sticky top-0 flex-shrink-0">
          <div>
            <button 
              onClick={() => {
                window.speechSynthesis.cancel();
                setSelectedBook(null);
              }}
              className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-1 flex items-center gap-1 hover:text-king-primary transition-colors active:scale-95"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M15 18l-6-6 6-6" /></svg>
              Library
            </button>
            <h1 className="font-display text-xl text-king-text">{selectedBook.title}</h1>
          </div>
          <div className="flex gap-2 items-center">
            <button 
              onClick={toggleSpeech}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 ${
                isPlaying 
                  ? 'bg-king-primary text-white shadow-glow animate-pulse' 
                  : 'bg-stone-100 text-stone-400 hover:text-king-primary'
              }`}
            >
              {isPlaying ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>
            {/* Mobile Chat Button */}
            <button 
              onClick={onOpenChat} 
              className="md:hidden w-10 h-10 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center hover:text-king-primary active:scale-90"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto relative custom-scrollbar">
          <div className="px-6 py-6 pb-32 max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-100 relative overflow-visible mb-6">
              <h2 className="font-serif text-lg text-king-primary mb-6">{lesson.title}</h2>
              <div className="prose prose-stone prose-lg leading-loose font-serif text-king-text/90">
                {lesson.content.split('\n\n').map((para, i) => (
                  <p key={i} className="mb-4 first:drop-cap">{para}</p>
                ))}
              </div>
            </div>

            {/* Actionable Section */}
            <div className="bg-king-primary/5 rounded-3xl p-6 border border-king-primary/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-king-primary/20 text-king-primary flex items-center justify-center font-bold">!</div>
                <h4 className="font-display text-sm text-king-primary uppercase tracking-widest">Practical Mission</h4>
              </div>
              <p className="text-sm text-king-text italic mb-6">{lesson.practicalApplication}</p>
            </div>
          </div>
        </div>

        {/* Footer - Absolute to bottom of container */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-king-cream via-king-cream to-transparent z-20 pointer-events-none flex justify-center">
          <button 
            onClick={() => {
              onAddHabit(lesson.practicalApplication, 'ACTION');
              onUpdateProgress(selectedBook.id, getProgress(selectedBook.id) + 1);
              window.speechSynthesis.cancel();
              setSelectedBook(null);
            }}
            className="pointer-events-auto w-full max-w-sm bg-king-primary text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:shadow-glow hover:scale-[1.02] active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>Accept & Complete</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12l5 5L20 7"/></svg>
          </button>
        </div>
      </div>
    )
  }

  // LIBRARY LIST VIEW
  return (
    <div className={`h-full overflow-y-auto px-6 py-8 pb-24 ${className}`}>
      <div className="max-w-md mx-auto md:max-w-none">
        <div className="flex justify-between items-center mb-2">
          <h1 className="font-display text-3xl text-king-text animate-fade-in">Library</h1>
          {/* Mobile Chat Button for List View */}
          <button 
            onClick={onOpenChat} 
            className="md:hidden px-4 py-2 rounded-full bg-stone-100 text-king-text text-xs font-bold uppercase tracking-widest hover:bg-king-primary hover:text-white transition-colors active:scale-95"
          >
            Ask King
          </button>
        </div>
        <p className="text-stone-400 text-sm mb-8 font-serif animate-fade-in delay-100">Select a text to begin study.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeBooks.map((book, i) => (
            <div 
              key={book.id} 
              onClick={() => handleBookSelect(book)}
              className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:border-king-primary/30 hover:shadow-card-hover hover:-translate-y-1 active:scale-[0.99] transition-all cursor-pointer group animate-slide-up flex flex-col justify-between"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-display text-xl text-king-text group-hover:text-king-primary transition-colors">{book.title}</h3>
                  {book.hebrewTitle && <span className="font-serif text-stone-300 italic text-sm">{book.hebrewTitle}</span>}
                </div>
                <p className="text-sm text-stone-500 mb-6 line-clamp-2 leading-relaxed">{book.description}</p>
              </div>
              <div className="flex items-center gap-4 mt-auto">
                <div className="flex-1 bg-stone-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-king-primary h-full rounded-full" 
                    style={{ width: `${(getProgress(book.id) / (book.totalChapters||1)) * 100}%` }}
                  ></div>
                </div>
                <span className="text-[10px] font-bold text-stone-400">{getProgress(book.id)}/{book.totalChapters}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};