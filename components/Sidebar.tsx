
import React from 'react';
import { Link } from 'react-router-dom';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { icon: 'dashboard', label: 'Overview', id: 'overview' },
    { icon: 'playlist_add_check', label: 'To-Do List', id: 'todo' },
    { icon: 'bookmark', label: 'Saved Items', id: 'saved' },
  ];

  return (
    <aside className="w-64 flex flex-col border-r border-[#eaf1f0] dark:border-[#2d3332] bg-white dark:bg-[#141618] h-full">
      <div className="p-6 flex flex-col h-full">
        <Link to="/" className="flex items-center gap-3 mb-10">
          <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined">rocket_launch</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold leading-tight dark:text-white">GrowthPath</h1>
            <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Opportunity Blog</p>
          </div>
        </Link>

        <nav className="flex-1 flex flex-col gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors w-full text-left ${
                currentView === item.id 
                ? 'bg-primary/10 text-primary font-semibold' 
                : 'text-[#5c8a82] hover:bg-[#eaf1f0] dark:hover:bg-[#1c1f22]'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-[#eaf1f0] dark:border-[#2d3332] flex flex-col gap-1">
          <button 
            onClick={() => onViewChange('settings')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors w-full text-left ${
              currentView === 'settings' 
              ? 'bg-primary/10 text-primary font-semibold' 
              : 'text-[#5c8a82] hover:bg-[#eaf1f0] dark:hover:bg-[#1c1f22]'
            }`}
          >
            <span className="material-symbols-outlined">settings</span>
            <span className="text-sm">Settings</span>
          </button>
          <div 
            onClick={() => onViewChange('profile')}
            className={`flex items-center gap-3 px-3 py-4 mt-2 cursor-pointer rounded-xl transition-colors hover:bg-gray-50 dark:hover:bg-white/5 ${
              currentView === 'profile' ? 'bg-primary/5 ring-1 ring-primary/20' : ''
            }`}
          >
            <div 
              className="size-8 rounded-full bg-cover bg-center bg-gray-200" 
              style={{ backgroundImage: "url('https://picsum.photos/seed/user1/64')" }}
            ></div>
            <div className="flex flex-col">
              <span className="text-xs font-bold dark:text-white">Alex Rivera</span>
              <span className="text-[10px] text-[#5c8a82]">Active User</span>
            </div>
            <Link to="/" className="material-symbols-outlined text-sm ml-auto text-[#5c8a82] hover:text-red-500" onClick={(e) => e.stopPropagation()}>logout</Link>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
