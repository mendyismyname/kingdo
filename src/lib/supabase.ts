// Import necessary modules
import { createClient } from '@supabase/supabase-js';

// Log all VITE_ prefixed environment variables for debugging (be careful with sensitive data in logs)
console.log('🔍 Debug: All VITE_ prefixed env vars:');
Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')).forEach(key => {
    console.log(`  ${key}:`, typeof import.meta.env[key] === 'string' ? import.meta.env[key].substring(0, 50) + '...' : import.meta.env[key]);
});

// Attempt to get the environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Debug: Attempting to use VITE_SUPABASE_URL:', typeof supabaseUrl === 'string' ? supabaseUrl.substring(0, 30) + '...' : supabaseUrl);
console.log('🔍 Debug: Attempting to use VITE_SUPABASE_ANON_KEY:', typeof supabaseAnonKey === 'string' ? 'Present (length: ' + supabaseAnonKey.length + ')' : supabaseAnonKey);

// Check if the required environment variables are present and are strings
if (typeof supabaseUrl !== 'string' || supabaseUrl.trim() === '') {
    console.error('❌ VITE_SUPABASE_URL is missing or invalid. Value type:', typeof supabaseUrl, 'Value:', supabaseUrl);
    throw new Error('VITE_SUPABASE_URL is required and must be a non-empty string.');
}

if (typeof supabaseAnonKey !== 'string' || supabaseAnonKey.trim() === '') {
    console.error('❌ VITE_SUPABASE_ANON_KEY is missing or invalid. Value type:', typeof supabaseAnonKey, 'Value:', supabaseAnonKey);
    throw new Error('VITE_SUPABASE_ANON_KEY is required and must be a non-empty string.');
}

console.log('✅ Supabase environment variables successfully retrieved.');
console.log('   VITE_SUPABASE_URL (first 30 chars):', supabaseUrl.substring(0, 30) + '...');
console.log('   VITE_SUPABASE_ANON_KEY (length):', supabaseAnonKey.length);

// Create the Supabase client instance
try {
    export const supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('✅ Supabase client created successfully.');
} catch (error) {
    console.error('❌ Failed to create Supabase client:', error);
    throw error;
}