import React, { useState } from 'react';
import { UserProfile, CommunityEvent, JobListing, ServiceListing, RentalListing, SimchaPost } from '../types';

interface CommunityProps {
  userProfile: UserProfile;
}

type CommunityTab = 'ALL' | 'UPDATES' | 'EVENTS' | 'JOBS' | 'SERVICES' | 'RENTALS' | 'SIMCHAS' | 'BOOKINGS';

// --- MOCK DATA ---
const EVENTS: CommunityEvent[] = [
    { id: '1', title: 'Grand Farbrengen', date: 'Thursday, 8:00 PM', participants: 450, type: 'LEARNING', location: 'Main Shul', description: 'Celebrating the 19th of Kislev with guest speakers.' },
    { id: '2', title: 'Community Tehillim', date: 'Sunday, 10:00 AM', participants: 120, type: 'PRAYER', location: 'Old City Plaza' },
    { id: '3', title: 'Food Drive Packing', date: 'Tuesday, 6:00 PM', participants: 35, type: 'CHESED', location: 'Warehouse B' }
];

const JOBS: JobListing[] = [
    { id: '1', title: 'Yeshiva Administrator', company: 'Oholei Torah', location: 'Brooklyn, NY', type: 'FULL_TIME', postedDate: '2 days ago' },
    { id: '2', title: 'Kosher Sous Chef', company: 'Reserve Cut', location: 'Manhattan, NY', type: 'FULL_TIME', postedDate: '1 week ago' },
    { id: '3', title: 'Remote React Developer', company: 'Torah Tech', location: 'Remote', type: 'REMOTE', postedDate: 'Just now' }
];

const SERVICES: ServiceListing[] = [
    { id: '1', title: 'Certified Shatnez Tester', category: 'Religious', contact: '555-0123', rating: 5.0 },
    { id: '2', title: 'Expert Sofer Stam', category: 'Religious', contact: '555-0199', rating: 4.9 },
    { id: '3', title: 'Yiddish Tutor', category: 'Education', contact: '555-0987', rating: 4.8 }
];

const RENTALS: RentalListing[] = [
    { id: '1', title: '3 Bedroom Apartment', price: '$2,800/mo', location: 'Crown Heights', rooms: 3, imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=400' },
    { id: '2', title: 'Short Term Guest Suite', price: '$150/night', location: 'Jerusalem', rooms: 1, imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=400' }
];

const SIMCHAS: SimchaPost[] = [
    { id: '1', title: 'Mazal Tov: Cohen Engagement', family: 'Cohen & Levi Families', date: 'Last Night', type: 'ENGAGEMENT' },
    { id: '2', title: 'Bar Mitzvah of Mendel Goldstein', family: 'Goldstein Family', date: 'Shabbos Parshas Noach', type: 'BAR_MITZVAH' }
];

export const Community: React.FC<CommunityProps> = ({ userProfile }) => {
  const [activeTab, setActiveTab] = useState<CommunityTab>('ALL');

  const tabs: { id: CommunityTab; label: string; icon: string }[] = [
      { id: 'ALL', label: 'All', icon: '♾️' },
      { id: 'EVENTS', label: 'Events', icon: '🗓️' },
      { id: 'JOBS', label: 'Jobs', icon: '💼' },
      { id: 'SERVICES', label: 'Services', icon: '🔧' },
      { id: 'RENTALS', label: 'Rentals', icon: '🏠' },
      { id: 'SIMCHAS', label: 'Simchas', icon: '🍷' },
      { id: 'BOOKINGS', label: 'Bookings', icon: '📅' },
      { id: 'UPDATES', label: 'Updates', icon: '📢' },
  ];

  const renderEvents = () => (
      <div className="space-y-6">
           <h3 className="font-display text-lg font-bold text-stone-400 uppercase tracking-widest pl-1 mb-2">Events</h3>
           {EVENTS.map((event, i) => (
               <div key={`evt-${event.id}`} className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm flex flex-col md:flex-row gap-6 group hover:border-king-primary/30 transition-all hover:shadow-lg hover:-translate-y-1 active:scale-[0.99] cursor-pointer animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                   <div className="w-full md:w-24 h-24 rounded-2xl bg-king-primary/5 flex flex-col items-center justify-center text-king-primary border border-king-primary/10 shrink-0">
                       <span className="text-2xl font-bold font-display">{event.date.split(',')[0]}</span>
                       <span className="text-[9px] uppercase font-bold tracking-widest opacity-60">Upcoming</span>
                   </div>
                   <div className="flex-1">
                       <div className="flex justify-between items-start">
                            <h3 className="font-display text-xl font-bold text-king-text group-hover:text-king-primary transition-colors">{event.title}</h3>
                            <span className="text-[10px] bg-stone-100 text-stone-500 px-2 py-1 rounded-full uppercase tracking-wider font-bold">{event.type}</span>
                       </div>
                       <p className="text-sm text-stone-500 font-serif mt-2 mb-4 leading-relaxed">{event.description || 'Join the community for this special gathering.'}</p>
                       <div className="flex items-center gap-6 text-xs text-stone-400 font-bold uppercase tracking-wide">
                           <span className="flex items-center gap-1.5">{event.location}</span>
                           <span className="flex items-center gap-1.5">{event.participants} Going</span>
                       </div>
                   </div>
                   <button className="h-12 px-8 rounded-2xl bg-stone-50 text-stone-400 font-bold text-xs uppercase tracking-widest hover:bg-king-primary hover:text-white transition-all self-start md:self-center shadow-sm active:scale-95">RSVP</button>
               </div>
           ))}
      </div>
  );

  const renderJobs = () => (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <h3 className="font-display text-lg font-bold text-stone-400 uppercase tracking-widest pl-1 mb-2 col-span-full">Jobs</h3>
           {JOBS.map((job, i) => (
               <div key={`job-${job.id}`} className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm hover:shadow-lg hover:-translate-y-1 active:scale-[0.99] transition-all cursor-pointer group animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                   <div className="flex justify-between items-start mb-6">
                       <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform">💼</div>
                       <span className="text-[10px] font-bold text-stone-300 uppercase tracking-wider bg-stone-50 px-2 py-1 rounded">{job.postedDate}</span>
                   </div>
                   <h3 className="font-bold text-king-text text-xl mb-1 group-hover:text-king-primary transition-colors">{job.title}</h3>
                   <p className="text-sm text-stone-500 mb-6 font-serif">{job.company} • {job.location}</p>
                   <div className="flex gap-2">
                       <span className="px-3 py-1.5 rounded-lg bg-stone-50 text-stone-500 text-[10px] font-bold uppercase tracking-wider border border-stone-100">{job.type.replace('_', ' ')}</span>
                   </div>
               </div>
           ))}
       </div>
  );

  const renderSimchas = () => (
      <div className="space-y-4">
          <h3 className="font-display text-lg font-bold text-stone-400 uppercase tracking-widest pl-1 mb-2">Simchas</h3>
           {SIMCHAS.map((simcha, i) => (
               <div key={`sim-${simcha.id}`} className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm text-center relative overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all active:scale-[0.99] cursor-pointer animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                   <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-king-primary via-king-secondary to-king-primary opacity-50"></div>
                   <div className="text-5xl mb-6 opacity-80">🍷</div>
                   <span className="inline-block px-4 py-1.5 rounded-full bg-king-primary/5 text-king-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                       {simcha.type.replace('_', ' ')}
                   </span>
                   <h3 className="font-display text-2xl font-bold text-king-text mb-2">{simcha.title}</h3>
                   <p className="font-serif italic text-stone-500 mb-2">The {simcha.family}</p>
                   <p className="text-xs text-stone-400 uppercase tracking-widest">{simcha.date}</p>
               </div>
           ))}
      </div>
  );

  return (
    <div className="h-full flex flex-col bg-king-cream pb-24">
       {/* Sticky Header */}
       <header className="px-6 py-8 bg-king-cream/95 backdrop-blur z-20 sticky top-0 border-b border-stone-100">
            <h1 className="font-display text-4xl text-king-text font-bold mb-1 animate-fade-in">Kehilla</h1>
            <p className="text-stone-400 text-sm font-serif italic mb-6 animate-fade-in delay-100">
                {userProfile.community || userProfile.demographic} Community Board
            </p>

            {/* Sub Nav - Pill Scroll */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-2 px-2 animate-slide-up delay-200">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all active:scale-95
                            ${activeTab === tab.id 
                                ? 'bg-king-primary text-white shadow-lg shadow-king-primary/20 scale-105' 
                                : 'bg-white border border-stone-100 text-stone-400 hover:border-king-primary/30 hover:text-king-primary'
                            }
                        `}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
       </header>

       {/* Content Area */}
       <div className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar max-w-7xl mx-auto w-full">
           
           {/* ALL - Multi Column Layout */}
           {activeTab === 'ALL' && (
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                   <div className="lg:col-span-8 space-y-12">
                       {renderEvents()}
                       {renderJobs()}
                   </div>
                   <div className="lg:col-span-4 space-y-12">
                       {renderSimchas()}
                       {/* Additional side widgets could go here */}
                   </div>
               </div>
           )}

           {/* EVENTS */}
           {activeTab === 'EVENTS' && renderEvents()}

           {/* JOBS */}
           {activeTab === 'JOBS' && renderJobs()}

            {/* SERVICES */}
            {activeTab === 'SERVICES' && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up">
                   {SERVICES.map((service, i) => (
                       <div key={service.id} className="bg-white p-6 rounded-3xl border border-stone-100 flex flex-col justify-between hover:border-king-primary/30 transition-all hover:shadow-lg hover:-translate-y-1 active:scale-[0.99] h-full cursor-pointer group" style={{ animationDelay: `${i * 100}ms` }}>
                           <div className="flex items-start justify-between mb-4">
                               <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-full bg-stone-50 flex items-center justify-center text-2xl border border-stone-100 group-hover:scale-110 transition-transform">🛠️</div>
                                    <div>
                                        <h4 className="font-bold text-lg text-king-text">{service.title}</h4>
                                        <div className="flex items-center gap-2 text-xs text-stone-400 mt-1">
                                            <span>{service.category}</span>
                                        </div>
                                    </div>
                               </div>
                               <span className="text-king-secondary font-bold text-sm bg-king-secondary/5 px-2 py-1 rounded">★ {service.rating}</span>
                           </div>
                           <div className="flex items-center gap-2 mt-auto pt-4 border-t border-stone-50">
                               <button className="flex-1 py-3 rounded-xl bg-king-primary text-white text-xs font-bold uppercase tracking-widest hover:bg-king-primaryLight transition-colors active:scale-95 shadow-sm">
                                   Contact
                               </button>
                               <button className="w-12 h-12 rounded-xl bg-stone-50 text-stone-400 flex items-center justify-center hover:bg-stone-100 active:scale-95 transition-all">
                                   💬
                               </button>
                           </div>
                       </div>
                   ))}
               </div>
           )}

           {/* RENTALS */}
           {activeTab === 'RENTALS' && (
               <div className="grid grid-cols-1 gap-8 animate-slide-up">
                   {RENTALS.map((rental, i) => (
                       <div key={rental.id} className="bg-white rounded-3xl border border-stone-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 active:scale-[0.99] transition-all group cursor-pointer" style={{ animationDelay: `${i * 100}ms` }}>
                           <div className="h-64 bg-stone-200 relative overflow-hidden">
                               <img src={rental.imageUrl} alt={rental.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                               <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-4 py-2 rounded-full text-xs font-bold shadow-sm text-king-text uppercase tracking-wider">
                                   {rental.price}
                               </div>
                               <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/50 to-transparent"></div>
                           </div>
                           <div className="p-6">
                               <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-display text-2xl font-bold text-king-text mb-2 group-hover:text-king-primary transition-colors">{rental.title}</h3>
                                        <p className="text-sm text-stone-500 flex items-center gap-2 font-serif">
                                            <span>{rental.location}</span>
                                            <span className="w-1 h-1 rounded-full bg-stone-300"></span>
                                            <span>{rental.rooms} Rooms</span>
                                        </p>
                                    </div>
                                    <button className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center hover:bg-king-primary hover:border-king-primary hover:text-white transition-all text-stone-400">
                                        ↗
                                    </button>
                               </div>
                           </div>
                       </div>
                   ))}
               </div>
           )}

           {/* SIMCHAS */}
           {activeTab === 'SIMCHAS' && renderSimchas()}

           {/* BOOKINGS */}
           {activeTab === 'BOOKINGS' && (
               <div className="grid grid-cols-2 gap-4 animate-slide-up">
                   {['Men\'s Mikvah', 'Women\'s Mikvah', 'Simcha Hall', 'Guest Suite', 'Conference Room', 'Library'].map((item, i) => (
                       <button key={i} className="bg-white p-6 rounded-3xl border border-stone-100 hover:border-king-primary hover:shadow-lg hover:-translate-y-1 active:scale-[0.99] transition-all text-left group flex flex-col items-start justify-between min-h-[140px]" style={{ animationDelay: `${i * 50}ms` }}>
                           <div className="w-12 h-12 rounded-2xl bg-stone-50 flex items-center justify-center text-xl group-hover:bg-king-primary group-hover:text-white transition-colors group-hover:scale-110">📅</div>
                           <div>
                                <h4 className="font-bold text-king-text text-lg leading-tight mb-1">{item}</h4>
                                <p className="text-[10px] text-stone-400 uppercase tracking-wider group-hover:text-king-primary transition-colors">Check Availability</p>
                           </div>
                       </button>
                   ))}
               </div>
           )}

           {/* UPDATES */}
           {activeTab === 'UPDATES' && (
               <div className="space-y-6 animate-slide-up">
                   <div className="bg-amber-50 p-8 rounded-3xl border border-amber-100 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                       <div className="absolute -right-6 -top-6 w-32 h-32 bg-amber-100 rounded-full blur-3xl"></div>
                       <div className="relative z-10">
                            <h3 className="font-bold text-amber-900 mb-4 flex items-center gap-3 text-lg">
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                                Urgent Community Announcement
                            </h3>
                            <p className="text-amber-900/80 text-base leading-relaxed font-serif">
                                Mincha time has changed for the winter season. Please verify the new schedule on the main board. Also, please be advised that the north parking lot is under construction.
                            </p>
                            <div className="mt-6 pt-6 border-t border-amber-200/50 flex justify-between items-center">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-800/60">Gabai - 2 hours ago</span>
                                <button className="text-amber-700 text-xs font-bold uppercase tracking-widest hover:bg-amber-100 px-3 py-1 rounded transition-colors active:scale-95">Dismiss</button>
                            </div>
                       </div>
                   </div>

                   <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm flex items-center justify-between gap-6 hover:shadow-md transition-shadow">
                       <div>
                            <h3 className="font-bold text-king-text mb-2 text-lg">Weekly Newsletter</h3>
                            <p className="text-stone-500 text-sm font-serif">The Parsha sheet for this week is now available.</p>
                       </div>
                       <button className="w-12 h-12 rounded-full bg-king-primary text-white flex items-center justify-center hover:scale-110 hover:shadow-glow active:scale-90 transition-all shadow-md">
                           ↓
                       </button>
                   </div>
               </div>
           )}
       </div>
    </div>
  );
};