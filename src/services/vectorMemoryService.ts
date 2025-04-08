import { UserMemory, MemoryStorageService, VectorQueryResult } from '../types/memory';
import { localMemoryService } from './localMemoryService';

// Mock implementation of vector database service
// In a real implementation, this would connect to Pinecone or Supabase
class VectorMemoryService implements MemoryStorageService {
  // We'll keep using local storage for now but with vector-like operations
  private localService = localMemoryService;
  
  // Mock embedding function (in a real implementation, this would call Gemini or another embedding service)
  private async generateEmbedding(text: string): Promise<number[]> {
    // This is a mock - in production we'd call an embedding API
    // Simple hash function to simulate embedding
    const simpleHash = (str: string) => {
      let hash = Array(128).fill(0);
      for (let i = 0; i < str.length; i++) {
        hash[i % 128] = (hash[i % 128] + str.charCodeAt(i)) % 100 / 100;
      }
      return hash;
    };
    
    return simpleHash(text);
  }
  
  // Calculate cosine similarity between two vectors
  private cosineSimilarity(a: number[], b: number[]): number {
    if (!a || !b || a.length !== b.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    if (normA === 0 || normB === 0) return 0;
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
  
  // Implementation of the MemoryStorageService interface
  async saveMemory(memory: Partial<UserMemory>): Promise<void> {
    await this.localService.saveMemory(memory);
  }
  
  async getMemory(): Promise<UserMemory> {
    return this.localService.getMemory();
  }
  
  async clearMemory(): Promise<void> {
    return this.localService.clearMemory();
  }
  
  async upsertMemoryWithEmbedding(memory: Partial<UserMemory>, text: string): Promise<void> {
    // Generate embedding for the text
    const embedding = await this.generateEmbedding(text);
    
    // Add embedding to memory object
    const memoryWithEmbedding = {
      ...memory,
      embedding,
      lastInteractionDate: new Date().toISOString()
    };
    
    // Save to local storage
    await this.localService.saveMemory(memoryWithEmbedding);
    
    console.log("Memory saved with embedding", { text, embedding: embedding.slice(0, 5) + '...' });
  }
  
  async findSimilarMemories(text: string, limit: number = 5): Promise<UserMemory[]> {
    // Generate embedding for the query text
    const queryEmbedding = await this.generateEmbedding(text);
    
    // Get current memory
    const currentMemory = await this.getMemory();
    
    // If we have previous conversation history, compare with embeddings
    if (currentMemory.conversationHistory && currentMemory.conversationHistory.length > 0) {
      // In a real implementation, this would query the vector database
      // Here we're simulating by computing similarities with stored conversations
      
      // Create synthetic memory entries from conversation history
      const memoryEntries: UserMemory[] = currentMemory.conversationHistory.map((conv, index) => {
        // Generate a mock embedding for each conversation entry
        const mockEmbedding = this.generateEmbedding(conv.message + " " + conv.response);
        
        return {
          id: `history-${index}`,
          conversationHistory: [conv],
          embedding: mockEmbedding instanceof Promise ? [] : mockEmbedding,
          lastInteractionDate: conv.timestamp
        };
      });
      
      // Add the current memory as well
      memoryEntries.push(currentMemory);
      
      // Calculate similarity scores
      const results: VectorQueryResult[] = memoryEntries.map(memory => {
        const score = memory.embedding 
          ? this.cosineSimilarity(queryEmbedding, memory.embedding) 
          : 0;
          
        return { memory, score };
      });
      
      // Sort by similarity score
      results.sort((a, b) => b.score - a.score);
      
      // Return the top results
      return results.slice(0, limit).map(result => result.memory);
    }
    
    // If no conversation history, just return the current memory
    return [currentMemory];
  }
}

export const vectorMemoryService = new VectorMemoryService();
