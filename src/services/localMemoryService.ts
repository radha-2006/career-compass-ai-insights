
import { UserMemory, MemoryStorageService } from '../types/memory';

const MEMORY_KEY = 'career_compass_memory';

class LocalMemoryService implements MemoryStorageService {
  async saveMemory(memory: Partial<UserMemory>): Promise<void> {
    try {
      const existingMemory = await this.getMemory();
      const updatedMemory = { ...existingMemory, ...memory };
      localStorage.setItem(MEMORY_KEY, JSON.stringify(updatedMemory));
    } catch (error) {
      console.error('Error saving memory:', error);
    }
  }

  async getMemory(): Promise<UserMemory> {
    try {
      const memoryString = localStorage.getItem(MEMORY_KEY);
      if (!memoryString) return {};
      return JSON.parse(memoryString) as UserMemory;
    } catch (error) {
      console.error('Error retrieving memory:', error);
      return {};
    }
  }

  async clearMemory(): Promise<void> {
    try {
      localStorage.removeItem(MEMORY_KEY);
    } catch (error) {
      console.error('Error clearing memory:', error);
    }
  }
}

export const localMemoryService = new LocalMemoryService();
