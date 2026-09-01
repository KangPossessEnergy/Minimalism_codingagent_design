import React, { useState } from 'react';
import { 
  Check, 
  Star, 
  Trash2, 
  Calendar, 
  CheckSquare, 
  Square, 
  Timer, 
  ChevronDown, 
  ChevronRight, 
  MoreHorizontal,
  Edit3
} from 'lucide-react';
import { Category, Priority, Todo } from '../types/todo';
import { formatDueDateDisplay } from '../utils/date';

interface TodoItemProps {
  todo: Todo;
  categories: Category[];
  onToggleComplete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onStartPomodoro: (todo: Todo) => void;
  onToggleSubTask: (todoId: string, subTaskId: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  categories,
  onToggleComplete,
  onTogglePin,
  onDelete,
  onEdit,
  onStartPomodoro,
  onToggleSubTask,
}) => {
  const [showSubtasks, setShowSubtasks] = useState(false);
  const category = categories.find((c) => c.id === todo.categoryId);
  const { text: dueDateText, isOverdue, isToday } = formatDueDateDisplay(todo.dueDate, todo.dueTime);

  // 优先级标签徽章配置
  const priorityConfig: Record<Priority, { label: string; bg: string; text: string; dot: string }> = {
    urgent: { label: '紧急', bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900', text: 'text-rose-600 dark:text-rose-400', dot: 'bg-rose-500' },
    high: { label: '重要', bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900', text: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-500' },
    medium: { label: '普通', bg: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-900', text: 'text-sky-600 dark:text-sky-400', dot: 'bg-sky-500' },
    low: { label: '低优', bg: 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700', text: 'text-slate-500 dark:text-slate-400', dot: 'bg-slate-400' },
  };

  const completedSubTasks = (todo.subTasks || []).filter((s) => s.completed).length;
  const totalSubTasks = (todo.subTasks || []).length;

  return (
    <div
      className={`group bg-white dark:bg-slate-900 border rounded-2xl p-4 transition-all duration-200 hover:shadow-md ${
        todo.completed
          ? 'opacity-65 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40'
          : todo.pinned
          ? 'border-brand-300 dark:border-brand-800 shadow-sm ring-1 ring-brand-500/10'
          : 'border-slate-200/90 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div className="flex items-start gap-3.5">
        
        {/* 打勾复选框 */}
        <button
          onClick={() => onToggleComplete(todo.id)}
          className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center transition-all flex-shrink-0 ${
            todo.completed
              ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30'
              : 'border-2 border-slate-300 dark:border-slate-600 hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-brand-950/40'
          }`}
          title={todo.completed ? '标记为未完成' : '标记为已完成'}
        >
          {todo.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* 中间主要内容 */}
        <div className="flex-1 min-w-0">
          
          <div className="flex items-start justify-between gap-2">
            <div 
              onClick={() => onEdit(todo)}
              className="cursor-pointer group-hover:text-brand-600 dark:group-hover:text-brand-400 transition"
            >
              <h4
                className={`text-sm sm:text-base font-semibold leading-snug break-words ${
                  todo.completed
                    ? 'line-through text-slate-400 dark:text-slate-500'
                    : 'text-slate-800 dark:text-slate-100'
                }`}
              >
                {todo.title}
              </h4>
            </div>

            {/* 右上角置顶与更多操作 */}
            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onTogglePin(todo.id)}
                className={`p-1.5 rounded-lg transition ${
                  todo.pinned
                    ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/50'
                    : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title={todo.pinned ? '取消置顶' : '置顶重要事项'}
              >
                <Star className="w-4 h-4 fill-current" />
              </button>

              <button
                onClick={() => onEdit(todo)}
                className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition hidden sm:block"
                title="编辑详情"
              >
                <Edit3 className="w-4 h-4" />
              </button>

              <button
                onClick={() => onDelete(todo.id)}
                className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition"
                title="删除任务"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 任务描述摘要 */}
          {todo.description && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {todo.description}
            </p>
          )}

          {/* 元属性标签与按钮栏 */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            
            {/* 分类徽章 */}
            {category && (
              <span className={`px-2 py-0.5 rounded-md font-medium text-[11px] ${category.bgColor}`}>
                {category.name}
              </span>
            )}

            {/* 优先级 */}
            <span
              className={`px-2 py-0.5 rounded-md border font-medium text-[11px] flex items-center gap-1.5 ${
                priorityConfig[todo.priority].bg
              } ${priorityConfig[todo.priority].text}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${priorityConfig[todo.priority].dot}`} />
              {priorityConfig[todo.priority].label}
            </span>

            {/* 截止时间 */}
            {todo.dueDate && (
              <span
                className={`px-2 py-0.5 rounded-md border font-medium text-[11px] flex items-center gap-1 ${
                  isOverdue && !todo.completed
                    ? 'border-rose-200 bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-400'
                    : isToday && !todo.completed
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-400'
                    : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40'
                }`}
              >
                <Calendar className="w-3 h-3" />
                {dueDateText}
              </span>
            )}

            {/* 标签列表 */}
            {todo.tags && todo.tags.map((t) => (
              <span
                key={t}
                className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded"
              >
                #{t}
              </span>
            ))}

            {/* 番茄钟专注入口 */}
            {!todo.completed && (
              <button
                onClick={() => onStartPomodoro(todo)}
                className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-md bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/50 dark:hover:bg-brand-900/60 text-brand-600 dark:text-brand-300 font-medium transition"
              >
                <Timer className="w-3 h-3" />
                <span>
                  {todo.spentPoms || 0}/{todo.estimatedPoms || 2} 番茄
                </span>
              </button>
            )}

            {/* 子任务展开收起指示 */}
            {totalSubTasks > 0 && (
              <button
                onClick={() => setShowSubtasks(!showSubtasks)}
                className="flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
              >
                {showSubtasks ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                <span>子任务 ({completedSubTasks}/{totalSubTasks})</span>
              </button>
            )}

          </div>

          {/* 子任务列表展开展示 */}
          {showSubtasks && totalSubTasks > 0 && (
            <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
              {todo.subTasks.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => onToggleSubTask(todo.id, sub.id)}
                  className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 cursor-pointer"
                >
                  {sub.completed ? (
                    <CheckSquare className="w-3.5 h-3.5 text-brand-500" />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span className={sub.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''}>
                    {sub.title}
                  </span>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
