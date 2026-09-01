import React from 'react';
import { 
  Plus, 
  MoreHorizontal, 
  CheckCircle2, 
  Circle, 
  Clock, 
  ArrowRight,
  Star,
  Trash2,
  Edit3
} from 'lucide-react';
import { Category, Priority, Status, Todo } from '../types/todo';
import { formatDueDateDisplay } from '../utils/date';

interface TodoBoardViewProps {
  todos: Todo[];
  categories: Category[];
  onToggleComplete: (id: string) => void;
  onUpdateStatus: (id: string, status: Status) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onOpenAddModal: (status?: Status) => void;
  onTogglePin: (id: string) => void;
}

const columns: { id: Status; title: string; color: string; bg: string; dot: string }[] = [
  { id: 'todo', title: '待处理 (To-Do)', color: 'text-slate-700 dark:text-slate-300', bg: 'bg-slate-100/70 dark:bg-slate-900/60', dot: 'bg-slate-400' },
  { id: 'in_progress', title: '进行中 (In Progress)', color: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-500/5 dark:bg-amber-950/20', dot: 'bg-amber-500' },
  { id: 'completed', title: '已完成 (Done)', color: 'text-emerald-700 dark:text-emerald-300', bg: 'bg-emerald-500/5 dark:bg-emerald-950/20', dot: 'bg-emerald-500' },
];

export const TodoBoardView: React.FC<TodoBoardViewProps> = ({
  todos,
  categories,
  onToggleComplete,
  onUpdateStatus,
  onEdit,
  onDelete,
  onOpenAddModal,
  onTogglePin,
}) => {
  const getCategory = (catId: string) => categories.find((c) => c.id === catId);

  const priorityConfig: Record<Priority, { label: string; text: string; bg: string }> = {
    urgent: { label: '紧急', text: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/50' },
    high: { label: '重要', text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/50' },
    medium: { label: '普通', text: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-950/50' },
    low: { label: '微小', text: 'text-slate-500 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800' },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pb-8 items-start">
      {columns.map((column) => {
        const columnTodos = todos.filter((t) => {
          if (column.id === 'completed') return t.completed || t.status === 'completed';
          if (column.id === 'in_progress') return !t.completed && t.status === 'in_progress';
          return !t.completed && (!t.status || t.status === 'todo');
        });

        return (
          <div
            key={column.id}
            className={`rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 flex flex-col min-h-[480px] ${column.bg}`}
          >
            {/* 泳道头部 */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/60 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${column.dot}`} />
                <h3 className={`text-sm font-bold ${column.color}`}>{column.title}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold shadow-xs">
                  {columnTodos.length}
                </span>
              </div>

              <button
                onClick={() => onOpenAddModal(column.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-white dark:hover:bg-slate-800 transition"
                title="在该状态下添加任务"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* 看板卡片容器 */}
            <div className="space-y-3 flex-1">
              {columnTodos.length === 0 ? (
                <div className="h-36 flex flex-col items-center justify-center text-center text-xs text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800/80 rounded-xl">
                  <span>暂无任务</span>
                  <button
                    onClick={() => onOpenAddModal(column.id)}
                    className="mt-1 text-brand-600 dark:text-brand-400 font-medium hover:underline"
                  >
                    + 点击创建
                  </button>
                </div>
              ) : (
                columnTodos.map((todo) => {
                  const cat = getCategory(todo.categoryId);
                  const { text: dueText, isOverdue } = formatDueDateDisplay(todo.dueDate, todo.dueTime);

                  return (
                    <div
                      key={todo.id}
                      className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md transition group"
                    >
                      {/* 卡片顶部类别与置顶 */}
                      <div className="flex items-center justify-between mb-2">
                        {cat && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${cat.bgColor}`}>
                            {cat.name}
                          </span>
                        )}

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onTogglePin(todo.id)}
                            className={`p-1 rounded transition ${
                              todo.pinned ? 'text-amber-500' : 'text-slate-300 hover:text-amber-500'
                            }`}
                          >
                            <Star className="w-3.5 h-3.5 fill-current" />
                          </button>
                        </div>
                      </div>

                      {/* 任务标题 */}
                      <h4
                        onClick={() => onEdit(todo)}
                        className={`text-sm font-semibold cursor-pointer hover:text-brand-600 dark:hover:text-brand-400 mb-2 leading-snug ${
                          todo.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-100'
                        }`}
                      >
                        {todo.title}
                      </h4>

                      {/* 任务描述 */}
                      {todo.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                          {todo.description}
                        </p>
                      )}

                      {/* 标签与截止日 */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-3 text-[10px]">
                        <span className={`px-1.5 py-0.5 rounded font-medium ${priorityConfig[todo.priority].bg} ${priorityConfig[todo.priority].text}`}>
                          {priorityConfig[todo.priority].label}
                        </span>

                        {todo.dueDate && (
                          <span className={`px-1.5 py-0.5 rounded ${isOverdue && !todo.completed ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60' : 'bg-slate-100 dark:bg-slate-700/50 text-slate-500'}`}>
                            {dueText}
                          </span>
                        )}
                      </div>

                      {/* 卡片底栏操作与状态转移 */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onEdit(todo)}
                            className="p-1 text-slate-400 hover:text-brand-600 rounded transition"
                            title="编辑"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDelete(todo.id)}
                            className="p-1 text-slate-400 hover:text-rose-500 rounded transition"
                            title="删除"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* 状态流转快捷按钮 */}
                        <div className="flex items-center gap-1">
                          {column.id !== 'todo' && (
                            <button
                              onClick={() => onUpdateStatus(todo.id, 'todo')}
                              className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 transition"
                            >
                              ← 待处理
                            </button>
                          )}
                          {column.id !== 'in_progress' && (
                            <button
                              onClick={() => onUpdateStatus(todo.id, 'in_progress')}
                              className="text-[10px] px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 hover:bg-amber-200 transition"
                            >
                              进行中
                            </button>
                          )}
                          {column.id !== 'completed' && (
                            <button
                              onClick={() => onToggleComplete(todo.id)}
                              className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 transition flex items-center gap-0.5"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              完成
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
