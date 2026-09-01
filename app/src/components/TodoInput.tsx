import React, { useState } from 'react';
import { Plus, Calendar, Flag, Folder, Sparkles } from 'lucide-react';
import { Category, CategoryId, Priority, Todo } from '../types/todo';
import { getTodayKey } from '../utils/date';

interface TodoInputProps {
  categories: Category[];
  onAddTodo: (todo: Partial<Todo>) => void;
  defaultCategoryId?: CategoryId | 'all';
}

export const TodoInput: React.FC<TodoInputProps> = ({
  categories,
  onAddTodo,
  defaultCategoryId = 'work',
}) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [categoryId, setCategoryId] = useState<CategoryId>(
    defaultCategoryId === 'all' ? 'work' : defaultCategoryId
  );
  const [dueDate, setDueDate] = useState<string>(getTodayKey());
  const [isExpanded, setIsExpanded] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onAddTodo({
      title: title.trim(),
      priority,
      categoryId,
      dueDate: dueDate || null,
      tags: tags.length > 0 ? tags : ['日常'],
      status: 'todo',
      completed: false,
      pinned: false,
      subTasks: [],
      estimatedPoms: 2,
      spentPoms: 0,
    });

    setTitle('');
    setTagInput('');
    setIsExpanded(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-all mb-6 p-3 sm:p-4">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center flex-shrink-0">
            <Plus className="w-3 h-3 text-slate-400" />
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder="添加新的待办任务，按 Enter 键快速保存..."
            className="flex-1 text-sm sm:text-base font-medium bg-transparent focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-white"
          />
          <button
            type="submit"
            disabled={!title.trim()}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:hover:bg-brand-600 text-white text-xs font-semibold rounded-xl transition shadow-sm"
          >
            <span>添加</span>
          </button>
        </div>

        {/* 展开的快捷属性选择器 */}
        {isExpanded && (
          <div className="mt-3.5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 animate-fade-in text-xs">
            <div className="flex flex-wrap items-center gap-2">
              
              {/* 分类下拉 */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg">
                <Folder className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value as CategoryId)}
                  className="bg-transparent text-slate-700 dark:text-slate-300 font-medium focus:outline-none cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id} className="dark:bg-slate-900">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 优先级 */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg">
                <Flag className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="bg-transparent text-slate-700 dark:text-slate-300 font-medium focus:outline-none cursor-pointer"
                >
                  <option value="urgent" className="dark:bg-slate-900">🔴 紧急优先</option>
                  <option value="high" className="dark:bg-slate-900">🟠 重要优先</option>
                  <option value="medium" className="dark:bg-slate-900">🔵 普通优先级</option>
                  <option value="low" className="dark:bg-slate-900">⚪ 微小优先级</option>
                </select>
              </div>

              {/* 截止日期 */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2.5 py-1.5 rounded-lg">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="bg-transparent text-slate-700 dark:text-slate-300 font-medium focus:outline-none cursor-pointer text-xs"
                />
              </div>

              {/* 快速标签输入 */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                <span className="text-slate-400 mr-1">#</span>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="标签 (逗号分隔)"
                  className="bg-transparent text-slate-700 dark:text-slate-300 placeholder:text-slate-400 focus:outline-none w-24 sm:w-32 py-0.5 text-xs"
                />
              </div>

            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="px-3 py-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                收起
              </button>
              <button
                type="submit"
                disabled={!title.trim()}
                className="sm:hidden px-3.5 py-1.5 bg-brand-600 hover:bg-brand-500 disabled:opacity-40 text-white font-semibold rounded-lg"
              >
                添加
              </button>
            </div>

          </div>
        )}
      </form>
    </div>
  );
};
