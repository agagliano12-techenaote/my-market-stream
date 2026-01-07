import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useLiveSports } from '@/hooks/useLiveSports';

interface SportsScoresWidgetProps {
  onRemove: () => void;
}

export const SportsScoresWidget = ({ onRemove }: SportsScoresWidgetProps) => {
  const [selectedLeague, setSelectedLeague] = useState<string>('All');
  const { scores, loading, error } = useLiveSports(selectedLeague);

  const leagues = ['All', 'NBA', 'NFL', 'NHL', 'MLB', 'EPL'];
  const filteredScores = selectedLeague === 'All' ? scores : scores.filter(s => s.league === selectedLeague);

  return (
    <div className="widget h-full">
      <div className="widget-header">
        <span className="widget-title flex items-center gap-2">
          Sports Scores
          {loading && <Loader2 size={12} className="animate-spin text-muted-foreground" />}
        </span>
        <button onClick={onRemove} className="text-muted-foreground hover:text-destructive transition-colors">
          <X size={16} />
        </button>
      </div>
      <div className="widget-content h-[calc(100%-52px)] flex flex-col">
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-thin">
          {leagues.map(league => (
            <button
              key={league}
              onClick={() => setSelectedLeague(league)}
              className={`px-3 py-1 text-xs font-mono rounded border transition-colors whitespace-nowrap ${
                selectedLeague === league
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-secondary border-border text-muted-foreground hover:text-foreground hover:border-primary/50'
              }`}
            >
              {league}
            </button>
          ))}
        </div>
        {error && (
          <div className="text-xs text-destructive p-2 bg-destructive/10 rounded mb-2">
            {error}
          </div>
        )}
        <div className="flex-1 overflow-auto scrollbar-thin space-y-2">
          {loading && filteredScores.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin text-primary" size={24} />
            </div>
          ) : filteredScores.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No games found for {selectedLeague}
            </div>
          ) : (
            filteredScores.map((game) => (
              <div key={game.id} className="p-3 bg-secondary/30 rounded border border-border/50 hover:border-primary/30 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-primary font-semibold">{game.league}</span>
                  <span className={`text-xs font-mono ${game.status === 'Final' ? 'text-muted-foreground' : 'text-success'}`}>
                    {game.status}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 items-center">
                  <div className="text-sm font-medium text-right">{game.awayTeam}</div>
                  <div className="font-mono text-xl font-bold text-center">
                    <span className={game.awayScore > game.homeScore ? 'text-success' : ''}>{game.awayScore}</span>
                    <span className="text-muted-foreground mx-2">-</span>
                    <span className={game.homeScore > game.awayScore ? 'text-success' : ''}>{game.homeScore}</span>
                  </div>
                  <div className="text-sm font-medium">{game.homeTeam}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
