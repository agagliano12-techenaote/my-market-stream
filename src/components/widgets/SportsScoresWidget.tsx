import { useState } from 'react';
import { X, Settings } from 'lucide-react';
import { SportsScore } from '@/types/widget';

interface SportsScoresWidgetProps {
  onRemove: () => void;
}

const mockScores: SportsScore[] = [
  { id: '1', league: 'NBA', homeTeam: 'Lakers', awayTeam: 'Celtics', homeScore: 112, awayScore: 108, status: 'Final' },
  { id: '2', league: 'NFL', homeTeam: 'Chiefs', awayTeam: 'Bills', homeScore: 27, awayScore: 24, status: 'Q4 2:34' },
  { id: '3', league: 'NHL', homeTeam: 'Rangers', awayTeam: 'Bruins', homeScore: 3, awayScore: 2, status: 'P3 8:15' },
  { id: '4', league: 'MLB', homeTeam: 'Yankees', awayTeam: 'Red Sox', homeScore: 5, awayScore: 4, status: '9th' },
  { id: '5', league: 'EPL', homeTeam: 'Arsenal', awayTeam: 'Chelsea', homeScore: 2, awayScore: 1, status: "90'+2" },
];

export const SportsScoresWidget = ({ onRemove }: SportsScoresWidgetProps) => {
  const [scores] = useState<SportsScore[]>(mockScores);
  const [selectedLeague, setSelectedLeague] = useState<string>('All');

  const leagues = ['All', 'NBA', 'NFL', 'NHL', 'MLB', 'EPL'];
  const filteredScores = selectedLeague === 'All' ? scores : scores.filter(s => s.league === selectedLeague);

  return (
    <div className="widget h-full">
      <div className="widget-header">
        <span className="widget-title">Sports Scores</span>
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
        <div className="flex-1 overflow-auto scrollbar-thin space-y-2">
          {filteredScores.map((game) => (
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
          ))}
        </div>
      </div>
    </div>
  );
};
