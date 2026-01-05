import { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, Settings } from 'lucide-react';
import { StockData } from '@/types/widget';

interface StockWidgetProps {
  onRemove: () => void;
  symbols?: string[];
}

const generateMockStockData = (symbol: string): StockData => {
  const basePrice = Math.random() * 500 + 50;
  const change = (Math.random() - 0.5) * 20;
  return {
    symbol,
    price: parseFloat(basePrice.toFixed(2)),
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(((change / basePrice) * 100).toFixed(2)),
  };
};

export const StockWidget = ({ onRemove, symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META'] }: StockWidgetProps) => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [customSymbols, setCustomSymbols] = useState(symbols.join(', '));

  useEffect(() => {
    const updateStocks = () => {
      const activeSymbols = customSymbols.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
      setStocks(activeSymbols.map(generateMockStockData));
    };
    
    updateStocks();
    const interval = setInterval(updateStocks, 3000);
    return () => clearInterval(interval);
  }, [customSymbols]);

  return (
    <div className="widget h-full">
      <div className="widget-header">
        <span className="widget-title">Stocks</span>
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
        </div>
      </div>
    </div>
  );
};
