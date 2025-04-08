
export interface UserMemory {
  id?: string;
  userId?: string;
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
  embedding?: number[];
  metadata?: Record<string, any>;
}

export interface MemoryStorageService {
  saveMemory: (memory: Partial<UserMemory>) => Promise<void>;
  getMemory: () => Promise<UserMemory>;
  clearMemory: () => Promise<void>;
  upsertMemoryWithEmbedding: (memory: Partial<UserMemory>, text: string) => Promise<void>;
  findSimilarMemories: (text: string, limit?: number) => Promise<UserMemory[]>;
}

export interface VectorQueryResult {
  memory: UserMemory;
  score: number;
}

export interface ApiJobData {
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  salary?: string;
  postedDate: string;
  skills?: string[];
}

export interface ApiSkillData {
  name: string;
  growth: number;
  demand: number;
  category?: string;
}

export interface ApiSalaryData {
  role: string;
  average: number;
  range: {
    min: number;
    max: number;
  };
  location?: string;
}

export interface ApiTrendData {
  title: string;
  description: string;
  source?: string;
  date?: string;
  url?: string;
}
