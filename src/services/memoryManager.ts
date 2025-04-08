
import { UserMemory } from '../types/memory';
import { localMemoryService } from './localMemoryService';
import { vectorMemoryService } from './vectorMemoryService';

class MemoryManager {
  private static instance: MemoryManager;
  private memoryService = vectorMemoryService; // Use vector service instead of local
  
  private constructor() {}

  static getInstance(): MemoryManager {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
    }
    return MemoryManager.instance;
  }

  async saveUserPreference(key: keyof UserMemory, value: any): Promise<void> {
    try {
      const memory = await this.memoryService.getMemory();
      const updatedMemory = { ...memory, [key]: value };
      
      // Store with embedding
      const textRepresentation = `${key}: ${JSON.stringify(value)}`;
      await this.memoryService.upsertMemoryWithEmbedding(updatedMemory, textRepresentation);
      
      console.log(`Saved user preference: ${key}`);
    } catch (error) {
      console.error('Error saving user preference:', error);
    }
  }

  async getUserMemory(): Promise<UserMemory> {
    try {
      return await this.memoryService.getMemory();
    } catch (error) {
      console.error('Error getting user memory:', error);
      return {};
    }
  }

  async clearMemory(): Promise<void> {
    try {
      await this.memoryService.clearMemory();
    } catch (error) {
      console.error('Error clearing memory:', error);
    }
  }

  async updateQueryHistory(query: string): Promise<void> {
    try {
      const memory = await this.memoryService.getMemory();
      const queries = memory.previousQueries || [];
      
      // Keep only the most recent queries (max 10)
      const updatedQueries = [query, ...queries].slice(0, 10);
      
      await this.saveUserPreference('previousQueries', updatedQueries);
    } catch (error) {
      console.error('Error updating query history:', error);
    }
  }

  async extractAndStoreCareerInfo(message: string): Promise<void> {
    // Simple keyword extraction for demonstration
    // In a real implementation, this would use NLP/LLM for entity extraction
    
    // Check for career fields
    const careerFields = [
      'software', 'development', 'engineering', 'data', 'science', 'marketing',
      'design', 'product', 'management', 'finance', 'healthcare', 'education'
    ];
    
    const locations = [
      'remote', 'new york', 'san francisco', 'seattle', 'austin',
      'chicago', 'boston', 'los angeles', 'london', 'berlin'
    ];
    
    const skills = [
      'javascript', 'python', 'react', 'node', 'sql', 'aws', 
      'azure', 'machine learning', 'ai', 'blockchain', 'cloud'
    ];
    
    const messageLower = message.toLowerCase();
    
    // Extract career field
    for (const field of careerFields) {
      if (messageLower.includes(field)) {
        await this.saveUserPreference('careerField', field);
        break;
      }
    }
    
    // Extract locations
    const matchedLocations = locations.filter(loc => messageLower.includes(loc));
    if (matchedLocations.length > 0) {
      const currentLocations = (await this.getUserMemory()).preferredLocations || [];
      const uniqueLocations = [...new Set([...currentLocations, ...matchedLocations])];
      await this.saveUserPreference('preferredLocations', uniqueLocations);
    }
    
    // Extract skills
    const matchedSkills = skills.filter(skill => messageLower.includes(skill));
    if (matchedSkills.length > 0) {
      const currentSkills = (await this.getUserMemory()).skills || [];
      const uniqueSkills = [...new Set([...currentSkills, ...matchedSkills])];
      await this.saveUserPreference('skills', uniqueSkills);
    }
  }
}

export const memoryManager = MemoryManager.getInstance();
