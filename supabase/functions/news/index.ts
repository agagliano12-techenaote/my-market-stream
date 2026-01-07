import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const categoryMap: Record<string, string> = {
  'Markets': 'business',
  'Tech': 'technology',
  'Energy': 'business',
  'Crypto': 'business',
  'M&A': 'business',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('NEWS_API_KEY');
    if (!apiKey) {
      throw new Error('NEWS_API_KEY not configured');
    }

    const { category = 'All' } = await req.json().catch(() => ({}));
    const apiCategory = category !== 'All' ? (categoryMap[category] || 'business') : 'business';

    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&category=${apiCategory}&pageSize=20&apiKey=${apiKey}`
    );
    const data = await response.json();

    if (data.status !== 'ok') {
      console.error('NewsAPI error:', data);
      throw new Error(data.message || 'Failed to fetch news');
    }

    const news = data.articles
      .filter((article: any) => article.title && article.title !== '[Removed]')
      .slice(0, 10)
      .map((article: any, index: number) => {
        const publishedAt = new Date(article.publishedAt);
        const now = new Date();
        const diffMs = now.getTime() - publishedAt.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);

        let timeAgo = '';
        if (diffMins < 60) {
          timeAgo = `${diffMins}m ago`;
        } else if (diffHours < 24) {
          timeAgo = `${diffHours}h ago`;
        } else {
          timeAgo = `${Math.floor(diffHours / 24)}d ago`;
        }

        // Assign categories based on content
        const title = article.title.toLowerCase();
        let assignedCategory = 'Markets';
        if (title.includes('tech') || title.includes('ai') || title.includes('software')) {
          assignedCategory = 'Tech';
        } else if (title.includes('oil') || title.includes('energy') || title.includes('gas')) {
          assignedCategory = 'Energy';
        } else if (title.includes('crypto') || title.includes('bitcoin')) {
          assignedCategory = 'Crypto';
        } else if (title.includes('merger') || title.includes('acquisition') || title.includes('deal')) {
          assignedCategory = 'M&A';
        }

        return {
          id: `${index}-${Date.now()}`,
          title: article.title,
          source: article.source?.name || 'Unknown',
          time: timeAgo,
          category: assignedCategory,
          url: article.url,
        };
      });

    console.log(`Fetched ${news.length} news articles`);

    return new Response(JSON.stringify({ news }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error fetching news:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
