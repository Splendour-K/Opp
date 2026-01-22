
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Opportunity } from '../types';
import { MOCK_OPPORTUNITIES } from '../constants';

interface OpportunityDetailModalProps {
  opportunity: Opportunity;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
  onAddToTodo: () => void;
  isInTodo: boolean;
  onSelectOpportunity?: (opp: Opportunity) => void;
}

const OpportunityDetailModal: React.FC<OpportunityDetailModalProps> = ({ 
  opportunity, 
  onClose, 
  isSaved, 
  onToggleSave, 
  onAddToTodo, 
  isInTodo, 
  onSelectOpportunity 
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasReadToEnd, setHasReadToEnd] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  const endOfContentRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Calculate estimated reading time
  const fullText = opportunity.content || opportunity.description;
  const paragraphs = fullText.split('\n\n');
  const readingTime = Math.max(1, Math.ceil(fullText.split(/\s+/).length / 200));

  // Intersection Observer to detect when user reaches the end
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasReadToEnd(true);
        }
      },
      { threshold: 0.1 }
    );

    if (endOfContentRef.current) {
      observer.observe(endOfContentRef.current);
    }

    return () => observer.disconnect();
  }, [opportunity]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const progress = (target.scrollTop / (target.scrollHeight - target.clientHeight)) * 100;
    setScrollProgress(progress);
    setIsHeaderVisible(target.scrollTop > 300);
  };

  const handleCopyLink = () => {
    const url = window.location.origin + window.location.pathname + '#/dashboard?opp=' + opportunity.id;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const relatedOpportunities = useMemo(() => {
    return MOCK_OPPORTUNITIES
      .filter(o => o.id !== opportunity.id)
      .map(o => {
        let score = 0;
        let reasons: string[] = [];
        
        if (o.type === opportunity.type) {
          score += 20;
          reasons.push('Similar Type');
        }
        
        if (o.tags && opportunity.tags) {
          const commonTags = o.tags.filter(tag => opportunity.tags!.includes(tag));
          if (commonTags.length > 0) {
            score += commonTags.length * 15;
            reasons.push('Related Tags');
          }
        }

        // Determine best label
        let finalLabel = 'Recommended';
        if (reasons.length > 1) finalLabel = 'Top Match';
        else if (reasons.length === 1) finalLabel = reasons[0];

        return { ...o, relationScore: score, relationshipLabel: finalLabel };
      })
      .sort((a, b) => b.relationScore - a.relationScore)
      .slice(0, 3);
  }, [opportunity]);

  return (
    <div className="fixed inset-0 z-[150] bg-white dark:bg-[#0f1112] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Immersive Sticky Header */}
      <header className={`fixed top-0 left-0 w-full z-[160] transition-all duration-300 border-b ${
        isHeaderVisible 
        ? 'bg-white/90 dark:bg-[#0f1112]/90 backdrop-blur-md translate-y-0 border-gray-100 dark:border-gray-800' 
        : '-translate-y-full border-transparent'
      }`}>
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={onClose} className="flex items-center gap-2 text-primary font-black text-sm">
            <span className="material-symbols-outlined">arrow_back</span>
            Back to Hub
          </button>
          <h2 className="text-sm font-black truncate max-w-[200px] md:max-w-md dark:text-white">
            {opportunity.title}
          </h2>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <button 
                onClick={handleCopyLink}
                className={`size-8 flex items-center justify-center rounded-full transition-colors ${isCopied ? 'text-primary bg-primary/10' : 'text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800'}`}
              >
                <span className="material-symbols-outlined text-sm">{isCopied ? 'check' : 'share'}</span>
              </button>
              {isCopied && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-primary text-white text-[10px] font-bold rounded shadow-lg whitespace-nowrap animate-in zoom-in-95 fade-in duration-200">
                  Link Copied!
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-primary"></div>
                </div>
              )}
            </div>
            <div className="h-1 w-24 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden hidden md:block">
              <div className="h-full bg-primary" style={{ width: `${scrollProgress}%` }}></div>
            </div>
            <button onClick={onClose} className="size-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Scroll Container */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto scroll-smooth"
      >
        <article className="max-w-screen-xl mx-auto flex flex-col items-center">
          
          {/* Top Hero Section */}
          <div className="w-full h-[60vh] relative mb-12">
            <img 
              src={opportunity.imageUrl || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2000'} 
              className="w-full h-full object-cover" 
              alt={opportunity.title}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#0f1112]/0"></div>
            
            <button 
              onClick={onClose}
              className="absolute top-8 left-8 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-2xl border border-white/20 transition-all flex items-center gap-2 font-bold"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              Back to Hub
            </button>

            <div className="absolute bottom-12 left-0 w-full px-6">
              <div className="max-w-3xl mx-auto">
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                    {opportunity.type}
                  </span>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest rounded-full border border-white/20">
                    {readingTime} min read
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white leading-tight drop-shadow-2xl">
                  {opportunity.title}
                </h1>
              </div>
            </div>
          </div>

          {/* Content Column */}
          <div className="max-w-3xl w-full px-6 pb-32">
            <div className="flex items-center gap-4 mb-12 pb-8 border-b border-gray-100 dark:border-gray-800">
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">business</span>
              </div>
              <div>
                <p className="text-xs font-black uppercase text-gray-400 tracking-widest">Published By</p>
                <p className="font-black text-lg text-[#101817] dark:text-white">{opportunity.organization}</p>
              </div>
              
              <div className="ml-auto relative">
                <button 
                  onClick={handleCopyLink}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-black text-xs uppercase tracking-widest border ${
                    isCopied 
                      ? 'bg-primary/10 border-primary/20 text-primary' 
                      : 'bg-gray-50 dark:bg-gray-900 border-transparent text-gray-400 hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{isCopied ? 'check' : 'share'}</span>
                  {isCopied ? 'Link Copied' : 'Share'}
                </button>
                {isCopied && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-primary text-white text-[10px] font-black rounded-lg shadow-xl whitespace-nowrap animate-in slide-in-from-bottom-2 fade-in duration-300">
                    COPIED TO CLIPBOARD
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-primary"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Ad Placeholder Concept (SEO-Friendly spacing) */}
            <div className="w-full h-24 bg-gray-50 dark:bg-gray-900/50 rounded-2xl mb-12 border border-dashed border-gray-200 dark:border-gray-800 flex items-center justify-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 opacity-50">Sponsor Content Area</span>
            </div>

            {/* Article Body */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div className="text-[#33413e] dark:text-gray-300 leading-[1.8] text-xl space-y-8 font-medium">
                {paragraphs.map((para, i) => (
                  <p key={i} className="mb-8">{para}</p>
                ))}
              </div>
            </div>

            {/* End of content sentinel for unlocking actions */}
            <div ref={endOfContentRef} className="h-4 w-full" />

            {/* Locked/Unlocked Actions Section */}
            <div className={`mt-20 transition-all duration-700 ${
              hasReadToEnd ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95 pointer-events-none'
            }`}>
              <div className="p-8 md:p-12 bg-primary/5 rounded-[2.5rem] border border-primary/20 relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-[60px]"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="material-symbols-outlined text-primary text-3xl">verified</span>
                    <h3 className="text-2xl font-black text-[#101817] dark:text-white">Ready to move forward?</h3>
                  </div>
                  
                  <p className="text-[#5c8a82] dark:text-gray-400 mb-10 text-lg leading-relaxed max-w-xl font-bold">
                    You've reviewed the details. Now it's time to take action. This opportunity could be the next major milestone in your career or business.
                  </p>

                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {opportunity.source?.url && (
                        <a 
                          href={opportunity.source.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex-[2] flex items-center justify-center gap-3 py-5 rounded-2xl font-black text-lg bg-primary text-white hover:bg-primary-dark transition-all shadow-2xl shadow-primary/30"
                        >
                          <span className="material-symbols-outlined text-[24px]">rocket_launch</span>
                          Apply Here
                        </a>
                      )}
                      <a 
                        href="https://example.com/request-review" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-3 py-5 rounded-2xl font-black text-lg bg-accent-gold text-black hover:bg-yellow-500 transition-all shadow-xl"
                      >
                        <span className="material-symbols-outlined text-[24px]">rate_review</span>
                        Request Help
                      </a>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <button 
                        onClick={onAddToTodo}
                        disabled={isInTodo}
                        className={`flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-sm transition-all ${
                          isInTodo 
                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed' 
                            : 'bg-[#101817] text-white hover:bg-black'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">{isInTodo ? 'check_circle' : 'bolt'}</span>
                        {isInTodo ? 'Added to List' : 'Add to Tracker'}
                      </button>
                      <button 
                        onClick={onToggleSave}
                        className={`flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-sm transition-all border ${
                          isSaved 
                            ? 'bg-white dark:bg-[#1c1f22] border-primary text-primary' 
                            : 'bg-white dark:bg-[#1c1f22] border-gray-200 dark:border-gray-700 text-gray-700 dark:text-white hover:border-primary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">{isSaved ? 'bookmark_added' : 'bookmark'}</span>
                        {isSaved ? 'Saved' : 'Save for Later'}
                      </button>
                      
                      <div className="relative h-full">
                        <button 
                          onClick={handleCopyLink}
                          className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-sm transition-all border ${
                            isCopied 
                              ? 'bg-primary/10 border-primary/20 text-primary' 
                              : 'bg-white dark:bg-[#1c1f22] border-gray-200 dark:border-gray-700 text-gray-700 dark:text-white hover:border-primary'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[20px]">{isCopied ? 'check' : 'share'}</span>
                          {isCopied ? 'Link Copied!' : 'Share Now'}
                        </button>
                        {isCopied && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-4 py-2 bg-[#101817] text-white text-xs font-black rounded-xl shadow-2xl whitespace-nowrap animate-in zoom-in-90 fade-in duration-300">
                            LINK READY TO PASTE!
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#101817]"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reading Reward Placeholder (AdSense-Ready spot) */}
            {!hasReadToEnd && (
              <div className="mt-8 text-center animate-pulse">
                <p className="text-xs font-black text-gray-300 uppercase tracking-widest">Continue reading to unlock application links</p>
                <div className="mt-2 w-full h-1.5 bg-gray-50 dark:bg-gray-900 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-200 dark:bg-gray-800" style={{ width: `${scrollProgress}%` }}></div>
                </div>
              </div>
            )}

            {/* You Might Also Like */}
            {hasReadToEnd && (
              <div className="mt-32 pt-16 border-t border-gray-100 dark:border-gray-800">
                <h3 className="text-2xl font-black text-[#101817] dark:text-white mb-10 flex items-center gap-3">
                  <span className="material-symbols-outlined text-accent-gold text-3xl">auto_awesome</span>
                  Related Discoveries
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {relatedOpportunities.map((relOpp) => (
                    <div 
                      key={relOpp.id}
                      onClick={() => {
                        onSelectOpportunity?.(relOpp as Opportunity);
                        scrollContainerRef.current?.scrollTo(0, 0);
                        setHasReadToEnd(false);
                      }}
                      className="group cursor-pointer"
                    >
                      <div className="aspect-video w-full rounded-2xl overflow-hidden mb-4 bg-gray-100 dark:bg-gray-900">
                        <img 
                          src={relOpp.imageUrl || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=600'} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                          alt={relOpp.title}
                        />
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                          {relOpp.type}
                        </span>
                        <span className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-400 text-[8px] font-black uppercase rounded tracking-tighter ring-1 ring-gray-200 dark:ring-gray-700">
                          <span className="material-symbols-outlined text-[10px]">diversity_2</span>
                          {(relOpp as any).relationshipLabel}
                        </span>
                      </div>
                      <h4 className="text-lg font-black text-[#101817] dark:text-white group-hover:text-primary transition-colors leading-tight mb-1">
                        {relOpp.title}
                      </h4>
                      <p className="text-sm font-bold text-[#5c8a82]">{relOpp.organization}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-20 flex justify-center">
              <button 
                onClick={() => scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="size-12 rounded-full border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-400 group-hover:text-primary group-hover:border-primary transition-all">
                  <span className="material-symbols-outlined">arrow_upward</span>
                </div>
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Back to top</span>
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default OpportunityDetailModal;
