import React from 'react';
import { 
  Trello, 
  GanttChart, 
  Search, 
  Settings, 
  Layout, 
  FileText, 
  Code2, 
  Package, 
  Plus,
  ChevronDown,
  Info,
  Kanban,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { ViewTab } from '../types';

interface SidebarProps {
  currentTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  projectName: string;
  projectKey: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  onSelectTab, 
  projectName,
  projectKey
}) => {
  const NavItem = ({ 
    tab, 
    icon: Icon, 
    label,
    badge
  }: { 
    tab: ViewTab; 
    icon: any; 
    label: string;
    badge?: string | number;
  }) => (
    <button
      onClick={() => onSelectTab(tab)}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors group ${
        currentTab === tab
          ? 'bg-[#deebff] dark:bg-[#0052cc]/20 text-[#0052cc] dark:text-[#579dff] font-semibold'
          : 'text-[#42526e] dark:text-[#b6c2cf] hover:bg-[#f4f5f7] dark:hover:bg-[#282e33] hover:text-[#172b4d] dark:hover:text-white'
      }`}
    >
      <div className="flex items-center space-x-3">
        <Icon className={`w-4 h-4 ${currentTab === tab ? 'text-[#0052cc] dark:text-[#579dff]' : 'text-[#42526e] dark:text-[#b6c2cf] group-hover:text-[#172b4d] dark:group-hover:text-white'}`} />
        <span className="text-sm">{label}</span>
      </div>
      {badge && (
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#dfe1e6] dark:bg-[#38414a] text-[#42526e] dark:text-[#b6c2cf] font-bold">
          {badge}
        </span>
      )}
    </button>
  );

  return (
    <aside className="w-64 bg-[#f4f5f7] dark:bg-[#1d2125] border-r border-[#dfe1e6] dark:border-[#38414a] flex flex-col h-full overflow-y-auto select-none transition-colors">
      {/* Project Info Header */}
      <div className="px-4 py-5 mb-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-white dark:bg-[#22272b] border border-[#dfe1e6] dark:border-[#38414a] flex items-center justify-center text-sm font-bold text-[#0052cc] dark:text-[#579dff] shadow-sm">
            {projectKey.substring(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold text-[#172b4d] dark:text-white truncate leading-tight">
              {projectName}
            </h2>
            <p className="text-xs text-[#5e6c84] dark:text-[#9fadbc] truncate">
              Software project
            </p>
          </div>
        </div>
      </div>

      <div className="px-3 space-y-6">
        {/* Planning & Tracking Section */}
        <section>
          <h3 className="px-3 text-[11px] font-bold text-[#5e6c84] dark:text-[#9fadbc] uppercase tracking-wider mb-2 flex items-center justify-between">
            Planning
            <ChevronDown className="w-3 h-3" />
          </h3>
          <div className="space-y-0.5">
            <NavItem tab="roadmap" icon={GanttChart} label="Timeline" />
            <NavItem tab="backlog" icon={FileText} label="Backlog" />
            <NavItem tab="board" icon={Kanban} label="Kanban Board" />
            <NavItem tab="issues" icon={Search} label="Issues" />
          </div>
        </section>

        {/* Development Section */}
        <section>
          <h3 className="px-3 text-[11px] font-bold text-[#5e6c84] dark:text-[#9fadbc] uppercase tracking-wider mb-2">
            Development
          </h3>
          <div className="space-y-0.5">
            <NavItem tab="code" icon={Code2} label="Code" />
            <NavItem tab="releases" icon={Package} label="Releases" />
          </div>
        </section>

        {/* Settings Section */}
        <section>
          <h3 className="px-3 text-[11px] font-bold text-[#5e6c84] dark:text-[#9fadbc] uppercase tracking-wider mb-2">
            Settings
          </h3>
          <div className="space-y-0.5">
            <NavItem tab="settings" icon={Settings} label="Project settings" />
          </div>
        </section>
      </div>

      {/* Footer / Info */}
      <div className="mt-auto p-4 border-t border-[#dfe1e6] dark:border-[#38414a] bg-[#ebecf0]/30 dark:bg-[#22272b]/30">
        <div className="flex items-center justify-between text-[#5e6c84] dark:text-[#9fadbc] text-xs">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Team-managed project</span>
          </div>
          <Info className="w-3.5 h-3.5 cursor-pointer hover:text-[#172b4d] dark:hover:text-white" />
        </div>
      </div>
    </aside>
  );
};
