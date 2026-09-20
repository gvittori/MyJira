import React, { useState } from 'react';
import { Issue, Sprint, Epic, IssueType, Priority } from '../types';
import { Play, CheckCircle, Plus, Calendar, Target, ChevronDown, ChevronRight, User } from 'lucide-react';

interface SprintPlanningProps {
  issues: Issue[];
  sprints: Sprint[];
  epics: Epic[];
  onAssignToSprint: (issueId: string, sprintId: string | undefined) => void;
  onStartSprint: (sprintId: string) => void;
  onCompleteSprint: (sprintId: string) => void;
  onCreateSprint: (name: string, goal: string) => void;
  onSelectIssue: (issue: Issue) => void;
  onOpenCreateModal: (defaultSprintId?: string) => void;
}

export const SprintPlanning: React.FC<SprintPlanningProps> = ({
  issues,
  sprints,
  epics,
  onAssignToSprint,
  onStartSprint,
  onCompleteSprint,
  onCreateSprint,
  onSelectIssue,
  onOpenCreateModal,
}) => {
  const [activeSprintId, setActiveSprintId] = useState<string>(
    sprints.find(s => s.status === 'active')?.id || sprints[0]?.id || ''
  );
  const [showCreateSprintModal, setShowCreateSprintModal] = useState(false);
  const [newSprintName, setNewSprintName] = useState('');
  const [newSprintGoal, setNewSprintGoal] = useState('');

  const activeSprint = sprints.find(s => s.id === activeSprintId);
  const backlogIssues = issues.filter(i => !i.sprintId || i.status === 'backlog');
  const sprintIssues = activeSprint ? issues.filter(i => i.sprintId === activeSprint.id) : [];

  const totalSprintPoints = sprintIssues.reduce((acc, i) => acc + (i.storyPoints || 0), 0);
  const completedSprintPoints = sprintIssues
    .filter(i => i.status === 'done')
    .reduce((acc, i) => acc + (i.storyPoints || 0), 0);

  const getTypeIcon = (type: IssueType) => {
    switch (type) {
      case 'epic': return <span className="text-purple-400">⚡</span>;
      case 'story': return <span className="text-emerald-400">📖</span>;
      case 'task': return <span className="text-blue-400">☑️</span>;
      case 'bug': return <span className="text-rose-400">🐞</span>;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#1d2125] overflow-y-auto p-6 space-y-6 transition-colors">
      {/* Header & Sprint Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-[#22272b] border border-[#dfe1e6] dark:border-[#38414a] p-5 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h1 className="text-xl font-bold text-[#172b4d] dark:text-white">Sprint Backlog & Planning</h1>
            <select
              value={activeSprintId}
              onChange={e => setActiveSprintId(e.target.value)}
              className="bg-[#f4f5f7] dark:bg-[#1d2125] border border-[#dfe1e6] dark:border-[#38414a] text-[#0052cc] dark:text-[#579dff] font-medium text-sm rounded-lg px-3 py-1.5 focus:outline-none"
            >
              {sprints.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.status.toUpperCase()})
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs text-[#5e6c84] dark:text-[#9fadbc]">Manage backlog items, organize active sprint goals, and dispatch tasks.</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCreateSprintModal(true)}
            className="bg-[#f4f5f7] dark:bg-[#282e33] hover:bg-[#ebecf0] dark:hover:bg-[#38414a] text-[#172b4d] dark:text-[#b6c2cf] text-sm font-medium px-4 py-2 rounded-xl border border-[#dfe1e6] dark:border-[#38414a] transition-colors"
          >
            + Create Sprint
          </button>

          {activeSprint?.status === 'planned' && (
            <button
              onClick={() => onStartSprint(activeSprint.id)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-xl flex items-center space-x-2 shadow-sm transition-colors"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Sprint</span>
            </button>
          )}

          {activeSprint?.status === 'active' && (
            <button
              onClick={() => onCompleteSprint(activeSprint.id)}
              className="bg-[#0052cc] hover:bg-[#0747a6] text-white text-sm font-medium px-4 py-2 rounded-xl flex items-center space-x-2 shadow-sm transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Complete Sprint</span>
            </button>
          )}
        </div>
      </div>

      {/* Active Sprint Section */}
      {activeSprint && (
        <div className="bg-white dark:bg-[#22272b] border border-[#dfe1e6] dark:border-[#38414a] rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between border-b border-[#dfe1e6] dark:border-[#38414a] pb-4 gap-4">
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="text-lg font-bold text-[#172b4d] dark:text-white">{activeSprint.name}</h2>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-semibold uppercase ${
                    activeSprint.status === 'active'
                      ? 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                      : activeSprint.status === 'planned'
                      ? 'bg-blue-100 dark:bg-blue-950/30 text-blue-800 dark:text-blue-400 border border-blue-300 dark:border-blue-800'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
                  }`}
                >
                  {activeSprint.status}
                </span>
              </div>
              <div className="flex items-center space-x-4 text-xs text-[#5e6c84] dark:text-[#9fadbc] mt-1">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{activeSprint.startDate} to {activeSprint.endDate}</span>
                </span>
                <span className="flex items-center space-x-1 text-[#0052cc] dark:text-[#579dff]">
                  <Target className="w-3.5 h-3.5" />
                  <span>Goal: {activeSprint.goal}</span>
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-sm">
              <div className="bg-[#f4f5f7] dark:bg-[#1d2125] px-3 py-1.5 rounded-lg border border-[#dfe1e6] dark:border-[#38414a] text-center">
                <div className="text-xs text-[#5e6c84] dark:text-[#9fadbc]">Total Points</div>
                <div className="font-bold text-[#172b4d] dark:text-white">{totalSprintPoints} pts</div>
              </div>
              <div className="bg-[#f4f5f7] dark:bg-[#1d2125] px-3 py-1.5 rounded-lg border border-[#dfe1e6] dark:border-[#38414a] text-center">
                <div className="text-xs text-[#5e6c84] dark:text-[#9fadbc]">Completed</div>
                <div className="font-bold text-emerald-700 dark:text-emerald-400">{completedSprintPoints} pts</div>
              </div>
              <button
                onClick={() => onOpenCreateModal(activeSprint.id)}
                className="bg-[#deebff] dark:bg-[#0052cc]/20 hover:bg-[#b3d4ff] dark:hover:bg-[#0052cc]/30 text-[#0052cc] dark:text-[#579dff] border border-[#b3d4ff] dark:border-[#0052cc]/40 text-xs font-semibold px-3 py-2 rounded-lg flex items-center space-x-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Issue to Sprint</span>
              </button>
            </div>
          </div>

          {/* Sprint Issues List */}
          <div className="space-y-2">
            {sprintIssues.length === 0 ? (
              <div className="py-8 text-center text-[#5e6c84] dark:text-[#9fadbc] border border-dashed border-[#dfe1e6] dark:border-[#38414a] rounded-xl">
                No issues in this sprint. Drag issues from the backlog below or create new ones.
              </div>
            ) : (
              sprintIssues.map(issue => {
                const epic = epics.find(e => e.id === issue.epicId);
                return (
                  <div
                    key={issue.id}
                    className="flex items-center justify-between bg-white dark:bg-[#22272b] hover:bg-[#f4f5f7] dark:hover:bg-[#282e33] border border-[#dfe1e6] dark:border-[#38414a] px-4 py-3 rounded-xl transition-all cursor-pointer group shadow-xs"
                    onClick={() => onSelectIssue(issue)}
                  >
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className="flex items-center space-x-2 w-24 flex-shrink-0">
                        {issue.type === 'story' && <div className="w-3.5 h-3.5 bg-emerald-500 rounded-sm flex items-center justify-center text-[8px] text-white font-bold">S</div>}
                        {issue.type === 'task' && <div className="w-3.5 h-3.5 bg-blue-500 rounded-sm flex items-center justify-center text-[8px] text-white font-bold">T</div>}
                        {issue.type === 'bug' && <div className="w-3.5 h-3.5 bg-rose-500 rounded-sm flex items-center justify-center text-[8px] text-white font-bold">B</div>}
                        <span className="text-xs font-bold text-[#5e6c84] dark:text-[#9fadbc]">{issue.key}</span>
                      </div>
                      <span className="text-sm font-medium text-[#172b4d] dark:text-white truncate">{issue.title}</span>
                      {epic && (
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded text-white flex-shrink-0 ${epic.color}`}>
                          {epic.key}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 flex-shrink-0">
                      <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        issue.priority === 'highest' ? 'text-rose-600 bg-rose-100 dark:bg-rose-950/30' :
                        issue.priority === 'high' ? 'text-orange-600 bg-orange-100 dark:bg-orange-950/30' :
                        'text-[#5e6c84] bg-[#f4f5f7] dark:bg-[#282e33]'
                      }`}>
                        {issue.priority}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-[#f4f5f7] dark:bg-[#1d2125] border border-[#dfe1e6] dark:border-[#38414a] text-[#172b4d] dark:text-[#b6c2cf] uppercase font-medium">
                        {issue.status.replace('-', ' ')}
                      </span>
                      {issue.storyPoints !== undefined && (
                        <span className="w-6 h-6 rounded-full bg-[#f4f5f7] dark:bg-[#1d2125] border border-[#dfe1e6] dark:border-[#38414a] flex items-center justify-center text-xs font-bold text-[#172b4d] dark:text-white">
                          {issue.storyPoints}
                        </span>
                      )}
                      {issue.assigneeAvatar ? (
                        <img src={issue.assigneeAvatar} alt={issue.assignee} className="w-7 h-7 rounded-full object-cover ring-1 ring-[#dfe1e6] dark:ring-[#38414a]" title={issue.assignee} />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-white dark:bg-[#22272b] border border-[#dfe1e6] dark:border-[#38414a] flex items-center justify-center">
                          <User className="w-3.5 h-3.5 text-[#5e6c84] dark:text-[#9fadbc]" />
                        </div>
                      )}
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onAssignToSprint(issue.id, undefined);
                        }}
                        className="text-xs text-[#5e6c84] dark:text-[#9fadbc] hover:text-rose-600 dark:hover:text-rose-400 p-1.5 rounded bg-[#f4f5f7] dark:bg-[#282e33] border border-[#dfe1e6] dark:border-[#38414a] hover:border-rose-300 transition-colors opacity-0 group-hover:opacity-100"
                        title="Move to Backlog"
                      >
                        Backlog
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Product Backlog Section */}
      <div className="bg-white dark:bg-[#22272b] border border-[#dfe1e6] dark:border-[#38414a] rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#dfe1e6] dark:border-[#38414a] pb-4">
          <div>
            <h2 className="text-lg font-bold text-[#172b4d] dark:text-white">Product Backlog ({backlogIssues.length})</h2>
            <p className="text-xs text-[#5e6c84] dark:text-[#9fadbc]">Unscheduled issues ready for upcoming sprints.</p>
          </div>
          <button
            onClick={() => onOpenCreateModal(undefined)}
            className="bg-[#0052cc] hover:bg-[#0747a6] text-white text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center space-x-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Backlog Issue</span>
          </button>
        </div>

        <div className="space-y-2">
          {backlogIssues.length === 0 ? (
            <div className="py-8 text-center text-[#5e6c84] dark:text-[#9fadbc] border border-dashed border-[#dfe1e6] dark:border-[#38414a] rounded-xl">
              Product backlog is empty. Great job!
            </div>
          ) : (
            backlogIssues.map(issue => {
              const epic = epics.find(e => e.id === issue.epicId);
              return (
                <div
                  key={issue.id}
                  className="flex items-center justify-between bg-white dark:bg-[#22272b] hover:bg-[#f4f5f7] dark:hover:bg-[#282e33] border border-[#dfe1e6] dark:border-[#38414a] px-4 py-3 rounded-xl transition-all cursor-pointer group shadow-xs"
                  onClick={() => onSelectIssue(issue)}
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="flex items-center space-x-2 w-24 flex-shrink-0">
                      {issue.type === 'story' && <div className="w-3.5 h-3.5 bg-emerald-500 rounded-sm flex items-center justify-center text-[8px] text-white font-bold">S</div>}
                      {issue.type === 'task' && <div className="w-3.5 h-3.5 bg-blue-500 rounded-sm flex items-center justify-center text-[8px] text-white font-bold">T</div>}
                      {issue.type === 'bug' && <div className="w-3.5 h-3.5 bg-rose-500 rounded-sm flex items-center justify-center text-[8px] text-white font-bold">B</div>}
                      <span className="text-xs font-bold text-[#5e6c84] dark:text-[#9fadbc]">{issue.key}</span>
                    </div>
                    <span className="text-sm font-medium text-[#172b4d] dark:text-white truncate">{issue.title}</span>
                    {epic && (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded text-white flex-shrink-0 ${epic.color}`}>
                        {epic.key}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-4 flex-shrink-0">
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      issue.priority === 'highest' ? 'text-rose-600 bg-rose-100 dark:bg-rose-950/30' :
                      issue.priority === 'high' ? 'text-orange-600 bg-orange-100 dark:bg-orange-950/30' :
                      'text-[#5e6c84] bg-[#f4f5f7] dark:bg-[#282e33]'
                    }`}>
                      {issue.priority}
                    </span>
                    {issue.storyPoints !== undefined && (
                      <span className="w-6 h-6 rounded-full bg-[#f4f5f7] dark:bg-[#1d2125] border border-[#dfe1e6] dark:border-[#38414a] flex items-center justify-center text-xs font-bold text-[#172b4d] dark:text-white">
                        {issue.storyPoints}
                      </span>
                    )}
                    {issue.assigneeAvatar ? (
                      <img src={issue.assigneeAvatar} alt={issue.assignee} className="w-7 h-7 rounded-full object-cover ring-1 ring-[#dfe1e6] dark:ring-[#38414a]" title={issue.assignee} />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-white dark:bg-[#22272b] border border-[#dfe1e6] dark:border-[#38414a] flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-[#5e6c84] dark:text-[#9fadbc]" />
                      </div>
                    )}
                    {activeSprint && (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onAssignToSprint(issue.id, activeSprint.id);
                        }}
                        className="text-xs text-[#0052cc] dark:text-[#579dff] hover:text-[#0747a6] dark:hover:text-[#579dff] px-3 py-1.5 rounded-lg bg-[#deebff] dark:bg-[#0052cc]/20 border border-[#b3d4ff] dark:border-[#0052cc]/40 hover:bg-[#b3d4ff]/60 transition-colors font-medium opacity-0 group-hover:opacity-100"
                      >
                        Add to Sprint
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Create Sprint Modal */}
      {showCreateSprintModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#22272b] border border-[#dfe1e6] dark:border-[#38414a] rounded-2xl w-full max-w-md p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-[#172b4d] dark:text-white">Create New Sprint</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#5e6c84] dark:text-[#9fadbc] mb-1 block">Sprint Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sprint 16: Security & SSO"
                  value={newSprintName}
                  onChange={e => setNewSprintName(e.target.value)}
                  className="w-full bg-[#f4f5f7] dark:bg-[#1d2125] border border-[#dfe1e6] dark:border-[#38414a] rounded-lg px-3 py-2 text-[#172b4d] dark:text-white text-sm focus:outline-none focus:border-[#0052cc]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#5e6c84] dark:text-[#9fadbc] mb-1 block">Sprint Goal</label>
                <textarea
                  placeholder="What is the primary objective of this sprint?"
                  value={newSprintGoal}
                  onChange={e => setNewSprintGoal(e.target.value)}
                  rows={3}
                  className="w-full bg-[#f4f5f7] dark:bg-[#1d2125] border border-[#dfe1e6] dark:border-[#38414a] rounded-lg px-3 py-2 text-[#172b4d] dark:text-white text-sm focus:outline-none focus:border-[#0052cc]"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowCreateSprintModal(false)}
                className="px-4 py-2 rounded-lg bg-[#f4f5f7] dark:bg-[#282e33] text-[#172b4d] dark:text-[#b6c2cf] hover:bg-[#ebecf0] dark:hover:bg-[#38414a] text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newSprintName.trim()) {
                    onCreateSprint(newSprintName, newSprintGoal);
                    setNewSprintName('');
                    setNewSprintGoal('');
                    setShowCreateSprintModal(false);
                  }
                }}
                className="px-4 py-2 rounded-lg bg-[#0052cc] hover:bg-[#0747a6] text-white text-sm font-medium shadow-sm transition-colors"
              >
                Create Sprint
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
