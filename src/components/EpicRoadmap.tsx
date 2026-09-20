import React, { useState } from 'react';
import { Epic, Issue } from '../types';
import { Calendar, Layers, Plus, CheckCircle2, Clock, ArrowRight } from 'lucide-react';

interface EpicRoadmapProps {
  epics: Epic[];
  issues: Issue[];
  onSelectIssue: (issue: Issue) => void;
  onCreateEpic: (name: string, description: string, startDate: string, endDate: string, color: string) => void;
}

export const EpicRoadmap: React.FC<EpicRoadmapProps> = ({
  epics,
  issues,
  onSelectIssue,
  onCreateEpic,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEpicName, setNewEpicName] = useState('');
  const [newEpicDesc, setNewEpicDesc] = useState('');
  const [newEpicStart, setNewEpicStart] = useState('2026-03-15');
  const [newEpicEnd, setNewEpicEnd] = useState('2026-04-15');
  const [newEpicColor, setNewEpicColor] = useState('bg-indigo-600');

  const colorOptions = [
    { label: 'Indigo', value: 'bg-indigo-600' },
    { label: 'Emerald', value: 'bg-emerald-600' },
    { label: 'Amber', value: 'bg-amber-600' },
    { label: 'Rose', value: 'bg-rose-600' },
    { label: 'Purple', value: 'bg-purple-600' },
    { label: 'Cyan', value: 'bg-cyan-600' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#1d2125] overflow-y-auto p-6 space-y-6 transition-colors">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-[#22272b] border border-[#dfe1e6] dark:border-[#38414a] p-5 rounded-2xl shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-[#172b4d] dark:text-white flex items-center space-x-2">
            <span>Epic Roadmap & Timeline</span>
          </h1>
          <p className="text-xs text-[#5e6c84] dark:text-[#9fadbc]">Track high-level strategic epics, milestones, and deliverables across time.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-[#0052cc] hover:bg-[#0747a6] text-white text-sm font-medium px-4 py-2 rounded-xl flex items-center space-x-2 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Epic</span>
        </button>
      </div>

      {/* Epics Timeline Grid */}
      <div className="space-y-4">
        {epics.map(epic => {
          const epicIssues = issues.filter(i => i.epicId === epic.id);
          const completedIssues = epicIssues.filter(i => i.status === 'done').length;
          const progressPercent = epicIssues.length > 0 ? Math.round((completedIssues / epicIssues.length) * 100) : 0;

          return (
            <div
              key={epic.id}
              className="bg-white dark:bg-[#22272b] border border-[#dfe1e6] dark:border-[#38414a] rounded-2xl p-5 shadow-sm space-y-4 hover:border-[#b3d4ff] dark:hover:border-[#0052cc]/40 transition-colors"
            >
              {/* Epic Header info */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#dfe1e6] dark:border-[#38414a] pb-4">
                <div className="flex items-center space-x-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded text-white ${epic.color}`}>
                    {epic.key}
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-[#172b4d] dark:text-white">{epic.name}</h2>
                    <p className="text-xs text-[#5e6c84] dark:text-[#9fadbc]">{epic.description}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-xs">
                  <div className="flex items-center space-x-1.5 text-[#5e6c84] dark:text-[#9fadbc] bg-[#f4f5f7] dark:bg-[#1d2125] px-3 py-1.5 rounded-lg border border-[#dfe1e6] dark:border-[#38414a]">
                    <Calendar className="w-4 h-4 text-[#0052cc] dark:text-[#579dff]" />
                    <span>{epic.startDate} → {epic.endDate}</span>
                  </div>

                  <div className="bg-[#f4f5f7] dark:bg-[#1d2125] px-3 py-1.5 rounded-lg border border-[#dfe1e6] dark:border-[#38414a] text-center">
                    <div className="text-[10px] text-[#5e6c84] dark:text-[#9fadbc]">Progress</div>
                    <div className="font-bold text-emerald-600 dark:text-emerald-400">{progressPercent}% ({completedIssues}/{epicIssues.length})</div>
                  </div>
                </div>
              </div>

              {/* Progress bar visual */}
              <div className="w-full bg-[#f4f5f7] dark:bg-[#1d2125] h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full ${epic.color} transition-all duration-500`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Linked Issues in this Epic */}
              <div>
                <h4 className="text-xs font-semibold text-[#5e6c84] dark:text-[#9fadbc] uppercase tracking-wider mb-2">
                  Associated Issues ({epicIssues.length})
                </h4>
                {epicIssues.length === 0 ? (
                  <div className="text-xs text-[#5e6c84] dark:text-[#9fadbc] italic py-2">No issues linked to this epic yet.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {epicIssues.map(issue => (
                      <div
                        key={issue.id}
                        onClick={() => onSelectIssue(issue)}
                        className="bg-[#f4f5f7] dark:bg-[#1d2125] border border-[#dfe1e6] dark:border-[#38414a] hover:border-[#b3d4ff] dark:hover:border-[#0052cc]/40 p-3 rounded-xl cursor-pointer transition-all flex flex-col justify-between space-y-2 group"
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-xs font-bold text-[#0052cc] dark:text-[#579dff] group-hover:underline">{issue.key}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-semibold ${
                            issue.status === 'done' ? 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400' : 'bg-[#ebecf0] dark:bg-[#282e33] text-[#5e6c84] dark:text-[#9fadbc]'
                          }`}>
                            {issue.status.replace('-', ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-[#172b4d] dark:text-[#b6c2cf] font-medium line-clamp-2">{issue.title}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Epic Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#22272b] border border-[#dfe1e6] dark:border-[#38414a] rounded-2xl w-full max-w-md p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-[#172b4d] dark:text-white">Create Strategic Epic</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#5e6c84] dark:text-[#9fadbc] mb-1 block">Epic Name</label>
                <input
                  type="text"
                  placeholder="e.g. Multi-Region Disaster Recovery"
                  value={newEpicName}
                  onChange={e => setNewEpicName(e.target.value)}
                  className="w-full bg-[#f4f5f7] dark:bg-[#1d2125] border border-[#dfe1e6] dark:border-[#38414a] rounded-lg px-3 py-2 text-[#172b4d] dark:text-white text-sm focus:outline-none focus:border-[#0052cc]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#5e6c84] dark:text-[#9fadbc] mb-1 block">Description</label>
                <textarea
                  placeholder="Strategic objectives and goals..."
                  value={newEpicDesc}
                  onChange={e => setNewEpicDesc(e.target.value)}
                  rows={2}
                  className="w-full bg-[#f4f5f7] dark:bg-[#1d2125] border border-[#dfe1e6] dark:border-[#38414a] rounded-lg px-3 py-2 text-[#172b4d] dark:text-white text-sm focus:outline-none focus:border-[#0052cc]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#5e6c84] dark:text-[#9fadbc] mb-1 block">Start Date</label>
                  <input
                    type="date"
                    value={newEpicStart}
                    onChange={e => setNewEpicStart(e.target.value)}
                    className="w-full bg-[#f4f5f7] dark:bg-[#1d2125] border border-[#dfe1e6] dark:border-[#38414a] rounded-lg px-3 py-2 text-[#172b4d] dark:text-white text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#5e6c84] dark:text-[#9fadbc] mb-1 block">Target End Date</label>
                  <input
                    type="date"
                    value={newEpicEnd}
                    onChange={e => setNewEpicEnd(e.target.value)}
                    className="w-full bg-[#f4f5f7] dark:bg-[#1d2125] border border-[#dfe1e6] dark:border-[#38414a] rounded-lg px-3 py-2 text-[#172b4d] dark:text-white text-sm focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#5e6c84] dark:text-[#9fadbc] mb-1 block">Epic Color Theme</label>
                <div className="flex space-x-2">
                  {colorOptions.map(c => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setNewEpicColor(c.value)}
                      className={`w-8 h-8 rounded-full ${c.value} ${newEpicColor === c.value ? 'ring-2 ring-[#0052cc] dark:ring-[#579dff]' : 'opacity-70'}`}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-lg bg-[#f4f5f7] dark:bg-[#282e33] text-[#172b4d] dark:text-[#b6c2cf] hover:bg-[#ebecf0] dark:hover:bg-[#38414a] text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newEpicName.trim()) {
                    onCreateEpic(newEpicName, newEpicDesc, newEpicStart, newEpicEnd, newEpicColor);
                    setNewEpicName('');
                    setNewEpicDesc('');
                    setShowCreateModal(false);
                  }
                }}
                className="px-4 py-2 rounded-lg bg-[#0052cc] hover:bg-[#0747a6] text-white text-sm font-medium shadow-sm transition-colors"
              >
                Create Epic
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
