import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { StockData } from '@/types/widget';

export const useLiveStocks = (symbols: string[] = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META']) => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStocks = useCallback(async () => {
    try {
      const { data, error: fnError } = await supabase.functions.invoke('stocks', {
        body: { symbols },
      });

      if (fnError) throw fnError;

      if (data?.stocks) {
        setStocks(data.stocks);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching stocks:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch stocks');
    } finally {
      setLoading(false);
    }
  }, [symbols.join(',')]);

  useEffect(() => {
    fetchStocks();
    const interval = setInterval(fetchStocks, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, [fetchStocks]);

  return { stocks, loading, error, refetch: fetchStocks };
};
