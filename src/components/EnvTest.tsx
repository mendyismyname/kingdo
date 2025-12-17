import React from 'react';

export const EnvTest: React.FC = () => {
  // Log all environment variables for debugging
  console.log('🔍 EnvTest: All import.meta.env keys:', Object.keys(import.meta.env));
  
  // Try to access the specific variables
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;

  console.log('🔍 EnvTest: VITE_SUPABASE_URL type:', typeof supabaseUrl);
  console.log('🔍 EnvTest: VITE_SUPABASE_URL value:', supabaseUrl);
  console.log('🔍 EnvTest: VITE_SUPABASE_ANON_KEY type:', typeof supabaseAnonKey);
  console.log('🔍 EnvTest: VITE_SUPABASE_ANON_KEY value (length):', supabaseAnonKey?.length);
  console.log('🔍 EnvTest: VITE_GEMINI_API_KEY type:', typeof geminiKey);
  console.log('🔍 EnvTest: VITE_GEMINI_API_KEY value (length):', geminiKey?.length);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Environment Variables Test</h2>
      <div className="space-y-2">
        <p><strong>VITE_SUPABASE_URL:</strong> {supabaseUrl ? '✅ Loaded' : '❌ Not found'}</p>
        <p><strong>VITE_SUPABASE_ANON_KEY:</strong> {supabaseAnonKey ? '✅ Loaded' : '❌ Not found'}</p>
        <p><strong>VITE_GEMINI_API_KEY:</strong> {geminiKey ? '✅ Loaded' : '❌ Not found'}</p>
      </div>
    </div>
  );
};