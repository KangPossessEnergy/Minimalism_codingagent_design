import React from 'react';
import { TodoItem } from './TodoItem';
import { Category, Todo } from '../types/todo';
import { CheckCheck, ListTodo } from 'lucide-react';

interface TodoListProps {
  todos: Todo[];
  categories: Category[];
  onToggleComplete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onStartPomodoro: (todo: Todo) => void;
  onToggleSubTask: (todoId: string, subTaskId: string) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  categories,
  onToggleComplete,
  onTogglePin,
  onDelete,
  onEdit,
  onStartPomodoro,
  onToggleSubTask,
}) => {
  // 置顶任务与普通任务分组
  const pinnedTodos = todos.filter((t) => t.pinned && !t.completed);
  const unpinnedTodos = todos.filter((t) => !t.pinned && !t.completed);
  const completedTodos = todos.filter((t) => t.completed);

  if (todos.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
        <div className="w-16 h-16 bg-brand-50 dark:bg-brand-950/60 text-brand-500 mx-auto rounded-2xl flex items-center justify-center mb-3">
          <ListTodo className="w-8 h-8" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">暂无待办事项</h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
          太棒了！当前没有任何未完成的任务，或者调整左侧筛选条件查看其他分类。
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* 置顶任务区域 */}
      {pinnedTodos.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            <span>⭐️ 置顶关注 ({pinnedTodos.length})</span>
          </div>
          <div className="space-y-2.5">
            {pinnedTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                categories={categories}
                onToggleComplete={onToggleComplete}
                onTogglePin={onTogglePin}
                onDelete={onDelete}
                onEdit={onEdit}
                onStartPomodoro={onStartPomodoro}
                onToggleSubTask={onToggleSubTask}
              />
            ))}
          </div>
        </div>
      )}

      {/* 普通待办任务列表 */}
      {unpinnedTodos.length > 0 && (
        <div className="space-y-3">
          {pinnedTodos.length > 0 && (
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              常规任务 ({unpinnedTodos.length})
            </div>
          )}
          <div className="space-y-2.5">
            {unpinnedTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                categories={categories}
                onToggleComplete={onToggleComplete}
                onTogglePin={onTogglePin}
                onDelete={onDelete}
                onEdit={onEdit}
                onStartPomodoro={onStartPomodoro}
                onToggleSubTask={onToggleSubTask}
              />
            ))}
          </div>
        </div>
      )}

      {/* 已完成列表折叠展示 */}
      {completedTodos.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <CheckCheck className="w-4 h-4" />
            <span>已完成归档 ({completedTodos.length})</span>
          </div>
          <div className="space-y-2.5">
            {completedTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                categories={categories}
                onToggleComplete={onToggleComplete}
                onTogglePin={onTogglePin}
                onDelete={onDelete}
                onEdit={onEdit}
                onStartPomodoro={onStartPomodoro}
                onToggleSubTask={onToggleSubTask}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
