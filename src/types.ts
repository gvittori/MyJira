export type IssueType = 'epic' | 'story' | 'task' | 'bug';

export type IssueStatus = 'backlog' | 'todo' | 'inprogress' | 'inreview' | 'done';

export type Priority = 'highest' | 'high' | 'medium' | 'low' | 'lowest';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  estimatedHours?: number;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  createdAt: string;
}

export interface Issue {
  id: string;
  key: string;
  title: string;
  description: string;
  type: IssueType;
  status: IssueStatus;
  priority: Priority;
  assignee: string;
  assigneeAvatar: string;
  reporter: string;
  storyPoints?: number;
  sprintId?: string; // If undefined or backlog, sits in backlog
  epicId?: string;
  parentId?: string; // If it's a subtask of another issue
  linkedIssueIds: string[]; // IDs of related issues
  subtasks: Subtask[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Sprint {
  id: string;
  name: string;
  goal: string;
  status: 'active' | 'planned' | 'closed';
  startDate: string;
  endDate: string;
}

export interface Epic {
  id: string;
  key: string;
  name: string;
  color: string; // Tailwind color class or hex e.g. 'bg-purple-600'
  startDate: string;
  endDate: string;
  status: 'todo' | 'inprogress' | 'done';
  description: string;
}

export interface Project {
  id: string;
  key: string;
  name: string;
  avatar: string;
  description: string;
}

export type ViewTab = 'board' | 'backlog' | 'roadmap' | 'issues' | 'code' | 'releases' | 'reports' | 'settings';

export type Theme = 'light' | 'dark';
