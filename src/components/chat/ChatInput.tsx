
import React, { useState, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { SendIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput = ({ onSendMessage, isLoading }: ChatInputProps) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex items-end gap-2 border-t p-4 bg-white">
      <Textarea
        placeholder="Ask about job trends, skills, or opportunities..."
        className="resize-none min-h-[80px]"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
      />
      <Button 
        className="bg-brand-purple hover:bg-brand-purple/90 h-10 px-4" 
        onClick={handleSendMessage}
        disabled={!message.trim() || isLoading}
      >
        <SendIcon className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default ChatInput;
