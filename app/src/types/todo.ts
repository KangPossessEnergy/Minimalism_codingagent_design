export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type CategoryId = 'all' | 'work' | 'study' | 'life' | 'health' | 'finance' | 'project';

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export type Status = 'todo' | 'in_progress' | 'completed';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  status: Status;
  priority: Priority;
  categoryId: CategoryId;
  dueDate: string | null; // ISO 字符串或 YYYY-MM-DD
  dueTime?: string | null; // HH:mm
  tags: string[];
  pinned?: boolean;
  createdAt: string;
  updatedAt: string;
  completedAt?: string | null;
  subTasks: SubTask[];
  estimatedPoms?: number; // 预估番茄数
  spentPoms?: number; // 已消耗番茄数
  color?: string;
}

export type ViewMode = 'list' | 'board' | 'calendar' | 'matrix';

export type MainFilter = 'all' | 'today' | 'upcoming' | 'completed' | 'starred' | 'trash';

export interface FilterState {
  mainFilter: MainFilter;
  categoryId?: CategoryId | 'all';
  priority?: Priority | 'all';
  searchQuery: string;
  tag?: string | null;
  sortBy: 'createdAt' | 'dueDate' | 'priority' | 'title';
  sortOrder: 'asc' | 'desc';
}

export interface PomodoroState {
  isOpen: boolean;
  isRunning: boolean;
  mode: 'pomodoro' | 'shortBreak' | 'longBreak';
  timeLeft: number; // 秒
  activeTodoId: string | null;
  completedCycles: number;
}
