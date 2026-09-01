import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import { Category, Priority, Todo } from '../types/todo';
import { formatDateKey, getNextNDays } from '../utils/date';

interface TodoCalendarViewProps {
  todos: Todo[];
  categories: Category[];
  onToggleComplete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onOpenAddModalWithDate: (dateStr: string) => void;
}

export const TodoCalendarView: React.FC<TodoCalendarViewProps> = ({
  todos,
  categories,
  onToggleComplete,
  onEdit,
  onOpenAddModalWithDate,
}) => {
  const [daysCount] = useState(7);
  const weekDays = getNextNDays(daysCount);

  const getCategory = (catId: string) => categories.find((c) => c.id === catId);

  const priorityDots: Record<Priority, string> = {
    urgent: 'bg-rose-500',
    high: 'bg-amber-500',
    medium: 'bg-sky-500',
    low: 'bg-slate-400',
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200/60 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">未来 7 天日程规划</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">纵览近期安排，合理分配专注力</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {weekDays.map((day, idx) => {
          const dayTodos = todos.filter((t) => t.dueDate === day.dateKey);
          const isToday = idx === 0;

          return (
            <div
              key={day.dateKey}
              className={`flex flex-col min-h-[300px] rounded-xl p-3 border transition-all ${
                isToday
                  ? 'border-brand-500 bg-brand-50/20 dark:bg-brand-950/20 shadow-xs'
                  : 'border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/40'
              }`}
            >
              {/* 日期卡片头部 */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/60 dark:border-slate-800">
                <div>
                  <span className={`text-xs font-semibold block ${isToday ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500 dark:text-slate-400'}`}>
                    {day.dayName}
                  </span>
                  <span className="text-lg font-black text-slate-800 dark:text-white">
                    {day.dayNumber} 日
                  </span>
                </div>
                <button
                  onClick={() => onOpenAddModalWithDate(day.dateKey)}
                  className="p-1 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-white dark:hover:bg-slate-800 transition"
                  title="在此日期添加待办"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* 当天任务列表 */}
              <div className="space-y-2 flex-1">
                {dayTodos.length === 0 ? (
                  <div className="h-20 flex items-center justify-center text-[11px] text-slate-400">
                    无待办安排
                  </div>
                ) : (
                  dayTodos.map((todo) => {
                    const cat = getCategory(todo.categoryId);

                    return (
                      <div
                        key={todo.id}
                        onClick={() => onEdit(todo)}
                        className={`p-2 rounded-lg border text-left cursor-pointer transition-all hover:scale-[1.02] ${
                          todo.completed
                            ? 'bg-slate-100/70 dark:bg-slate-800/40 border-transparent opacity-60'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-xs'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`w-1.5 h-1.5 rounded-full ${priorityDots[todo.priority]}`} />
                          <span
                            className={`text-xs font-semibold truncate flex-1 ${
                              todo.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            {todo.title}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span>{todo.dueTime || '全天'}</span>
                          {cat && <span className="font-medium text-slate-500">{cat.name}</span>}
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
    </div>
  );
};
