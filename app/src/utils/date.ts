/**
 * 日期辅助工具函数
 */

// 格式化日期为 YYYY-MM-DD
export const formatDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 获取今天的字符串
export const getTodayKey = (): string => {
  return formatDateKey(new Date());
};

// 相对时间展示描述
export const formatDueDateDisplay = (dueDate: string | null, dueTime?: string | null): { text: string; isOverdue: boolean; isToday: boolean; isTomorrow: boolean } => {
  if (!dueDate) return { text: '无截止日', isOverdue: false, isToday: false, isTomorrow: false };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [year, month, day] = dueDate.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  const timeSuffix = dueTime ? ` ${dueTime}` : '';

  if (diffDays < 0) {
    return {
      text: `已逾期 ${Math.abs(diffDays)} 天${timeSuffix}`,
      isOverdue: true,
      isToday: false,
      isTomorrow: false,
    };
  } else if (diffDays === 0) {
    return {
      text: `今天到期${timeSuffix}`,
      isOverdue: false,
      isToday: true,
      isTomorrow: false,
    };
  } else if (diffDays === 1) {
    return {
      text: `明天到期${timeSuffix}`,
      isOverdue: false,
      isToday: false,
      isTomorrow: true,
    };
  } else if (diffDays === 2) {
    return {
      text: `后天到期${timeSuffix}`,
      isOverdue: false,
      isToday: false,
      isTomorrow: false,
    };
  } else if (diffDays < 7) {
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return {
      text: `${weekdays[targetDate.getDay()]}${timeSuffix}`,
      isOverdue: false,
      isToday: false,
      isTomorrow: false,
    };
  } else {
    return {
      text: `${month}月${day}日${timeSuffix}`,
      isOverdue: false,
      isToday: false,
      isTomorrow: false,
    };
  }
};

// 获取未来 N 天的日期列表
export const getNextNDays = (daysCount: number = 7) => {
  const dates: { dateKey: string; dayName: string; dayNumber: number; date: Date }[] = [];
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

  for (let i = 0; i < daysCount; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push({
      dateKey: formatDateKey(d),
      dayName: i === 0 ? '今天' : i === 1 ? '明天' : weekdays[d.getDay()],
      dayNumber: d.getDate(),
      date: d,
    });
  }
  return dates;
};
