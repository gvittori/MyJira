import { Project, Epic, Sprint, Issue } from '../types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    key: 'ALPHA',
    name: 'Alpha Mobile SuperApp',
    avatar: '🚀',
    description: 'Next-gen cross-platform React Native customer portal with biometric auth & real-time sync.'
  },
  {
    id: 'proj-2',
    key: 'CLOUD',
    name: 'Cloud Infrastructure & K8s',
    avatar: '☁️',
    description: 'Global multi-region microservice migration, zero-downtime rolling deployments, and observability.'
  },
  {
    id: 'proj-3',
    key: 'PAY',
    name: 'FinTech Checkout & Billing',
    avatar: '💳',
    description: 'Secure PCI-DSS compliant payment gateway integration with Stripe, Apple Pay, and crypto rails.'
  }
];

export const INITIAL_EPICS: Epic[] = [
  {
    id: 'epic-1',
    key: 'ALP-E1',
    name: 'Authentication & Biometrics',
    color: 'bg-indigo-600',
    startDate: '2026-03-01',
    endDate: '2026-03-25',
    status: 'inprogress',
    description: 'Implement FaceID, TouchID, and OAuth 2.0 PKCE secure login flows.'
  },
  {
    id: 'epic-2',
    key: 'ALP-E2',
    name: 'Real-time Chat & Notifications',
    color: 'bg-emerald-600',
    startDate: '2026-03-15',
    endDate: '2026-04-15',
    status: 'todo',
    description: 'Websocket-backed messaging system with push notifications and offline queue.'
  },
  {
    id: 'epic-3',
    key: 'ALP-E3',
    name: 'Analytics Dashboard',
    color: 'bg-amber-600',
    startDate: '2026-04-01',
    endDate: '2026-04-30',
    status: 'todo',
    description: 'Interactive D3 charts displaying user engagement, revenue metrics, and error rates.'
  }
];

export const INITIAL_SPRINTS: Sprint[] = [
  {
    id: 'sprint-1',
    name: 'Sprint 14: Core Auth & Foundation',
    goal: 'Ship OAuth 2.0 PKCE flow and biometric login handlers with 99.9% test coverage.',
    status: 'active',
    startDate: '2026-03-08',
    endDate: '2026-03-21'
  },
  {
    id: 'sprint-2',
    name: 'Sprint 15: Push Notifications & UI Polish',
    goal: 'Integrate Firebase Cloud Messaging and implement smooth dark mode transitions.',
    status: 'planned',
    startDate: '2026-03-22',
    endDate: '2026-04-04'
  },
  {
    id: 'sprint-3',
    name: 'Sprint 13: Legacy Cleanup (Completed)',
    goal: 'Deprecate v1 REST endpoints and clean up unused dependencies.',
    status: 'closed',
    startDate: '2026-02-22',
    endDate: '2026-03-07'
  }
];

export const INITIAL_ISSUES: Issue[] = [
  {
    id: 'issue-1',
    key: 'ALPHA-101',
    title: 'Implement OAuth 2.0 PKCE authentication handshake',
    description: '### Overview\nWe need to securely exchange authorization codes using PKCE for the mobile client.\n\n### Acceptance Criteria\n- [ ] Generate cryptographic code verifier and challenge\n- [ ] Handle custom URI scheme redirect back to app\n- [ ] Securely store access tokens in Keychain / EncryptedSharedPreferences',
    type: 'story',
    status: 'inprogress',
    priority: 'highest',
    assignee: 'Alex Morgan',
    assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    reporter: 'Sarah Connor',
    storyPoints: 5,
    sprintId: 'sprint-1',
    epicId: 'epic-1',
    linkedIssueIds: ['ALPHA-103'],
    subtasks: [
      { id: 'sub-1', title: 'Generate PKCE verifier utility', completed: true, estimatedHours: 2 },
      { id: 'sub-2', title: 'Configure deep link intent filter', completed: true, estimatedHours: 3 },
      { id: 'sub-3', title: 'Token exchange API call integration', completed: false, estimatedHours: 4 }
    ],
    comments: [
      {
        id: 'c-1',
        author: 'Sarah Connor',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
        content: 'Please ensure we test this thoroughly on iOS Simulator and Android Emulator.',
        createdAt: '2026-03-10T09:30:00Z'
      }
    ],
    createdAt: '2026-03-08T10:00:00Z',
    updatedAt: '2026-03-12T14:15:00Z'
  },
  {
    id: 'issue-2',
    key: 'ALPHA-102',
    title: 'Add biometric FaceID / TouchID prompt support',
    description: 'Allow users to unlock the app instantly using device biometrics after initial login.',
    type: 'story',
    status: 'todo',
    priority: 'high',
    assignee: 'David Chen',
    assigneeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    reporter: 'Alex Morgan',
    storyPoints: 3,
    sprintId: 'sprint-1',
    epicId: 'epic-1',
    linkedIssueIds: ['ALPHA-101'],
    subtasks: [
      { id: 'sub-4', title: 'Install expo-local-authentication', completed: true, estimatedHours: 1 },
      { id: 'sub-5', title: 'Create biometric prompt modal fallback', completed: false, estimatedHours: 3 }
    ],
    comments: [],
    createdAt: '2026-03-08T11:00:00Z',
    updatedAt: '2026-03-08T11:00:00Z'
  },
  {
    id: 'issue-3',
    key: 'ALPHA-103',
    title: 'Fix token refresh race condition on concurrent API requests',
    description: 'When multiple requests hit 401 simultaneously, multiple refresh tokens are requested causing invalidation.',
    type: 'bug',
    status: 'inreview',
    priority: 'highest',
    assignee: 'Elena Rostova',
    assigneeAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    reporter: 'Alex Morgan',
    storyPoints: 8,
    sprintId: 'sprint-1',
    epicId: 'epic-1',
    linkedIssueIds: ['ALPHA-101'],
    subtasks: [
      { id: 'sub-6', title: 'Implement Axios request queue interceptor', completed: true, estimatedHours: 5 }
    ],
    comments: [
      {
        id: 'c-2',
        author: 'Elena Rostova',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
        content: 'Queue mechanism is implemented and passing unit tests.',
        createdAt: '2026-03-11T16:00:00Z'
      }
    ],
    createdAt: '2026-03-09T14:20:00Z',
    updatedAt: '2026-03-12T16:00:00Z'
  },
  {
    id: 'issue-4',
    key: 'ALPHA-104',
    title: 'Design high-fidelity onboarding screens in Figma',
    description: 'Create 4-step interactive tutorial for first-time app users.',
    type: 'task',
    status: 'done',
    priority: 'medium',
    assignee: 'Jessica Taylor',
    assigneeAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100',
    reporter: 'Sarah Connor',
    storyPoints: 2,
    sprintId: 'sprint-1',
    epicId: 'epic-1',
    linkedIssueIds: [],
    subtasks: [
      { id: 'sub-7', title: 'Wireframes export', completed: true, estimatedHours: 4 },
      { id: 'sub-8', title: 'Design system tokens sync', completed: true, estimatedHours: 2 }
    ],
    comments: [],
    createdAt: '2026-03-07T08:00:00Z',
    updatedAt: '2026-03-10T11:00:00Z'
  },
  {
    id: 'issue-5',
    key: 'ALPHA-105',
    title: 'Implement WebSocket reconnect with exponential backoff',
    description: 'Ensure realtime chat stays connected even under intermittent network dropouts.',
    type: 'story',
    status: 'backlog',
    priority: 'medium',
    assignee: 'David Chen',
    assigneeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    reporter: 'Alex Morgan',
    storyPoints: 5,
    sprintId: undefined, // In Backlog
    epicId: 'epic-2',
    linkedIssueIds: [],
    subtasks: [],
    comments: [],
    createdAt: '2026-03-10T12:00:00Z',
    updatedAt: '2026-03-10T12:00:00Z'
  },
  {
    id: 'issue-6',
    key: 'ALPHA-106',
    title: 'Push notification sound customization settings',
    description: 'Let users choose custom notification tones for direct messages vs alerts.',
    type: 'story',
    status: 'backlog',
    priority: 'low',
    assignee: 'Unassigned',
    assigneeAvatar: '',
    reporter: 'Sarah Connor',
    storyPoints: 3,
    sprintId: undefined,
    epicId: 'epic-2',
    linkedIssueIds: [],
    subtasks: [],
    comments: [],
    createdAt: '2026-03-10T13:00:00Z',
    updatedAt: '2026-03-10T13:00:00Z'
  },
  {
    id: 'issue-7',
    key: 'ALPHA-107',
    title: 'D3 interactive sparkline charts for financial metrics',
    description: 'Render responsive SVG sparklines for user spending and earnings over last 30 days.',
    type: 'story',
    status: 'backlog',
    priority: 'high',
    assignee: 'Elena Rostova',
    assigneeAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    reporter: 'Alex Morgan',
    storyPoints: 8,
    sprintId: undefined,
    epicId: 'epic-3',
    linkedIssueIds: [],
    subtasks: [],
    comments: [],
    createdAt: '2026-03-11T09:00:00Z',
    updatedAt: '2026-03-11T09:00:00Z'
  }
];
