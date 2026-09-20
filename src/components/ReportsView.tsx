import React from 'react';
import { Issue, Sprint, Epic } from '../types';
import { BarChart3, TrendingUp, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface ReportsViewProps {
  issues: Issue[];
  sprints: Sprint[];
  epics: Epic[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  issues,
  sprints,
  epics,
}) => {
  const totalIssues = issues.length;
  const doneIssues = issues.filter(i => i.status === 'done').length;
  const inProgressIssues = issues.filter(i => i.status === 'inprogress' || i.status === 'inreview').length;
  const backlogIssues = issues.filter(i => i.status === 'backlog').length;

  const totalPoints = issues.reduce((acc, i) => acc + (i.storyPoints || 0), 0);
  const completedPoints = issues.filter(i => i.status === 'done').reduce((acc, i) => acc + (i.storyPoints || 0), 0);

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem)] bg-slate-950 overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <h1 className="text-xl font-bold text-white">Agile Reports & Velocity Metrics</h1>
        <p className="text-xs text-slate-400">Comprehensive overview of team velocity, story point burndown, and issue distribution.</p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Total Issues</div>
            <div className="text-2xl font-bold text-white mt-1">{totalIssues}</div>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
            <BarChart3 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Completed Points</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{completedPoints} / {totalPoints}</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">In Progress</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">{inProgressIssues}</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-lg flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Backlog Queue</div>
            <div className="text-2xl font-bold text-purple-400 mt-1">{backlogIssues}</div>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Velocity Chart simulation */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white">Sprint Velocity Chart (Story Points Committed vs Completed)</h3>
        <div className="h-64 flex items-end justify-between gap-6 pt-6 px-4 border-b border-slate-800">
          {[
            { sprint: 'Sprint 11', committed: 24, completed: 22 },
            { sprint: 'Sprint 12', committed: 30, completed: 28 },
            { sprint: 'Sprint 13', committed: 28, completed: 28 },
            { sprint: 'Sprint 14 (Active)', committed: 26, completed: 13 },
          ].map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center h-full justify-end space-y-2">
              <div className="w-full flex justify-center items-end space-x-2 h-48">
                <div
                  className="w-6 bg-slate-700 rounded-t-lg transition-all"
                  style={{ height: `${(item.committed / 35) * 100}%` }}
                  title={`Committed: ${item.committed}`}
                />
                <div
                  className="w-6 bg-blue-600 rounded-t-lg transition-all"
                  style={{ height: `${(item.completed / 35) * 100}%` }}
                  title={`Completed: ${item.completed}`}
                />
              </div>
              <span className="text-xs text-slate-400 font-medium text-center">{item.sprint}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center space-x-6 text-xs text-slate-400 pt-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-slate-700 rounded" />
            <span>Committed Points</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded" />
            <span>Completed Points</span>
          </div>
        </div>
      </div>
    </div>
  );
};
