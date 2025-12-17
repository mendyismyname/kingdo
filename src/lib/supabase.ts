import { createClient } from '@supabase/supabase-js';

// Use VITE_ prefixed variables as per Vite's env var handling
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Strict check for required environment variables
if (!supabaseUrl) {
  console.error('❌ VITE_SUPABASE_URL is missing. Please check your .env.local file.');
  // Throwing an error here will prevent the client from being created with an undefined URL
  throw new Error('VITE_SUPABASE_URL is required.');
}

if (!supabaseAnonKey) {
  console.error('❌ VITE_SUPABASE_ANON_KEY is missing. Please check your .env.local file.');
  // Throwing an error here will prevent the client from being created with an undefined key
  throw new Error('VITE_SUPABASE_ANON_KEY is required.');
}

console.log('✅ Supabase environment variables found.');
console.log('   VITE_SUPABASE_URL (first 20 chars):', supabaseUrl.substring(0, 20) + '...');
console.log('   VITE_SUPABASE_ANON_KEY (first 10 chars):', supabaseAnonKey.substring(0, 10) + '...');

// Create the Supabase client instance only if variables are present
export const supabase = createClient(supabaseUrl, supabaseAnonKey);