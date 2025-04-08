
import React, { useState, useEffect, useRef } from 'react';
import Header from '@/components/shared/Header';
import Sidebar from '@/components/shared/Sidebar';
import ChatInput from '@/components/chat/ChatInput';
import ChatWindow from '@/components/chat/ChatWindow';
import { Message } from '@/components/chat/ChatMessage';
import WelcomeCard from '@/components/dashboard/WelcomeCard';
import TrendingSkills from '@/components/dashboard/TrendingSkills';
import { useToast } from "@/components/ui/use-toast";
import { aiAssistantService } from '@/services/aiAssistantService';
import { memoryManager } from '@/services/memoryManager';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const chatInputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // On desktop, sidebar is always open initially
    if (!isMobile) {
      setIsSidebarOpen(true);
    }
  }, [isMobile]);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);
    
    try {
      // Process message with AI assistant service
      const response = await aiAssistantService.processMessage(content);
      
      // Update user memory if needed
      if (response.memoryUpdates) {
        await memoryManager.saveUserPreference(
          Object.keys(response.memoryUpdates)[0] as any,
          Object.values(response.memoryUpdates)[0]
        );
      }
      
      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error('Error processing message:', error);
      toast({
        title: "Error",
        description: "Failed to process your message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartChat = () => {
    setShowChat(true);
    // Automatically send welcome message when chat starts
    handleSendMessage("Hello, I'm looking for career advice.");
    
    // Scroll to chat input after a brief delay
    setTimeout(() => {
      chatInputRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        
        {/* Main content */}
        <main className={`flex-1 flex flex-col p-4 md:p-6 overflow-hidden transition-all duration-300 ease-in-out ${
          isMobile ? 'w-full' : (isSidebarOpen ? 'md:ml-64' : 'md:ml-0')
        }`}>
          {showChat ? (
            <div className="flex flex-col h-full bg-white border rounded-lg shadow-sm overflow-hidden">
              <ChatWindow messages={messages} isLoading={isLoading} />
              <div ref={chatInputRef}>
                <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <WelcomeCard onStartChat={handleStartChat} />
              <h2 className="text-xl font-semibold text-gray-900">Current Job Market Trends</h2>
              <TrendingSkills />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
