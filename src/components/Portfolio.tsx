'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, DollarSign, Wallet, RefreshCw } from 'lucide-react';
import { useAccount } from 'wagmi';
import { setOnchainKitConfig } from '@coinbase/onchainkit';
import { getPortfolios } from '@coinbase/onchainkit/api';
import type { APIError } from '@/app/types/api';

interface TokenBalance {
  address: string;
  symbol: string;
  name: string;
  balance: string;
  value: string;
  change24h: number;
}

interface PortfolioData {
  totalValue: number;
  totalChange24h: number;
  tokens: TokenBalance[];
}

export function Portfolio() {
  const { address, isConnected } = useAccount();
  const [portfolio, setPortfolio] = useState<PortfolioData>({
    totalValue: 0,
    totalChange24h: 0,
    tokens: []
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Mock data for demo - in production this would come from OnchainKit APIs
  const mockPortfolioData: PortfolioData = {
    totalValue: 12847.32,
    totalChange24h: 5.67,
    tokens: [
      {
        address: '0x',
        symbol: 'ETH',
        name: 'Ethereum',
        balance: '3.45',
        value: '8,234.50',
        change24h: 4.2
      },
      {
        address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
        symbol: 'USDC',
        name: 'USD Coin',
        balance: '2,450.00',
        value: '2,450.00',
        change24h: 0.1
      },
      {
        address: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
        symbol: 'DEGEN',
        name: 'Degen',
        balance: '15,000.00',
        value: '1,875.50',
        change24h: 12.8
      },
      {
        address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        symbol: 'DAI',
        name: 'Dai',
        balance: '287.32',
        value: '287.32',
        change24h: -0.05
      }
    ]
  };

  const fetchPortfolio = async () => {
    if (!isConnected || !address) {
      setPortfolio(mockPortfolioData);
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      // Initialize OnchainKit config
      setOnchainKitConfig({
        apiKey: 'EUK6nliWVdB5Nkt4VuNXUsAV7VwBmtwR',
      });

      const response = await getPortfolios({
        addresses: [address],
      });

      if ('error' in response) {
        throw new Error((response as APIError).message);
      }

      if (response.portfolios && response.portfolios.length > 0) {
        const portfolioData = response.portfolios[0];
        
        const formattedTokens: TokenBalance[] = portfolioData.tokenBalances.map(token => ({
          address: token.address,
          symbol: token.symbol,
          name: token.name,
          balance: token.cryptoBalance.toFixed(6),
          value: token.fiatBalance.toFixed(2),
          change24h: Math.random() * 20 - 10 // Mock 24h change
        }));

        setPortfolio({
          totalValue: portfolioData.portfolioBalanceInUsd,
          totalChange24h: Math.random() * 10 - 5, // Mock total change
          tokens: formattedTokens
        });
      } else {
        // Use mock data if no portfolio found
        setPortfolio(mockPortfolioData);
      }
    } catch (err) {
      console.error('Error fetching portfolio:', err);
      setError('Failed to load portfolio data');
      // Use mock data on error
      setPortfolio(mockPortfolioData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, [address, isConnected]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (change: number) => {
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
      {/* Portfolio Overview */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-blue-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-green-600" />
              Portfolio Overview
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={fetchPortfolio}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Total Value */}
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">
                {formatCurrency(portfolio.totalValue)}
              </div>
              <div className="flex items-center justify-center mt-1">
                {formatPercentage(portfolio.totalChange24h)}
                <span className="text-sm text-gray-600 ml-2">24h</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-sm text-gray-600">Assets</div>
                <div className="text-lg font-semibold">{portfolio.tokens.length}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Best Performer</div>
                <div className="text-sm font-semibold text-green-600">
                  {portfolio.tokens.length > 0 
                    ? portfolio.tokens.reduce((prev, current) => 
                        prev.change24h > current.change24h ? prev : current
                      ).symbol
                    : '--'
                  }
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Status</div>
                <Badge variant={portfolio.totalChange24h >= 0 ? "default" : "destructive"}>
                  {portfolio.totalChange24h >= 0 ? "Gaining" : "Losing"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Token Holdings */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-blue-600" />
            Token Holdings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="list" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="chart">Chart View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list" className="space-y-4 mt-4">
              {portfolio.tokens.map((token, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                      {token.symbol.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold">{token.symbol}</div>
                      <div className="text-sm text-gray-600">{token.name}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold">{token.balance}</div>
                    <div className="text-sm text-gray-600">${token.value}</div>
                  </div>
                  
                  <div className="text-right">
                    {formatPercentage(token.change24h)}
                  </div>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="chart" className="mt-4">
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center text-gray-500">
                  <div className="mb-2">📊</div>
                  <div>Portfolio chart visualization</div>
                  <div className="text-sm">Coming soon...</div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-red-600 text-center">{error}</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
💬 4. Crypto Chat Component
src/components/CryptoChat.tsx - XMTP Messaging Interface
'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Send, Users, TrendingUp, Wifi, WifiOff } from 'lucide-react';
import { useXMTPClient } from '@/providers/XMTPProvider';
import { createWalletClient, custom } from 'viem';
import { mainnet } from 'viem/chains';
import { toBytes } from 'viem';

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  type: 'text' | 'trade' | 'price';
}

interface ChatRoom {
  id: string;
  name: string;
  members: number;
  topic: string;
}

export function CryptoChat() {
  const { client, initClient, isLoading, error } = useXMTPClient();
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [activeRoom, setActiveRoom] = useState<string>('general');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock chat rooms
  const chatRooms: ChatRoom[] = [
    { id: 'general', name: 'General Trading', members: 1247, topic: 'General crypto discussion' },
    { id: 'defi', name: 'DeFi Alpha', members: 892, topic: 'DeFi protocols and yield farming' },
    { id: 'nft', name: 'NFT Trades', members: 634, topic: 'NFT trading and collections' },
    { id: 'analysis', name: 'Technical Analysis', members: 456, topic: 'Charts and market analysis' },
  ];

  // Mock messages for demo
  const mockMessages: Message[] = [
    {
      id: '1',
      content: 'ETH looking bullish today! 🚀',
      sender: '0x1234...5678',
      timestamp: new Date(Date.now() - 300000),
      type: 'text'
    },
    {
      id: '2',
      content: 'Just swapped 1000 USDC for ETH at $2,456',
      sender: '0xabcd...ef01',
      timestamp: new Date(Date.now() - 240000),
      type: 'trade'
    },
    {
      id: '3',
      content: 'DEGEN up 15% in the last hour! 📈',
      sender: '0x5678...9abc',
      timestamp: new Date(Date.now() - 180000),
      type: 'price'
    },
    {
      id: '4',
      content: 'Anyone using the new Base DeFi protocols?',
      sender: '0xdef0...2345',
      timestamp: new Date(Date.now() - 120000),
      type: 'text'
    },
    {
      id: '5',
      content: 'Perfect entry point for USDC/ETH pair right now',
      sender: '0x9876...5432',
      timestamp: new Date(Date.now() - 60000),
      type: 'text'
    }
  ];

  useEffect(() => {
    setMessages(mockMessages);
  }, [activeRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const connectToXMTP = async () => {
    if (!window.ethereum) {
      alert('Please install MetaMask or another Web3 wallet');
      return;
    }

    setIsConnecting(true);
    try {
      // Create wallet client
      const walletClient = createWalletClient({
        chain: mainnet,
        transport: custom(window.ethereum),
      });

      // Request accounts
      const accounts = await walletClient.request({
        method: 'eth_requestAccounts',
        params: [],
      });

      if (accounts && accounts.length > 0) {
        const accountAddress = accounts[0] as `0x${string}`;
        
        // Create XMTP signer
        const signer = {
          type: 'EOA' as const,
          getIdentifier: () => ({
            identifier: accountAddress.toLowerCase(),
            identifierKind: 'Ethereum' as const,
          }),
          signMessage: async (message: string) => {
            const signature = await walletClient.signMessage({
              account: accountAddress,
              message,
            });
            return toBytes(signature);
          },
        };

        await initClient(signer, 'dev');
      }
    } catch (err) {
      console.error('Failed to connect to XMTP:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: client?.inboxId || 'You',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'trade':
        return '💰';
      case 'price':
        return '📊';
      default:
        return '💬';
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const truncateAddress = (address: string) => {
    if (address === 'You') return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card className="shadow-lg border-0">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {client ? (
                <>
                  <Wifi className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Connected to XMTP</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-500">Not connected</span>
                </>
              )}
            </div>
            {!client && (
              <Button 
                onClick={connectToXMTP} 
                disabled={isConnecting || isLoading}
                size="sm"
              >
                {isConnecting || isLoading ? 'Connecting...' : 'Connect to Chat'}
              </Button>
            )}
          </div>
          {error && (
            <div className="mt-2 text-sm text-red-600">{error}</div>
          )}
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="shadow-lg border-0">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-blue-600" />
            Crypto Trading Chat
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeRoom} onValueChange={setActiveRoom}>
            <TabsList className="grid w-full grid-cols-4">
              {chatRooms.map((room) => (
                <TabsTrigger key={room.id} value={room.id} className="text-xs">
                  {room.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {chatRooms.map((room) => (
              <TabsContent key={room.id} value={room.id} className="mt-4">
                <div className="space-y-4">
                  {/* Room Info */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-semibold text-sm">{room.name}</div>
                      <div className="text-xs text-gray-600">{room.topic}</div>
                    </div>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {room.members}
                    </Badge>
                  </div>

                  {/* Messages */}
                  <div className="h-80 overflow-y-auto border rounded-lg p-4 space-y-3">
                    {messages.map((message) => (
                      <div key={message.id} className="flex gap-3">
                        <div className="text-lg">{getMessageIcon(message.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">
                              {truncateAddress(message.sender)}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatTime(message.timestamp)}
                            </span>
                            {message.type === 'trade' && (
                              <Badge variant="outline" className="text-xs">
                                <TrendingUp className="h-2 w-2 mr-1" />
                                Trade
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-900 break-words">
                            {message.content}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message... (Press Enter to send)"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={!client}
                    />
                    <Button 
                      onClick={sendMessage} 
                      disabled={!newMessage.trim() || !client}
                      size="sm"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>

                  {!client && (
                    <div className="text-center text-sm text-gray-500 py-4">
                      Connect to XMTP to start chatting with other traders
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}