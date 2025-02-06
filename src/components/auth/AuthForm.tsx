import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AuthFormProps {
  mode: 'login' | 'register';
  onSubmit: (data: { email: string; password: string }) => void;
}

export function AuthForm({ mode, onSubmit }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Add .com to the email if it doesn't have a domain
    const formattedEmail = email.includes('@') ? email : `${email}@temp.com`;

    try {
      if (mode === 'register') {
        const { error } = await supabase.auth.signUp({
          email: formattedEmail,
          password,
          options: {
            data: {
              name: email.split('@')[0], // Use part before @ as name
            },
          },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formattedEmail,
          password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 w-full max-w-md">
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400" size={20} />
        <input
          type="text"
          placeholder="Username or email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-black/5 border border-primary-400/20 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-white placeholder-white/50"
          required
        />
      </div>
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400" size={20} />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-black/5 border border-primary-400/20 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-white placeholder-white/50"
          required
        />
      </div>
      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:from-primary-600 hover:to-secondary-600 transition-all transform hover:scale-105 shadow-lg font-semibold mt-8 disabled:opacity-50"
      >
        {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
      </button>
    </form>
  );
}