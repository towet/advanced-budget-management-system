import React, { useState, useEffect } from 'react';
import { Wallet, PieChart, TrendingUp, DollarSign, ChevronRight, Shield, Zap, BarChart3, LogOut, Menu, X } from 'lucide-react';
import { AuthForm } from './components/auth/AuthForm';
import { Dashboard } from './components/dashboard/Dashboard';
import { Hero } from './components/Hero';
import { supabase } from './lib/supabase';

function App() {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [session, setSession] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleGetStarted = () => {
    setShowAuth(true);
    setAuthMode('register');
  };

  if (session) {
    return <Dashboard session={session} onSignOut={handleSignOut} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-secondary-900 to-primary-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-primary-400 to-secondary-400 p-2 rounded-lg">
              <Wallet className="text-white" size={32} />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-100 to-secondary-100 text-transparent bg-clip-text">
              Budgeting System
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4">
            <button
              onClick={() => { setShowAuth(true); setAuthMode('login'); }}
              className="px-6 py-2.5 text-white/90 hover:text-white transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => { setShowAuth(true); setAuthMode('register'); }}
              className="px-6 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-lg border-b border-white/10">
            <div className="px-4 py-4 space-y-3">
              <button
                onClick={() => { 
                  setShowAuth(true); 
                  setAuthMode('login');
                  setMobileMenuOpen(false);
                }}
                className="w-full px-6 py-3 text-white/90 hover:text-white transition-colors text-left"
              >
                Sign In
              </button>
              <button
                onClick={() => { 
                  setShowAuth(true); 
                  setAuthMode('register');
                  setMobileMenuOpen(false);
                }}
                className="w-full px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-left"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </header>

      <main onClick={() => setMobileMenuOpen(false)}>
        {showAuth ? (
          <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <AuthForm mode={authMode} onClose={() => setShowAuth(false)} />
          </div>
        ) : (
          <div>
            {/* Hero Section */}
            <Hero onGetStarted={handleGetStarted} />

            {/* Features Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="bg-black/30 backdrop-blur-xl p-8 rounded-2xl hover:shadow-2xl transition-all transform hover:-translate-y-1 border border-white/10">
                  <div className="bg-primary-500/20 p-3 rounded-lg w-fit mb-4">
                    <BarChart3 className="text-primary-400" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Smart Analytics</h3>
                  <p className="text-white/70">Get detailed insights into your spending patterns and financial habits.</p>
                </div>

                <div className="bg-black/30 backdrop-blur-xl p-8 rounded-2xl hover:shadow-2xl transition-all transform hover:-translate-y-1 border border-white/10">
                  <div className="bg-secondary-500/20 p-3 rounded-lg w-fit mb-4">
                    <Shield className="text-secondary-400" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Secure Platform</h3>
                  <p className="text-white/70">Your financial data is protected with enterprise-grade security.</p>
                </div>

                <div className="bg-black/30 backdrop-blur-xl p-8 rounded-2xl hover:shadow-2xl transition-all transform hover:-translate-y-1 border border-white/10">
                  <div className="bg-primary-500/20 p-3 rounded-lg w-fit mb-4">
                    <Zap className="text-primary-400" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Real-time Updates</h3>
                  <p className="text-white/70">Track your finances in real-time with instant notifications.</p>
                </div>

                <div className="bg-black/30 backdrop-blur-xl p-8 rounded-2xl hover:shadow-2xl transition-all transform hover:-translate-y-1 border border-white/10">
                  <div className="bg-secondary-500/20 p-3 rounded-lg w-fit mb-4">
                    <PieChart className="text-secondary-400" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Smart Budgeting</h3>
                  <p className="text-white/70">Create and manage budgets that adapt to your lifestyle.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;