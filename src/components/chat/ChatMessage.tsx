
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { BriefcaseIcon, User2Icon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

const formatMessage = (content: string) => {
  return content.split('\n').map((line, i) => (
    <React.Fragment key={i}>
      {line}
      {i < content.split('\n').length - 1 && <br />}
    </React.Fragment>
  ));
};

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.sender === 'user';

  return (
    <div 
      className={cn(
        "flex gap-3 p-4",
        isUser ? "bg-white" : "bg-brand-gray"
      )}
    >
      <Avatar className={cn(isUser ? "bg-brand-blue" : "bg-brand-purple")}>
        <AvatarFallback className="text-white">
          {isUser ? <User2Icon className="h-5 w-5" /> : <BriefcaseIcon className="h-5 w-5" />}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="font-medium mb-1">
          {isUser ? 'You' : 'CareerCompass'}
        </div>
        <div className="text-sm text-gray-700 whitespace-pre-wrap">
          {formatMessage(message.content)}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
