import React, { useState, useEffect, useMemo } from 'react';
import { Project, Issue, Sprint, Epic, ViewTab, IssueStatus } from './types';
import { INITIAL_PROJECTS, INITIAL_ISSUES, INITIAL_SPRINTS, INITIAL_EPICS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { KanbanBoard } from './components/KanbanBoard';
import { SprintPlanning } from './components/SprintPlanning';
import { EpicRoadmap } from './components/EpicRoadmap';
import { ReportsView } from './components/ReportsView';
import { IssueDetailModal } from './components/IssueDetailModal';
import { CreateIssueModal } from './components/CreateIssueModal';
import { InsightsSidebar } from './components/InsightsSidebar';
import { ThemeProvider } from './context/ThemeContext';

const AppContent: React.FC = () => {
  const [projects] = useState<Project[]>(INITIAL_PROJECTS);
  const [currentProject, setCurrentProject] = useState<Project>(INITIAL_PROJECTS[0]);
  const [currentTab, setCurrentTab] = useState<ViewTab>('board');

  const [issues, setIssues] = useState<Issue[]>(() => {
    const saved = localStorage.getItem('jira_issues');
    return saved ? JSON.parse(saved) : INITIAL_ISSUES;
  });

  const [sprints, setSprints] = useState<Sprint[]>(() => {
    const saved = localStorage.getItem('jira_sprints');
    return saved ? JSON.parse(saved) : INITIAL_SPRINTS;
  });

  const [epics, setEpics] = useState<Epic[]>(() => {
    const saved = localStorage.getItem('jira_epics');
    return saved ? JSON.parse(saved) : INITIAL_EPICS;
  });

  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createDefaultSprintId, setCreateDefaultSprintId] = useState<string | undefined>(undefined);

  const activeSprint = useMemo(() => sprints.find(s => s.status === 'active'), [sprints]);

  useEffect(() => {
    localStorage.setItem('jira_issues', JSON.stringify(issues));
  }, [issues]);

  useEffect(() => {
    localStorage.setItem('jira_sprints', JSON.stringify(sprints));
  }, [sprints]);

  useEffect(() => {
    localStorage.setItem('jira_epics', JSON.stringify(epics));
  }, [epics]);

  const handleUpdateIssueStatus = (issueId: string, newStatus: IssueStatus) => {
    setIssues(prev =>
      prev.map(i => (i.id === issueId ? { ...i, status: newStatus, updatedAt: new Date().toISOString() } : i))
    );
  };

  const handleUpdateIssue = (updated: Issue) => {
    setIssues(prev => prev.map(i => (i.id === updated.id ? updated : i)));
  };

  const handleCreateIssue = (newIssueData: Omit<Issue, 'id' | 'key' | 'createdAt' | 'updatedAt' | 'comments' | 'subtasks' | 'linkedIssueIds'>) => {
    const nextKeyNum = issues.length + 101;
    const newIssue: Issue = {
      ...newIssueData,
      id: `issue-${Date.now()}`,
      key: `${currentProject.key}-${nextKeyNum}`,
      subtasks: [],
      comments: [],
      linkedIssueIds: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setIssues(prev => [newIssue, ...prev]);
  };

  const handleAssignToSprint = (issueId: string, sprintId: string | undefined) => {
    setIssues(prev =>
      prev.map(i => (i.id === issueId ? { ...i, sprintId, status: sprintId ? (i.status === 'backlog' ? 'todo' : i.status) : 'backlog' } : i))
    );
  };

  const handleStartSprint = (sprintId: string) => {
    setSprints(prev =>
      prev.map(s => (s.id === sprintId ? { ...s, status: 'active' } : s))
    );
  };

  const handleCompleteSprint = (sprintId: string) => {
    setSprints(prev =>
      prev.map(s => (s.id === sprintId ? { ...s, status: 'closed' } : s))
    );
  };

  const handleCreateSprint = (name: string, goal: string) => {
    const newSprint: Sprint = {
      id: `sprint-${Date.now()}`,
      name,
      goal,
      status: 'planned',
      startDate: '2026-04-05',
      endDate: '2026-04-18',
    };
    setSprints(prev => [...prev, newSprint]);
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case 'board':
        return (
          <KanbanBoard
            issues={issues}
            epics={epics}
            onUpdateIssueStatus={handleUpdateIssueStatus}
            onSelectIssue={setSelectedIssue}
          />
        );
      case 'backlog':
        return (
          <SprintPlanning
            issues={issues}
            sprints={sprints}
            epics={epics}
            onAssignToSprint={handleAssignToSprint}
            onStartSprint={handleStartSprint}
            onCompleteSprint={handleCompleteSprint}
            onCreateSprint={handleCreateSprint}
            onSelectIssue={setSelectedIssue}
            onOpenCreateModal={sprintId => {
              setCreateDefaultSprintId(sprintId);
              setShowCreateModal(true);
            }}
          />
        );
      case 'roadmap':
        return (
          <EpicRoadmap
            epics={epics}
            issues={issues}
            onSelectIssue={setSelectedIssue}
            onCreateEpic={(name, desc, start, end, color) => {
              const newEpic: Epic = {
                id: `epic-${Date.now()}`,
                key: `${currentProject.key}-E${epics.length + 1}`,
                name,
                description: desc,
                startDate: start,
                endDate: end,
                color,
                status: 'todo',
              };
              setEpics(prev => [...prev, newEpic]);
            }}
          />
        );
      case 'reports':
        return <ReportsView issues={issues} sprints={sprints} epics={epics} />;
      case 'settings':
        return (
          <div className="flex-1 p-8 bg-white dark:bg-[#1d2125] overflow-y-auto space-y-6">
            <div className="bg-white dark:bg-[#22272b] border border-[#dfe1e6] dark:border-[#38414a] p-6 rounded-2xl shadow-sm max-w-2xl">
              <h2 className="text-xl font-bold text-[#172b4d] dark:text-white mb-2">Project Settings: {currentProject.name}</h2>
              <p className="text-sm text-[#5e6c84] dark:text-[#9fadbc] mb-6">Manage project keys, agile workflows, and team permissions.</p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[#5e6c84] dark:text-[#9fadbc] mb-1 block">Project Name</label>
                  <input
                    type="text"
                    readOnly
                    value={currentProject.name}
                    className="w-full bg-[#f4f5f7] dark:bg-[#1d2125] border border-[#dfe1e6] dark:border-[#38414a] rounded-lg px-3 py-2 text-[#172b4d] dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#5e6c84] dark:text-[#9fadbc] mb-1 block">Project Key</label>
                  <input
                    type="text"
                    readOnly
                    value={currentProject.key}
                    className="w-full bg-[#f4f5f7] dark:bg-[#1d2125] border border-[#dfe1e6] dark:border-[#38414a] rounded-lg px-3 py-2 text-[#172b4d] dark:text-white text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 'issues':
      case 'code':
      case 'releases':
        return (
          <div className="flex-1 flex items-center justify-center bg-white dark:bg-[#1d2125] text-[#5e6c84] dark:text-[#9fadbc]">
            <div className="text-center">
              <div className="text-4xl mb-4">🚧</div>
              <h2 className="text-xl font-bold text-[#172b4d] dark:text-white mb-2">{currentTab.charAt(0).toUpperCase() + currentTab.slice(1)} view is coming soon</h2>
              <p>We're working hard to bring you the best {currentTab} experience.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#1d2125] text-[#172b4d] dark:text-[#b6c2cf] flex flex-col font-sans select-none transition-colors">
      <Navbar
        projects={projects}
        currentProject={currentProject}
        onSelectProject={setCurrentProject}
        onOpenCreateModal={() => {
          setCreateDefaultSprintId(undefined);
          setShowCreateModal(true);
        }}
        issues={issues}
        onSelectIssue={setSelectedIssue}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          projectName={currentProject.name}
          projectKey={currentProject.key}
        />

        <main className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            {renderTabContent()}
          </div>
          <InsightsSidebar issues={issues} activeSprint={activeSprint} />
        </main>
      </div>

      {/* Modals */}
      {selectedIssue && (
        <IssueDetailModal
          issue={selectedIssue}
          epics={epics}
          sprints={sprints}
          allIssues={issues}
          onClose={() => setSelectedIssue(null)}
          onUpdateIssue={handleUpdateIssue}
        />
      )}

      {showCreateModal && (
        <CreateIssueModal
          epics={epics}
          sprints={sprints}
          defaultSprintId={createDefaultSprintId}
          onClose={() => setShowCreateModal(false)}
          onCreateIssue={handleCreateIssue}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
