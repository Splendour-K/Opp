
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MOCK_OPPORTUNITIES, MOCK_DEADLINES } from '../constants';
import Sidebar from './Sidebar';
import OpportunityCard from './OpportunityCard';
import DeadlineCard from './DeadlineCard';
import OpportunityDetailModal from './OpportunityDetailModal';
import { syncExternalSources } from '../services/geminiService';
import { Opportunity, UserTask, TaskStatus, OpportunityType, UserSettings } from '../types';

interface DashboardProps {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ toggleDarkMode, isDarkMode }) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(MOCK_OPPORTUNITIES);
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [currentView, setCurrentView] = useState('overview');
  const [groundingLinks, setGroundingLinks] = useState<{title: string, uri: string}[]>([]);
  
  // Filtering state
  const [typeFilter, setTypeFilter] = useState<OpportunityType | 'All'>('All');
  const [scoreFilter, setScoreFilter] = useState<number>(0);
  
  // Settings and Notifications
  const [settings, setSettings] = useState<UserSettings>({ reminderThreshold: 3 });
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  const [userBio, setUserBio] = useState('I am a tech entrepreneur interested in decentralized systems and green energy solutions.');

  // User workflow state
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [tasks, setTasks] = useState<UserTask[]>([]);

  // Calculate upcoming deadlines for notifications
  const notifications = useMemo(() => {
    const today = new Date();
    const allItems = [
      ...opportunities.map(o => ({ id: o.id, title: o.title, deadlineDate: o.deadlineDate })),
      ...MOCK_DEADLINES.map(d => ({ id: d.id, title: d.title, deadlineDate: d.deadlineDate }))
    ];

    return allItems.filter(item => {
      if (!item.deadlineDate || dismissedAlerts.has(item.id)) return false;
      const dDate = new Date(item.deadlineDate);
      const diffTime = dDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= settings.reminderThreshold;
    });
  }, [opportunities, settings.reminderThreshold, dismissedAlerts]);

  // "Latest Articles" are simply the first 3-4 items in our opportunity list
  const latestArticles = useMemo(() => {
    return opportunities.slice(0, 4);
  }, [opportunities]);

  const handleSync = async () => {
    setIsSyncing(true);
    const result = await syncExternalSources();
    
    if (result.opportunities.length > 0) {
      setOpportunities(prev => {
        const combined = [...result.opportunities, ...prev];
        const unique = combined.filter((v, i, a) => a.findIndex(t => t.title === v.title) === i);
        return unique;
      });
    }

    if (result.groundingChunks) {
      const links = result.groundingChunks
        .filter(chunk => chunk.web && chunk.web.uri)
        .map(chunk => ({
          title: chunk.web.title || chunk.web.uri,
          uri: chunk.web.uri
        }));
      setGroundingLinks(links);
    }

    setIsSyncing(false);
  };

  const toggleSave = (id: string) => {
    setSavedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const addToTodo = (id: string) => {
    if (tasks.find(t => t.opportunityId === id)) return;
    const newTask: UserTask = {
      id: `task-${Date.now()}`,
      opportunityId: id,
      status: 'Yet to Start',
      addedAt: new Date().toISOString()
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
  };

  const removeTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const dismissNotification = (id: string) => {
    setDismissedAlerts(prev => new Set(prev).add(id));
  };

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesType = typeFilter === 'All' || opp.type === typeFilter;
    const matchesScore = (opp.matchScore || 0) >= scoreFilter;
    return matchesType && matchesScore;
  });

  const renderContent = () => {
    if (currentView === 'overview') {
      return (
        <div className="flex flex-col gap-12 animate-in fade-in duration-500">
          {notifications.length > 0 && (
            <div className="flex flex-col gap-2">
              {notifications.map(notif => (
                <div key={notif.id} className="flex items-center justify-between bg-accent-gold/10 border border-accent-gold/20 p-4 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-accent-gold">event_upcoming</span>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      Reminder: <span className="font-bold">"{notif.title}"</span> deadline is approaching.
                    </p>
                  </div>
                  <button onClick={() => dismissNotification(notif.id)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <h1 className="text-4xl font-black tracking-tight dark:text-white">GrowthPath Daily</h1>
            <p className="text-[#5c8a82] font-medium text-lg">The pulse of global career and funding opportunities.</p>
          </div>

          {/* New Section: Latest from the Blog */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black flex items-center gap-3 dark:text-white">
                <span className="material-symbols-outlined text-primary">rss_feed</span>
                Latest Articles
              </h2>
              <button 
                onClick={handleSync}
                className="text-xs font-black text-primary hover:underline flex items-center gap-1"
              >
                Fetch more news
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {latestArticles.map((article, idx) => (
                <div 
                  key={article.id}
                  onClick={() => setSelectedOpp(article)}
                  className={`group relative overflow-hidden rounded-[2rem] border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#141618] hover:shadow-2xl transition-all cursor-pointer ${idx === 0 ? 'lg:col-span-2 aspect-[21/9]' : 'aspect-[16/10]'}`}
                >
                  <img 
                    src={article.imageUrl || `https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1000`} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    alt={article.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  <div className="absolute bottom-0 left-0 w-full p-8">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                        {article.type}
                      </span>
                      <span className="text-white/70 text-[10px] font-black uppercase tracking-widest">
                        Just Published
                      </span>
                    </div>
                    <h3 className={`font-black text-white leading-tight mb-2 ${idx === 0 ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'}`}>
                      {article.title}
                    </h3>
                    <p className="text-white/60 text-sm font-medium line-clamp-2 max-w-2xl mb-4">
                      {article.description}
                    </p>
                    <div className="flex items-center gap-4">
                       <div className="flex items-center gap-2">
                          <div className="size-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                            <span className="material-symbols-outlined text-[14px]">business</span>
                          </div>
                          <span className="text-xs font-bold text-white/80">{article.organization}</span>
                       </div>
                       <span className="text-xs font-black text-accent-gold">{article.amount}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2 dark:text-white">
                <span className="material-symbols-outlined text-accent-gold">alarm</span>
                Expiring Soon
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {MOCK_DEADLINES.map((dl) => (
                <DeadlineCard key={dl.id} deadline={dl} />
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#eaf1f0] dark:border-[#2d3332] pb-6">
              <div className="flex flex-col gap-4">
                <h2 className="text-lg font-bold dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">explore</span>
                  Discover All
                </h2>
                <div className="flex flex-wrap gap-2">
                  {['All', 'Grant', 'Fellowship', 'Conference', 'Scholarship', 'Internship', 'Job', 'Investment'].map(type => (
                    <button 
                      key={type}
                      onClick={() => setTypeFilter(type as any)}
                      className={`px-4 py-1.5 text-xs font-bold rounded-full border transition-all ${
                        typeFilter === type 
                        ? 'bg-primary border-primary text-white shadow-md' 
                        : 'bg-white dark:bg-[#141618] border-gray-200 dark:border-gray-700 text-[#5c8a82] hover:border-primary/50'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2 min-w-[160px]">
                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Min Match Score</span>
                <select 
                  value={scoreFilter}
                  onChange={(e) => setScoreFilter(Number(e.target.value))}
                  className="bg-white dark:bg-[#141618] border border-gray-200 dark:border-gray-700 text-xs font-bold rounded-xl px-4 py-2 focus:ring-primary/20 text-[#101817] dark:text-white"
                >
                  <option value={0}>Any Match Score</option>
                  <option value={90}>90% or higher</option>
                  <option value={80}>80% or higher</option>
                  <option value={70}>70% or higher</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOpportunities.map((opp) => (
                <OpportunityCard 
                  key={opp.id} 
                  opportunity={opp} 
                  isSaved={savedIds.has(opp.id)}
                  onReadMore={() => setSelectedOpp(opp)}
                  onSave={() => toggleSave(opp.id)}
                />
              ))}
            </div>
          </section>
        </div>
      );
    }

    if (currentView === 'todo') {
      return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-black tracking-tight dark:text-white">My To-Do List</h1>
            <p className="text-[#5c8a82] font-medium">Manage and track your active applications.</p>
          </div>

          <div className="bg-white dark:bg-[#141618] rounded-2xl border border-[#eaf1f0] dark:border-[#2d3332] overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50 text-[#5c8a82] text-[10px] font-black uppercase tracking-widest border-b border-[#eaf1f0] dark:border-[#2d3332]">
                  <th className="px-6 py-4">Opportunity</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eaf1f0] dark:divide-[#2d3332]">
                {tasks.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-gray-400">
                      <span className="material-symbols-outlined text-4xl mb-2 block">playlist_add</span>
                      <p className="text-sm font-bold">Your to-do list is empty</p>
                    </td>
                  </tr>
                ) : (
                  tasks.map(task => {
                    const opp = opportunities.find(o => o.id === task.opportunityId);
                    if (!opp) return null;
                    return (
                      <tr key={task.id} className="text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold dark:text-white">{opp.title}</span>
                            <span className="text-xs text-[#5c8a82]">{opp.organization}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <select 
                            value={task.status}
                            onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                            className="bg-[#eaf1f0] dark:bg-[#2d3332] border-none text-xs font-bold rounded-lg px-3 py-1.5 focus:ring-primary/20 text-primary"
                          >
                            <option value="Yet to Start">Yet to Start</option>
                            <option value="Started">Started</option>
                            <option value="Finished">Finished</option>
                            <option value="Submitted">Submitted</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button onClick={() => setSelectedOpp(opp)} className="text-primary hover:underline font-bold text-xs">View</button>
                            <button onClick={() => removeTask(task.id)} className="text-red-500 hover:underline font-bold text-xs">Remove</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (currentView === 'saved') {
      const savedOpps = opportunities.filter(o => savedIds.has(o.id));
      return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-black tracking-tight dark:text-white">Saved Opportunities</h1>
            <p className="text-[#5c8a82] font-medium">Items you've bookmarked for later review.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedOpps.map((opp) => (
              <OpportunityCard 
                key={opp.id} 
                opportunity={opp} 
                isSaved={true}
                onReadMore={() => setSelectedOpp(opp)}
                onSave={() => toggleSave(opp.id)}
              />
            ))}
          </div>
        </div>
      );
    }

    if (currentView === 'settings') {
      return (
        <div className="flex flex-col gap-8 max-w-2xl animate-in fade-in slide-in-from-left-4 duration-500">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-black tracking-tight dark:text-white">Settings</h1>
            <p className="text-[#5c8a82] font-medium">Customize your hub experience and preferences.</p>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-[#141618] rounded-2xl p-6 border border-[#eaf1f0] dark:border-[#2d3332]">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary">notifications_active</span>
                <h3 className="font-bold dark:text-white text-lg">Notification Preferences</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Deadline Reminder Threshold</p>
                  <div className="flex gap-3">
                    {[1, 3, 5, 7].map(days => (
                      <button 
                        key={days}
                        onClick={() => setSettings({ ...settings, reminderThreshold: days })}
                        className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all ${
                          settings.reminderThreshold === days 
                          ? 'bg-primary border-primary text-white shadow-lg' 
                          : 'bg-gray-50 dark:bg-[#1c1f22] border-gray-200 dark:border-gray-800 text-[#5c8a82]'
                        }`}
                      >
                        {days} Day{days > 1 ? 's' : ''}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold dark:text-white">Reset Notifications</p>
                    <p className="text-xs text-[#5c8a82]">Clear all dismissed alerts and start fresh.</p>
                  </div>
                  <button 
                    onClick={() => setDismissedAlerts(new Set())}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-white text-xs font-bold rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
                  >
                    Reset Now
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#141618] rounded-2xl p-6 border border-[#eaf1f0] dark:border-[#2d3332]">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-primary">palette</span>
                <h3 className="font-bold dark:text-white text-lg">Interface Settings</h3>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold dark:text-white">Visual Mode</p>
                    <p className="text-xs text-[#5c8a82]">Switch between dark and light themes.</p>
                  </div>
                  <button 
                    onClick={toggleDarkMode}
                    className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-xs font-black rounded-xl hover:bg-primary/20 transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {isDarkMode ? 'light_mode' : 'dark_mode'}
                    </span>
                    {isDarkMode ? 'Switch to Light' : 'Switch to Dark'}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#141618] rounded-2xl p-6 border border-[#eaf1f0] dark:border-[#2d3332]">
               <div className="flex items-center gap-3 mb-6 text-red-500">
                <span className="material-symbols-outlined">dangerous</span>
                <h3 className="font-bold text-lg">Danger Zone</h3>
              </div>
              <button className="w-full py-4 text-xs font-black text-red-500 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/20 hover:bg-red-100 transition-all">
                Delete My Hub Data
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (currentView === 'profile') {
      return (
        <div className="flex flex-col gap-8 max-w-2xl animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-black tracking-tight dark:text-white">User Profile</h1>
            <p className="text-[#5c8a82] font-medium">Manage your identity and matching profile.</p>
          </div>

          <div className="bg-white dark:bg-[#141618] rounded-[2.5rem] overflow-hidden border border-[#eaf1f0] dark:border-[#2d3332] relative">
            <div className="h-32 bg-primary/10"></div>
            <div className="px-10 pb-10">
              <div className="relative -mt-16 mb-6">
                <div 
                  className="size-32 rounded-[2rem] border-4 border-white dark:border-[#141618] bg-cover bg-center shadow-2xl" 
                  style={{ backgroundImage: "url('https://picsum.photos/seed/user1/128')" }}
                ></div>
                <button className="absolute bottom-0 left-24 size-10 bg-white dark:bg-[#25282c] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-lg flex items-center justify-center text-primary hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">edit</span>
                </button>
              </div>

              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-black dark:text-white">Alex Rivera</h2>
                  <p className="text-sm font-bold text-primary">Entrepreneur & Strategist</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Email</p>
                     <p className="text-sm font-bold dark:text-white">alex.rivera@example.com</p>
                   </div>
                   <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Location</p>
                     <p className="text-sm font-bold dark:text-white">San Francisco, CA</p>
                   </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Matching Bio</p>
                    <span className="text-[10px] font-black text-primary px-2 py-0.5 bg-primary/10 rounded">Used by AI Matcher</span>
                  </div>
                  <textarea 
                    value={userBio}
                    onChange={(e) => setUserBio(e.target.value)}
                    rows={4}
                    className="w-full bg-gray-50 dark:bg-[#1c1f22] border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-primary/20 dark:text-white resize-none"
                  />
                  <p className="mt-2 text-xs text-[#5c8a82]">Update your bio to get more accurate opportunity match scores.</p>
                </div>

                <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex gap-4">
                   <button className="flex-1 bg-primary text-white font-black py-4 rounded-2xl text-sm shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all">
                     Save Profile Changes
                   </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return <div className="p-20 text-center text-gray-400">Under Construction</div>;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark transition-colors">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="sticky top-0 z-10 flex items-center justify-between bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-[#eaf1f0] dark:border-[#2d3332] px-8 py-4">
          <div className="flex items-center gap-6 flex-1">
            <div className="relative w-full max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#5c8a82] text-xl">search</span>
              <input 
                className="w-full bg-[#eaf1f0] dark:bg-[#2d3332] border-none rounded-xl pl-11 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-[#5c8a82] text-[#101817] dark:text-white" 
                placeholder="Search hub content..." 
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleSync}
              disabled={isSyncing}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border border-primary/20 transition-all ${
                isSyncing ? 'bg-gray-100 text-gray-400' : 'bg-primary/10 text-primary hover:bg-primary/20'
              }`}
            >
              <span className={`material-symbols-outlined text-sm ${isSyncing ? 'animate-spin' : ''}`}>sync</span>
              {isSyncing ? 'Syncing...' : 'Sync New Posts'}
            </button>
            
            <button 
              onClick={() => setCurrentView('settings')}
              className={`size-10 flex items-center justify-center rounded-xl bg-white dark:bg-[#141618] border border-[#eaf1f0] dark:border-[#2d3332] transition-colors ${
                currentView === 'settings' ? 'text-primary border-primary' : 'text-[#5c8a82] hover:bg-gray-50'
              }`}
            >
              <span className="material-symbols-outlined">notifications</span>
              {notifications.length > 0 && (
                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-[#141618]"></span>
              )}
            </button>

            <button 
              onClick={toggleDarkMode}
              className="size-10 flex items-center justify-center rounded-xl bg-white dark:bg-[#141618] border border-[#eaf1f0] dark:border-[#2d3332]"
            >
              <span className="material-symbols-outlined text-[#5c8a82]">
                {isDarkMode ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
          </div>
        </header>

        <div className="px-8 py-8 max-w-7xl mx-auto w-full">
          {renderContent()}
        </div>

        {selectedOpp && (
          <OpportunityDetailModal 
            opportunity={selectedOpp} 
            isSaved={savedIds.has(selectedOpp.id)}
            isInTodo={!!tasks.find(t => t.opportunityId === selectedOpp.id)}
            onToggleSave={() => toggleSave(selectedOpp.id)}
            onAddToTodo={() => addToTodo(selectedOpp.id)}
            onClose={() => setSelectedOpp(null)} 
            onSelectOpportunity={setSelectedOpp}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
