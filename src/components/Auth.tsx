"use client";

import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface AuthProps {
  onAuthSuccess: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSigningUp) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // showSuccess('Check your email for the confirmation link!'); // Removed toast
        // For sign-up, we don't immediately call onAuthSuccess, as email confirmation is needed.
        // The App.tsx will detect the session change after confirmation.
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // showSuccess('Signed in successfully!'); // Removed toast
        onAuthSuccess(); // Trigger App.tsx to load profile
      }
    } catch (error: any) {
      // showError(error.message); // Removed toast
      console.error('Auth error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-king-cream flex flex-col items-center justify-center p-6 z-50">
      <div className="max-w-md w-full text-center bg-white p-8 rounded-3xl shadow-xl border border-stone-100">
        <div className="w-12 h-12 mx-auto text-king-primary mb-6 opacity-80">
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.5523 18.5523 20 18 20H6C5.44772 20 5 19.5523 5 19V18H19V19Z" />
          </svg>
        </div>
        <h1 className="font-display text-4xl text-king-text font-bold mb-6">
          {isSigningUp ? 'Join the Kingdom' : 'Enter the Kingdom'}
        </h1>

        <form onSubmit={handleAuth} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-king-primary/20 text-king-text"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-king-primary/20 text-king-text"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-king-primary text-white py-3 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-king-primaryLight transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : (isSigningUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <button
          onClick={() => setIsSigningUp(!isSigningUp)}
          className="mt-6 text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-king-primary transition-colors"
        >
          {isSigningUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
        </button>
      </div>
    </div>
  );
};