import React, { useState, useEffect } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Check, 
  Calendar, 
  Clock, 
  Flag, 
  Folder, 
  Tag, 
  Star, 
  CheckSquare, 
  Square,
  Timer
} from 'lucide-react';
import { Category, CategoryId, Priority, Status, SubTask, Todo } from '../types/todo';
import { getTodayKey } from '../utils/date';

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  todo: Todo | null; // null 表示新建模式
  categories: Category[];
  onSave: (todoData: Partial<Todo>) => void;
  onDelete?: (id: string) => void;
  initialStatus?: Status;
  initialDueDate?: string;
}

export const TodoModal: React.FC<TodoModalProps> = ({
  isOpen,
  onClose,
  todo,
  categories,
  onSave,
  onDelete,
  initialStatus = 'todo',
  initialDueDate,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [categoryId, setCategoryId] = useState<CategoryId>('work');
  const [status, setStatus] = useState<Status>('todo');
  const [dueDate, setDueDate] = useState<string>('');
  const [dueTime, setDueTime] = useState<string>('');
  const [pinned, setPinned] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [subTasks, setSubTasks] = useState<SubTask[]>([]);
  const [newSubTaskInput, setNewSubTaskInput] = useState('');
  const [estimatedPoms, setEstimatedPoms] = useState(2);
  const [spentPoms, setSpentPoms] = useState(0);

  useEffect(() => {
    if (todo) {
      setTitle(todo.title || '');
      setDescription(todo.description || '');
      setPriority(todo.priority || 'medium');
      setCategoryId(todo.categoryId || 'work');
      setStatus(todo.status || (todo.completed ? 'completed' : 'todo'));
      setDueDate(todo.dueDate || '');
      setDueTime(todo.dueTime || '');
      setPinned(!!todo.pinned);
      setTags(todo.tags || []);
      setSubTasks(todo.subTasks || []);
      setEstimatedPoms(todo.estimatedPoms || 2);
      setSpentPoms(todo.spentPoms || 0);
    } else {
      // 新建模式初始值
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCategoryId('work');
      setStatus(initialStatus);
      setDueDate(initialDueDate || getTodayKey());
      setDueTime('18:00');
      setPinned(false);
      setTags(['日常']);
      setSubTasks([]);
      setEstimatedPoms(2);
      setSpentPoms(0);
    }
  }, [todo, isOpen, initialStatus, initialDueDate]);

  if (!isOpen) return null;

  const handleAddSubTask = () => {
    if (!newSubTaskInput.trim()) return;
    const newSub: SubTask = {
      id: `sub-${Date.now()}`,
      title: newSubTaskInput.trim(),
      completed: false,
    };
    setSubTasks([...subTasks, newSub]);
    setNewSubTaskInput('');
  };

  const handleToggleSubTask = (subId: string) => {
    setSubTasks(
      subTasks.map((s) => (s.id === subId ? { ...s, completed: !s.completed } : s))
    );
  };

  const handleDeleteSubTask = (subId: string) => {
    setSubTasks(subTasks.filter((s) => s.id !== subId));
  };

  const handleAddTag = () => {
    const trimmed = newTagInput.trim().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: todo ? todo.id : `todo-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      priority,
      categoryId,
      status,
      completed: status === 'completed',
      dueDate: dueDate || null,
      dueTime: dueTime || null,
      pinned,
      tags,
      subTasks,
      estimatedPoms,
      spentPoms,
      createdAt: todo?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: status === 'completed' ? new Date().toISOString() : null,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 顶部标题栏 */}
        <div className="px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base text-slate-800 dark:text-slate-100">
              {todo ? '编辑待办详情' : '新建待办事项'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setPinned(!pinned)}
              className={`p-2 rounded-xl transition ${
                pinned
                  ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/60'
                  : 'text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={pinned ? '取消星标置顶' : '星标置顶'}
            >
              <Star className="w-4 h-4 fill-current" />
            </button>

            {todo && onDelete && (
              <button
                type="button"
                onClick={() => {
                  onDelete(todo.id);
                  onClose();
                }}
                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-xl transition"
                title="删除任务"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 表单内容 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* 标题 */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="任务名称..."
              required
              className="w-full text-lg font-bold bg-transparent border-b border-slate-200 dark:border-slate-800 pb-2 focus:border-brand-500 focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>

          {/* 详细描述 */}
          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="添加详细描述、任务要点或背景说明..."
              className="w-full text-sm p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-brand-500 resize-none"
            />
          </div>

          {/* 属性选择区域 (两列网格) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* 所属分类 */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Folder className="w-3.5 h-3.5" /> 所属分类
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value as CategoryId)}
                className="w-full text-xs font-medium p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 优先级 */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Flag className="w-3.5 h-3.5" /> 优先级
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full text-xs font-medium p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value="urgent">🔴 紧急优先 (Urgent)</option>
                <option value="high">🟠 重要优先 (High)</option>
                <option value="medium">🔵 普通优先级 (Medium)</option>
                <option value="low">⚪ 微小优先级 (Low)</option>
              </select>
            </div>

            {/* 状态 */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5" /> 任务状态
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className="w-full text-xs font-medium p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value="todo">待处理 (To-Do)</option>
                <option value="in_progress">进行中 (In Progress)</option>
                <option value="completed">已完成 (Completed)</option>
              </select>
            </div>

            {/* 预估番茄数 */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Timer className="w-3.5 h-3.5" /> 预估番茄钟 (每钟 25min)
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={estimatedPoms}
                onChange={(e) => setEstimatedPoms(Number(e.target.value))}
                className="w-full text-xs font-medium p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* 截止日期 */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> 截止日期
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full text-xs font-medium p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* 截止具体时间 */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> 截止时间 (选填)
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full text-xs font-medium p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>

          </div>

          {/* 子任务拆解 */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              子任务步骤拆解 ({subTasks.filter((s) => s.completed).length}/{subTasks.length})
            </label>

            {/* 子任务列表 */}
            <div className="space-y-2">
              {subTasks.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs"
                >
                  <div
                    onClick={() => handleToggleSubTask(sub.id)}
                    className="flex items-center gap-2 cursor-pointer flex-1 min-w-0"
                  >
                    {sub.completed ? (
                      <CheckSquare className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    )}
                    <span className={`truncate ${sub.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>
                      {sub.title}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteSubTask(sub.id)}
                    className="text-slate-400 hover:text-rose-500 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* 添加子任务输入框 */}
            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                value={newSubTaskInput}
                onChange={(e) => setNewSubTaskInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubTask();
                  }
                }}
                placeholder="输入具体执行步骤，按 Enter 添加..."
                className="flex-1 text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500"
              />
              <button
                type="button"
                onClick={handleAddSubTask}
                className="px-3 py-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition"
              >
                添加步骤
              </button>
            </div>
          </div>

          {/* 标签管理 */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" /> 标签分类
            </label>

            <div className="flex flex-wrap items-center gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-300 border border-brand-200 dark:border-brand-900"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-rose-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="+ 新标签"
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-brand-500 focus:outline-none w-24 text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>
          </div>

          {/* 弹窗底部操作按钮 */}
          <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow-md shadow-brand-500/20 active:scale-95 transition-all"
            >
              {todo ? '保存更改' : '立即创建'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
