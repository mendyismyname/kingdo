import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, ChatMessage, Demographic } from '../../types';
import { chatWithKing } from '../../services/geminiService';

interface StudySessionProps {
  userProfile: UserProfile;
  onAddHabit: (title: string, category: 'THOUGHT' | 'SPEECH' | 'ACTION') => void;
  onSessionComplete: (minutes: number) => void;
  onNavigateToLibrary?: () => void;
  embedded?: boolean;
  mobileMode?: boolean;
}

export const StudySession: React.FC<StudySessionProps> = ({ userProfile, onAddHabit, onSessionComplete, onNavigateToLibrary, embedded = false, mobileMode = false }) => {
  const [view, setView] = useState<'menu' | 'chat'>(embedded ? 'chat' : 'menu');
  const [category, setCategory] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isNoahide = userProfile.demographic === Demographic.NON_JEWISH;

  // Force chat view on embedded/desktop mode if not already
  useEffect(() => {
    if (embedded && view === 'menu') setView('chat');
  }, [embedded, view]);

  // Define categories based on demographic
  const CATEGORIES = isNoahide ? [
    { id: 'Mysticism', icon: 'book', color: 'border-king-teal text-king-teal' },
    { id: 'Divine Laws', icon: 'scale', color: 'border-king-amber text-king-amber' },
    { id: 'Bible', icon: 'scroll', color: 'border-king-purple text-king-purple' },
    { id: 'Ethics', icon: 'heart', color: 'border-king-blue text-king-blue' }
  ] : [
    { id: 'Chassidus', icon: 'book', color: 'border-king-teal text-king-teal' },
    { id: 'Halacha', icon: 'scale', color: 'border-king-amber text-king-amber' },
    { id: 'Gemara', icon: 'scroll', color: 'border-king-purple text-king-purple' },
    { id: 'Mussar', icon: 'heart', color: 'border-king-blue text-king-blue' }
  ];

  const startChat = (topic: string) => {
    setCategory(topic);
    const intro = isNoahide 
      ? `We are exploring ${topic}. Ask about the Creator's wisdom or request a summary.` 
      : `We are studying ${topic}. Ask me anything, or request a summary.`;
    setMessages([{ id: 'init', role: 'model', text: intro }]);
    setView('chat');
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await chatWithKing(userProfile, input, messages);
    setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: responseText, isActionable: true }]);
    setIsLoading(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Helper to format text with bolding
  const formatMessage = (text: string) => {
    // Split by **text**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-bold text-king-secondary">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  // MENU VIEW (Mobile Only when NOT embedded)
  if (view === 'menu' && !embedded) {
    return (
      <div className="h-full px-6 py-8 flex flex-col animate-fade-in pb-24 bg-king-cream">
        {/* Menu content omitted for brevity, logic handled by embedded switch mostly */}
      </div>
    )
  }

  // CHAT VIEW
  return (
    <div className={`flex flex-col h-full bg-white ${embedded ? '' : 'h-[calc(100vh-80px)] md:h-screen max-w-3xl mx-auto'}`}>
      {/* Header */}
      <header className={`p-4 border-b border-stone-100 flex items-center gap-4 bg-white/95 backdrop-blur sticky top-0 z-20 ${embedded ? 'justify-between' : ''}`}>
        <div className="flex items-center gap-4">
          {/* Back Button - Show if not embedded OR if in mobileMode (which is passed when embedded is true but on mobile screen) */}
          {(!embedded || mobileMode) && (
            <button 
              onClick={onNavigateToLibrary}
              className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-king-primary hover:bg-stone-50 rounded-full transition-colors active:scale-90"
            >
              ←
            </button>
          )}
          <h2 className="font-display text-xl text-king-text">{category || 'Study Companion'}</h2>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-king-cream/30 custom-scrollbar">
        {messages.length === 0 && embedded && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40 p-8">
            <div className="text-4xl mb-4 animate-pulse-slow">♔</div>
            <p className="font-serif italic text-sm">Ask me anything about the text...</p>
          </div>
        )}
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
          >
            <div className={`max-w-[90%] p-4 rounded-2xl leading-relaxed text-sm ${
              msg.role === 'user' 
                ? 'bg-king-primary text-white rounded-tr-none shadow-glow' 
                : 'bg-white border border-stone-100 text-king-text rounded-tl-none shadow-sm'
            }`}>
              <div className="whitespace-pre-wrap font-serif">
                {formatMessage(msg.text)}
              </div>
            </div>
          </div>
        ))}
        {isLoading && <div className="p-4 text-xs uppercase tracking-widest text-stone-400 animate-pulse">Thinking...</div>}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-stone-100 z-20 pb-safe">
        <div className="relative group">
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Ask..." 
            className="w-full bg-stone-50 border border-stone-200 p-3 pr-10 rounded-xl focus:outline-none focus:border-king-primary focus:ring-2 focus:ring-king-primary/20 transition-all text-king-text placeholder-stone-400 text-sm" 
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="absolute right-3 top-3 text-king-primary font-bold hover:scale-110 active:scale-90 transition-transform disabled:opacity-50"
          >
            →
          </button>
        </div>
      </form>
    </div>
  );
};