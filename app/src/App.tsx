import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { TodoStats } from './components/TodoStats';
import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import { TodoBoardView } from './components/TodoBoardView';
import { TodoCalendarView } from './components/TodoCalendarView';
import { TodoModal } from './components/TodoModal';
import { PomodoroTimer } from './components/PomodoroTimer';
import { INITIAL_CATEGORIES, INITIAL_TODOS } from './data/mockData';
import { CategoryId, MainFilter, Priority, Status, Todo, ViewMode } from './types/todo';
import { triggerConfetti } from './utils/confetti';
import { CheckCircle2, Sparkles, Filter, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const STORAGE_KEY_TODOS = 'taskflow_todos_v1';
const STORAGE_KEY_THEME = 'taskflow_theme_v1';

export function App() {
  // 本地持久化或从 Mock 数据初始化
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TODOS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved todos', e);
      }
    }
    return INITIAL_TODOS;
  });

  const [categories] = useState(INITIAL_CATEGORIES);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // 状态与过滤器
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [activeFilter, setActiveFilter] = useState<MainFilter>('all');
  const [activeCategory, setActiveCategory] = useState<CategoryId | 'all'>('all');
  const [activePriority, setActivePriority] = useState<Priority | 'all'>('all');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'createdAt' | 'dueDate' | 'priority'>('createdAt');

  // 模态弹窗状态
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [modalInitialStatus, setModalInitialStatus] = useState<Status>('todo');
  const [modalInitialDueDate, setModalInitialDueDate] = useState<string | undefined>(undefined);

  // 番茄钟状态
  const [pomodoroOpen, setPomodoroOpen] = useState(false);
  const [pomodoroTodo, setPomodoroTodo] = useState<Todo | null>(null);
  const [isPomRunning, setIsPomRunning] = useState(false);
  const [pomTimeLeft, setPomTimeLeft] = useState(25 * 60);
  const [pomMode, setPomMode] = useState<'work' | 'break'>('work');

  // 暗黑模式 DOM 类名切换
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'light');
    }
  }, [darkMode]);

  // 同步本地存储
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_TODOS, JSON.stringify(todos));
  }, [todos]);

  // 操作处理器
  const handleAddTodo = (newTodoData: Partial<Todo>) => {
    const newTodo: Todo = {
      id: `todo-${Date.now()}`,
      title: newTodoData.title || '无标题任务',
      description: newTodoData.description || '',
      completed: false,
      status: newTodoData.status || 'todo',
      priority: newTodoData.priority || 'medium',
      categoryId: newTodoData.categoryId || 'work',
      dueDate: newTodoData.dueDate || null,
      dueTime: newTodoData.dueTime || null,
      tags: newTodoData.tags || ['日常'],
      pinned: newTodoData.pinned || false,
      subTasks: newTodoData.subTasks || [],
      estimatedPoms: newTodoData.estimatedPoms || 2,
      spentPoms: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setTodos([newTodo, ...todos]);
  };

  const handleSaveModalTodo = (todoData: Partial<Todo>) => {
    if (editingTodo) {
      // 更新现有任务
      setTodos(
        todos.map((t) =>
          t.id === editingTodo.id ? ({ ...t, ...todoData, updatedAt: new Date().toISOString() } as Todo) : t
        )
      );
    } else {
      // 新建任务
      handleAddTodo(todoData);
    }
  };

  const handleToggleComplete = (id: string) => {
    setTodos(
      todos.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          if (nextCompleted) {
            triggerConfetti();
          }
          return {
            ...t,
            completed: nextCompleted,
            status: nextCompleted ? 'completed' : 'todo',
            completedAt: nextCompleted ? new Date().toISOString() : null,
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      })
    );
  };

  const handleTogglePin = (id: string) => {
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, pinned: !t.pinned, updatedAt: new Date().toISOString() } : t))
    );
  };

  const handleUpdateStatus = (id: string, status: Status) => {
    setTodos(
      todos.map((t) => {
        if (t.id === id) {
          const isCompleted = status === 'completed';
          if (isCompleted && !t.completed) {
            triggerConfetti();
          }
          return {
            ...t,
            status,
            completed: isCompleted,
            completedAt: isCompleted ? new Date().toISOString() : null,
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      })
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const handleToggleSubTask = (todoId: string, subTaskId: string) => {
    setTodos(
      todos.map((t) => {
        if (t.id === todoId) {
          const updatedSubTasks = t.subTasks.map((s) =>
            s.id === subTaskId ? { ...s, completed: !s.completed } : s
          );
          return {
            ...t,
            subTasks: updatedSubTasks,
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      })
    );
  };

  const handleStartPomodoro = (todo: Todo) => {
    setPomodoroTodo(todo);
    setPomodoroOpen(true);
    setPomMode('work');
    setPomTimeLeft(25 * 60);
    setIsPomRunning(true);
  };

  const handleCompletePomodoro = (todoId: string) => {
    setTodos(
      todos.map((t) => {
        if (t.id === todoId) {
          return {
            ...t,
            spentPoms: (t.spentPoms || 0) + 1,
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      })
    );
  };

  const handleResetData = () => {
    if (window.confirm('确定要恢复初始示例 Mock 数据吗？现有的本地修改将被重置。')) {
      setTodos(INITIAL_TODOS);
      localStorage.setItem(STORAGE_KEY_TODOS, JSON.stringify(INITIAL_TODOS));
    }
  };

  const handleOpenAddModal = (status?: Status, dueDate?: string) => {
    setEditingTodo(null);
    setModalInitialStatus(status || 'todo');
    setModalInitialDueDate(dueDate);
    setModalOpen(true);
  };

  const handleOpenEditModal = (todo: Todo) => {
    setEditingTodo(todo);
    setModalOpen(true);
  };

  // 过滤数据计算
  const filteredTodos = todos
    .filter((todo) => {
      // 搜索过滤
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = todo.title.toLowerCase().includes(query);
        const matchDesc = todo.description?.toLowerCase().includes(query);
        const matchTags = todo.tags?.some((tag) => tag.toLowerCase().includes(query));
        if (!matchTitle && !matchDesc && !matchTags) return false;
      }

      // 主状态过滤
      const todayStr = new Date().toISOString().split('T')[0];
      if (activeFilter === 'today') {
        if (todo.dueDate !== todayStr) return false;
      } else if (activeFilter === 'upcoming') {
        if (!todo.dueDate || todo.completed) return false;
      } else if (activeFilter === 'starred') {
        if (!todo.pinned) return false;
      } else if (activeFilter === 'completed') {
        if (!todo.completed) return false;
      }

      // 分类过滤
      if (activeCategory !== 'all') {
        if (todo.categoryId !== activeCategory) return false;
      }

      // 优先级过滤
      if (activePriority !== 'all') {
        if (todo.priority !== activePriority) return false;
      }

      // 标签过滤
      if (activeTag) {
        if (!todo.tags?.includes(activeTag)) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder: Record<Priority, number> = { urgent: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="min-h-screen bg-slate-100/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* 顶部主导航 */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        viewMode={viewMode}
        setViewMode={setViewMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenPomodoro={() => setPomodoroOpen(true)}
        onOpenAddModal={() => handleOpenAddModal()}
        onResetData={handleResetData}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        isPomodoroActive={isPomRunning}
      />

      {/* 主布局容器 */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* 侧边栏 */}
        <Sidebar
          categories={categories}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          activePriority={activePriority}
          setActivePriority={setActivePriority}
          activeTag={activeTag}
          setActiveTag={setActiveTag}
          todos={todos}
          isOpen={sidebarOpen}
          onCloseMobile={() => setSidebarOpen(false)}
        />

        {/* 主内容区域 */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 max-w-5xl overflow-y-auto">
          
          {/* 数据看板与概览统计 */}
          <TodoStats todos={todos} />

          {/* 快捷新建输入框 */}
          <TodoInput
            categories={categories}
            onAddTodo={handleAddTodo}
            defaultCategoryId={activeCategory}
          />

          {/* 工具栏：排序与活动状态提示 */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100">
                {activeFilter === 'today' && '📅 今日待办'}
                {activeFilter === 'upcoming' && '🗓 近期安排'}
                {activeFilter === 'starred' && '⭐️ 星标任务'}
                {activeFilter === 'completed' && '✅ 已完成归档'}
                {activeFilter === 'all' && (activeCategory !== 'all' ? `📁 ${categories.find(c => c.id === activeCategory)?.name}` : '📋 全部待办')}
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold">
                {filteredTodos.length} 项
              </span>
              {activeTag && (
                <span className="text-xs px-2 py-0.5 rounded-md bg-brand-100 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 font-medium">
                  #{activeTag}
                  <button onClick={() => setActiveTag(null)} className="ml-1 text-slate-400 hover:text-slate-700">✕</button>
                </span>
              )}
            </div>

            {/* 排序选择 */}
            <div className="flex items-center gap-2 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500 hidden sm:inline">排序方式:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1 text-slate-700 dark:text-slate-300 font-medium focus:outline-none cursor-pointer"
              >
                <option value="createdAt">最新创建优先</option>
                <option value="dueDate">截止日期临近</option>
                <option value="priority">最高优先级</option>
              </select>
            </div>
          </div>

          {/* 视图内容切换 */}
          {viewMode === 'list' && (
            <TodoList
              todos={filteredTodos}
              categories={categories}
              onToggleComplete={handleToggleComplete}
              onTogglePin={handleTogglePin}
              onDelete={handleDeleteTodo}
              onEdit={handleOpenEditModal}
              onStartPomodoro={handleStartPomodoro}
              onToggleSubTask={handleToggleSubTask}
            />
          )}

          {viewMode === 'board' && (
            <TodoBoardView
              todos={filteredTodos}
              categories={categories}
              onToggleComplete={handleToggleComplete}
              onUpdateStatus={handleUpdateStatus}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteTodo}
              onOpenAddModal={(status) => handleOpenAddModal(status)}
              onTogglePin={handleTogglePin}
            />
          )}

          {viewMode === 'calendar' && (
            <TodoCalendarView
              todos={todos}
              categories={categories}
              onToggleComplete={handleToggleComplete}
              onEdit={handleOpenEditModal}
              onOpenAddModalWithDate={(dateStr) => handleOpenAddModal('todo', dateStr)}
            />
          )}

        </main>
      </div>

      {/* 待办事项新建/编辑弹窗 */}
      <TodoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        todo={editingTodo}
        categories={categories}
        onSave={handleSaveModalTodo}
        onDelete={handleDeleteTodo}
        initialStatus={modalInitialStatus}
        initialDueDate={modalInitialDueDate}
      />

      {/* 番茄钟专注弹窗 */}
      <PomodoroTimer
        isOpen={pomodoroOpen}
        onClose={() => setPomodoroOpen(false)}
        selectedTodo={pomodoroTodo}
        onCompletePomodoro={handleCompletePomodoro}
        isRunning={isPomRunning}
        setIsRunning={setIsPomRunning}
        timeLeft={pomTimeLeft}
        setTimeLeft={setPomTimeLeft}
        mode={pomMode}
        setMode={setPomMode}
      />

    </div>
  );
}
export default App;
