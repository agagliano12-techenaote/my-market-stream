import { useState, useEffect } from 'react';
import { X, Zap, Loader2 } from 'lucide-react';
import { useLiveSports } from '@/hooks/useLiveSports';

interface SportsTickerWidgetProps {
  onRemove: () => void;
}

export const SportsTickerWidget = ({ onRemove }: SportsTickerWidgetProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { scores, loading } = useLiveSports('All');

  // Generate ticker items from live scores
  const tickerItems = scores.map(game => {
    const emoji = game.league === 'NBA' ? '🏀' : 
                  game.league === 'NFL' ? '🏈' : 
                  game.league === 'NHL' ? '🏒' : 
                  game.league === 'MLB' ? '⚾' : 
                  game.league === 'EPL' ? '⚽' : '🏆';
    return `${emoji} ${game.league}: ${game.awayTeam} ${game.awayScore} - ${game.homeScore} ${game.homeTeam} (${game.status})`;
  });

  useEffect(() => {
    if (isPaused || tickerItems.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tickerItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, tickerItems.length]);

  return (
    <div className="widget h-full">
      <div className="widget-header">
        <span className="widget-title flex items-center gap-2">
          <Zap size={14} className="text-primary" />
          Sports Ticker
          {loading && <Loader2 size={12} className="animate-spin text-muted-foreground" />}
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
        {loading && tickerItems.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={24} />
          </div>
        ) : tickerItems.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            No live games at the moment
          </div>
        ) : (
          <>
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center px-4">
                <p className="text-lg font-medium transition-opacity duration-500">
                  {tickerItems[currentIndex]}
                </p>
              </div>
            </div>
            <div className="flex justify-center gap-2 pt-4">
              {tickerItems.slice(0, 8).map((_, index) => (
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
          </>
        )}
      </div>
    </div>
  );
};
