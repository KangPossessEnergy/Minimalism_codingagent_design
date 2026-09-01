import React from 'react';
import { 
  CheckCircle2, 
  Sparkles, 
  Search, 
  Sun, 
  Moon, 
  Timer, 
  LayoutList, 
  Kanban, 
  CalendarDays, 
  SlidersHorizontal,
  Plus,
  RotateCcw
} from 'lucide-react';
import { ViewMode } from '../types/todo';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenPomodoro: () => void;
  onOpenAddModal: () => void;
  onResetData: () => void;
  onToggleSidebar: () => void;
  isPomodoroActive: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
  onOpenPomodoro,
  onOpenAddModal,
  onResetData,
  onToggleSidebar,
  isPomodoroActive,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        
        {/* 左侧 Logo 与侧边栏切换 */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onToggleSidebar}
            className="p-2 -ml-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition lg:hidden"
            title="展开/收起侧边栏"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 select-none">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-brand-700 to-indigo-600 dark:from-white dark:via-brand-300 dark:to-indigo-300 bg-clip-text text-transparent">
                  TaskFlow
                </span>
                <span className="text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950/80 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">专注高效每一天</p>
            </div>
          </div>
        </div>

        {/* 中间 搜索框 */}
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索待办任务、标签或描述 (快捷键 /)..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-slate-100/90 dark:bg-slate-800/80 border border-transparent focus:border-brand-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-inner"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* 右侧 功能操作栏 */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* 视图切换按钮组 */}
          <div className="hidden sm:flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="列表视图"
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>列表</span>
            </button>
            
            <button
              onClick={() => setViewMode('board')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'board'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="看板视图"
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>看板</span>
            </button>

            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'calendar'
                  ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
              title="日程周历视图"
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>日程</span>
            </button>
          </div>

          {/* 番茄钟专注入口 */}
          <button
            onClick={onOpenPomodoro}
            className={`relative p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all border ${
              isPomodoroActive
                ? 'bg-rose-500 text-white border-rose-600 shadow-md shadow-rose-500/25 animate-pulse'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-500 hover:text-brand-600'
            }`}
            title="番茄工作法计时器"
          >
            <Timer className="w-4 h-4" />
            <span className="hidden sm:inline">番茄钟</span>
            {isPomodoroActive && (
              <span className="w-2 h-2 rounded-full bg-white absolute top-1.5 right-1.5 animate-ping" />
            )}
          </button>

          {/* 重置/恢复 Mock 数据 */}
          <button
            onClick={onResetData}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white transition"
            title="重置为默认Mock数据"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* 暗黑/明亮主题切换 */}
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:text-amber-500 dark:hover:text-amber-400 transition"
            title={darkMode ? '切换为浅色主题' : '切换为暗色主题'}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* 新建任务主按钮 */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-medium text-xs sm:text-sm px-3.5 py-2 rounded-xl shadow-md shadow-brand-500/25 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">新建待办</span>
          </button>
        </div>
      </div>
    </header>
  );
};
