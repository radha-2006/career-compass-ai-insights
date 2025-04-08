
import React from 'react';
import { Message } from './ChatMessage';
import ChatMessage from './ChatMessage';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserMemory } from '@/types/memory';
import { Badge } from '@/components/ui/badge';
import { InfoIcon } from 'lucide-react';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  userMemory?: UserMemory;
  showMemoryIndicator?: boolean;
}

const LoadingMessage = () => (
  <div className="flex gap-3 p-4 bg-brand-gray">
    <div className="h-10 w-10 rounded-full bg-brand-purple/70 flex items-center justify-center animate-pulse-slow">
      <div className="h-5 w-5" />
    </div>
    <div className="flex-1">
      <div className="h-5 w-32 bg-gray-300 rounded animate-pulse-slow mb-2"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-pulse-slow w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse-slow w-1/2"></div>
      </div>
    </div>
  </div>
);

const MemoryContext = ({ memory }: { memory: UserMemory }) => {
  if (!memory || Object.keys(memory).length === 0) return null;
  
  const memoryItems = [];
  
  if (memory.careerField) memoryItems.push(`Field: ${memory.careerField}`);
  if (memory.skills && memory.skills.length > 0) memoryItems.push(`Skills: ${memory.skills.length}`);
  if (memory.preferredLocations && memory.preferredLocations.length > 0) 
    memoryItems.push(`Locations: ${memory.preferredLocations.length}`);
  
  if (memoryItems.length === 0) return null;
  
  return (
    <div className="p-2 bg-gray-50 border-b flex items-center gap-2 text-xs text-gray-500">
      <InfoIcon className="h-3 w-3" />
      <span>Memory active:</span>
      <div className="flex gap-1 flex-wrap">
        {memoryItems.map((item, i) => (
          <Badge key={i} variant="outline" className="text-xs py-0 h-5">
            {item}
          </Badge>
        ))}
      </div>
    </div>
  );
};

const ChatWindow = ({ messages, isLoading, userMemory, showMemoryIndicator = false }: ChatWindowProps) => {
  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto flex flex-col">
      {showMemoryIndicator && userMemory && <MemoryContext memory={userMemory} />}
      <ScrollArea className="flex-1">
        <div className="flex flex-col divide-y">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && <LoadingMessage />}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatWindow;
