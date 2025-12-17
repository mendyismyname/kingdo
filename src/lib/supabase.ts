import { createClient } from '@supabase/supabase-js';

// Use VITE_ prefixed variables as per Vite's env var handling
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if the required environment variables are present
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Please check your .env.local file.');
  console.error('Expected VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to be set.');
  // Depending on your app's requirements, you might want to throw an error here
  // or export a null/undefined client. For now, we'll proceed but the client creation will fail.
}

// Create the Supabase client instance
// The createClient function itself will throw an error if url or key are invalid/missing
export const supabase = createClient(supabaseUrl, supabaseAnonKey);