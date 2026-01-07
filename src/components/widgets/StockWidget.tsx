import { useState } from 'react';
import { X, TrendingUp, TrendingDown, Settings, Loader2 } from 'lucide-react';
import { useLiveStocks } from '@/hooks/useLiveStocks';

interface StockWidgetProps {
  onRemove: () => void;
  symbols?: string[];
}

export const StockWidget = ({ onRemove, symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META'] }: StockWidgetProps) => {
  const [editMode, setEditMode] = useState(false);
  const [customSymbols, setCustomSymbols] = useState(symbols.join(', '));
  
  const activeSymbols = customSymbols.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
  const { stocks, loading, error } = useLiveStocks(activeSymbols);

  return (
    <div className="widget h-full">
      <div className="widget-header">
        <span className="widget-title flex items-center gap-2">
          Stocks
          {loading && <Loader2 size={12} className="animate-spin text-muted-foreground" />}
        </span>
        <div className="flex gap-2">
          <button onClick={() => setEditMode(!editMode)} className="text-muted-foreground hover:text-primary transition-colors">
            <Settings size={16} />
          </button>
          <button onClick={onRemove} className="text-muted-foreground hover:text-destructive transition-colors">
            <X size={16} />
          </button>
        </div>
      </div>
      <div className="widget-content h-[calc(100%-52px)] overflow-auto scrollbar-thin">
        {editMode && (
          <div className="mb-4">
            <input
              type="text"
              value={customSymbols}
              onChange={(e) => setCustomSymbols(e.target.value)}
              className="w-full bg-secondary border border-border rounded px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="AAPL, GOOGL, MSFT..."
            />
          </div>
        )}
        {error && (
          <div className="text-xs text-destructive p-2 bg-destructive/10 rounded mb-2">
            {error}
          </div>
        )}
        <div className="space-y-2">
          {stocks.map((stock) => (
            <div key={stock.symbol} className="flex items-center justify-between p-3 bg-secondary/50 rounded border border-border/50 hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-3">
                {stock.change >= 0 ? (
                  <TrendingUp className="text-success" size={18} />
                ) : (
                  <TrendingDown className="text-destructive" size={18} />
                )}
                <span className="font-mono font-semibold text-primary">{stock.symbol}</span>
              </div>
              <div className="text-right">
                <div className="font-mono font-bold">${stock.price.toFixed(2)}</div>
                <div className={`font-mono text-xs ${stock.change >= 0 ? 'ticker-positive' : 'ticker-negative'}`}>
                  {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent}%)
                </div>
              </div>
            </div>
          ))}
          {loading && stocks.length === 0 && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin text-primary" size={24} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
