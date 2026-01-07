import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SportsScore } from '@/types/widget';

export const useLiveSports = (league: string = 'All') => {
  const [scores, setScores] = useState<SportsScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchScores = useCallback(async () => {
    try {
      const { data, error: fnError } = await supabase.functions.invoke('sports', {
        body: { league },
      });

      if (fnError) throw fnError;

      if (data?.scores) {
        setScores(data.scores);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching sports:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch sports');
    } finally {
      setLoading(false);
    }
  }, [league]);

  useEffect(() => {
    fetchScores();
    const interval = setInterval(fetchScores, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [fetchScores]);

  return { scores, loading, error, refetch: fetchScores };
};
