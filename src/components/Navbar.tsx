import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Bell, 
  HelpCircle, 
  Settings, 
  ChevronDown, 
  Sun, 
  Moon, 
  Check 
} from 'lucide-react';
import { Project, Issue } from '../types';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  projects: Project[];
  currentProject: Project;
  onSelectProject: (proj: Project) => void;
  onOpenCreateModal: () => void;
  issues: Issue[];
  onSelectIssue: (issue: Issue) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  projects,
  currentProject,
  onSelectProject,
  onOpenCreateModal,
  issues,
  onSelectIssue,
}) => {
  const { theme, setTheme } = useTheme();
  const [showProjDropdown, setShowProjDropdown] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const filteredIssues = searchQuery.trim()
    ? issues.filter(
        i =>
          i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.key.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const NavItem = ({ label }: { label: string }) => (
    <button className="flex items-center space-x-1 px-3 py-1 rounded hover:bg-[#f4f5f7] dark:hover:bg-[#282e33] text-sm font-medium transition-colors">
      <span>{label}</span>
      <ChevronDown className="w-3.5 h-3.5 text-[#5e6c84] dark:text-[#9fadbc]" />
    </button>
  );

  return (
    <header className="h-14 bg-white dark:bg-[#1d2125] border-b border-[#dfe1e6] dark:border-[#38414a] text-[#172b4d] dark:text-[#b6c2cf] flex items-center justify-between px-4 sticky top-0 z-40 shadow-xs">
      <div className="flex items-center space-x-4">
        {/* Jira Logo */}
        <div className="flex items-center space-x-2.5 cursor-pointer group mr-2">
          <div className="w-7 h-7 rounded bg-[#0052cc] flex items-center justify-center font-bold text-white text-sm shadow-sm group-hover:bg-[#0747a6] transition-colors">
            ⚡
          </div>
          <span className="font-bold text-base tracking-tight text-[#172b4d] dark:text-white flex items-center space-x-1.5">
            <span>Jira</span>
          </span>
        </div>

        {/* Project Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowProjDropdown(!showProjDropdown)}
            className="flex items-center space-x-1 px-3 py-1 rounded hover:bg-[#f4f5f7] dark:hover:bg-[#282e33] text-sm font-medium transition-colors"
          >
            <span>Projects</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#5e6c84] dark:text-[#9fadbc]" />
          </button>

          {showProjDropdown && (
            <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-[#22272b] border border-[#dfe1e6] dark:border-[#38414a] rounded-xl shadow-xl py-2 z-50">
              <div className="px-3 py-1.5 text-xs font-semibold text-[#5e6c84] dark:text-[#9fadbc] uppercase tracking-wider">
                Recent Projects
              </div>
              {projects.map(proj => (
                <button
                  key={proj.id}
                  onClick={() => {
                    onSelectProject(proj);
                    setShowProjDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 flex items-center space-x-3 hover:bg-[#f4f5f7] dark:hover:bg-[#282e33] transition-colors ${
                    proj.id === currentProject.id ? 'bg-[#deebff] dark:bg-[#0052cc]/20 text-[#0052cc] dark:text-[#579dff] font-medium' : 'text-[#172b4d] dark:text-[#b6c2cf]'
                  }`}
                >
                  <span className="text-lg">{proj.avatar}</span>
                  <div>
                    <div className="text-sm font-medium">{proj.name}</div>
                    <div className="text-xs text-[#5e6c84] dark:text-[#9fadbc]">{proj.key}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <NavItem label="Filters" />
        <NavItem label="Dashboards" />
        <NavItem label="Teams" />
        <NavItem label="Apps" />

        <button
          onClick={onOpenCreateModal}
          className="bg-[#0052cc] hover:bg-[#0747a6] text-white font-medium text-sm px-3.5 py-1.5 rounded flex items-center space-x-1.5 shadow-sm transition-colors ml-2"
        >
          <span>Create</span>
        </button>
      </div>

      {/* Global Search & Actions */}
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="flex items-center bg-[#f4f5f7] dark:bg-[#22272b] border border-[#dfe1e6] dark:border-[#38414a] rounded px-3 py-1.5 w-64 md:w-80 focus-within:border-[#0052cc] dark:focus-within:border-[#579dff] focus-within:bg-white dark:focus-within:bg-[#121417] transition-colors">
            <Search className="w-4 h-4 text-[#5e6c84] dark:text-[#9fadbc] mr-2 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search Jira..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              className="bg-transparent text-sm text-[#172b4d] dark:text-[#b6c2cf] placeholder-[#5e6c84] dark:placeholder-[#9fadbc] focus:outline-none w-full"
            />
          </div>

          {/* Search Dropdown */}
          {showSearchResults && searchQuery.trim() && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#22272b] border border-[#dfe1e6] dark:border-[#38414a] rounded-xl shadow-xl py-2 z-50 max-h-96 overflow-y-auto">
              <div className="px-3 py-1.5 text-xs font-semibold text-[#5e6c84] dark:text-[#9fadbc] uppercase tracking-wider">
                Search Results ({filteredIssues.length})
              </div>
              {filteredIssues.length === 0 ? (
                <div className="px-4 py-3 text-sm text-[#5e6c84] dark:text-[#9fadbc]">No issues found matching "{searchQuery}"</div>
              ) : (
                filteredIssues.map(issue => (
                  <button
                    key={issue.id}
                    onClick={() => {
                      onSelectIssue(issue);
                      setSearchQuery('');
                      setShowSearchResults(false);
                    }}
                    className="w-full text-left px-3 py-2.5 hover:bg-[#f4f5f7] dark:hover:bg-[#282e33] flex items-start space-x-3 border-b border-[#dfe1e6]/60 dark:border-[#38414a]/40 last:border-0"
                  >
                    <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-[#deebff] dark:bg-[#0052cc]/20 text-[#0052cc] dark:text-[#579dff] mt-0.5">
                      {issue.key}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-[#172b4d] dark:text-white truncate">{issue.title}</div>
                      <div className="text-xs text-[#5e6c84] dark:text-[#9fadbc] capitalize flex items-center space-x-2 mt-0.5">
                        <span>{issue.status.replace('-', ' ')}</span>
                        <span>•</span>
                        <span>{issue.type}</span>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-1 text-[#5e6c84] dark:text-[#9fadbc]">
          <button className="p-2 hover:bg-[#f4f5f7] dark:hover:bg-[#282e33] hover:text-[#172b4d] dark:hover:text-white rounded transition-colors" title="Notifications">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-[#f4f5f7] dark:hover:bg-[#282e33] hover:text-[#172b4d] dark:hover:text-white rounded transition-colors" title="Help">
            <HelpCircle className="w-5 h-5" />
          </button>
          
          {/* Settings Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
              className={`p-2 hover:bg-[#f4f5f7] dark:hover:bg-[#282e33] hover:text-[#172b4d] dark:hover:text-white rounded transition-colors ${showSettingsDropdown ? 'bg-[#f4f5f7] dark:bg-[#282e33] text-[#172b4d] dark:text-white' : ''}`}
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            {showSettingsDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#22272b] border border-[#dfe1e6] dark:border-[#38414a] rounded-xl shadow-xl py-2 z-50">
                <div className="px-3 py-1.5 text-xs font-semibold text-[#5e6c84] dark:text-[#9fadbc] uppercase tracking-wider">
                  Settings
                </div>
                <div className="h-px bg-[#dfe1e6] dark:bg-[#38414a] my-1 mx-2"></div>
                <div className="px-3 py-1.5 text-xs font-semibold text-[#5e6c84] dark:text-[#9fadbc] uppercase tracking-wider">
                  Themes
                </div>
                <button 
                  onClick={() => {
                    setTheme('light');
                    setShowSettingsDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-[#172b4d] dark:text-[#b6c2cf] hover:bg-[#f4f5f7] dark:hover:bg-[#282e33] transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4" />
                    <span>Light</span>
                  </div>
                  {theme === 'light' && <Check className="w-3.5 h-3.5 text-[#0052cc] dark:text-[#579dff]" />}
                </button>
                <button 
                  onClick={() => {
                    setTheme('dark');
                    setShowSettingsDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-[#172b4d] dark:text-[#b6c2cf] hover:bg-[#f4f5f7] dark:hover:bg-[#282e33] transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Moon className="w-4 h-4" />
                    <span>Dark</span>
                  </div>
                  {theme === 'dark' && <Check className="w-3.5 h-3.5 text-[#0052cc] dark:text-[#579dff]" />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-[#0052cc] flex items-center justify-center text-white font-bold text-xs ring-2 ring-[#dfe1e6] dark:ring-[#38414a] cursor-pointer">
          AM
        </div>
      </div>
    </header>
  );
};
