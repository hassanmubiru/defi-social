'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WalletDefault } from '@coinbase/onchainkit/wallet';
import { Avatar, Identity, Name, Address, EthBalance } from '@coinbase/onchainkit/identity';
import { ConnectWallet, WalletDropdown, WalletDropdownDisconnect } from '@coinbase/onchainkit/wallet';
import { DeFiSwap } from '@/components/DeFiSwap';
import { Portfolio } from '@/components/Portfolio';
import { CryptoChat } from '@/components/CryptoChat';
import { MarketData } from '@/components/MarketData';
import { XMTPProvider } from '@/providers/XMTPProvider';
import { sdk } from '@farcaster/miniapp-sdk'
import { 
  ArrowLeftRight, 
  Wallet, 
  MessageCircle, 
  TrendingUp, 
  Sparkles,
  Globe,
  Shield,
  Zap
} from 'lucide-react';

export default function DeFiMiniApp() {
  useEffect(() => {
    const initializeFarcaster = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 100))
        
        if (document.readyState !== 'complete') {
          await new Promise(resolve => {
            if (document.readyState === 'complete') {
              resolve(void 0)
            } else {
              window.addEventListener('load', () => resolve(void 0), { once: true })
            }
          })
        }
        
        await sdk.actions.ready()
        console.log('Farcaster SDK initialized successfully - app fully loaded')
      } catch (error) {
        console.error('Failed to initialize Farcaster SDK:', error)
        setTimeout(async () => {
          try {
            await sdk.actions.ready()
            console.log('Farcaster SDK initialized on retry')
          } catch (retryError) {
            console.error('Farcaster SDK retry failed:', retryError)
          }
        }, 1000)
      }
    }

    initializeFarcaster()
  }, [])
  const [activeTab, setActiveTab] = useState<string>('swap');

  const features = [
    {
      icon: <ArrowLeftRight className="h-6 w-6 text-blue-600" />,
      title: 'Token Swaps',
      description: 'Trade crypto with best rates from multiple DEXs'
    },
    {
      icon: <Wallet className="h-6 w-6 text-green-600" />,
      title: 'Portfolio Tracking',
      description: 'Monitor your holdings and performance in real-time'
    },
    {
      icon: <MessageCircle className="h-6 w-6 text-purple-600" />,
      title: 'Crypto Chat',
      description: 'Discuss trades and strategies with other DeFi users'
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-orange-600" />,
      title: 'Live Market Data',
      description: 'Stay updated with real-time price feeds and analytics'
    }
  ];

  return (
    <XMTPProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    DeFi Social
                  </h1>
                  <p className="text-sm text-gray-600">Trade, Chat, Connect</p>
                </div>
              </div>
              
              {/* Wallet Connection */}
              <div className="flex items-center gap-4">
                <WalletDefault />
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative py-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              DeFi Meets Social Trading
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              The future of onchain finance - seamlessly integrated into messaging platforms. 
              Trade tokens, track portfolios, and chat with fellow crypto enthusiasts all in one place.
            </p>
            
            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {features.map((feature, index) => (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300 border-0 bg-white/50 backdrop-blur-sm">
                  <CardContent className="p-0">
                    <div className="mb-4">{feature.icon}</div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Value Props */}
            <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span>Secure & Decentralized</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-600" />
                <span>Cross-Chain Compatible</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-purple-600" />
                <span>Instant Settlement</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/50 backdrop-blur-sm">
              <TabsTrigger value="swap" className="flex items-center gap-2">
                <ArrowLeftRight className="h-4 w-4" />
                <span className="hidden sm:inline">Swap</span>
              </TabsTrigger>
              <TabsTrigger value="portfolio" className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                <span className="hidden sm:inline">Portfolio</span>
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Chat</span>
              </TabsTrigger>
              <TabsTrigger value="market" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Market</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="swap" className="space-y-6">
              <DeFiSwap />
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-6">
              <Portfolio />
            </TabsContent>

            <TabsContent value="chat" className="space-y-6">
              <CryptoChat />
            </TabsContent>

            <TabsContent value="market" className="space-y-6">
              <MarketData />
            </TabsContent>
          </Tabs>
        </main>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <p className="text-sm opacity-90">
                Built with OnchainKit SDK v1.0.0-alpha.13 by Modu on Ohara
              </p>
              <p className="text-xs opacity-75 mt-2">
                Bringing DeFi to the masses through familiar messaging platforms
              </p>
            </div>
          </div>
        </footer>
      </div>
    </XMTPProvider>
  );
}