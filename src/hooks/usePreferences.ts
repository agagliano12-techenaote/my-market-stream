import { useLocalStorage } from './useLocalStorage';

export interface DashboardPreferences {
  stocks: string[];
  favoriteTeams: string[];
  favoriteLeagues: string[];
}

const defaultPreferences: DashboardPreferences = {
  stocks: ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META'],
  favoriteTeams: [],
  favoriteLeagues: ['NBA', 'NFL', 'NHL', 'MLB', 'EPL'],
};

export function usePreferences() {
  const [preferences, setPreferences] = useLocalStorage<DashboardPreferences>(
    'dashboard-preferences',
    defaultPreferences
  );

  const updateStocks = (stocks: string[]) => {
    setPreferences(prev => ({ ...prev, stocks }));
  };

  const updateFavoriteTeams = (teams: string[]) => {
    setPreferences(prev => ({ ...prev, favoriteTeams: teams }));
  };

  const updateFavoriteLeagues = (leagues: string[]) => {
    setPreferences(prev => ({ ...prev, favoriteLeagues: leagues }));
  };

  const addFavoriteTeam = (team: string) => {
    if (!preferences.favoriteTeams.includes(team)) {
      setPreferences(prev => ({ ...prev, favoriteTeams: [...prev.favoriteTeams, team] }));
    }
  };

  const removeFavoriteTeam = (team: string) => {
    setPreferences(prev => ({ 
      ...prev, 
      favoriteTeams: prev.favoriteTeams.filter(t => t !== team) 
    }));
  };

  const toggleLeague = (league: string) => {
    setPreferences(prev => ({
      ...prev,
      favoriteLeagues: prev.favoriteLeagues.includes(league)
        ? prev.favoriteLeagues.filter(l => l !== league)
        : [...prev.favoriteLeagues, league]
    }));
  };

  return {
    preferences,
    updateStocks,
    updateFavoriteTeams,
    updateFavoriteLeagues,
    addFavoriteTeam,
    removeFavoriteTeam,
    toggleLeague,
  };
}
