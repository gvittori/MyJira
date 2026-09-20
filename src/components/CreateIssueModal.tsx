import React, { useState } from 'react';
import { Issue, IssueType, Priority, IssueStatus, Epic, Sprint } from '../types';
import { X, Sparkles } from 'lucide-react';

interface CreateIssueModalProps {
  epics: Epic[];
  sprints: Sprint[];
  defaultSprintId?: string;
  onClose: () => void;
  onCreateIssue: (newIssue: Omit<Issue, 'id' | 'key' | 'createdAt' | 'updatedAt' | 'comments' | 'subtasks' | 'linkedIssueIds'>) => void;
}

export const CreateIssueModal: React.FC<CreateIssueModalProps> = ({
  epics,
  sprints,
  defaultSprintId,
  onClose,
  onCreateIssue,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<IssueType>('story');
  const [priority, setPriority] = useState<Priority>('medium');
  const [storyPoints, setStoryPoints] = useState<number>(3);
  const [epicId, setEpicId] = useState<string>(epics[0]?.id || '');
  const [sprintId, setSprintId] = useState<string>(defaultSprintId || sprints[0]?.id || '');
  const [assignee, setAssignee] = useState('Alex Morgan');
  const [assigneeAvatar, setAssigneeAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreateIssue({
      title: title.trim(),
      description: description.trim(),
      type,
      status: sprintId ? 'todo' : 'backlog',
      priority,
      assignee,
      assigneeAvatar,
      reporter: 'Alex Morgan',
      storyPoints: Number(storyPoints),
      epicId: epicId || undefined,
      sprintId: sprintId || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-[#22272b] border border-[#dfe1e6] dark:border-[#38414a] rounded-2xl w-full max-w-2xl flex flex-col shadow-2xl overflow-hidden transition-colors">
        <div className="px-6 py-4 bg-white dark:bg-[#22272b] border-b border-[#dfe1e6] dark:border-[#38414a] flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#172b4d] dark:text-white">Create Issue</h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#f4f5f7] dark:hover:bg-[#282e33] text-[#5e6c84] dark:text-[#9fadbc] hover:text-[#172b4d] dark:hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[80vh]">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#5e6c84] dark:text-[#9fadbc] mb-1 block">Issue Type *</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as IssueType)}
                className="w-full bg-[#f4f5f7] dark:bg-[#1d2125] border border-[#dfe1e6] dark:border-[#38414a] text-[#172b4d] dark:text-[#b6c2cf] text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#0052cc] dark:focus:border-[#579dff]"
              >
                <option value="story">📖 Story</option>
                <option value="task">☑️ Task</option>
                <option value="bug">🐞 Bug</option>
                <option value="epic">⚡ Epic</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#5e6c84] dark:text-[#9fadbc] mb-1 block">Priority</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as Priority)}
                className="w-full bg-[#f4f5f7] dark:bg-[#1d2125] border border-[#dfe1e6] dark:border-[#38414a] text-[#172b4d] dark:text-[#b6c2cf] text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#0052cc] dark:focus:border-[#579dff]"
              >
                <option value="highest">Highest</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
                <option value="lowest">Lowest</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#5e6c84] dark:text-[#9fadbc] mb-1 block">Summary *</label>
            <input
              type="text"
              required
              placeholder="What needs to be done?"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-[#f4f5f7] dark:bg-[#1d2125] border border-[#dfe1e6] dark:border-[#38414a] text-[#172b4d] dark:text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#0052cc] dark:focus:border-[#579dff]"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#5e6c84] dark:text-[#9fadbc] mb-1 block">Description</label>
            <textarea
              placeholder="Add detailed context, user story or acceptance criteria..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-[#f4f5f7] dark:bg-[#1d2125] border border-[#dfe1e6] dark:border-[#38414a] text-[#172b4d] dark:text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#0052cc] dark:focus:border-[#579dff]"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#5e6c84] dark:text-[#9fadbc] mb-1 block">Story Points</label>
              <input
                type="number"
                min="0"
                max="21"
                value={storyPoints}
                onChange={e => setStoryPoints(Number(e.target.value))}
                className="w-full bg-[#f4f5f7] dark:bg-[#1d2125] border border-[#dfe1e6] dark:border-[#38414a] text-[#172b4d] dark:text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#0052cc] dark:focus:border-[#579dff]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#5e6c84] dark:text-[#9fadbc] mb-1 block">Epic Link</label>
              <select
                value={epicId}
                onChange={e => setEpicId(e.target.value)}
                className="w-full bg-[#f4f5f7] dark:bg-[#1d2125] border border-[#dfe1e6] dark:border-[#38414a] text-[#172b4d] dark:text-[#b6c2cf] text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#0052cc] dark:focus:border-[#579dff]"
              >
                <option value="">No Epic</option>
                {epics.map(ep => (
                  <option key={ep.id} value={ep.id}>{ep.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#5e6c84] dark:text-[#9fadbc] mb-1 block">Sprint</label>
              <select
                value={sprintId}
                onChange={e => setSprintId(e.target.value)}
                className="w-full bg-[#f4f5f7] dark:bg-[#1d2125] border border-[#dfe1e6] dark:border-[#38414a] text-[#172b4d] dark:text-[#b6c2cf] text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#0052cc] dark:focus:border-[#579dff]"
              >
                <option value="">Product Backlog</option>
                {sprints.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-[#dfe1e6] dark:border-[#38414a]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#ebecf0] dark:bg-[#282e33] text-[#172b4d] dark:text-[#b6c2cf] hover:bg-[#dfe1e6] dark:hover:bg-[#38414a] text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#0052cc] hover:bg-[#0747a6] text-white text-sm font-medium shadow-sm transition-colors"
            >
              Create Issue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
