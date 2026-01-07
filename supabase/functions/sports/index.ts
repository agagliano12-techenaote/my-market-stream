import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// TheSportsDB league IDs
const leagueIds: Record<string, string> = {
  'NBA': '4387',
  'NFL': '4391',
  'NHL': '4380',
  'MLB': '4424',
  'EPL': '4328',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { league } = await req.json().catch(() => ({}));

    const leaguesToFetch = league && league !== 'All' ? [league] : Object.keys(leagueIds);
    const scores: any[] = [];

    for (const leagueName of leaguesToFetch) {
      const leagueId = leagueIds[leagueName];
      if (!leagueId) continue;

      try {
        // Fetch live events for this league (free API endpoint)
        const response = await fetch(
          `https://www.thesportsdb.com/api/v1/json/3/eventspastleague.php?id=${leagueId}`
        );
        const data = await response.json();

        if (data.events && Array.isArray(data.events)) {
          // Get the most recent events (last 5)
          const recentEvents = data.events.slice(0, 5);

          for (const event of recentEvents) {
            scores.push({
              id: event.idEvent,
              league: leagueName,
              homeTeam: event.strHomeTeam,
              awayTeam: event.strAwayTeam,
              homeScore: parseInt(event.intHomeScore) || 0,
              awayScore: parseInt(event.intAwayScore) || 0,
              status: event.strStatus || 'Final',
              date: event.dateEvent,
            });
          }
        }
      } catch (e) {
        console.error(`Error fetching ${leagueName}:`, e);
      }
    }

    console.log(`Fetched ${scores.length} sports scores`);

    return new Response(JSON.stringify({ scores }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error fetching sports:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
