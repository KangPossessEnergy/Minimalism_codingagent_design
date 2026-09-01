import React from 'react';
import { CheckCircle2, Clock, Zap, AlertCircle, Award } from 'lucide-react';
import { Todo } from '../types/todo';

interface TodoStatsProps {
  todos: Todo[];
}

export const TodoStats: React.FC<TodoStatsProps> = ({ todos }) => {
  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const inProgress = todos.filter((t) => t.status === 'in_progress').length;
  const urgentCount = todos.filter((t) => t.priority === 'urgent' && !t.completed).length;
  
  // 计算完成百分比
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  // 累计番茄钟专注数
  const totalPoms = todos.reduce((acc, t) => acc + (t.spentPoms || 0), 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
      
      {/* 进度百分比卡片 */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm relative overflow-hidden group hover:border-brand-300 dark:hover:border-brand-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">总完成率</span>
          <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 group-hover:scale-110 transition">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900 dark:text-white">{completionRate}%</span>
          <span className="text-xs text-slate-400">({completed}/{total})</span>
        </div>
        {/* 底部进度条 */}
        <div className="mt-3 w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-brand-500 to-indigo-500 rounded-full transition-all duration-500" 
            style={{ width: `${completionRate}%` }} 
          />
        </div>
      </div>

      {/* 进行中任务 */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm relative overflow-hidden group hover:border-amber-300 dark:hover:border-amber-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">进行中任务</span>
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition">
            <Zap className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900 dark:text-white">{inProgress}</span>
          <span className="text-xs text-slate-400">项处理中</span>
        </div>
        <div className="mt-3 text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1 font-medium">
          <span>保持心流加速推进</span>
        </div>
      </div>

      {/* 紧要事项预警 */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm relative overflow-hidden group hover:border-rose-300 dark:hover:border-rose-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">高优/紧急</span>
          <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition">
            <AlertCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-rose-600 dark:text-rose-400">{urgentCount}</span>
          <span className="text-xs text-slate-400">项需优先处理</span>
        </div>
        <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
          建议立即排期解决
        </div>
      </div>

      {/* 专注番茄钟统计 */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm relative overflow-hidden group hover:border-indigo-300 dark:hover:border-indigo-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">累计专注</span>
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition">
            <Award className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-slate-900 dark:text-white">{totalPoms}</span>
          <span className="text-xs text-slate-400">番茄 (≈{totalPoms * 25}分钟)</span>
        </div>
        <div className="mt-3 text-[11px] text-indigo-600 dark:text-indigo-400 flex items-center gap-1 font-medium">
          <span>效率表现非常优秀 🎯</span>
        </div>
      </div>

    </div>
  );
};
