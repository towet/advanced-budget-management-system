import React from 'react';

interface HeroProps {
  onGetStarted: () => void;
}

export function Hero({ onGetStarted }: HeroProps) {
  return (
    <div className="relative min-h-[500px] bg-gradient-to-br from-black via-gray-900 to-primary-900 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Flex container for desktop layout */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
          {/* Text Content - Full width on mobile, half on desktop */}
          <div className="w-full lg:w-1/2 text-white space-y-6 lg:space-y-8 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
              Take Control of Your
              <span className="text-primary-400 block mt-2">Financial Future</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/80 max-w-xl mx-auto lg:mx-0">
              Track, analyze, and optimize your finances with our advanced budgeting system. 
              Make smarter financial decisions today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={onGetStarted}
                className="w-full sm:w-auto px-8 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Get Started
              </button>
              <button className="w-full sm:w-auto px-8 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors">
                Learn More
              </button>
            </div>
          </div>
          
          {/* Hero Image - Full width on mobile, half on desktop */}
          <div className="w-full lg:w-1/2 px-4 sm:px-8 lg:px-0">
            <div className="relative aspect-square lg:aspect-[4/3] max-w-lg mx-auto">
              <img 
                src="/images/hero.jpg" 
                alt="Financial Expert" 
                className="w-full h-full object-cover rounded-2xl shadow-2xl"
              />
              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-primary-500/20 rounded-full filter blur-3xl"></div>
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-primary-500/20 rounded-full filter blur-3xl"></div>
      
      {/* Mobile-optimized gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 pointer-events-none lg:hidden"></div>
    </div>
  );
}
