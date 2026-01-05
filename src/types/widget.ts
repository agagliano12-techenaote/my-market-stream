export type WidgetType = 
  | 'stock'
  | 'news'
  | 'instagram'
  | 'sports-scores'
  | 'sports-ticker'
  | 'clock'
  | 'notes';

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  config?: Record<string, any>;
}

export interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  category?: string;
}

export interface SportsScore {
  id: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: string;
}
