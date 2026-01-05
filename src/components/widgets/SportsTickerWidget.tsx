import { useState, useEffect } from 'react';
import { X, Zap } from 'lucide-react';

interface SportsTickerWidgetProps {
  onRemove: () => void;
}

const tickerItems = [
  '🏀 NBA: LeBron James scores 35 points in Lakers victory',
  '🏈 NFL: Patrick Mahomes throws 4 TDs as Chiefs clinch playoff spot',
  '⚽ EPL: Arsenal extends lead at top of table with 3-1 win',
  '🏒 NHL: Rangers goalie makes 42 saves in shutout victory',
  '⚾ MLB: Yankees sign free agent pitcher to 5-year deal',
  '🎾 ATP: Djokovic advances to semifinals at Australian Open',
  '⛳ PGA: Tiger Woods confirms return at upcoming tournament',
  '🏎️ F1: New regulations announced for upcoming season',
];

export const SportsTickerWidget = ({ onRemove }: SportsTickerWidgetProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tickerItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div className="widget h-full">
      <div className="widget-header">
        <span className="widget-title flex items-center gap-2">
          <Zap size={14} className="text-primary" />
          Sports Ticker
        </span>
        <button onClick={onRemove} className="text-muted-foreground hover:text-destructive transition-colors">
          <X size={16} />
        </button>
      </div>
      <div 
        className="widget-content h-[calc(100%-52px)] flex flex-col"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-4">
            <p className="text-lg font-medium transition-opacity duration-500">
              {tickerItems[currentIndex]}
            </p>
          </div>
        </div>
        <div className="flex justify-center gap-2 pt-4">
          {tickerItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-primary' : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
        <div className="mt-4 overflow-hidden">
          <div className="animate-ticker whitespace-nowrap font-mono text-xs text-muted-foreground">
            {tickerItems.join('  •  ')}  •  {tickerItems.join('  •  ')}
          </div>
        </div>
      </div>
    </div>
  );
};
