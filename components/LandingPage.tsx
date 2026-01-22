
import React from 'react';
import { Link } from 'react-router-dom';
import { MOCK_OPPORTUNITIES } from '../constants';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-background-light/80 dark:bg-background-dark/80 glass-nav">
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[20px]">hub</span>
            </div>
            <h1 className="text-lg font-extrabold tracking-tight text-[#101817] dark:text-white">Opportunity Hub</h1>
          </div>
          <nav className="hidden md:flex items-center gap-10">
            <a className="text-sm font-semibold hover:text-primary transition-colors" href="#">Explore</a>
            <a className="text-sm font-semibold hover:text-primary transition-colors" href="#">About</a>
            <a className="text-sm font-semibold hover:text-primary transition-colors" href="#">Resources</a>
            <a className="text-sm font-semibold hover:text-primary transition-colors" href="#">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link 
              to="/dashboard"
              className="px-5 py-2 text-sm font-bold text-[#101817] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
            >
              Login
            </Link>
            <Link 
              to="/dashboard"
              className="px-5 py-2 text-sm font-bold bg-primary text-white rounded-lg shadow-sm hover:shadow-md hover:bg-[#256e62] transition-all"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-6 pb-20">
        {/* Hero Section */}
        <section className="py-16 md:py-24 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-[12px] font-bold text-primary uppercase tracking-wider">New opportunities added today</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-[#101817] dark:text-white leading-[1.1] tracking-tight max-w-[800px] mb-8">
            Your gateway to the next <span className="text-primary">big breakthrough.</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-[650px] mb-12 leading-relaxed">
            Discover curated grants, strategic investments, and career-defining professional growth opportunities in one unified hub.
          </p>

          {/* Search Bar */}
          <div className="w-full max-w-[720px] bg-white dark:bg-[#25282c] p-2 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center px-4 gap-3">
              <span className="material-symbols-outlined text-gray-400">search</span>
              <input 
                className="w-full bg-transparent border-none focus:ring-0 text-sm md:text-base py-3 placeholder:text-gray-400 dark:text-white" 
                placeholder="Search by keyword, industry, or location..." 
                type="text"
              />
            </div>
            <div className="h-10 w-px bg-gray-100 dark:bg-gray-700 hidden md:block my-auto"></div>
            <div className="flex items-center px-4 gap-3 md:w-48 cursor-pointer">
              <span className="material-symbols-outlined text-gray-400">location_on</span>
              <span className="text-sm text-gray-500 truncate">Global Search</span>
            </div>
            <button className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-[#256e62] transition-all whitespace-nowrap">
              Search Hub
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {['All', 'Grants', 'Investments', 'Internships', 'Growth'].map((filter) => (
              <button 
                key={filter}
                className={`px-5 py-2 rounded-full border border-gray-200 dark:border-gray-700 text-xs font-bold uppercase tracking-widest transition-all ${filter === 'All' ? 'bg-primary text-white' : 'bg-white dark:bg-[#25282c] text-gray-600 dark:text-gray-300 hover:border-primary'}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </section>

        {/* Metrics */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-gray-100 dark:border-gray-800 mb-16">
          {[
            { label: 'Opportunities', value: '50k+' },
            { label: 'Total Grant Pool', value: '$120M' },
            { label: 'VC Partners', value: '200+' },
            { label: 'Hired Interns', value: '12k' },
          ].map((m) => (
            <div key={m.label} className="text-center">
              <p className="text-3xl font-black text-primary">{m.value}</p>
              <p className="text-xs font-bold uppercase tracking-tighter text-gray-500 mt-1">{m.label}</p>
            </div>
          ))}
        </section>

        {/* Featured */}
        <section>
          <div className="flex items-end justify-between mb-8 px-2">
            <div>
              <h2 className="text-2xl font-black text-[#101817] dark:text-white">Featured Opportunities</h2>
              <p className="text-sm text-gray-500 mt-1">Hand-picked by our specialists for high impact potential.</p>
            </div>
            <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
              View all <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_OPPORTUNITIES.slice(0, 3).map((opp) => (
              <div key={opp.id} className="group bg-white dark:bg-[#25282c] rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all">
                {opp.imageUrl && (
                  <div 
                    className="h-48 bg-cover bg-center relative" 
                    style={{ backgroundImage: `url('${opp.imageUrl}')` }}
                  >
                    {opp.isUrgent && (
                      <div className="absolute top-4 right-4 bg-accent-gold text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                        Ending Soon
                      </div>
                    )}
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase">{opp.type}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">• {opp.deadline || 'New'}</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#101817] dark:text-white mb-2 group-hover:text-primary transition-colors">{opp.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 line-clamp-2">{opp.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px] text-gray-400">business</span>
                      </div>
                      <span className="text-xs font-semibold text-gray-500">{opp.organization}</span>
                    </div>
                    <span className="text-sm font-black text-[#101817] dark:text-white">{opp.amount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="mt-24 bg-[#101817] rounded-2xl p-8 md:p-16 text-center text-white relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/20 rounded-full blur-[80px]"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-accent-gold/20 rounded-full blur-[80px]"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black mb-6">Ready to find your next move?</h2>
            <p className="text-gray-400 text-lg mb-10 max-w-[600px] mx-auto">
              Join 50,000+ professionals who get the first pick of curated opportunities every morning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard" className="bg-primary hover:bg-[#256e62] px-10 py-4 rounded-xl font-black text-lg transition-all">
                Join the Hub
              </Link>
              <Link to="/dashboard" className="bg-white/10 hover:bg-white/20 border border-white/10 px-10 py-4 rounded-xl font-black text-lg transition-all">
                Explore Open Calls
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-background-dark border-t border-gray-100 dark:border-gray-800 py-16">
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-primary p-1 rounded-lg">
                <span className="material-symbols-outlined text-white text-[16px]">hub</span>
              </div>
              <h2 className="text-sm font-extrabold tracking-tight dark:text-white">Opportunity Hub</h2>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed mb-6">
              The world's most comprehensive platform for curated grants, investments, and professional growth opportunities.
            </p>
            <div className="flex gap-4">
              <span className="material-symbols-outlined text-gray-400 cursor-pointer hover:text-primary">public</span>
              <span className="material-symbols-outlined text-gray-400 cursor-pointer hover:text-primary">groups</span>
              <span className="material-symbols-outlined text-gray-400 cursor-pointer hover:text-primary">mail</span>
            </div>
          </div>
          {['Explore', 'Resources', 'Company'].map((col) => (
            <div key={col}>
              <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">{col}</h4>
              <ul className="space-y-4 text-sm font-semibold text-gray-600 dark:text-gray-400">
                <li><a className="hover:text-primary transition-colors" href="#">Link 1</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Link 2</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Link 3</a></li>
              </ul>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
