import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('FINNHUB_API_KEY');
    if (!apiKey) {
      throw new Error('FINNHUB_API_KEY not configured');
    }

    const { symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META'] } = await req.json().catch(() => ({}));

    const stockPromises = symbols.map(async (symbol: string) => {
      const response = await fetch(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`
      );
      const data = await response.json();
      
      const price = typeof data.c === 'number' ? data.c : null;
      const previousClose = typeof data.pc === 'number' ? data.pc : null;

      // Skip if no valid data
      if (price === null || previousClose === null) {
        console.log(`No data for symbol ${symbol}:`, data);
        return null;
      }

      const change = price - previousClose;
      const changePercent = previousClose > 0 ? (change / previousClose) * 100 : 0;

      return {
        symbol,
        price: Math.round(price * 100) / 100,
        change: Math.round(change * 100) / 100,
        changePercent: Math.round(changePercent * 100) / 100,
      };
    });

    const stocks = (await Promise.all(stockPromises)).filter(Boolean);

    console.log(`Fetched ${stocks.length} stock quotes`);

    return new Response(JSON.stringify({ stocks }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error fetching stocks:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
