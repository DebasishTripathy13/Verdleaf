'use client';

import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect, useBalance } from 'wagmi';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, LogOut, Copy, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn, shortenAddress } from '@/lib/utils';

interface WalletConnectProps {
  className?: string;
  showBalance?: boolean;
}

export function WalletConnect({ className, showBalance = false }: WalletConnectProps) {
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });
  const [copied, setCopied] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  const openExplorer = () => {
    if (address && chain) {
      const explorerUrl = chain.blockExplorers?.default?.url;
      if (explorerUrl) {
        window.open(`${explorerUrl}/address/${address}`, '_blank');
      }
    }
  };
  
  if (!isConnected) {
    return (
      <ConnectButton.Custom>
        {({ openConnectModal }) => (
          <Button
            onClick={openConnectModal}
            variant="eco"
            className={cn('gap-2', className)}
          >
            <Wallet className="w-4 h-4" />
            Connect Wallet
          </Button>
        )}
      </ConnectButton.Custom>
    );
  }
  
  return (
    <div className="relative">
      <Button
        onClick={() => setShowDropdown(!showDropdown)}
        variant="outline"
        className={cn(
          'gap-2 border-emerald-500/30 hover:bg-emerald-500/10',
          className
        )}
      >
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="hidden sm:inline">{shortenAddress(address || '')}</span>
        <span className="sm:hidden"><Wallet className="w-4 h-4" /></span>
      </Button>
      
      <AnimatePresence>
        {showDropdown && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowDropdown(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 top-full mt-2 z-50"
            >
              <Card glass className="w-64">
                <CardContent className="p-4 space-y-4">
                  {/* Address */}
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Connected Wallet</p>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-white">
                        {shortenAddress(address || '')}
                      </span>
                      <button
                        onClick={copyAddress}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={openExplorer}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Network */}
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Network</p>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-white">{chain?.name || 'Unknown'}</span>
                    </div>
                  </div>
                  
                  {/* Balance */}
                  {showBalance && balance && (
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Balance</p>
                      <p className="text-white font-medium">
                        {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
                      </p>
                    </div>
                  )}
                  
                  {/* Disconnect */}
                  <button
                    onClick={() => {
                      disconnect();
                      setShowDropdown(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Disconnect
                  </button>
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
