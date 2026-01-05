import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ClockWidgetProps {
  onRemove: () => void;
}

export const ClockWidget = ({ onRemove }: ClockWidgetProps) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="widget h-full">
      <div className="widget-header">
        <span className="widget-title">Clock</span>
        <button onClick={onRemove} className="text-muted-foreground hover:text-destructive transition-colors">
          <X size={16} />
        </button>
      </div>
      <div className="widget-content flex flex-col items-center justify-center h-[calc(100%-52px)]">
        <div className="font-mono text-5xl font-bold text-primary tracking-wider">
          {formatTime(time)}
          <span className="animate-blink">:</span>
        </div>
        <div className="text-muted-foreground mt-4 text-sm">
          {formatDate(time)}
        </div>
        <div className="flex gap-8 mt-6 text-xs text-muted-foreground font-mono">
          <div className="text-center">
            <div className="text-primary text-lg font-semibold">NYC</div>
            <div>{new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', hour12: false })}</div>
          </div>
          <div className="text-center">
            <div className="text-primary text-lg font-semibold">LDN</div>
            <div>{new Date().toLocaleTimeString('en-US', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit', hour12: false })}</div>
          </div>
          <div className="text-center">
            <div className="text-primary text-lg font-semibold">TKY</div>
            <div>{new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit', hour12: false })}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
