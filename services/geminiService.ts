import { GoogleGenAI } from "@google/genai";
import { Demographic, UserProfile, Insight, BookLesson, AppLanguage, NewsItem } from "../types";

// Correctly access the VITE_ prefixed environment variable
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Ensure the API key is provided
if (!apiKey) {
  console.error("VITE_GEMINI_API_KEY is not set. Please check your .env.local file.");
  // Depending on your error handling strategy, you might want to throw an error here
  // or provide a fallback mechanism.
  // For now, we'll let the GoogleGenAI constructor handle the missing key error,
  // which should now be clearer why it's happening.
}

const ai = new GoogleGenAI({ apiKey: apiKey });
const MODEL_ID = "gemini-2.5-flash";

// --- Helper Functions (Image Map, System Instruction) ---
// (These functions remain largely unchanged, included for completeness)

// Curated list of high quality images for different categories
const IMAGE_MAP: Record<string, string[]> = {
  'general': [
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1493612276216-ee3925520721?auto=format&fit=crop&q=80&w=800"
  ],
  'tech': [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800"
  ],
  'business': [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1611974765270-ca12586343bb?auto=format&fit=crop&q=80&w=800"
  ],
  'spirit': [
    "https://images.unsplash.com/photo-1507692049790-de58293a469d?auto=format&fit=crop&q=80&w=800", // Jerusalem
    "https://images.unsplash.com/photo-1533226487968-07e112d83b12?auto=format&fit=crop&q=80&w=800", // Candles
    "https://images.unsplash.com/photo-1549651579-d2b4b4556488?auto=format&fit=crop&q=80&w=800" // Book
  ],
  'art': [
    "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&q=80&w=800"
  ]
};

const getSystemInstruction = (profile: UserProfile): string => {
  const { demographic, level, language, community } = profile;
  let tone = "minimalist, regal, authoritative yet kind, devoid of fluff.";
  let terminology = "";
  let quoteSource = "Classic Torah sources, the Talmud, and the Chumash.";

  // Demographic Logic (Baseline)
  switch (demographic) {
    case Demographic.CHABAD:
      terminology = "Use Chabad terminology (חוכמה, בינה, דעת, התקשרות, ביטול).";
      quoteSource = "The Lubavitcher Rebbe, the Alter Rebbe (Tanya), and Chabad Rebbeim.";
      break;
    case Demographic.BRESLOV:
      terminology = "Use Breslov terminology (התבודדות, אראנו, שמחה, רבי נחמן).";
      quoteSource = "Rebbe Nachman of Breslov (Likutei Moharan), Reb Noson, and Breslov mashpiim.";
      break;
    case Demographic.NON_JEWISH:
      terminology = "STRICT RULE: Do NOT use Hebrew terms (like Hashem, Mitzvos, Torah, Davening). Use universal terms: 'The Creator', 'Commandments', 'Bible/Scripture', 'Prayer'. Focus on the Seven Noahide Laws.";
      quoteSource = "The Seven Noahide Laws, Psalms (Tehillim), and universal ethical teachings.";
      break;
    case Demographic.SECULAR_JEWISH:
      quoteSource = "Modern Jewish thinkers like Elie Wiesel, Rabbi Lord Jonathan Sacks, Abraham Joshua Heschel, and universal Jewish wisdom.";
      break;
    default:
      terminology = "Use standard Torah terminology.";
      quoteSource = "The Vilna Gaon, the Chofetz Chaim, and the Talmud.";
      break;
  }

  // Community Overrides - Refine the sources based on specific communities
  if (community) {
    if (community.includes("Satmar") || community.includes("Kahal Yatev Lev")) {
      quoteSource = "Reb Yoel Teitelbaum (Satmar Rebbe), the Divrei Yoel, and the Chasam Sofer.";
      terminology += " Use very warm Yiddish-infused Hebrew terms.";
    } else if (community.includes("Rebbe MH'M")) {
      quoteSource = "The Lubavitcher Rebbe (emphasizing Geulah and Moshiach).";
    } else if (community.includes("Thank You Hashem")) {
      tone += " Focus intensely on Gratitude, Emunah, and Simcha.";
      quoteSource = "Reb Asher Freund, Reb Shlomo Carlebach, and general Masters of Emunah.";
    } else if (community.includes("Yeshivas Mir") || community.includes("Lakewood")) {
      quoteSource = "Reb Chaim Shmuelevitz, Reb Aharon Kotler, and classic Litvish Roshei Yeshiva.";
    } else if (community.includes("Baba Sali") || community.includes("Moroccan")) {
      quoteSource = "The Baba Sali, Rabbi David Abuchatzeira, and Moroccan Tzadikim.";
    } else if (community.includes("Na Nach")) {
      quoteSource = "Rebbe Nachman (Petek), Saba Yisroel Odesser.";
    } else if (community.includes("Bnei Akiva") || community.includes("Dati Leumi")) {
      quoteSource = "Rav Kook, Rav Soloveitchik, and Religious Zionist leaders.";
    }
  }

  // Language/Mode Override
  if (language) {
    switch (language) {
      case AppLanguage.YIDDISH:
        terminology += " Use Yiddish flavoring and terms written in Hebrew script (דער אויבערשטער, טאטע, נשמה, הייליגע). Phrase things with a warm, heimish tone.";
        break;
      case AppLanguage.YESHIVISH:
        terminology += " Use Yeshivish syntax. Write specific terms in Hebrew script where applicable (למעשה, ממש, פשט, מסתמא, ביסט דו).";
        if (!community?.includes("Yeshivas Mir")) {
          quoteSource = "The Vilna Gaon, Reb Chaim Kanievsky, Rav Shach, and the Yeshivish world.";
        }
        break;
      case AppLanguage.HEBREW:
        terminology += " Respond in Hebrew (עברית). Focus on Lashon Hakodesh.";
        break;
      case AppLanguage.SEFARDI:
        terminology += " Use Sefardi terminology and customs (חכם, הקב''ה, הילולה).";
        if (!community?.includes("Moroccan")) {
          quoteSource = "The Ben Ish Chai, Baba Sali, Rambam, and Ovadia Yosef.";
        }
        break;
      case AppLanguage.FRUM:
        terminology += " Maintain a high standard of Frumkeit. Refer to G-d as 'השם'. Focus on Yiras Shamayim (יראת שמים).";
        break;
      case AppLanguage.CHASSIDISH:
        terminology += " Use Chassidish warmth. Focus on Dveikus (דביקות) and Avodah (עבודה).";
        // Override quotes for general Chassidish mode if not specifically Chabad/Breslov/Satmar already set
        if (demographic !== Demographic.CHABAD && demographic !== Demographic.BRESLOV && !community?.includes("Satmar")) {
          quoteSource = "The Baal Shem Tov, the Noam Elimelech, and General Chassidish Masters.";
        }
        break;
    }
  }

  let complexity = "";
  if (level < 3) complexity = "Focus on basics: Gratitude, basic awareness of the Creator, simple kindness.";
  else if (level < 7) complexity = "Intermediate: Detailed laws, specific prayers, deeper textual analysis, character refinement.";
  else complexity = "Advanced: Deeper mysticism, service of the heart, Temple service metaphors applied to daily life.";

  return `You are "King", a digital spiritual mentor designed to bring the user closer to the Creator. User Demographic: ${demographic}. User Community: ${community || 'General'}. User Level: ${level}/10. Language Mode: ${language || 'English'}.
Directives:
1. ${tone} DO NOT sound like an AI assistant. Do not say "How can I help you today?". Be direct.
2. ${terminology}
3. ${complexity}
4. Primary Quote Sources: Prioritize quotes and wisdom from ${quoteSource}.
5. The ultimate goal is Action. Always try to ground abstract concepts into a physical action or habit.
6. **FORMATTING RULE**: Return plain text only. Do not use markdown like **bold** or *italics*.
`;
};

// --- Exported Functions ---

export const generateDailyInsight = async (profile: UserProfile): Promise<Insight> => {
  // Check if AI client is initialized (implies key is set)
  if (!apiKey) {
    console.warn("Gemini API key not found. Returning fallback insight.");
    return {
      content: "The King is waiting for your return.",
      source: "Inner Voice",
      actionableStep: "Take a moment of silence."
    };
  }

  const systemInstruction = getSystemInstruction(profile);
  const prompt = `Generate a daily insight for me. It should include:
1. A short, profound concept (1-2 sentences) from relevant sources.
2. The source citation.
3. A single, concrete, small actionable step I can take today.
Return as JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT", // Assuming Type.OBJECT maps to "OBJECT" string
          properties: {
            content: { type: "STRING" }, // Assuming Type.STRING maps to "STRING" string
            source: { type: "STRING" },
            actionableStep: { type: "STRING" },
          },
          required: ["content", "source", "actionableStep"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as Insight;
    }
    throw new Error("No response text");
  } catch (error) {
    console.error("Gemini Error:", error);
    // Return a fallback insight if the API call fails
    return {
      content: "The King is waiting for your return.",
      source: "Inner Voice",
      actionableStep: "Take a moment of silence."
    };
  }
};

const getRandomImage = (category: string) => {
  const cat = category.toLowerCase();
  let images = IMAGE_MAP['general'];
  if (cat.includes('tech') || cat.includes('business')) images = IMAGE_MAP['tech'];
  if (cat.includes('finance') || cat.includes('money')) images = IMAGE_MAP['business'];
  if (cat.includes('art') || cat.includes('culture') || cat.includes('fashion')) images = IMAGE_MAP['art'];
  if (cat.includes('spirit') || cat.includes('torah') || cat.includes('israel')) images = IMAGE_MAP['spirit'];
  return images[Math.floor(Math.random() * images.length)];
};

export const generateNewsFeed = async (profile: UserProfile): Promise<NewsItem[]> => {
  // NOTE: This function is currently bypassed in Dashboard.tsx by hardcoded news
  // but kept here for fallback or future dynamic generation.

  // Check if AI client is initialized (implies key is set)
  if (!apiKey) {
    console.warn("Gemini API key not found. Returning empty news feed.");
    return [];
  }

  const systemInstruction = getSystemInstruction(profile);
  const interests = profile.newsInterests?.join(", ") || "General, Technology, Spirit";
  const prompt = `Generate 4 short news headlines/summaries based on these interests: [${interests}].
For each item:
1. Create a realistic headline relevant to the interest (e.g., if 'Business', mention a market trend; if 'Hip Hop', mention culture).
2. Provide a 'spiritualInsight' that connects this news to the user's demographic/spiritual path.
Return as JSON Array.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: "ARRAY", // Assuming Type.ARRAY maps to "ARRAY" string
          items: {
            type: "OBJECT", // Assuming Type.OBJECT maps to "OBJECT" string
            properties: {
              id: { type: "STRING" },
              headline: { type: "STRING" },
              category: { type: "STRING" },
              summary: { type: "STRING" },
              spiritualInsight: { type: "STRING" }
            },
            required: ["headline", "category", "summary", "spiritualInsight"]
          }
        }
      }
    });

    if (response.text) {
      const items = JSON.parse(response.text) as NewsItem[];
      return items.map((item, index) => ({
        ...item,
        id: `news-${Date.now()}-${index}`,
        imageUrl: getRandomImage(item.category),
        author: "Royal Correspondent",
        date: "Just Now"
      }));
    }
    return [];
  } catch (error) {
    console.error("News Error:", error);
    return [];
  }
};

export const chatWithKing = async (
  profile: UserProfile,
  message: string,
  history: { role: 'user' | 'model', text: string }[]
) => {
  // Check if AI client is initialized (implies key is set)
  if (!apiKey) {
    console.warn("Gemini API key not found. Returning fallback chat message.");
    return "The King's wisdom is currently sealed. Please check your connection to the source.";
  }

  const systemInstruction = getSystemInstruction(profile);

  // Convert history for API (limit to last 10 turns to save context)
  const chatHistory = history.slice(-10).map(h => ({
    role: h.role,
    parts: [{ text: h.text }]
  }));

  const chat = ai.chats.create({
    model: MODEL_ID,
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.7, // Slightly creative but grounded
    },
    history: chatHistory
  });

  try {
    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Chat Error", error);
    return "Connection to the source interrupted. Try again.";
  }
};

export const suggestHabitFromChat = async (profile: UserProfile, chatContext: string): Promise<any> => {
  // Check if AI client is initialized (implies key is set)
  if (!apiKey) {
    console.warn("Gemini API key not found. Returning null habit suggestion.");
    return null;
  }

  const systemInstruction = getSystemInstruction(profile);
  const prompt = `Based on this conversation context: "${chatContext}", suggest a concise habit I can track.
Return JSON: { "title": "string", "category": "THOUGHT" | "SPEECH" | "ACTION", "frequency": "DAILY" | "WEEKLY" }`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT", // Assuming Type.OBJECT maps to "OBJECT" string
          properties: {
            title: { type: "STRING" },
            category: { type: "STRING", enum: ["THOUGHT", "SPEECH", "ACTION"] },
            frequency: { type: "STRING", enum: ["DAILY", "WEEKLY"] }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Habit Suggestion Error", e);
    return null;
  }
};

export const generateBookLesson = async (profile: UserProfile, bookTitle: string, chapter: number): Promise<BookLesson> => {
  // Check if AI client is initialized (implies key is set)
  if (!apiKey) {
    console.warn("Gemini API key not found. Returning fallback book lesson.");
    return {
      title: "Study Error",
      content: "Could not retrieve lesson from the archives.",
      summary: "Try again later.",
      practicalApplication: "Review what you learned yesterday."
    };
  }

  const systemInstruction = getSystemInstruction(profile);
  const prompt = `Teach me ${bookTitle}, Chapter (or Section) ${chapter}.
Provide a concise lesson. Return JSON with:
1. title: Title of the concept/chapter.
2. content: The main explanation (2-3 paragraphs max).
3. summary: A one-sentence takeaway.
4. practicalApplication: A specific action or thought for the day based on this chapter.
`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT", // Assuming Type.OBJECT maps to "OBJECT" string
          properties: {
            title: { type: "STRING" },
            content: { type: "STRING" },
            summary: { type: "STRING" },
            practicalApplication: { type: "STRING" }
          },
          required: ["title", "content", "summary", "practicalApplication"]
        }
      }
    });

    if (response.text) return JSON.parse(response.text) as BookLesson;
    throw new Error("No text");
  } catch (e) {
    console.error("Book Lesson Error", e);
    return {
      title: "Study Error",
      content: "Could not retrieve lesson from the archives.",
      summary: "Try again later.",
      practicalApplication: "Review what you learned yesterday."
    };
  }
};