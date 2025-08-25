'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { ArrowUpDown, TrendingUp, Zap } from 'lucide-react';
import { SwapDefault } from '@coinbase/onchainkit/swap';
import { getSwapPrice, listSupportedTokens, type Token } from '@/0x-api';
import type { Token as OnchainToken } from '@coinbase/onchainkit/token';

const SUPPORTED_TOKENS: OnchainToken[] = [
  {
    name: 'Ethereum',
    address: '',
    symbol: 'ETH',
    decimals: 18,
    image: 'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
    chainId: 8453,
  },
  {
    name: 'USDC',
    address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
    symbol: 'USDC',
    decimals: 6,
    image: 'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2',
    chainId: 8453,
  },
  {
    name: 'DEGEN',
    address: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
    symbol: 'DEGEN',
    decimals: 18,
    image: 'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/3b/bf/3bbf118b5e6dc2f9e7fc607a6e7526647b4ba8f0bea87125f971446d57b296d2-MDNmNjY0MmEtNGFiZi00N2I0LWIwMTItMDUyMzg2ZDZhMWNm',
    chainId: 8453,
  },
];

const QUICK_AMOUNTS = [10, 50, 100, 500];

export function DeFiSwap() {
  const [fromToken, setFromToken] = useState<OnchainToken>(SUPPORTED_TOKENS[0]);
  const [toToken, setToToken] = useState<OnchainToken>(SUPPORTED_TOKENS[1]);
  const [amount, setAmount] = useState<string>('');
  const [estimatedOutput, setEstimatedOutput] = useState<string>('');
  const [isLoadingPrice, setIsLoadingPrice] = useState<boolean>(false);
  const [priceImpact, setPriceImpact] = useState<string>('');

  // Get price estimate when amount changes
  useEffect(() => {
    const getPriceEstimate = async () => {
      if (!amount || parseFloat(amount) <= 0) {
        setEstimatedOutput('');
        return;
      }
      
      setIsLoadingPrice(true);
      try {
        const priceResponse = await getSwapPrice({
          chainId: 1, // Ethereum mainnet for 0x API
          buyToken: toToken.address === '' ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' : toToken.address,
          sellToken: fromToken.address === '' ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' : fromToken.address,
          sellAmount: parseFloat(amount),
          apiKey: 'secret_cm9gmm9tn00002v6u5nrv32kx'
        });

        if (!priceResponse.error && priceResponse.price) {
          const outputAmount = (parseFloat(amount) * parseFloat(priceResponse.price)).toFixed(6);
          setEstimatedOutput(outputAmount);
          setPriceImpact('<0.1%');
        }
      } catch (error) {
        console.error('Error fetching price:', error);
      } finally {
        setIsLoadingPrice(false);
      }
    };

    const timeoutId = setTimeout(getPriceEstimate, 500);
    return () => clearTimeout(timeoutId);
  }, [amount, fromToken, toToken]);

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setAmount('');
    setEstimatedOutput('');
  };

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString());
  };

  return (
    <div className="space-y-6">
      {/* Quick Swap Interface */}
      <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            Quick Swap
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* From Token */}
          <div className="space-y-2">
            <Label>From</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="0.0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-lg"
                />
              </div>
              <Select value={fromToken.symbol} onValueChange={(symbol) => {
                const token = SUPPORTED_TOKENS.find(t => t.symbol === symbol);
                if (token) setFromToken(token);
              }}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_TOKENS.map((token) => (
                    <SelectItem key={token.symbol} value={token.symbol}>
                      {token.symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              {QUICK_AMOUNTS.map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAmount(quickAmount)}
                  className="text-xs"
                >
                  {quickAmount}
                </Button>
              ))}
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSwapTokens}
              className="rounded-full p-2"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>

          {/* To Token */}
          <div className="space-y-2">
            <Label>To (estimated)</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="0.0"
                  value={isLoadingPrice ? 'Loading...' : estimatedOutput}
                  readOnly
                  className="text-lg bg-gray-50"
                />
              </div>
              <Select value={toToken.symbol} onValueChange={(symbol) => {
                const token = SUPPORTED_TOKENS.find(t => t.symbol === symbol);
                if (token) setToToken(token);
              }}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_TOKENS.map((token) => (
                    <SelectItem key={token.symbol} value={token.symbol}>
                      {token.symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {priceImpact && (
              <div className="text-sm text-gray-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Price Impact: {priceImpact}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* OnchainKit Swap Component */}
      <Card className="shadow-lg border-0">
        <CardHeader>
          <CardTitle>Advanced Trading</CardTitle>
        </CardHeader>
        <CardContent>
          <SwapDefault
            from={[SUPPORTED_TOKENS[0]]}
            to={[SUPPORTED_TOKENS[1]]}
          />
        </CardContent>
      </Card>
    </div>
  );
}