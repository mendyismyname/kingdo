export enum Demographic {
  CHABAD = 'Chabad',
  BRESLOV = 'Breslov',
  GENERAL_JEWISH = 'General Jewish',
  SECULAR_JEWISH = 'Secular Jewish',
  NON_JEWISH = 'Non-Jewish / Noahide'
}

export enum AppLanguage {
  ENGLISH = 'English',
  YIDDISH = 'Yiddish',
  HEBREW = 'Hebrew',
  YESHIVISH = 'Yeshivish',
  FRUM = 'Frum',
  CHASSIDISH = 'Chassidish',
  SEFARDI = 'Sefardi'
}

export type AppTheme = 'mint' | 'orange' | 'blue' | 'purple';

export interface UserProfile {
  name: string;
  demographic: Demographic;
  level: number; // 1-10
  streak: number; // Calculated dynamically
  totalStudyMinutes: number; // New field for time tracking
  theme?: AppTheme;
  language?: AppLanguage;
  community?: string; // e.g., "Satmar", "Yeshivas Mir"
  newsInterests?: string[]; // e.g. ["Business", "Fashion", "Chassidus"]
}

export interface Habit {
  id: string;
  title: string;
  category: 'THOUGHT' | 'SPEECH' | 'ACTION';
  history: Record<string, boolean>; // 'YYYY-MM-DD': true
  frequency: 'DAILY' | 'WEEKLY';
  currentStreak: number;
}

export interface Insight {
  content: string;
  source: string;
  actionableStep: string;
}

export interface NewsItem {
  id: string;
  headline: string;
  category: string;
  summary: string;
  spiritualInsight: string; // The "King's Take"
  imageUrl?: string;
  author?: string;
  date?: string;
  content?: string; // Full article content
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isActionable?: boolean;
}

export interface Book {
  id: string;
  title: string;
  hebrewTitle?: string;
  totalChapters?: number; // Approximate
  description: string;
  coverColor?: string;
}

export interface BookProgress {
  bookId: string;
  currentChapter: number;
  lastReadDate?: string;
}

export interface BookLesson {
  title: string;
  content: string; // The text of the lesson
  summary: string;
  practicalApplication: string;
}

export interface CommunityEvent {
    id: string;
    title: string;
    date: string;
    participants: number;
    type: 'LEARNING' | 'CHESED' | 'PRAYER';
    imageUrl?: string;
    location?: string;
    description?: string;
}

export interface JobListing {
    id: string;
    title: string;
    company: string;
    location: string;
    type: 'FULL_TIME' | 'PART_TIME' | 'REMOTE';
    postedDate: string;
}

export interface ServiceListing {
    id: string;
    title: string;
    category: string;
    contact: string;
    rating: number;
}

export interface RentalListing {
    id: string;
    title: string;
    price: string;
    location: string;
    rooms: number;
    imageUrl?: string;
}

export interface SimchaPost {
    id: string;
    title: string;
    family: string;
    date: string;
    type: 'WEDDING' | 'BAR_MITZVAH' | 'BRIS' | 'ENGAGEMENT';
}