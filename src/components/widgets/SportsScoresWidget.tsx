import { useState } from 'react';
import { X, Loader2, Settings, Star, StarOff, Plus } from 'lucide-react';
import { useLiveSports } from '@/hooks/useLiveSports';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface SportsScoresWidgetProps {
  onRemove: () => void;
}

const allLeagues = ['NBA', 'NFL', 'NHL', 'MLB', 'EPL'];

export const SportsScoresWidget = ({ onRemove }: SportsScoresWidgetProps) => {
  const [selectedLeague, setSelectedLeague] = useState<string>('All');
  const [editMode, setEditMode] = useState(false);
  const [favoriteTeams, setFavoriteTeams] = useLocalStorage<string[]>('dashboard-favorite-teams', []);
  const [enabledLeagues, setEnabledLeagues] = useLocalStorage<string[]>('dashboard-enabled-leagues', allLeagues);
  const [teamInput, setTeamInput] = useState('');
  
  const { scores, loading, error } = useLiveSports(selectedLeague);

  const leagues = ['All', ...enabledLeagues];
  
  // Sort to show favorite teams first
  const filteredScores = (selectedLeague === 'All' ? scores : scores.filter(s => s.league === selectedLeague))
    .sort((a, b) => {
      const aIsFavorite = favoriteTeams.some(team => 
        a.homeTeam.toLowerCase().includes(team.toLowerCase()) || 
        a.awayTeam.toLowerCase().includes(team.toLowerCase())
      );
      const bIsFavorite = favoriteTeams.some(team => 
        b.homeTeam.toLowerCase().includes(team.toLowerCase()) || 
        b.awayTeam.toLowerCase().includes(team.toLowerCase())
      );
      if (aIsFavorite && !bIsFavorite) return -1;
      if (!aIsFavorite && bIsFavorite) return 1;
      return 0;
    });

  const toggleLeague = (league: string) => {
    if (enabledLeagues.includes(league)) {
      setEnabledLeagues(enabledLeagues.filter(l => l !== league));
    } else {
      setEnabledLeagues([...enabledLeagues, league]);
    }
  };

  const addFavoriteTeam = () => {
    const team = teamInput.trim();
    if (team && !favoriteTeams.includes(team)) {
      setFavoriteTeams([...favoriteTeams, team]);
      setTeamInput('');
    }
  };

  const removeFavoriteTeam = (team: string) => {
    setFavoriteTeams(favoriteTeams.filter(t => t !== team));
  };

  const isGameFavorite = (game: { homeTeam: string; awayTeam: string }) => {
    return favoriteTeams.some(team => 
      game.homeTeam.toLowerCase().includes(team.toLowerCase()) || 
      game.awayTeam.toLowerCase().includes(team.toLowerCase())
    );
  };

  return (
    <div className="widget h-full">
      <div className="widget-header">
        <span className="widget-title flex items-center gap-2">
          Sports Scores
          {loading && <Loader2 size={12} className="animate-spin text-muted-foreground" />}
        </span>
        <div className="flex gap-2">
          <button onClick={() => setEditMode(!editMode)} className={`transition-colors ${editMode ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>
            <Settings size={16} />
          </button>
          <button onClick={onRemove} className="text-muted-foreground hover:text-destructive transition-colors">
            <X size={16} />
          </button>
        </div>
      </div>
      <div className="widget-content h-[calc(100%-52px)] flex flex-col">
        {editMode && (
          <div className="mb-4 p-3 bg-secondary/50 rounded border border-border">
            <p className="text-xs text-muted-foreground mb-2 font-mono">Favorite Teams:</p>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={teamInput}
                onChange={(e) => setTeamInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addFavoriteTeam()}
                placeholder="Add team name..."
                className="flex-1 bg-background border border-border rounded px-3 py-1.5 text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button onClick={addFavoriteTeam} className="px-3 py-1.5 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
                <Plus size={14} />
              </button>
            </div>
            {favoriteTeams.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {favoriteTeams.map(team => (
                  <span key={team} className="flex items-center gap-1 px-2 py-1 bg-warning/20 border border-warning/30 rounded text-xs font-mono text-warning">
                    <Star size={10} />
                    {team}
                    <button onClick={() => removeFavoriteTeam(team)} className="hover:text-destructive">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground mb-2 font-mono">Leagues:</p>
            <div className="flex flex-wrap gap-2">
              {allLeagues.map(league => (
                <button
                  key={league}
                  onClick={() => toggleLeague(league)}
                  className={`px-2 py-1 text-xs font-mono rounded border transition-colors ${
                    enabledLeagues.includes(league)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border text-muted-foreground'
                  }`}
                >
                  {league}
                </button>
              ))}
            </div>
          </div>
        )}
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
              <div 
                key={game.id} 
                className={`p-3 bg-secondary/30 rounded border transition-colors ${
                  isGameFavorite(game) 
                    ? 'border-warning/50 bg-warning/5' 
                    : 'border-border/50 hover:border-primary/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1 text-xs font-mono text-primary font-semibold">
                    {isGameFavorite(game) && <Star size={10} className="text-warning fill-warning" />}
                    {game.league}
                  </span>
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
