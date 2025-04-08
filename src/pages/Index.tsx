
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
import { UserMemory } from '@/types/memory';
import { Button } from '@/components/ui/button';
import { RefreshCcwIcon, BrainIcon } from 'lucide-react';

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [userMemory, setUserMemory] = useState<UserMemory>({});
  const [showMemoryIndicator, setShowMemoryIndicator] = useState(true);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const chatInputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // On desktop, sidebar is always open initially
    if (!isMobile) {
      setIsSidebarOpen(true);
    }
    
    // Load user memory on component mount
    loadUserMemory();
  }, [isMobile]);

  const loadUserMemory = async () => {
    try {
      const memory = await memoryManager.getUserMemory();
      setUserMemory(memory);
    } catch (error) {
      console.error('Error loading user memory:', error);
    }
  };

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
        
        // Refresh memory display
        loadUserMemory();
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

  const handleClearMemory = async () => {
    try {
      await memoryManager.clearMemory();
      setUserMemory({});
      toast({
        title: "Memory Cleared",
        description: "Your conversation history and preferences have been reset.",
      });
    } catch (error) {
      console.error('Error clearing memory:', error);
      toast({
        title: "Error",
        description: "Failed to clear memory. Please try again.",
        variant: "destructive"
      });
    }
  };

  const toggleMemoryIndicator = () => {
    setShowMemoryIndicator(prev => !prev);
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
              <div className="flex justify-between items-center p-2 bg-gray-50 border-b">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-2" 
                    onClick={toggleMemoryIndicator}
                    title={showMemoryIndicator ? "Hide memory status" : "Show memory status"}
                  >
                    <BrainIcon className={`h-4 w-4 ${showMemoryIndicator ? 'text-brand-purple' : 'text-gray-400'}`} />
                  </Button>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8" 
                  onClick={handleClearMemory}
                >
                  <RefreshCcwIcon className="h-4 w-4 mr-2" />
                  Reset Memory
                </Button>
              </div>
              <ChatWindow 
                messages={messages} 
                isLoading={isLoading} 
                userMemory={userMemory}
                showMemoryIndicator={showMemoryIndicator}
              />
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
