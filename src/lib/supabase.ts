import { createClient } from '@supabase/supabase-js';

// Function to get environment variables with better error handling
const getEnvVar = (name: string): string => {
  const value = import.meta.env[name];
  if (typeof value !== 'string' || value.trim() === '') {
    console.error(`❌ Environment variable ${name} is missing or invalid.`);
    console.error(`   Current value:`, value);
    console.error(`   Type:`, typeof value);
    throw new Error(`${name} is required and must be a non-empty string.`);
  }
  return value;
};

try {
  // Get environment variables
  const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
  const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');
  
  console.log('✅ Supabase environment variables loaded successfully.');
  console.log('   VITE_SUPABASE_URL (first 30 chars):', supabaseUrl.substring(0, 30) + '...');
  console.log('   VITE_SUPABASE_ANON_KEY (length):', supabaseAnonKey.length);

  // Create the Supabase client instance
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log('✅ Supabase client created successfully.');
} catch (error) {
  console.error('❌ Failed to initialize Supabase client:', error);
  throw error;
}
export const supabase = createClient(supabaseUrl, supabaseAnonKey);