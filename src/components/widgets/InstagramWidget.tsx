import { useState } from 'react';
import { X, Settings, Heart, MessageCircle, Image } from 'lucide-react';

interface InstagramWidgetProps {
  onRemove: () => void;
}

interface Post {
  id: string;
  username: string;
  imageUrl: string;
  likes: number;
  comments: number;
  caption: string;
}

const mockPosts: Post[] = [
  { id: '1', username: '@bloomberg', imageUrl: '', likes: 12453, comments: 234, caption: 'Markets update: S&P 500 reaches new highs...' },
  { id: '2', username: '@reuters', imageUrl: '', likes: 8932, comments: 156, caption: 'Breaking: Major policy announcement...' },
  { id: '3', username: '@wsj', imageUrl: '', likes: 15678, comments: 423, caption: 'Inside the latest tech revolution...' },
];

export const InstagramWidget = ({ onRemove }: InstagramWidgetProps) => {
  const [posts] = useState<Post[]>(mockPosts);
  const [feedHandle, setFeedHandle] = useState('@bloomberg');
  const [showSettings, setShowSettings] = useState(false);

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="widget h-full">
      <div className="widget-header">
        <span className="widget-title">Instagram Feed</span>
        <div className="flex gap-2">
          <button onClick={() => setShowSettings(!showSettings)} className="text-muted-foreground hover:text-primary transition-colors">
            <Settings size={16} />
          </button>
          <button onClick={onRemove} className="text-muted-foreground hover:text-destructive transition-colors">
            <X size={16} />
          </button>
        </div>
      </div>
      <div className="widget-content h-[calc(100%-52px)] flex flex-col overflow-auto scrollbar-thin">
        {showSettings && (
          <div className="mb-4">
            <input
              type="text"
              value={feedHandle}
              onChange={(e) => setFeedHandle(e.target.value)}
              className="w-full bg-secondary border border-border rounded px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="@username"
            />
          </div>
        )}
        <div className="text-sm text-muted-foreground mb-4 font-mono">
          Following: <span className="text-primary">{feedHandle}</span>
        </div>
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-secondary/30 rounded border border-border/50 overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
                <Image className="text-muted-foreground" size={32} />
              </div>
              <div className="p-3">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <span className="flex items-center gap-1">
                    <Heart size={14} className="text-destructive" />
                    {formatNumber(post.likes)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle size={14} />
                    {formatNumber(post.comments)}
                  </span>
                </div>
                <p className="text-xs text-foreground/80 line-clamp-2">
                  <span className="font-semibold text-primary">{post.username}</span> {post.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center mt-4 italic">
          Connect your Instagram API for live feed
        </p>
      </div>
    </div>
  );
};
