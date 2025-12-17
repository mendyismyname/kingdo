import { createClient } from '@supabase/supabase-js';

// Correct way to access VITE_ prefixed environment variables in Vite
// Using optional chaining and nullish coalescing for safety
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

// Strict check for required environment variables
if (!supabaseUrl || supabaseUrl === '') {
  console.error('❌ VITE_SUPABASE_URL is missing or empty. Please check your .env.local file.');
  console.error('Current value:', supabaseUrl);
  throw new Error('VITE_SUPABASE_URL is required.');
}

if (!supabaseAnonKey || supabaseAnonKey === '') {
  console.error('❌ VITE_SUPABASE_ANON_KEY is missing or empty. Please check your .env.local file.');
  console.error('Current value:', supabaseAnonKey);
  throw new Error('VITE_SUPABASE_ANON_KEY is required.');
}

console.log('✅ Supabase environment variables found.');
console.log('   VITE_SUPABASE_URL (first 20 chars):', supabaseUrl.substring(0, 20) + '...');
// Be careful not to log the full anon key for security
console.log('   VITE_SUPABASE_ANON_KEY (present):', supabaseAnonKey ? 'Yes' : 'No');

// Create the Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);