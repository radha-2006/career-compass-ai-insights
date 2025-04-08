
import React from 'react';
import { Message } from './ChatMessage';
import ChatMessage from './ChatMessage';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
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

const ChatWindow = ({ messages, isLoading }: ChatWindowProps) => {
  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <ScrollArea className="flex-1 overflow-y-auto">
      <div className="flex flex-col divide-y">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && <LoadingMessage />}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
};

export default ChatWindow;
