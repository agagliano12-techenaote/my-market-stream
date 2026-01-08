import { useState } from 'react';
import { Plus, X, Clock, TrendingUp, Newspaper, Camera, Trophy, Radio, StickyNote, CheckSquare } from 'lucide-react';
import { WidgetType } from '@/types/widget';

interface AddWidgetButtonProps {
  onAddWidget: (type: WidgetType) => void;
}

const widgetOptions: { type: WidgetType; label: string; icon: React.ReactNode; description: string }[] = [
  { type: 'clock', label: 'Clock', icon: <Clock size={20} />, description: 'World time display' },
  { type: 'stock', label: 'Stocks', icon: <TrendingUp size={20} />, description: 'Live stock ticker' },
  { type: 'news', label: 'News', icon: <Newspaper size={20} />, description: 'Breaking headlines' },
  { type: 'instagram', label: 'Instagram', icon: <Camera size={20} />, description: 'Social feed' },
  { type: 'sports-scores', label: 'Sports Scores', icon: <Trophy size={20} />, description: 'Live game scores' },
  { type: 'sports-ticker', label: 'Sports Ticker', icon: <Radio size={20} />, description: 'Sports headlines' },
  { type: 'notes', label: 'Notes', icon: <StickyNote size={20} />, description: 'Quick notes' },
  { type: 'tasks', label: 'Tasks', icon: <CheckSquare size={20} />, description: 'Todo list' },
];

export const AddWidgetButton = ({ onAddWidget }: AddWidgetButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (type: WidgetType) => {
    onAddWidget(type);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors shadow-lg"
        style={{ boxShadow: 'var(--glow-primary)' }}
      >
        {isOpen ? <X size={18} /> : <Plus size={18} />}
        Add Widget
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 bg-card border border-border rounded-lg shadow-2xl z-50 overflow-hidden">
            <div className="p-3 border-b border-border">
              <h3 className="font-semibold text-sm text-primary font-mono">SELECT WIDGET</h3>
            </div>
            <div className="p-2 max-h-80 overflow-auto scrollbar-thin">
              {widgetOptions.map((option) => (
                <button
                  key={option.type}
                  onClick={() => handleSelect(option.type)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors text-left group"
                >
                  <div className="p-2 rounded-lg bg-secondary text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {option.icon}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{option.label}</div>
                    <div className="text-xs text-muted-foreground">{option.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
