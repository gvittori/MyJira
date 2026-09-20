import React, { useState } from 'react';
import { Issue, IssueStatus, Priority, IssueType, Epic } from '../types';
import { Search, Filter, CheckCircle2, Clock, AlertCircle, Bookmark, ArrowRight, User } from 'lucide-react';

interface KanbanBoardProps {
  issues: Issue[];
  epics: Epic[];
  onUpdateIssueStatus: (issueId: string, newStatus: IssueStatus) => void;
  onSelectIssue: (issue: Issue) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  issues,
  epics,
  onUpdateIssueStatus,
  onSelectIssue,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterAssignee, setFilterAssignee] = useState<string>('all');
  const [filterEpic, setFilterEpic] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Active sprint issues or general Kanban issues (let's show sprint-1 or non-backlog issues)
  const boardIssues = issues.filter(i => i.status !== 'backlog');

  const filteredIssues = boardIssues.filter(issue => {
    if (filterType !== 'all' && issue.type !== filterType) return false;
    if (filterPriority !== 'all' && issue.priority !== filterPriority) return false;
    if (filterAssignee !== 'all' && issue.assignee !== filterAssignee) return false;
    if (filterEpic !== 'all' && issue.epicId !== filterEpic) return false;
    if (searchFilter.trim() && !issue.title.toLowerCase().includes(searchFilter.toLowerCase()) && !issue.key.toLowerCase().includes(searchFilter.toLowerCase())) {
      return false;
    }
    return true;
  });

  const columns: { id: IssueStatus; title: string; color: string; badgeColor: string }[] = [
    { id: 'todo', title: 'To Do', color: 'border-slate-700 bg-slate-800/40', badgeColor: 'bg-slate-700 text-slate-300' },
    { id: 'inprogress', title: 'In Progress', color: 'border-blue-500/40 bg-blue-950/20', badgeColor: 'bg-blue-500/20 text-blue-400' },
    { id: 'inreview', title: 'In Review', color: 'border-amber-500/40 bg-amber-950/20', badgeColor: 'bg-amber-500/20 text-amber-400' },
    { id: 'done', title: 'Done', color: 'border-emerald-500/40 bg-emerald-950/20', badgeColor: 'bg-emerald-500/20 text-emerald-400' },
  ];

  const assignees = Array.from(new Set(boardIssues.map(i => i.assignee).filter(Boolean)));

  const getTypeIcon = (type: IssueType) => {
    switch (type) {
      case 'epic': return <span className="text-purple-400 font-bold text-xs" title="Epic">⚡</span>;
      case 'story': return <span className="text-emerald-400 font-bold text-xs" title="Story">📖</span>;
      case 'task': return <span className="text-blue-400 font-bold text-xs" title="Task">☑️</span>;
      case 'bug': return <span className="text-rose-400 font-bold text-xs" title="Bug">🐞</span>;
    }
  };

  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case 'highest': return <span className="text-rose-500 font-bold" title="Highest">▲▲</span>;
      case 'high': return <span className="text-rose-400 font-medium" title="High">▲</span>;
      case 'medium': return <span className="text-amber-400 font-medium" title="Medium">▬</span>;
      case 'low': return <span className="text-blue-400 font-medium" title="Low">▼</span>;
      case 'lowest': return <span className="text-slate-400 font-medium" title="Lowest">▼▼</span>;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#1d2125] overflow-hidden transition-colors">
      {/* Header & Filters */}
      <div className="p-4 bg-white dark:bg-[#1d2125] border-b border-[#dfe1e6] dark:border-[#38414a] flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#172b4d] dark:text-white flex items-center space-x-2">
            <span>Kanban Active Sprint Board</span>
          </h1>
          <p className="text-xs text-[#5e6c84] dark:text-[#9fadbc]">Drag or move issues across columns to track active workflow.</p>
        </div>

        {/* Filters bar */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="relative">
            <input
              type="text"
              placeholder="Filter board..."
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              className="bg-[#f4f5f7] dark:bg-[#22272b] border border-[#dfe1e6] dark:border-[#38414a] text-[#172b4d] dark:text-white rounded-lg px-3 py-1.5 w-48 placeholder-[#5e6c84] dark:placeholder-[#9fadbc] focus:outline-none focus:border-[#0052cc] focus:bg-white dark:focus:bg-[#1d2125]"
            />
          </div>

          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="bg-[#f4f5f7] dark:bg-[#22272b] border border-[#dfe1e6] dark:border-[#38414a] text-[#172b4d] dark:text-[#b6c2cf] rounded-lg px-2.5 py-1.5 focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="story">Story</option>
            <option value="task">Task</option>
            <option value="bug">Bug</option>
          </select>

          <select
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
            className="bg-[#f4f5f7] dark:bg-[#22272b] border border-[#dfe1e6] dark:border-[#38414a] text-[#172b4d] dark:text-[#b6c2cf] rounded-lg px-2.5 py-1.5 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="highest">Highest</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={filterAssignee}
            onChange={e => setFilterAssignee(e.target.value)}
            className="bg-[#f4f5f7] dark:bg-[#22272b] border border-[#dfe1e6] dark:border-[#38414a] text-[#172b4d] dark:text-[#b6c2cf] rounded-lg px-2.5 py-1.5 focus:outline-none"
          >
            <option value="all">All Assignees</option>
            {assignees.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>

          <select
            value={filterEpic}
            onChange={e => setFilterEpic(e.target.value)}
            className="bg-[#f4f5f7] dark:bg-[#22272b] border border-[#dfe1e6] dark:border-[#38414a] text-[#172b4d] dark:text-[#b6c2cf] rounded-lg px-2.5 py-1.5 focus:outline-none"
          >
            <option value="all">All Epics</option>
            {epics.map(ep => (
              <option key={ep.id} value={ep.id}>{ep.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="flex-1 flex gap-4 p-4 overflow-x-auto overflow-y-hidden bg-[#f4f5f7]/50 dark:bg-[#1d2125]/50 transition-colors">
        {columns.map(col => {
          const colIssues = filteredIssues.filter(i => i.status === col.id);
          return (
            <div
              key={col.id}
              className="flex flex-col flex-shrink-0 w-[320px] rounded-xl bg-[#f4f5f7] dark:bg-[#1d2125] border border-[#dfe1e6] dark:border-[#38414a] p-3 h-full overflow-hidden shadow-xs"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#dfe1e6] dark:border-[#38414a]">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-sm text-[#172b4d] dark:text-white uppercase tracking-wider">{col.title}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-[#dfe1e6] dark:bg-[#38414a] text-[#5e6c84] dark:text-[#9fadbc]">
                    {colIssues.length}
                  </span>
                </div>
              </div>

              {/* Column Cards Container */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {colIssues.length === 0 ? (
                  <div className="h-28 border border-dashed border-[#dfe1e6] dark:border-[#38414a] rounded-lg flex items-center justify-center text-xs text-[#5e6c84] dark:text-[#9fadbc]">
                    No issues
                  </div>
                ) : (
                  colIssues.map(issue => {
                    const epic = epics.find(e => e.id === issue.epicId);
                    const completedSubtasks = issue.subtasks.filter(s => s.completed).length;
                    const totalSubtasks = issue.subtasks.length;

                    return (
                      <div
                        key={issue.id}
                        onClick={() => onSelectIssue(issue)}
                        className="bg-white dark:bg-[#22272b] border border-[#dfe1e6] dark:border-[#38414a] hover:border-[#0052cc] dark:hover:border-[#579dff] rounded-xl p-3.5 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col space-y-2.5"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(issue.type)}
                            <span className="text-xs font-bold text-[#5e6c84] dark:text-[#9fadbc] group-hover:text-[#0052cc] dark:group-hover:text-[#579dff] transition-colors">
                              {issue.key}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1.5">
                            {getPriorityBadge(issue.priority)}
                          </div>
                        </div>

                        <h4 className="text-sm font-medium text-[#172b4d] dark:text-white leading-snug line-clamp-2">
                          {issue.title}
                        </h4>

                        {epic && (
                          <div className="inline-flex items-center space-x-1">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded text-white ${epic.color}`}>
                              {epic.key}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-[#f4f5f7] dark:border-[#38414a] text-xs text-[#5e6c84] dark:text-[#9fadbc]">
                          {/* Subtasks status */}
                          {totalSubtasks > 0 ? (
                            <div className="flex items-center space-x-1 bg-[#f4f5f7] dark:bg-[#1d2125] border border-[#dfe1e6] dark:border-[#38414a] px-2 py-0.5 rounded text-[11px]">
                              <span>☑</span>
                              <span>{completedSubtasks}/{totalSubtasks}</span>
                            </div>
                          ) : (
                            <div />
                          )}

                          <div className="flex items-center space-x-2">
                            {issue.storyPoints !== undefined && (
                              <span className="w-5 h-5 rounded-full bg-[#f4f5f7] dark:bg-[#1d2125] border border-[#dfe1e6] dark:border-[#38414a] flex items-center justify-center text-[10px] font-bold text-[#172b4d] dark:text-white" title="Story Points">
                                {issue.storyPoints}
                              </span>
                            )}

                            {issue.assigneeAvatar ? (
                              <img
                                src={issue.assigneeAvatar}
                                alt={issue.assignee}
                                className="w-6 h-6 rounded-full object-cover ring-1 ring-[#dfe1e6] dark:ring-[#38414a]"
                                title={issue.assignee}
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-[#f4f5f7] dark:bg-[#1d2125] flex items-center justify-center text-[10px]" title="Unassigned">
                                <User className="w-3 h-3 text-[#5e6c84] dark:text-[#9fadbc]" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Quick Status Action / Move */}
                        <div className="flex items-center justify-between pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-[10px] text-[#5e6c84] dark:text-[#9fadbc]">Move to:</span>
                          <div className="flex space-x-1" onClick={e => e.stopPropagation()}>
                            {col.id !== 'todo' && (
                              <button
                                onClick={() => onUpdateIssueStatus(issue.id, 'todo')}
                                className="text-[10px] px-1.5 py-0.5 bg-[#f4f5f7] dark:bg-[#1d2125] hover:bg-[#ebecf0] dark:hover:bg-[#282e33] text-[#172b4d] dark:text-[#b6c2cf] rounded border border-[#dfe1e6] dark:border-[#38414a]"
                              >
                                To Do
                              </button>
                            )}
                            {col.id !== 'inprogress' && (
                              <button
                                onClick={() => onUpdateIssueStatus(issue.id, 'inprogress')}
                                className="text-[10px] px-1.5 py-0.5 bg-[#deebff] dark:bg-[#0052cc]/20 hover:bg-[#b3d4ff] dark:hover:bg-[#0052cc]/30 text-[#0052cc] dark:text-[#579dff] rounded"
                              >
                                Progress
                              </button>
                            )}
                            {col.id !== 'done' && (
                              <button
                                onClick={() => onUpdateIssueStatus(issue.id, 'done')}
                                className="text-[10px] px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-950/30 hover:bg-emerald-200 dark:hover:bg-emerald-900/40 text-emerald-800 dark:text-emerald-400 rounded"
                              >
                                Done
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
