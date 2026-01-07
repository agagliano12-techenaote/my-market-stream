import { useState, useEffect } from 'react';
import { Widget, WidgetType } from '@/types/widget';
import { ClockWidget } from './widgets/ClockWidget';
import { StockWidget } from './widgets/StockWidget';
import { NewsWidget } from './widgets/NewsWidget';
import { InstagramWidget } from './widgets/InstagramWidget';
import { SportsScoresWidget } from './widgets/SportsScoresWidget';
import { SportsTickerWidget } from './widgets/SportsTickerWidget';
import { NotesWidget } from './widgets/NotesWidget';
import { AddWidgetButton } from './AddWidgetButton';
import { LayoutGrid, Tv } from 'lucide-react';
import { useLiveStocks } from '@/hooks/useLiveStocks';

const defaultWidgets: Widget[] = [
  { id: '1', type: 'clock', title: 'Clock' },
  { id: '2', type: 'stock', title: 'Stocks' },
  { id: '3', type: 'news', title: 'News' },
  { id: '4', type: 'sports-scores', title: 'Sports Scores' },
];

export const Dashboard = () => {
  const [widgets, setWidgets] = useState<Widget[]>(() => {
    const saved = localStorage.getItem('dashboard-widgets');
    return saved ? JSON.parse(saved) : defaultWidgets;
  });
  
  const { stocks } = useLiveStocks(['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META']);

  useEffect(() => {
    localStorage.setItem('dashboard-widgets', JSON.stringify(widgets));
  }, [widgets]);

  const addWidget = (type: WidgetType) => {
    const newWidget: Widget = {
      id: Date.now().toString(),
      type,
      title: type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' '),
    };
    setWidgets([...widgets, newWidget]);
  };

  const removeWidget = (id: string) => {
    setWidgets(widgets.filter(w => w.id !== id));
  };

  const renderWidget = (widget: Widget) => {
    const props = { onRemove: () => removeWidget(widget.id) };
    
    switch (widget.type) {
      case 'clock':
        return <ClockWidget {...props} />;
      case 'stock':
        return <StockWidget {...props} />;
      case 'news':
        return <NewsWidget {...props} />;
      case 'instagram':
        return <InstagramWidget {...props} />;
      case 'sports-scores':
        return <SportsScoresWidget {...props} />;
      case 'sports-ticker':
        return <SportsTickerWidget {...props} />;
      case 'notes':
        return <NotesWidget {...props} />;
      default:
        return null;
    }
  };

  const getGridClass = () => {
    const count = widgets.length;
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-1 md:grid-cols-2';
    if (count <= 4) return 'grid-cols-1 md:grid-cols-2';
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
  };

  // Generate ticker content from live stocks
  const tickerContent = stocks.length > 0 
    ? stocks.map(stock => (
        `<span class="text-primary">${stock.symbol}</span> $${stock.price.toFixed(2)} <span class="${stock.change >= 0 ? 'text-success' : 'text-destructive'}">${stock.change >= 0 ? '+' : ''}${stock.changePercent}%</span>`
      )).join(' • ')
    : 'Loading stock data...';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <Tv className="text-primary" size={24} />
            </div>
            <div>
              <h1 className="font-mono font-bold text-lg text-primary tracking-tight">SURVEILLANCE</h1>
              <p className="text-xs text-muted-foreground font-mono">LIVE DASHBOARD</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground font-mono">
              <LayoutGrid size={14} />
              <span>{widgets.length} widgets</span>
            </div>
            <AddWidgetButton onAddWidget={addWidget} />
          </div>
        </div>
      </header>

      {/* Dashboard Grid */}
      <main className="container py-6 pb-16">
        {widgets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="p-6 rounded-xl bg-card border border-border mb-6">
              <LayoutGrid className="text-muted-foreground" size={48} />
            </div>
            <h2 className="text-xl font-semibold mb-2">No Widgets</h2>
            <p className="text-muted-foreground mb-6">Add widgets to customize your dashboard</p>
            <AddWidgetButton onAddWidget={addWidget} />
          </div>
        ) : (
          <div className={`grid ${getGridClass()} gap-4 auto-rows-[300px]`}>
            {widgets.map((widget) => (
              <div key={widget.id} className="min-h-[300px]">
                {renderWidget(widget)}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer Ticker */}
      <footer className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border py-2 z-20">
        <div className="overflow-hidden">
          <div 
            className="animate-ticker whitespace-nowrap font-mono text-xs text-muted-foreground"
            dangerouslySetInnerHTML={{ 
              __html: tickerContent + ' • ' + tickerContent 
            }}
          />
        </div>
      </footer>
    </div>
  );
};
