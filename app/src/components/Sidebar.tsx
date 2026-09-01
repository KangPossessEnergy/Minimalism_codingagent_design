import React from 'react';
import { 
  Inbox, 
  Calendar, 
  CalendarRange, 
  CheckCircle, 
  Star, 
  Tag, 
  Briefcase, 
  GraduationCap, 
  Layers, 
  Coffee, 
  Flame, 
  CreditCard,
  Plus,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { Category, CategoryId, MainFilter, Priority, Todo } from '../types/todo';

interface SidebarProps {
  categories: Category[];
  activeFilter: MainFilter;
  setActiveFilter: (filter: MainFilter) => void;
  activeCategory: CategoryId | 'all';
  setActiveCategory: (cat: CategoryId | 'all') => void;
  activePriority: Priority | 'all';
  setActivePriority: (pri: Priority | 'all') => void;
  activeTag: string | null;
  setActiveTag: (tag: string | null) => void;
  todos: Todo[];
  isOpen: boolean;
  onCloseMobile: () => void;
}

// 映射分类图标组件
const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'Briefcase': return <Briefcase className="w-4 h-4" />;
    case 'GraduationCap': return <GraduationCap className="w-4 h-4" />;
    case 'Layers': return <Layers className="w-4 h-4" />;
    case 'Coffee': return <Coffee className="w-4 h-4" />;
    case 'Flame': return <Flame className="w-4 h-4" />;
    case 'CreditCard': return <CreditCard className="w-4 h-4" />;
    default: return <Briefcase className="w-4 h-4" />;
  }
};

export const Sidebar: React.FC<SidebarProps> = ({
  categories,
  activeFilter,
  setActiveFilter,
  activeCategory,
  setActiveCategory,
  activePriority,
  setActivePriority,
  activeTag,
  setActiveTag,
  todos,
  isOpen,
  onCloseMobile,
}) => {
  // 提取所有的标签列表和计数
  const allTags = Array.from(new Set(todos.flatMap((t) => t.tags || [])));

  // 计算不同过滤条件下的任务计数
  const counts = {
    all: todos.length,
    today: todos.filter((t) => {
      const todayStr = new Date().toISOString().split('T')[0];
      return t.dueDate === todayStr && !t.completed;
    }).length,
    upcoming: todos.filter((t) => !t.completed && t.dueDate).length,
    completed: todos.filter((t) => t.completed).length,
    starred: todos.filter((t) => t.pinned).length,
  };

  const getCategoryCount = (catId: CategoryId) => {
    return todos.filter((t) => t.categoryId === catId && !t.completed).length;
  };

  return (
    <>
      {/* 移动端遮罩层 */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-slate-50/90 dark:bg-slate-900/90 border-r border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 space-y-6">
          
          {/* 主导航项 */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              视图与状态
            </div>

            <button
              onClick={() => { setActiveFilter('all'); setActiveCategory('all'); setActiveTag(null); onCloseMobile(); }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                activeFilter === 'all' && activeCategory === 'all' && !activeTag
                  ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Inbox className="w-4 h-4 text-brand-500" />
                <span>全部任务</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                {counts.all}
              </span>
            </button>

            <button
              onClick={() => { setActiveFilter('today'); setActiveCategory('all'); setActiveTag(null); onCloseMobile(); }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                activeFilter === 'today' && !activeTag
                  ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-emerald-500" />
                <span>今天需完成</span>
              </div>
              {counts.today > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-medium">
                  {counts.today}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveFilter('upcoming'); setActiveCategory('all'); setActiveTag(null); onCloseMobile(); }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                activeFilter === 'upcoming' && !activeTag
                  ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CalendarRange className="w-4 h-4 text-indigo-500" />
                <span>近期安排</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                {counts.upcoming}
              </span>
            </button>

            <button
              onClick={() => { setActiveFilter('starred'); setActiveCategory('all'); setActiveTag(null); onCloseMobile(); }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                activeFilter === 'starred' && !activeTag
                  ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Star className="w-4 h-4 text-amber-500" />
                <span>星标置顶</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                {counts.starred}
              </span>
            </button>

            <button
              onClick={() => { setActiveFilter('completed'); setActiveCategory('all'); setActiveTag(null); onCloseMobile(); }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                activeFilter === 'completed' && !activeTag
                  ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-teal-500" />
                <span>已完成归档</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                {counts.completed}
              </span>
            </button>
          </div>

          {/* 分类筛选列表 */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-3 py-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                分类项目
              </span>
            </div>

            {categories.map((cat) => {
              const count = getCategoryCount(cat.id);
              const isSelected = activeCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(isSelected ? 'all' : cat.id);
                    setActiveTag(null);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span style={{ color: cat.color }}>{getCategoryIcon(cat.icon)}</span>
                    <span>{cat.name}</span>
                  </div>
                  {count > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* 优先级快速过滤 */}
          <div className="space-y-1">
            <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              优先级过滤
            </div>
            <div className="grid grid-cols-2 gap-1.5 px-1">
              {[
                { id: 'urgent', label: '紧急', color: 'text-rose-500 border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20' },
                { id: 'high', label: '重要', color: 'text-amber-500 border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20' },
                { id: 'medium', label: '普通', color: 'text-sky-500 border-sky-200 dark:border-sky-900 bg-sky-50/50 dark:bg-sky-950/20' },
                { id: 'low', label: '微小', color: 'text-slate-500 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActivePriority(activePriority === p.id ? 'all' : (p.id as Priority))}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border text-center transition-all ${
                    activePriority === p.id
                      ? `${p.color} ring-2 ring-brand-500 font-semibold`
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* 标签云 */}
          {allTags.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <Tag className="w-3 h-3" />
                <span>热门标签</span>
              </div>
              <div className="flex flex-wrap gap-1.5 px-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setActiveTag(activeTag === tag ? null : tag);
                      onCloseMobile();
                    }}
                    className={`text-xs px-2.5 py-1 rounded-lg transition-all ${
                      activeTag === tag
                        ? 'bg-brand-500 text-white shadow-sm shadow-brand-500/30'
                        : 'bg-slate-200/70 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 底部效率小卡片 */}
          <div className="mt-6 p-3.5 rounded-2xl bg-gradient-to-br from-brand-50 to-indigo-50/50 dark:from-brand-950/40 dark:to-indigo-950/40 border border-brand-100 dark:border-brand-900/60">
            <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 text-xs font-semibold">
              <TrendingUp className="w-4 h-4" />
              <span>今日效率箴言</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
              将重要的大任务拆解为 15 分钟的小步骤，立刻着手开始。
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
