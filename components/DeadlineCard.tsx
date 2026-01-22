
import React from 'react';
import { Deadline } from '../types';

interface DeadlineCardProps {
  deadline: Deadline;
}

const DeadlineCard: React.FC<DeadlineCardProps> = ({ deadline }) => {
  const colorClass = deadline.isUrgent ? 'border-accent-gold' : 'border-primary';
  const tagBg = deadline.isUrgent ? 'bg-accent-gold/10' : 'bg-primary/10';
  const tagText = deadline.isUrgent ? 'text-accent-gold' : 'text-primary';
  const progressBg = deadline.isUrgent ? 'bg-accent-gold' : 'bg-primary';

  return (
    <div className={`bg-white dark:bg-[#141618] border-l-4 ${colorClass} rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer`}>
      <div className="flex justify-between items-start mb-3">
        <span className={`text-[10px] font-bold uppercase tracking-wider ${tagText} ${tagBg} px-2 py-1 rounded`}>
          {deadline.isUrgent ? 'Urgent' : 'In Progress'}
        </span>
        <span className="text-xs font-bold text-[#5c8a82]">{deadline.timeLeft}</span>
      </div>
      <h3 className="font-bold text-base leading-snug mb-1 dark:text-white">{deadline.title}</h3>
      <p className="text-xs text-[#5c8a82] line-clamp-1">{deadline.organization}</p>
      <div className="mt-4 flex items-center gap-2">
        <div className="flex-1 bg-[#eaf1f0] dark:bg-[#2d3332] h-1.5 rounded-full overflow-hidden">
          <div className={`${progressBg} h-full transition-all duration-500`} style={{ width: `${deadline.progress}%` }}></div>
        </div>
        <span className="text-[10px] font-bold dark:text-gray-400">{deadline.progress}% Ready</span>
      </div>
    </div>
  );
};

export default DeadlineCard;
