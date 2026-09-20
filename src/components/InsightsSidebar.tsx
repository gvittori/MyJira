import React from 'react';
import { Issue, Sprint } from '../types';
import { BarChart3, Users, Clock, Info } from 'lucide-react';

interface InsightsSidebarProps {
  issues: Issue[];
  activeSprint?: Sprint;
}

export const InsightsSidebar: React.FC<InsightsSidebarProps> = ({ issues, activeSprint }) => {
  const sprintIssues = activeSprint ? issues.filter(i => i.sprintId === activeSprint.id) : [];
  
  const totalPoints = sprintIssues.reduce((sum, i) => sum + (i.storyPoints || 0), 0);
  const donePoints = sprintIssues
    .filter(i => i.status === 'done')
    .reduce((sum, i) => sum + (i.storyPoints || 0), 0);
    
  const completionPercentage = totalPoints > 0 ? Math.round((donePoints / totalPoints) * 100) : 0;

  // Workload by assignee
  const workload = sprintIssues.reduce((acc, issue) => {
    if (!issue.assignee) return acc;
    acc[issue.assignee] = (acc[issue.assignee] || 0) + (issue.storyPoints || 0);
    return acc;
  }, {} as Record<string, number>);

  return (
    <aside className="w-80 bg-[#f4f5f7] dark:bg-[#1d2125] border-l border-[#dfe1e6] dark:border-[#38414a] p-4 flex flex-col h-full overflow-y-auto hidden xl:flex">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-[#172b4d] dark:text-white flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          Insights
        </h3>
        <button className="text-[#5e6c84] dark:text-[#9fadbc] hover:text-[#172b4d] dark:hover:text-white">
          <Info className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-6">
        {/* Sprint Progress */}
        <section>
          <h4 className="text-xs font-bold text-[#5e6c84] dark:text-[#9fadbc] uppercase mb-3">Sprint Progress</h4>
          <div className="bg-white dark:bg-[#22272b] rounded-lg p-4 border border-[#dfe1e6] dark:border-[#38414a] shadow-sm">
            <div className="flex justify-between items-end mb-2">
              <span className="text-2xl font-bold text-[#172b4d] dark:text-white">{completionPercentage}%</span>
              <span className="text-xs text-[#5e6c84] dark:text-[#9fadbc]">{donePoints} / {totalPoints} pts</span>
            </div>
            <div className="w-full bg-[#dfe1e6] dark:bg-[#38414a] rounded-full h-2">
              <div 
                className="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-[#5e6c84] dark:text-[#9fadbc] mt-2 italic">
              Keep it up! You're on track to complete this sprint.
            </p>
          </div>
        </section>

        {/* Workload breakdown */}
        <section>
          <h4 className="text-xs font-bold text-[#5e6c84] dark:text-[#9fadbc] uppercase mb-3 flex items-center gap-2">
            <Users className="w-3 h-3" />
            Workload Breakdown
          </h4>
          <div className="space-y-3">
            {Object.entries(workload).map(([assignee, points]) => (
              <div key={assignee} className="bg-white dark:bg-[#22272b] rounded-lg p-3 border border-[#dfe1e6] dark:border-[#38414a] shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-[#172b4d] dark:text-white truncate">{assignee}</span>
                  <span className="text-xs font-bold text-[#172b4d] dark:text-white">{points} pts</span>
                </div>
                <div className="w-full bg-[#dfe1e6] dark:bg-[#38414a] rounded-full h-1.5">
                  <div 
                    className="bg-[#0052cc] dark:bg-[#579dff] h-1.5 rounded-full" 
                    style={{ width: `${Math.min((points / 21) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
            {Object.keys(workload).length === 0 && (
              <p className="text-xs text-[#5e6c84] dark:text-[#9fadbc] text-center py-4">No workload data available.</p>
            )}
          </div>
        </section>

        {/* Sprint Time */}
        <section>
          <h4 className="text-xs font-bold text-[#5e6c84] dark:text-[#9fadbc] uppercase mb-3 flex items-center gap-2">
            <Clock className="w-3 h-3" />
            Time remaining
          </h4>
          <div className="bg-white dark:bg-[#22272b] rounded-lg p-4 border border-[#dfe1e6] dark:border-[#38414a] shadow-sm">
            <div className="text-center">
              <span className="text-xl font-bold text-[#172b4d] dark:text-white">8 days</span>
              <p className="text-[11px] text-[#5e6c84] dark:text-[#9fadbc]">of 14 days total</p>
            </div>
          </div>
        </section>
      </div>
    </aside>
  );
};
