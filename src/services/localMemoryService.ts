
import { UserMemory, MemoryStorageService } from '../types/memory';

// A simple implementation that stores memory in localStorage
class LocalMemoryService implements MemoryStorageService {
  private readonly storageKey = 'userMemory';
  
  async saveMemory(memory: Partial<UserMemory>): Promise<void> {
    try {
      const currentMemory = await this.getMemory();
      const updatedMemory = { ...currentMemory, ...memory };
      localStorage.setItem(this.storageKey, JSON.stringify(updatedMemory));
    } catch (error) {
      console.error('Error saving memory to localStorage:', error);
    }
  }
  
  async getMemory(): Promise<UserMemory> {
    try {
      const storedMemory = localStorage.getItem(this.storageKey);
      return storedMemory ? JSON.parse(storedMemory) : {};
    } catch (error) {
      console.error('Error retrieving memory from localStorage:', error);
      return {};
    }
  }
  
  async clearMemory(): Promise<void> {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Error clearing memory from localStorage:', error);
    }
  }
  
  // Implement the missing methods required by the interface
  async upsertMemoryWithEmbedding(memory: Partial<UserMemory>, text: string): Promise<void> {
    // In local storage, we just save the memory without handling embeddings
    await this.saveMemory(memory);
  }
  
  async findSimilarMemories(text: string, limit?: number): Promise<UserMemory[]> {
    // For local storage, we just return the current memory as we can't do similarity search
    const memory = await this.getMemory();
    return [memory];
  }
}

export const localMemoryService = new LocalMemoryService();
