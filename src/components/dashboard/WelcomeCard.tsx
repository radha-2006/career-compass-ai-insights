
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquareIcon } from 'lucide-react';

interface WelcomeCardProps {
  onStartChat: () => void;
}

const WelcomeCard = ({ onStartChat }: WelcomeCardProps) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle>Welcome to CareerCompass AI</CardTitle>
        <CardDescription>
          Your personalized career guidance assistant
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-gray-700">
          I can help you navigate the job market with personalized insights and real-time data. 
          Ask me about job trends, in-demand skills, or career opportunities tailored to your background.
        </p>
        <p className="mb-4 text-gray-700">
          I'll remember your preferences and career goals across conversations to provide consistent guidance.
        </p>
        <Button 
          onClick={onStartChat}
          className="bg-brand-purple hover:bg-brand-purple/90 gap-2"
        >
          <MessageSquareIcon className="h-4 w-4" />
          Start a Conversation
        </Button>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
