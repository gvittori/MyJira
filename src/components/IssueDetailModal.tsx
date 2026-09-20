import React, { useState } from 'react';
import { Issue, Epic, Sprint, IssueStatus, Priority, IssueType, Subtask, Comment } from '../types';
import { X, Sparkles, CheckSquare, MessageSquare, Link as LinkIcon, User, Plus, Trash2, Send } from 'lucide-react';

interface IssueDetailModalProps {
  issue: Issue;
  epics: Epic[];
  sprints: Sprint[];
  allIssues: Issue[];
  onClose: () => void;
  onUpdateIssue: (updated: Issue) => void;
}

export const IssueDetailModal: React.FC<IssueDetailModalProps> = ({
  issue,
  epics,
  sprints,
  allIssues,
  onClose,
  onUpdateIssue,
}) => {
  const [title, setTitle] = useState(issue.title);
  const [description, setDescription] = useState(issue.description);
  const [status, setStatus] = useState<IssueStatus>(issue.status);
  const [priority, setPriority] = useState<Priority>(issue.priority);
  const [type, setType] = useState<IssueType>(issue.type);
  const [storyPoints, setStoryPoints] = useState<number>(issue.storyPoints || 0);
  const [epicId, setEpicId] = useState<string>(issue.epicId || '');
  const [sprintId, setSprintId] = useState<string>(issue.sprintId || '');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [aiLoading, setAiLoading] = useState<string | null>(null);

  const handleSave = () => {
    onUpdateIssue({
      ...issue,
      title,
      description,
      status,
      priority,
      type,
      storyPoints: Number(storyPoints),
      epicId: epicId || undefined,
      sprintId: sprintId || undefined,
      updatedAt: new Date().toISOString(),
    });
    onClose();
  };

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    const newSub: Subtask = {
      id: `sub-${Date.now()}`,
      title: newSubtaskTitle.trim(),
      completed: false,
    };
    const updated = {
      ...issue,
      subtasks: [...issue.subtasks, newSub],
    };
    onUpdateIssue(updated);
    setNewSubtaskTitle('');
  };

  const handleToggleSubtask = (subId: string) => {
    const updatedSubtasks = issue.subtasks.map(s =>
      s.id === subId ? { ...s, completed: !s.completed } : s
    );
    onUpdateIssue({ ...issue, subtasks: updatedSubtasks });
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const c: Comment = {
      id: `c-${Date.now()}`,
      author: 'Alex Morgan',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      content: newComment.trim(),
      createdAt: new Date().toISOString(),
    };
    onUpdateIssue({ ...issue, comments: [...issue.comments, c] });
    setNewComment('');
  };

  // AI Actions
  const handleAiSubtasks = async () => {
    setAiLoading('subtasks');
    try {
      const res = await fetch('/api/ai/subtasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      const data = await res.json();
      if (data.subtasks) {
        const added: Subtask[] = data.subtasks.map((st: any, idx: number) => ({
          id: `ai-sub-${Date.now()}-${idx}`,
          title: st.title,
          completed: false,
        }));
        onUpdateIssue({ ...issue, subtasks: [...issue.subtasks, ...added] });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(null);
    }
  };

  const handleAiEstimate = async () => {
    setAiLoading('estimate');
    try {
      const res = await fetch('/api/ai/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      const data = await res.json();
      if (data.storyPoints) {
        setStoryPoints(data.storyPoints);
        onUpdateIssue({ ...issue, storyPoints: data.storyPoints });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(null);
    }
  };

  const handleAiRefine = async () => {
    setAiLoading('refine');
    try {
      const res = await fetch('/api/ai/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      const data = await res.json();
      if (data.refinedDescription) {
        setDescription(data.refinedDescription);
        onUpdateIssue({ ...issue, description: data.refinedDescription });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#22272b] border border-[#dfe1e6] dark:border-[#38414a] rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden transition-colors">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-white dark:bg-[#22272b] border-b border-[#dfe1e6] dark:border-[#38414a] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-bold px-2.5 py-1 rounded bg-[#deebff] dark:bg-[#0052cc]/20 text-[#0052cc] dark:text-[#579dff]">
              {issue.key}
            </span>
            <select
              value={type}
              onChange={e => setType(e.target.value as IssueType)}
              className="bg-[#f4f5f7] dark:bg-[#1d2125] border border-[#dfe1e6] dark:border-[#38414a] text-[#172b4d] dark:text-[#b6c2cf] text-xs font-semibold rounded-lg px-2.5 py-1 focus:outline-none"
            >
              <option value="story">Story</option>
              <option value="task">Task</option>
              <option value="bug">Bug</option>
              <option value="epic">Epic</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              className="bg-[#0052cc] hover:bg-[#0747a6] text-white text-xs font-semibold px-4 py-1.5 rounded-lg shadow-sm transition-colors"
            >
              Save & Close
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-[#f4f5f7] dark:hover:bg-[#282e33] text-[#5e6c84] dark:text-[#9fadbc] hover:text-[#172b4d] dark:hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left / Main Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-transparent text-xl font-bold text-[#172b4d] dark:text-white border-b border-transparent hover:border-[#dfe1e6] dark:hover:border-[#38414a] focus:border-[#0052cc] dark:focus:border-[#579dff] pb-1 focus:outline-none transition-colors"
              />
            </div>

            {/* AI Assistant Action Buttons */}
            <div className="bg-[#f4f5f7] dark:bg-[#1d2125]/60 border border-[#0052cc]/20 dark:border-[#579dff]/30 rounded-xl p-3 flex flex-wrap items-center gap-2">
              <div className="flex items-center space-x-1.5 text-[#0052cc] dark:text-[#579dff] text-xs font-semibold mr-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Gemini AI:</span>
              </div>
              <button
                disabled={Boolean(aiLoading)}
                onClick={handleAiSubtasks}
                className="bg-white dark:bg-[#22272b] hover:bg-[#f4f5f7] dark:hover:bg-[#282e33] text-[#0052cc] dark:text-[#579dff] text-xs font-medium px-3 py-1.5 rounded-lg border border-[#dfe1e6] dark:border-[#38414a] transition-colors disabled:opacity-50"
              >
                {aiLoading === 'subtasks' ? 'Generating...' : '🤖 AI Subtask Breakdown'}
              </button>
              <button
                disabled={Boolean(aiLoading)}
                onClick={handleAiEstimate}
                className="bg-white dark:bg-[#22272b] hover:bg-[#f4f5f7] dark:hover:bg-[#282e33] text-[#0052cc] dark:text-[#579dff] text-xs font-medium px-3 py-1.5 rounded-lg border border-[#dfe1e6] dark:border-[#38414a] transition-colors disabled:opacity-50"
              >
                {aiLoading === 'estimate' ? 'Estimating...' : '🤖 AI Estimate Points'}
              </button>
              <button
                disabled={Boolean(aiLoading)}
                onClick={handleAiRefine}
                className="bg-white dark:bg-[#22272b] hover:bg-[#f4f5f7] dark:hover:bg-[#282e33] text-[#0052cc] dark:text-[#579dff] text-xs font-medium px-3 py-1.5 rounded-lg border border-[#dfe1e6] dark:border-[#38414a] transition-colors disabled:opacity-50"
              >
                {aiLoading === 'refine' ? 'Refining...' : '🤖 AI Refine Description'}
              </button>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#5e6c84] dark:text-[#9fadbc] uppercase tracking-wider">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={6}
                className="w-full bg-[#f4f5f7] dark:bg-[#1d2125] border border-[#dfe1e6] dark:border-[#38414a] rounded-xl p-3 text-[#172b4d] dark:text-[#b6c2cf] text-sm focus:outline-none focus:border-[#0052cc] dark:focus:border-[#579dff] leading-relaxed transition-colors"
              />
            </div>

            {/* Subtasks Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#5e6c84] dark:text-[#9fadbc] uppercase tracking-wider">
                  Subtasks ({issue.subtasks.filter(s => s.completed).length}/{issue.subtasks.length})
                </label>
              </div>

              <div className="space-y-2">
                {issue.subtasks.map(sub => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between bg-white dark:bg-[#22272b] border border-[#dfe1e6] dark:border-[#38414a] px-3 py-2 rounded-xl"
                  >
                    <label className="flex items-center space-x-3 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={sub.completed}
                        onChange={() => handleToggleSubtask(sub.id)}
                        className="w-4 h-4 rounded bg-[#f4f5f7] dark:bg-[#1d2125] border-[#dfe1e6] dark:border-[#38414a] text-[#0052cc] dark:text-[#579dff] focus:ring-0"
                      />
                      <span className={`text-sm ${sub.completed ? 'line-through text-[#5e6c84] dark:text-[#9fadbc]' : 'text-[#172b4d] dark:text-[#b6c2cf]'}`}>
                        {sub.title}
                      </span>
                    </label>
                  </div>
                ))}

                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="text"
                    placeholder="Add a new subtask..."
                    value={newSubtaskTitle}
                    onChange={e => setNewSubtaskTitle(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddSubtask()}
                    className="flex-1 bg-[#f4f5f7] dark:bg-[#1d2125] border border-[#dfe1e6] dark:border-[#38414a] rounded-xl px-3 py-2 text-sm text-[#172b4d] dark:text-white placeholder-[#5e6c84] dark:placeholder-[#9fadbc] focus:outline-none focus:border-[#0052cc] dark:focus:border-[#579dff]"
                  />
                  <button
                    onClick={handleAddSubtask}
                    className="bg-[#ebecf0] dark:bg-[#282e33] hover:bg-[#dfe1e6] dark:hover:bg-[#38414a] text-[#172b4d] dark:text-[#b6c2cf] px-4 py-2 rounded-xl text-xs font-medium transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="space-y-4 pt-4 border-t border-[#dfe1e6] dark:border-[#38414a]">
              <label className="text-xs font-semibold text-[#5e6c84] dark:text-[#9fadbc] uppercase tracking-wider">Comments</label>
              <div className="space-y-3">
                {issue.comments.map(c => (
                  <div key={c.id} className="flex space-x-3 bg-[#f4f5f7] dark:bg-[#1d2125]/60 border border-[#dfe1e6] dark:border-[#38414a] p-3.5 rounded-xl">
                    <img src={c.avatar} alt={c.author} className="w-8 h-8 rounded-full object-cover ring-1 ring-[#dfe1e6] dark:ring-[#38414a] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-[#172b4d] dark:text-white">{c.author}</span>
                        <span className="text-[10px] text-[#5e6c84] dark:text-[#9fadbc]">{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-xs text-[#42526e] dark:text-[#9fadbc] leading-relaxed">{c.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddComment()}
                  className="flex-1 bg-[#f4f5f7] dark:bg-[#1d2125] border border-[#dfe1e6] dark:border-[#38414a] rounded-xl px-3 py-2.5 text-sm text-[#172b4d] dark:text-white placeholder-[#5e6c84] dark:placeholder-[#9fadbc] focus:outline-none focus:border-[#0052cc] dark:focus:border-[#579dff]"
                />
                <button
                  onClick={handleAddComment}
                  className="bg-[#0052cc] hover:bg-[#0747a6] text-white p-2.5 rounded-xl transition-colors shadow-sm"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar Metadata */}
          <div className="bg-[#f4f5f7] dark:bg-[#1d2125]/60 border border-[#dfe1e6] dark:border-[#38414a] rounded-2xl p-5 space-y-5 h-fit">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#5e6c84] dark:text-[#9fadbc] uppercase tracking-wider">Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as IssueStatus)}
                className="w-full bg-white dark:bg-[#22272b] border border-[#dfe1e6] dark:border-[#38414a] text-[#172b4d] dark:text-[#b6c2cf] text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#0052cc] dark:focus:border-[#579dff]"
              >
                <option value="backlog">Backlog</option>
                <option value="todo">To Do</option>
                <option value="inprogress">In Progress</option>
                <option value="inreview">In Review</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#5e6c84] dark:text-[#9fadbc] uppercase tracking-wider">Priority</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as Priority)}
                className="w-full bg-white dark:bg-[#22272b] border border-[#dfe1e6] dark:border-[#38414a] text-[#172b4d] dark:text-[#b6c2cf] text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#0052cc] dark:focus:border-[#579dff]"
              >
                <option value="highest">Highest</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
                <option value="lowest">Lowest</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#5e6c84] dark:text-[#9fadbc] uppercase tracking-wider">Story Points</label>
              <input
                type="number"
                value={storyPoints}
                onChange={e => setStoryPoints(Number(e.target.value))}
                className="w-full bg-white dark:bg-[#22272b] border border-[#dfe1e6] dark:border-[#38414a] text-[#172b4d] dark:text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#0052cc] dark:focus:border-[#579dff]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#5e6c84] dark:text-[#9fadbc] uppercase tracking-wider">Epic Link</label>
              <select
                value={epicId}
                onChange={e => setEpicId(e.target.value)}
                className="w-full bg-white dark:bg-[#22272b] border border-[#dfe1e6] dark:border-[#38414a] text-[#172b4d] dark:text-[#b6c2cf] text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#0052cc] dark:focus:border-[#579dff]"
              >
                <option value="">No Epic</option>
                {epics.map(ep => (
                  <option key={ep.id} value={ep.id}>{ep.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#5e6c84] dark:text-[#9fadbc] uppercase tracking-wider">Sprint</label>
              <select
                value={sprintId}
                onChange={e => setSprintId(e.target.value)}
                className="w-full bg-white dark:bg-[#22272b] border border-[#dfe1e6] dark:border-[#38414a] text-[#172b4d] dark:text-[#b6c2cf] text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#0052cc] dark:focus:border-[#579dff]"
              >
                <option value="">Backlog</option>
                {sprints.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1 pt-4 border-t border-[#dfe1e6] dark:border-[#38414a] text-[10px] text-[#5e6c84] dark:text-[#9fadbc]">
              <div>Reporter: {issue.reporter}</div>
              <div>Created: {new Date(issue.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
