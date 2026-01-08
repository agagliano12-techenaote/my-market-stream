import { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, Settings, Loader2, Save, Plus, Trash2 } from 'lucide-react';
import { useLiveStocks } from '@/hooks/useLiveStocks';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface StockWidgetProps {
  onRemove: () => void;
}

const defaultSymbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META'];

export const StockWidget = ({ onRemove }: StockWidgetProps) => {
  const [savedSymbols, setSavedSymbols] = useLocalStorage<string[]>('dashboard-stock-symbols', defaultSymbols);
  const [editMode, setEditMode] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  const { stocks, loading, error } = useLiveStocks(savedSymbols);

  const addSymbol = () => {
    const symbol = inputValue.trim().toUpperCase();
    if (symbol && !savedSymbols.includes(symbol)) {
      setSavedSymbols([...savedSymbols, symbol]);
      setInputValue('');
    }
  };

  const removeSymbol = (symbol: string) => {
    setSavedSymbols(savedSymbols.filter(s => s !== symbol));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addSymbol();
    }
  };

  return (
    <div className="widget h-full">
      <div className="widget-header">
        <span className="widget-title flex items-center gap-2">
          Stocks
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
      <div className="widget-content h-[calc(100%-52px)] overflow-auto scrollbar-thin">
        {editMode && (
          <div className="mb-4 p-3 bg-secondary/50 rounded border border-border">
            <p className="text-xs text-muted-foreground mb-2 font-mono">Manage your stocks:</p>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value.toUpperCase())}
                onKeyDown={handleKeyDown}
                placeholder="Add symbol..."
                className="flex-1 bg-background border border-border rounded px-3 py-1.5 text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                maxLength={10}
              />
              <button
                onClick={addSymbol}
                className="px-3 py-1.5 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {savedSymbols.map(symbol => (
                <span key={symbol} className="flex items-center gap-1 px-2 py-1 bg-background border border-border rounded text-xs font-mono">
                  {symbol}
                  <button onClick={() => removeSymbol(symbol)} className="text-muted-foreground hover:text-destructive">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
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
