'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';

interface Message {
  id: string;
  role: 'user' | 'ecomon';
  content: string;
  timestamp: Date;
  mood?: string;
}

interface ChatInterfaceProps {
  ecomonName: string;
  ecomonAvatar?: string;
  userAvatar?: string;
  personality: string;
  onSendMessage: (message: string) => Promise<string>;
  className?: string;
}

export function ChatInterface({
  ecomonName,
  ecomonAvatar,
  userAvatar,
  personality,
  onSendMessage,
  className,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ecomon',
      content: `Hello, Guardian! I'm ${ecomonName}, your EcoMon companion! 🌱 How can I help you on your eco-journey today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);
  
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      const response = await onSendMessage(userMessage.content);
      
      const ecomonMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ecomon',
        content: response,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, ecomonMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ecomon',
        content: "Oh no, I'm feeling a bit tired right now. Can we try again in a moment? 😴",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <Card glass className={cn('flex flex-col h-[600px] max-w-2xl w-full', className)}>
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-white/10">
        <div className="relative">
          <Avatar className="w-10 h-10 border-2 border-emerald-500">
            <AvatarImage src={ecomonAvatar} />
            <AvatarFallback className="bg-emerald-500/20 text-emerald-400">
              🌱
            </AvatarFallback>
          </Avatar>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-gray-900"
          />
        </div>
        <div>
          <h3 className="font-semibold text-white">{ecomonName}</h3>
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            {personality} personality
          </p>
        </div>
      </div>
      
      {/* Messages */}
      <ScrollArea ref={scrollRef} className="flex-1 p-4">
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  'flex gap-3',
                  message.role === 'user' ? 'flex-row-reverse' : ''
                )}
              >
                <Avatar className="w-8 h-8 shrink-0">
                  {message.role === 'ecomon' ? (
                    <>
                      <AvatarImage src={ecomonAvatar} />
                      <AvatarFallback className="bg-emerald-500/20 text-emerald-400 text-sm">
                        🌱
                      </AvatarFallback>
                    </>
                  ) : (
                    <>
                      <AvatarImage src={userAvatar} />
                      <AvatarFallback className="bg-blue-500/20 text-blue-400 text-sm">
                        👤
                      </AvatarFallback>
                    </>
                  )}
                </Avatar>
                
                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-2',
                    message.role === 'ecomon'
                      ? 'bg-gray-800/50 text-gray-100 rounded-tl-sm'
                      : 'bg-emerald-600/80 text-white rounded-tr-sm'
                  )}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Typing Indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-emerald-500/20 text-emerald-400 text-sm">
                  🌱
                </AvatarFallback>
              </Avatar>
              <div className="bg-gray-800/50 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: i * 0.15,
                      }}
                      className="w-2 h-2 bg-emerald-400 rounded-full"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>
      
      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Chat with ${ecomonName}...`}
            disabled={isLoading}
            className="flex-1 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            variant="eco"
            size="icon"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Your EcoMon remembers your conversations and grows with you! 💚
        </p>
      </div>
    </Card>
  );
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
