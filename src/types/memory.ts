
export interface UserMemory {
  careerField?: string;
  preferredLocations?: string[];
  skills?: string[];
  experienceLevel?: string;
  jobPreferences?: {
    remote?: boolean;
    hybrid?: boolean;
    onsite?: boolean;
  };
  previousQueries?: string[];
  interests?: string[];
  conversationHistory?: {
    timestamp: string;
    message: string;
    response: string;
  }[];
  lastInteractionDate?: string;
  favoriteResources?: string[];
  jobSearchStatus?: 'active' | 'passive' | 'not_looking';
}

export interface MemoryStorageService {
  saveMemory: (memory: Partial<UserMemory>) => Promise<void>;
  getMemory: () => Promise<UserMemory>;
  clearMemory: () => Promise<void>;
}
