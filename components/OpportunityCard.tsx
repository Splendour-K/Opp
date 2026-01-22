
import React from 'react';
import { Opportunity } from '../types';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onReadMore: () => void;
  onSave: (e: React.MouseEvent) => void;
  isSaved?: boolean;
}

const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity, onReadMore, onSave, isSaved }) => {
  return (
    <div 
      onClick={onReadMore}
      className="bg-white dark:bg-[#141618] rounded-2xl p-6 shadow-sm flex flex-col group border border-transparent hover:border-primary/20 transition-all cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="size-12 rounded-xl bg-[#eaf1f0] dark:bg-[#2d3332] flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
          <span className="material-symbols-outlined text-3xl">
            {opportunity.type === 'Grant' ? 'payments' : 
             opportunity.type === 'Investment' ? 'trending_up' : 
             opportunity.type === 'Internship' ? 'work' : 'auto_awesome'}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full uppercase">
            {opportunity.type}
          </span>
          {opportunity.source && (
             <span className="text-[10px] font-bold text-gray-400 mt-1 flex items-center gap-1">
               <span className="material-symbols-outlined text-[10px]">public</span>
               {opportunity.source.name}
             </span>
          )}
        </div>
      </div>
      <h3 className="text-lg font-bold mb-2 dark:text-white group-hover:text-primary transition-colors line-clamp-2">{opportunity.title}</h3>
      <p className="text-sm text-[#5c8a82] leading-relaxed mb-6 line-clamp-3">{opportunity.description}</p>
      
      <div className="mt-auto flex flex-col gap-4">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="flex items-center gap-1 text-[#5c8a82]">
            <span className="material-symbols-outlined text-sm">schedule</span>
            {opportunity.deadline || 'Rolling Basis'}
          </span>
          <span className="text-[#101817] dark:text-[#f9fbfb] truncate max-w-[100px]">{opportunity.amount}</span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); onReadMore(); }}
            className="flex-1 bg-primary text-white font-bold py-2.5 rounded-xl text-sm hover:bg-primary-dark transition-colors"
          >
            Read More
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onSave(e); }}
            className={`size-10 flex items-center justify-center border rounded-xl transition-colors ${
              isSaved 
                ? 'bg-primary border-primary text-white' 
                : 'border-[#eaf1f0] dark:border-[#2d3332] text-[#5c8a82] hover:bg-[#eaf1f0] dark:hover:bg-[#2d3332]'
            }`}
          >
            <span className="material-symbols-outlined text-xl">
              {isSaved ? 'bookmark_added' : 'bookmark'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OpportunityCard;
