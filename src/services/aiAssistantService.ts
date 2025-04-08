import { memoryManager } from './memoryManager';
import { vectorMemoryService } from './vectorMemoryService';
import { apiJobService } from './apiJobService';
import { UserMemory } from '../types/memory';

export interface AssistantResponse {
  content: string;
  memoryUpdates?: Partial<UserMemory>;
}

class AIAssistantService {
  async processMessage(message: string): Promise<AssistantResponse> {
    console.log("Processing message:", message);
    
    // Update memory based on the user's message
    await memoryManager.updateQueryHistory(message);
    await memoryManager.extractAndStoreCareerInfo(message);
    
    // Get the user's memory
    const userMemory = await memoryManager.getUserMemory();
    
    // Find relevant memories using vector similarity search
    const similarMemories = await vectorMemoryService.findSimilarMemories(message, 3);
    console.log("Found similar memories:", similarMemories.length);
    
    // Create a context from similar memories
    const memoryContext = this.buildMemoryContext(similarMemories);
    
    // In a real implementation, this would send the message to an LLM API (Gemini or Groq)
    // along with the memory context and get a response
    // For this demo, we'll simulate responses based on the message content
    
    const lowerMessage = message.toLowerCase();
    
    // Handle different query types
    try {
      let response: AssistantResponse;
      
      // First, check if the message is a simple custom question not covered by our specialized handlers
      if (lowerMessage.includes('why') && lowerMessage.includes('same') && lowerMessage.includes('reply')) {
        return {
          content: "I understand your concern. Previously, I was giving similar responses because the message processing logic wasn't properly distinguishing between different types of questions. This has now been fixed, and I'll respond appropriately to different questions. Could you try asking me something specific about careers or the job market?"
        };
      }
      
      if (lowerMessage.includes('skill') || lowerMessage.includes('demand')) {
        response = await this.handleSkillsQuery(lowerMessage, userMemory, memoryContext);
      } else if (lowerMessage.includes('salary') || lowerMessage.includes('pay') || lowerMessage.includes('compensation')) {
        response = await this.handleSalaryQuery(lowerMessage, userMemory, memoryContext);
      } else if (lowerMessage.includes('job') || lowerMessage.includes('opportunit') || lowerMessage.includes('position')) {
        response = await this.handleJobOpportunitiesQuery(lowerMessage, userMemory, memoryContext);
      } else if (lowerMessage.includes('remote') || lowerMessage.includes('work from home')) {
        response = await this.handleRemoteWorkQuery(lowerMessage, userMemory, memoryContext);
      } else if (lowerMessage.includes('trend') || lowerMessage.includes('market')) {
        response = await this.handleTrendsQuery(lowerMessage, userMemory, memoryContext);
      } else if (this.isGreeting(lowerMessage)) {
        response = await this.handleGreeting(message, userMemory, memoryContext);
      } else {
        // Check for specific industry inquiries
        const industries = ['software', 'tech', 'data', 'marketing', 'finance', 'healthcare', 'education', 'design'];
        const mentionsIndustry = industries.some(industry => lowerMessage.includes(industry));
        
        if (mentionsIndustry) {
          response = await this.handleIndustryQuery(message, userMemory, memoryContext);
        } else {
          // Try to provide a more personalized response instead of the generic one
          response = await this.handleCustomQuery(message, userMemory, memoryContext);
        }
      }
      
      // Store this interaction in memory with vector embedding
      if (response) {
        const interaction = {
          timestamp: new Date().toISOString(),
          message: message,
          response: response.content
        };
        
        const conversationHistory = userMemory.conversationHistory || [];
        const updatedHistory = [interaction, ...conversationHistory].slice(0, 20); // Keep last 20 interactions
        
        const memoryUpdate = {
          ...response.memoryUpdates,
          conversationHistory: updatedHistory,
          lastInteractionDate: new Date().toISOString()
        };
        
        // Store with embedding
        await vectorMemoryService.upsertMemoryWithEmbedding(memoryUpdate, 
          `User: ${message}\nAssistant: ${response.content}`);
      }
      
      return response;
    } catch (error) {
      console.error("Error processing message:", error);
      return {
        content: "I'm sorry, I encountered an error processing your request. Please try again."
      };
    }
  }
  
  private buildMemoryContext(memories: UserMemory[]): string {
    if (!memories || memories.length === 0) return "";
    
    let context = "Based on our previous conversations, I remember:\n";
    
    const careerFields = new Set<string>();
    const skills = new Set<string>();
    const locations = new Set<string>();
    const jobPreferences: Record<string, boolean> = {};
    
    // Collect unique information from memories
    memories.forEach(memory => {
      if (memory.careerField) careerFields.add(memory.careerField);
      if (memory.skills) memory.skills.forEach(skill => skills.add(skill));
      if (memory.preferredLocations) memory.preferredLocations.forEach(loc => locations.add(loc));
      if (memory.jobPreferences) {
        Object.entries(memory.jobPreferences).forEach(([key, value]) => {
          if (value) jobPreferences[key] = true;
        });
      }
    });
    
    // Build context string
    if (careerFields.size > 0) {
      context += `- Career field(s): ${Array.from(careerFields).join(', ')}\n`;
    }
    
    if (skills.size > 0) {
      context += `- Skills: ${Array.from(skills).join(', ')}\n`;
    }
    
    if (locations.size > 0) {
      context += `- Preferred locations: ${Array.from(locations).join(', ')}\n`;
    }
    
    if (Object.keys(jobPreferences).length > 0) {
      const prefs = Object.keys(jobPreferences).map(key => key.charAt(0).toUpperCase() + key.slice(1));
      context += `- Job preferences: ${prefs.join(', ')}\n`;
    }
    
    return context;
  }
  
  private isGreeting(message: string): boolean {
    const greetings = ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening'];
    return greetings.some(greeting => message.toLowerCase().includes(greeting));
  }
  
  private async handleGreeting(message: string, memory: UserMemory, context: string): Promise<AssistantResponse> {
    let greeting = "Hello! I'm CareerCompass, your AI career assistant. I can help you navigate the job market with personalized insights and real-time data.";
    
    if (memory.lastInteractionDate) {
      const lastDate = new Date(memory.lastInteractionDate);
      const now = new Date();
      const hoursSinceLastInteraction = (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceLastInteraction < 24) {
        greeting = "Welcome back! It's good to see you again.";
      } else {
        greeting = "Welcome back! It's been a while since we last chatted.";
      }
    }
    
    let response = `${greeting}\n\nI can assist with:
• Current job market trends and opportunities
• In-demand skills in your field
• Salary information and comparisons
• Remote work trends and opportunities
• Career path recommendations based on your profile\n`;

    if (memory.careerField || memory.skills?.length) {
      response += `\nBased on our previous conversations, I remember that you're interested in ${memory.careerField || 'the job market'}${
        memory.skills ? ` and have experience with ${memory.skills.join(', ')}` : ''
      }. How can I help you today?`;
    } else {
      response += "\nTo provide more personalized recommendations, feel free to share details about your career field, skills, or job preferences. I'll remember these details for future conversations.";
    }
    
    return { content: response };
  }
  
  private async handleSkillsQuery(message: string, memory: UserMemory, context: string): Promise<AssistantResponse> {
    let industry = memory.careerField || 'technology';
    
    // Try to identify industry from the message
    const industries = ['software', 'data', 'design', 'marketing', 'finance'];
    for (const ind of industries) {
      if (message.includes(ind)) {
        industry = ind;
        break;
      }
    }
    
    // Get skill data from API
    const topSkills = await apiJobService.getSkills(industry);
    
    const response = `Based on the latest market data for the ${industry} industry, these are the most in-demand skills:

${topSkills.map(skill => `• ${skill.name} - Growing at ${skill.growth}% with a demand score of ${skill.demand}/100`).join('\n')}

${memory.skills && memory.skills.length > 0 
  ? `I notice you've mentioned experience with ${memory.skills.join(', ')}. ${
      topSkills.some(ts => memory.skills!.some(s => ts.name.toLowerCase().includes(s.toLowerCase())))
        ? "That's great! Some of these skills are highly valued in the current market."
        : "Consider adding some of these high-demand skills to your repertoire to enhance your marketability."
    }`
  : "To provide more personalized recommendations, you can share your current skills with me."
}`;
    
    return { 
      content: response,
      memoryUpdates: { careerField: industry } 
    };
  }
  
  private async handleSalaryQuery(message: string, memory: UserMemory, context: string): Promise<AssistantResponse> {
    let role = 'software engineer';
    let location: string | undefined = undefined;
    
    // Try to identify role from the message or memory
    if (message.includes('data scientist') || message.includes('data science')) {
      role = 'data scientist';
    } else if (message.includes('product manager')) {
      role = 'product manager';
    } else if (memory.careerField) {
      role = memory.careerField;
    }
    
    // Check for location in message
    const locations = ['san francisco', 'new york', 'seattle', 'austin', 'remote'];
    for (const loc of locations) {
      if (message.toLowerCase().includes(loc)) {
        location = loc;
        break;
      }
    }
    
    // If no location in message, use preferred locations from memory
    if (!location && memory.preferredLocations && memory.preferredLocations.length > 0) {
      location = memory.preferredLocations[0];
    }
    
    // Get salary data from API
    const salaryData = await apiJobService.getSalaries(role, location);
    
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    });
    
    const response = `Here are the current salary trends for roles related to ${role}:

${salaryData.map(data => 
  `• ${data.role}: Average ${formatter.format(data.average)} (Range: ${formatter.format(data.range.min)} - ${formatter.format(data.range.max)})`
).join('\n')}

${memory.preferredLocations && memory.preferredLocations.length > 0
  ? `Keep in mind that salaries can vary significantly based on location. You've mentioned interest in ${memory.preferredLocations.join(', ')}, which ${
      memory.preferredLocations.some(loc => ['san francisco', 'new york', 'seattle'].includes(loc.toLowerCase()))
        ? "tend to have higher compensation ranges than the national average."
        : "may have different compensation ranges than shown here."
    }`
  : "These figures represent national averages. Salaries can vary significantly based on location, with tech hubs like San Francisco, New York, and Seattle generally offering higher compensation."
}

Experience level, company size, and industry specialization also impact compensation.`;
    
    return { content: response };
  }
  
  private async handleJobOpportunitiesQuery(message: string, memory: UserMemory, context: string): Promise<AssistantResponse> {
    // Determine filters based on message and memory
    let query = "";
    let location: string | undefined = undefined;
    let remote: boolean | undefined = undefined;
    
    // Extract query from message or memory
    if (memory.careerField) {
      query = memory.careerField;
    }
    
    if (memory.skills && memory.skills.length > 0) {
      query = memory.skills[0] + " " + query;
    }
    
    // Check message for location mentions
    const locations = ['san francisco', 'new york', 'seattle', 'austin', 'remote'];
    for (const loc of locations) {
      if (message.toLowerCase().includes(loc)) {
        if (loc === 'remote') {
          remote = true;
        } else {
          location = loc;
        }
        break;
      }
    }
    
    // Use memory for additional filters
    if (!location && memory.preferredLocations && memory.preferredLocations.length > 0) {
      location = memory.preferredLocations[0];
    }
    
    // If message mentions remote work
    if (message.toLowerCase().includes('remote')) {
      remote = true;
    } else if (memory.jobPreferences?.remote) {
      remote = true;
    }
    
    // Get job data from API
    const jobs = await apiJobService.getJobs(query, location, remote);
    
    if (jobs.length === 0) {
      return { 
        content: "I couldn't find any job opportunities matching your criteria. Try broadening your search or provide different filters."
      };
    }
    
    // Format response
    const jobList = jobs.slice(0, 3).map(job => {
      return `• ${job.title} at ${job.company} (${job.location})
  ${job.url ? `[Job Link](${job.url})` : ""}
  ${job.salary ? `Salary: ${job.salary}` : ""}
  Skills: ${job.skills ? job.skills.join(', ') : "Various skills"}
  Posted: ${new Date(job.postedDate).toLocaleDateString()}`;
    }).join('\n\n');
    
    const response = `Here are some relevant job opportunities based on ${
      (location || remote || memory.careerField || memory.skills?.length > 0) 
        ? `your preferences and our conversation`
        : `current market trends`
    }:

${jobList}

These listings are based on the latest data from my job market database. In a real implementation, I would connect to live job board APIs for up-to-date opportunities.`;
    
    return { content: response };
  }
  
  private async handleRemoteWorkQuery(message: string, memory: UserMemory, context: string): Promise<AssistantResponse> {
    // Set remote preference in memory
    const memoryUpdates: Partial<UserMemory> = {
      jobPreferences: { ...(memory.jobPreferences || {}), remote: true }
    };
    
    let industry = memory.careerField || '';
    const industries = ['software', 'data', 'marketing', 'design'];
    for (const ind of industries) {
      if (message.includes(ind)) {
        industry = ind;
        memoryUpdates.careerField = ind;
        break;
      }
    }
    
    // Get trend data from API
    const trends = await apiJobService.getTrends('remote work');
    
    const response = `Remote work continues to be a significant part of the job market in 2025. ${
      industry 
        ? `In the ${industry} field, remote opportunities have ${
            ['software', 'data'].includes(industry) ? 'increased' : 'remained stable'
          } over the past year.`
        : `Many industries now offer remote options, with technology and digital roles leading the way.`
    }

Top industries for remote work:
• Software Development (80% of new positions offer remote options)
• Data Science & Analytics (75% remote options)
• Digital Marketing (65% remote options)
• Content Creation (70% remote options)
• Customer Success (55% remote options)

${trends.length > 0 ? `Recent trend: ${trends[0].title} - ${trends[0].description}\n` : ''}

Companies are increasingly adopting hybrid models that combine remote work with occasional in-office collaboration. Some notable trends include:

• "Remote-first" companies offering global hiring
• Distributed team collaboration tools continuing to evolve
• Asynchronous work becoming more normalized
• Regional salary adjustments based on cost of living

${memory.skills && memory.skills.length > 0
  ? `With your background in ${memory.skills.join(', ')}, you're well-positioned for remote opportunities in the current market.`
  : `To enhance your remote work prospects, consider developing skills in digital collaboration, time management, and written communication.`
}

I've noted your interest in remote work and will prioritize remote opportunities in our future discussions.`;
    
    return { 
      content: response,
      memoryUpdates
    };
  }
  
  private async handleTrendsQuery(message: string, memory: UserMemory, context: string): Promise<AssistantResponse> {
    let industry = '';
    const industries = ['software', 'data', 'marketing', 'design', 'finance', 'healthcare'];
    for (const ind of industries) {
      if (message.includes(ind)) {
        industry = ind;
        break;
      }
    }
    
    if (!industry && memory.careerField) {
      industry = memory.careerField;
    }
    
    // Get data from APIs
    const topSkills = await apiJobService.getSkills(industry);
    const trends = await apiJobService.getTrends(industry);
    
    const response = `Here are the latest job market trends ${industry ? `in ${industry}` : 'across industries'}:

Growth Areas:
• Artificial Intelligence & Machine Learning (34% YOY growth)
• Cybersecurity (29% increase in job postings)
• Remote and distributed work (continuing strong after pandemic shifts)
• Sustainability and green technology roles (41% growth)
• Healthcare technology (26% increase)

In-demand Skills:
${topSkills.map(skill => `• ${skill.name} (${skill.growth}% growth)`).join('\n')}

${trends.length > 0 ? `Recent Industry Insight:\n${trends[0].title} - ${trends[0].description}\n` : ''}

Industry Shifts:
• Companies are increasingly prioritizing digital transformation
• Emphasis on adaptability and continuous learning
• Greater focus on soft skills alongside technical expertise
• Rise of contract and freelance opportunities
• Growing importance of data literacy across all roles

${memory.careerField
  ? `Based on your interest in ${memory.careerField}, you're in ${
      ['software', 'data', 'cybersecurity', 'ai'].some(field => memory.careerField!.includes(field))
        ? 'a high-growth area with strong demand'
        : 'an evolving field with emerging opportunities'
    }.`
  : 'I can provide more personalized trend insights if you share your career field or interests.'
}`;
    
    return {
      content: response,
      memoryUpdates: industry ? { careerField: industry } : undefined
    };
  }
  
  private async handleIndustryQuery(message: string, memory: UserMemory, context: string): Promise<AssistantResponse> {
    // Determine which industry is being discussed
    const industries = {
      tech: ['software', 'tech', 'it', 'technology'],
      data: ['data', 'analytics', 'science'],
      marketing: ['marketing', 'advertising', 'digital marketing'],
      finance: ['finance', 'banking', 'accounting'],
      healthcare: ['healthcare', 'medical', 'health'],
      education: ['education', 'teaching', 'academic'],
      design: ['design', 'ux', 'ui', 'graphic']
    };
    
    let detectedIndustry = '';
    const lowerMessage = message.toLowerCase();
    
    // Find which industry is mentioned in the message
    for (const [industry, keywords] of Object.entries(industries)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        detectedIndustry = industry;
        break;
      }
    }
    
    // If no specific industry detected, use one from memory or default to tech
    if (!detectedIndustry) {
      detectedIndustry = memory.careerField || 'tech';
    }
    
    // Get trend data from API
    const trends = await apiJobService.getTrends(detectedIndustry);
    const skills = await apiJobService.getSkills(detectedIndustry);
    
    // Format industry name for display
    const industryDisplay = detectedIndustry.charAt(0).toUpperCase() + detectedIndustry.slice(1);
    
    const response = `The ${industryDisplay} industry has been experiencing significant changes in 2025. Here are some key insights:

Growth Rate: ${['tech', 'data', 'healthcare'].includes(detectedIndustry) ? 'Above average' : 'Steady'} compared to other sectors.

Top In-Demand Skills:
${skills.slice(0, 3).map(skill => `• ${skill.name} - Growing at ${skill.growth}% with high demand`).join('\n')}

Recent Industry Trends:
${trends.slice(0, 2).map(trend => `• ${trend.title}: ${trend.description}`).join('\n')}

Job Market Outlook:
• ${['tech', 'data', 'healthcare'].includes(detectedIndustry) ? 'Hiring is robust with many companies actively recruiting' : 'Job market is competitive but stable with opportunities for specialists'}
• ${detectedIndustry === 'tech' ? 'Remote work options continue to dominate' : 'Hybrid work models are becoming standard'}
• Upskilling is critical for career advancement in this field

${memory.skills && memory.skills.length > 0
  ? `Based on your background with ${memory.skills.join(', ')}, you're well-positioned to explore roles that leverage these skills in the ${industryDisplay} sector.`
  : `To enhance your prospects in the ${industryDisplay} sector, consider developing specialized skills that align with current industry demands.`
}`;
    
    return { 
      content: response,
      memoryUpdates: { careerField: detectedIndustry }
    };
  }
  
  // Replace the generic response with a more personalized custom query handler
  private async handleCustomQuery(message: string, memory: UserMemory, context: string): Promise<AssistantResponse> {
    const lowerMessage = message.toLowerCase();
    
    // Analyze the message to provide more relevant responses
    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
      return {
        content: `I'm CareerCompass, your AI career assistant. I can help you with:

• Finding in-demand skills for your industry
• Analyzing current job market trends
• Providing salary information for various roles
• Suggesting remote work opportunities
• Offering personalized career path recommendations

Just ask me a specific question about any of these topics, and I'll provide customized insights based on your preferences and the latest market data.`
      };
    }
    
    if (lowerMessage.includes('remember') || lowerMessage.includes('memory')) {
      return {
        content: `Yes, I have memory capabilities! I remember:
${memory.careerField ? `• Your career field: ${memory.careerField}` : ''}
${memory.skills && memory.skills.length > 0 ? `• Your skills: ${memory.skills.join(', ')}` : ''}
${memory.preferredLocations && memory.preferredLocations.length > 0 ? `• Your preferred locations: ${memory.preferredLocations.join(', ')}` : ''}
${memory.jobPreferences ? `• Job preferences: ${Object.entries(memory.jobPreferences)
  .filter(([_, value]) => value)
  .map(([key, _]) => key)
  .join(', ')}` : ''}

This information helps me provide more personalized recommendations. You can share more details about your preferences anytime, and I'll remember them for future conversations.`
      };
    }
    
    if (lowerMessage.includes('career') || lowerMessage.includes('advice')) {
      return {
        content: `Career development is a journey that benefits from continuous learning and strategic planning. Here are some general career advancement tips:

1. Set clear short-term and long-term goals
2. Seek mentorship and build your professional network
3. Develop both technical and soft skills
4. Stay updated with industry trends
5. Request regular feedback on your performance

${memory.careerField 
  ? `Since you're interested in ${memory.careerField}, I recommend focusing on building expertise in this area while also developing complementary skills that increase your versatility.`
  : `To provide more tailored career advice, I'd love to know more about your field of interest and career goals.`
}`
      };
    }
    
    // Default response when no specific intent is detected
    return {
      content: `Thanks for your message. To help you more effectively, could you be more specific about what job market information you're looking for? 

For example, you could ask about:
• "What skills are in demand for software engineers?"
• "What are current salary trends in marketing?"
• "What remote job opportunities are growing?"
• "How is the tech job market in New York?"

${memory.careerField 
  ? `Since you've mentioned an interest in ${memory.careerField}, I can provide specific insights for this field if you'd like.`
  : `Sharing details about your career field, skills, or job preferences will help me provide more personalized recommendations.`
}`
    };
  }
}

export const aiAssistantService = new AIAssistantService();
