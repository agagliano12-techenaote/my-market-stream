import { useState } from 'react';
import { X, ExternalLink, Loader2 } from 'lucide-react';
import { useLiveNews } from '@/hooks/useLiveNews';

interface NewsWidgetProps {
  onRemove: () => void;
}

export const NewsWidget = ({ onRemove }: NewsWidgetProps) => {
  const { news, loading, error } = useLiveNews();
  const [filter, setFilter] = useState<string>('All');

  const categories = ['All', 'Markets', 'Tech', 'Energy', 'Crypto', 'M&A'];
  const filteredNews = filter === 'All' ? news : news.filter(n => n.category === filter);

  return (
    <div className="widget h-full">
      <div className="widget-header">
        <span className="widget-title flex items-center gap-2">
          News
          {loading && <Loader2 size={12} className="animate-spin text-muted-foreground" />}
        </span>
        <button onClick={onRemove} className="text-muted-foreground hover:text-destructive transition-colors">
          <X size={16} />
        </button>
      </div>
      <div className="widget-content h-[calc(100%-52px)] flex flex-col">
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-thin">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 text-xs font-mono rounded border transition-colors whitespace-nowrap ${
                filter === cat
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-secondary border-border text-muted-foreground hover:text-foreground hover:border-primary/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        {error && (
          <div className="text-xs text-destructive p-2 bg-destructive/10 rounded mb-2">
            {error}
          </div>
        )}
        <div className="flex-1 overflow-auto scrollbar-thin space-y-3">
          {loading && filteredNews.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin text-primary" size={24} />
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No news found for {filter}
            </div>
          ) : (
            filteredNews.map((item) => (
              <div key={item.id} className="group p-3 bg-secondary/30 rounded border border-border/50 hover:border-primary/30 transition-all cursor-pointer">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-medium leading-tight group-hover:text-primary transition-colors">
                    {item.title}
                  </h4>
                  <ExternalLink size={14} className="text-muted-foreground flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground font-mono">
                  <span className="text-primary">{item.source}</span>
                  <span>•</span>
                  <span>{item.time}</span>
                  {item.category && (
                    <>
                      <span>•</span>
                      <span className="text-accent">{item.category}</span>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
