interface TimerWidgetProps {
  seconds: number;
  isRunning: boolean;
  onToggle: () => void;
  onReset?: () => void;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function TimerWidget({
  seconds,
  isRunning,
  onToggle,
  onReset,
  label,
  size = 'md'
}: TimerWidgetProps) {
  const formatTime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl'
  };

  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-sm text-gray-600">{label}</span>}
      <span className={`font-mono font-semibold ${sizeClasses[size]}`}>
        {formatTime(seconds)}
      </span>
      <button
        onClick={onToggle}
        className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        title={isRunning ? 'Pause' : 'Start'}
      >
        {isRunning ? '⏸' : '▶'}
      </button>
      {onReset && (
        <button
          onClick={onReset}
          className="px-2 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          title="Reset"
        >
          ⏹
        </button>
      )}
    </div>
  );
}
