import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, X, CheckCircle, Bell, Flame } from 'lucide-react';
import { Todo } from '../types/todo';
import { triggerConfetti } from '../utils/confetti';

interface PomodoroTimerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTodo: Todo | null;
  onCompletePomodoro: (todoId: string) => void;
  isRunning: boolean;
  setIsRunning: (running: boolean) => void;
  timeLeft: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  mode: 'work' | 'break';
  setMode: (mode: 'work' | 'break') => void;
}

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  isOpen,
  onClose,
  selectedTodo,
  onCompletePomodoro,
  isRunning,
  setIsRunning,
  timeLeft,
  setTimeLeft,
  mode,
  setMode,
}) => {
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      triggerConfetti();

      if (mode === 'work') {
        if (selectedTodo) {
          onCompletePomodoro(selectedTodo.id);
        }
        setMode('break');
        setTimeLeft(BREAK_TIME);
      } else {
        setMode('work');
        setTimeLeft(WORK_TIME);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode, selectedTodo, onCompletePomodoro, setIsRunning, setMode, setTimeLeft]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const totalCurrentModeTime = mode === 'work' ? WORK_TIME : BREAK_TIME;
  const progress = ((totalCurrentModeTime - timeLeft) / totalCurrentModeTime) * 100;

  const handleTogglePlay = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? WORK_TIME : BREAK_TIME);
  };

  const switchMode = (newMode: 'work' | 'break') => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === 'work' ? WORK_TIME : BREAK_TIME);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 背景光晕装饰 */}
        <div className={`absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-20 -z-10 ${mode === 'work' ? 'bg-rose-500' : 'bg-emerald-500'}`} />

        {/* 顶部关闭与模式指示 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-500">
              <Flame className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">番茄心流工作台</h3>
              <p className="text-[11px] text-slate-400">单核专注 · 劳逸结合</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 模式切换选项卡 */}
        <div className="flex items-center justify-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 mb-6">
          <button
            onClick={() => switchMode('work')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
              mode === 'work'
                ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            深度专注 (25m)
          </button>
          <button
            onClick={() => switchMode('break')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
              mode === 'break'
                ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            适度休息 (5m)
          </button>
        </div>

        {/* 当前绑定的任务 */}
        <div className="mb-6 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-center">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            当前心流目标
          </span>
          <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
            {selectedTodo ? selectedTodo.title : '未绑定特定任务（自由专注）'}
          </p>
        </div>

        {/* 环形时钟与数字展示 */}
        <div className="flex flex-col items-center justify-center my-6">
          <div className="relative flex items-center justify-center">
            {/* 倒计时巨幕数字 */}
            <div className="text-6xl font-black tracking-tighter text-slate-900 dark:text-white select-none">
              {formattedTime}
            </div>
          </div>

          <div className="w-48 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-4 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${mode === 'work' ? 'bg-rose-500' : 'bg-emerald-500'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 控制按钮组 */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={handleReset}
            className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
            title="重置"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={handleTogglePlay}
            className={`px-8 py-3.5 rounded-2xl text-white font-bold flex items-center gap-2 shadow-lg transition active:scale-95 ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30'
                : mode === 'work'
                ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/30'
                : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/30'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>暂停</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>开始专注</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
