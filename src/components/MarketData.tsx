'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, BarChart3, Activity, RefreshCw, Star } from 'lucide-react';

interface MarketItem {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  isWatching?: boolean;
}

interface TradingPair {
  pair: string;
  price: number;
  change24h: number;
  volume: number;
  high24h: number;
  low24h: number;
}

export function MarketData() {
  const [topTokens, setTopTokens] = useState<MarketItem[]>([]);
  const [trendingPairs, setTrendingPairs] = useState<TradingPair[]>([]);
  const [watchlist, setWatchlist] = useState<MarketItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Mock market data - in production this would come from real APIs
  const mockTopTokens: MarketItem[] = [
    {
      symbol: 'ETH',
      name: 'Ethereum',
      price: 2456.78,
      change24h: 4.2,
      volume24h: 15670000000,
      marketCap: 295000000000
    },
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 43210.45,
      change24h: -1.8,
      volume24h: 28450000000,
      marketCap: 847000000000
    },
    {
      symbol: 'USDC',
      name: 'USD Coin',
      price: 1.00,
      change24h: 0.1,
      volume24h: 6780000000,
      marketCap: 32500000000
    },
    {
      symbol: 'DEGEN',
      name: 'Degen',
      price: 0.125,
      change24h: 12.8,
      volume24h: 45600000,
      marketCap: 125000000
    },
    {
      symbol: 'USDT',
      name: 'Tether',
      price: 0.9998,
      change24h: -0.02,
      volume24h: 42300000000,
      marketCap: 91800000000
    }
  ];

  const mockTrendingPairs: TradingPair[] = [
    {
      pair: 'ETH/USDC',
      price: 2456.78,
      change24h: 4.2,
      volume: 1567000000,
      high24h: 2478.90,
      low24h: 2398.45
    },
    {
      pair: 'DEGEN/ETH',
      price: 0.0000508,
      change24h: 15.6,
      volume: 8950000,
      high24h: 0.0000521,
      low24h: 0.0000445
    },
    {
      pair: 'WBTC/ETH',
      price: 17.58,
      change24h: -5.9,
      volume: 125000000,
      high24h: 18.12,
      low24h: 17.45
    },
    {
      pair: 'DAI/USDC',
      price: 0.9998,
      change24h: 0.05,
      volume: 456000000,
      high24h: 1.0012,
      low24h: 0.9985
    }
  ];

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchMarketData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add some random variation to simulate live data
      const updatedTokens = mockTopTokens.map(token => ({
        ...token,
        price: token.price * (1 + (Math.random() - 0.5) * 0.02), // ±1% variation
        change24h: token.change24h + (Math.random() - 0.5) * 0.5, // ±0.25% variation
      }));

      const updatedPairs = mockTrendingPairs.map(pair => ({
        ...pair,
        price: pair.price * (1 + (Math.random() - 0.5) * 0.02),
        change24h: pair.change24h + (Math.random() - 0.5) * 0.5,
      }));

      setTopTokens(updatedTokens);
      setTrendingPairs(updatedPairs);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching market data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleWatchlist = (token: MarketItem) => {
    const isInWatchlist = watchlist.some(item => item.symbol === token.symbol);
    
    if (isInWatchlist) {
      setWatchlist(prev => prev.filter(item => item.symbol !== token.symbol));
    } else {
      setWatchlist(prev => [...prev, { ...token, isWatching: true }]);
    }
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    if (currency === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: amount < 1 ? 6 : 2
      }).format(amount);
    }
    return amount.toLocaleString('en-US', { maximumFractionDigits: 8 });
  };

  const formatLargeNumber = (num: number) => {
    if (num >= 1e9) {
      return `$${(num / 1e9).toFixed(2)}B`;
    } else if (num >= 1e6) {
      return `$${(num / 1e6).toFixed(2)}M`;
    } else if (num >= 1e3) {
      return `$${(num / 1e3).toFixed(2)}K`;
    }
    return `$${num.toFixed(2)}`;
  };

  const renderChangeIndicator = (change: number) => {
    const isPositive = change >= 0;
    return (
      <div className={`flex items-center gap-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        {Math.abs(change).toFixed(2)}%
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Market Overview Header */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              Live Market Data
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                Updated: {lastUpdate.toLocaleTimeString()}
              </span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={fetchMarketData}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-sm text-gray-600">Total Market Cap</div>
              <div className="text-lg font-bold">$2.18T</div>
              <div className="text-xs text-green-600">+2.4%</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">24h Volume</div>
              <div className="text-lg font-bold">$89.5B</div>
              <div className="text-xs text-red-600">-8.1%</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">DeFi TVL</div>
              <div className="text-lg font-bold">$78.9B</div>
              <div className="text-xs text-green-600">+1.2%</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Active Traders</div>
              <div className="text-lg font-bold">1.2M</div>
              <div className="text-xs text-green-600">+15.6%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Data Tabs */}
      <Card className="shadow-lg border-0">
        <CardContent className="p-0">
          <Tabs defaultValue="tokens" className="w-full">
            <div className="px-6 pt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="tokens">Top Tokens</TabsTrigger>
                <TabsTrigger value="pairs">Trading Pairs</TabsTrigger>
                <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="tokens" className="px-6 pb-6">
              <div className="space-y-3 mt-4">
                {topTokens.map((token, index) => (
                  <div key={token.symbol} className="flex items-center justify-between p-4 rounded-lg border bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium text-gray-500">#{index + 1}</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleWatchlist(token)}
                          className="p-1 h-auto"
                        >
                          <Star 
                            className={`h-4 w-4 ${
                              watchlist.some(item => item.symbol === token.symbol) 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'text-gray-400'
                            }`} 
                          />
                        </Button>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                        {token.symbol.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold">{token.symbol}</div>
                        <div className="text-sm text-gray-600">{token.name}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(token.price)}</div>
                      {renderChangeIndicator(token.change24h)}
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Vol: {formatLargeNumber(token.volume24h)}</div>
                      <div className="text-sm text-gray-600">Cap: {formatLargeNumber(token.marketCap)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="pairs" className="px-6 pb-6">
              <div className="space-y-3 mt-4">
                {trendingPairs.map((pair, index) => (
                  <div key={pair.pair} className="flex items-center justify-between p-4 rounded-lg border bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-blue-500" />
                        <div className="font-semibold">{pair.pair}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(pair.price, 'crypto')}</div>
                      {renderChangeIndicator(pair.change24h)}
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-gray-600">H: {formatCurrency(pair.high24h, 'crypto')}</div>
                      <div className="text-sm text-gray-600">L: {formatCurrency(pair.low24h, 'crypto')}</div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Volume</div>
                      <div className="text-sm font-medium">{formatLargeNumber(pair.volume)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="watchlist" className="px-6 pb-6">
              <div className="mt-4">
                {watchlist.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <div className="text-lg font-medium">No tokens in watchlist</div>
                    <div className="text-sm">Click the star icon on tokens to add them here</div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {watchlist.map((token, index) => (
                      <div key={token.symbol} className="flex items-center justify-between p-4 rounded-lg border bg-yellow-50 hover:bg-yellow-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleWatchlist(token)}
                            className="p-1 h-auto"
                          >
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          </Button>
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                            {token.symbol.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold">{token.symbol}</div>
                            <div className="text-sm text-gray-600">{token.name}</div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(token.price)}</div>
                          {renderChangeIndicator(token.change24h)}
                        </div>
                        
                        <div className="text-right">
                          <Badge variant={token.change24h >= 0 ? "default" : "destructive"}>
                            {token.change24h >= 0 ? "Gaining" : "Losing"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}