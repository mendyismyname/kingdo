import React, { useState } from 'react';
import { Habit } from '../types';

interface HabitTrackerProps {
  habits: Habit[];
  onToggle: (id: string, date: string) => void;
  onAdd: (title: string, category: 'THOUGHT' | 'SPEECH' | 'ACTION') => void;
}

const SUGGESTED_HABITS = [
    "Modeh Ani", "Asher Yatzar", "Tzedakah", "Call Parents", 
    "Learn 1 Halacha", "Recite Shema", "Psalm 23", "Gratitude Journal"
];

export const HabitTracker: React.FC<HabitTrackerProps> = ({ habits, onToggle, onAdd }) => {
  const [newHabit, setNewHabit] = useState('');
  const todayStr = new Date().toISOString().split('T')[0];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabit.trim()) {
      onAdd(newHabit, 'ACTION');
      setNewHabit('');
    }
  };

  const addSuggestion = (suggestion: string) => {
      onAdd(suggestion, 'ACTION');
  };

  const completedToday = habits.filter(h => h.history[todayStr]).length;
  const totalHabits = habits.length;
  const progress = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;

  return (
    <div className="max-w-3xl mx-auto py-12 px-6 min-h-screen pb-32">
      {/* Header */}
      <header className="mb-10 animate-fade-in">
        <div className="flex justify-between items-end mb-6">
            <h1 className="font-display text-4xl text-king-text font-bold tracking-tight">Builder</h1>
            <span className="text-xs font-bold uppercase tracking-widest text-stone-400 bg-stone-100 px-3 py-1 rounded-full">{completedToday}/{totalHabits} Completed</span>
        </div>
        
        {/* Progress Bar */}
        <div className="bg-white p-1 rounded-full shadow-sm border border-stone-100">
            <div className="h-4 w-full bg-stone-50 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-king-gradient transition-all duration-1000 ease-out rounded-full relative overflow-hidden" 
                    style={{ width: `${progress}%` }}
                >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
            </div>
        </div>
      </header>

      {/* List */}
      <div className="space-y-4">
        {habits.map((habit, idx) => {
            const isCompleted = habit.history[todayStr];
            
            return (
                <div 
                    key={habit.id}
                    className={`group relative overflow-hidden rounded-2xl p-5 transition-all duration-300 ease-out border animate-slide-up cursor-pointer select-none
                        ${isCompleted 
                            ? 'bg-king-primary/5 border-king-primary/20 shadow-inner' 
                            : 'bg-white border-stone-100 hover:border-king-primary/30 hover:shadow-card hover:-translate-y-0.5'
                        }
                    `}
                    style={{ animationDelay: `${idx * 100}ms` }}
                    onClick={() => onToggle(habit.id, todayStr)}
                >
                    <div className="flex items-center gap-5 relative z-10">
                        {/* Checkbox */}
                        <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all duration-300 shadow-sm
                            ${isCompleted 
                                ? 'bg-king-primary border-king-primary text-white scale-110 rotate-3' 
                                : 'bg-white border-stone-200 text-transparent group-hover:border-king-primary/50'
                            }
                        `}>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        
                        <div className="flex-1">
                            <h3 className={`font-sans font-medium text-lg transition-colors duration-300 ${isCompleted ? 'text-king-primary line-through opacity-60' : 'text-king-text'}`}>
                                {habit.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded transition-colors duration-300 
                                    ${isCompleted 
                                        ? 'bg-king-primary/10 text-king-primary' 
                                        : 'bg-stone-100 text-stone-400 group-hover:bg-stone-200'
                                    }`}>
                                    {habit.category}
                                </span>
                            </div>
                        </div>

                         {/* Completion Streak/Icon */}
                         <div className={`transition-opacity duration-500 ${isCompleted ? 'opacity-100' : 'opacity-0'}`}>
                             <span className="text-xl">🔥</span>
                         </div>
                    </div>
                </div>
            );
        })}

         {/* Add New Input */}
         <div className="mt-8 animate-slide-up" style={{ animationDelay: `${habits.length * 100}ms` }}>
            <form onSubmit={handleAdd} className="relative group bg-white rounded-2xl p-2 pl-6 shadow-sm border border-stone-100 flex items-center focus-within:ring-2 focus-within:ring-king-primary/20 focus-within:border-king-primary transition-all">
                <input 
                    type="text"
                    value={newHabit}
                    onChange={(e) => setNewHabit(e.target.value)}
                    placeholder="Add a new habit..."
                    className="flex-1 bg-transparent py-3 text-king-text placeholder-stone-300 focus:outline-none font-serif text-lg"
                />
                <button type="submit" className="w-12 h-12 rounded-xl bg-stone-50 text-stone-300 hover:bg-king-primary hover:text-white transition-all font-bold text-2xl flex items-center justify-center ml-2">
                    +
                </button>
            </form>

            {/* Suggestions */}
            <div className="flex flex-wrap gap-2 mt-4">
                {SUGGESTED_HABITS.map(suggestion => (
                    <button 
                        key={suggestion}
                        onClick={() => addSuggestion(suggestion)}
                        className="px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-100 text-[10px] font-bold uppercase tracking-wider text-stone-400 hover:bg-king-primary hover:text-white hover:border-king-primary transition-all"
                    >
                        + {suggestion}
                    </button>
                ))}
            </div>
         </div>
      </div>
    </div>
  );
};