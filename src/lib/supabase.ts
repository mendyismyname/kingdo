import { createClient } from '@supabase/supabase-js';

// Log all environment variables for debugging
console.log('🔍 Supabase client: All import.meta.env keys:', Object.keys(import.meta.env));

// Try to get the environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Supabase client: VITE_SUPABASE_URL:', supabaseUrl);
console.log('🔍 Supabase client: VITE_SUPABASE_ANON_KEY (length):', supabaseAnonKey?.length);

// Check if the required environment variables are present
if (!supabaseUrl) {
  console.error('❌ VITE_SUPABASE_URL is missing.');
  throw new Error('VITE_SUPABASE_URL is required.');
}

if (!supabaseAnonKey) {
  console.error('❌ VITE_SUPABASE_ANON_KEY is missing.');
  throw new Error('VITE_SUPABASE_ANON_KEY is required.');
}

// Create the Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);