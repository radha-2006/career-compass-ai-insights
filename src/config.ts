
// This file would normally contain environment variables or configuration settings
// For a real deployment, you would use environment variables in your Vercel project

export const config = {
  // LLM API settings
  llm: {
    provider: 'gemini', // or 'groq'
    apiKey: process.env.LLM_API_KEY || 'your-api-key', // This would be set in Vercel
    model: 'gemini-pro', // or 'llama2-70b' for Groq
  },
  
  // Vector DB settings
  vectorDb: {
    provider: 'pinecone', // or 'supabase'
    apiKey: process.env.VECTOR_DB_API_KEY || 'your-api-key',
    environment: 'us-west1-gcp', // for Pinecone
    index: 'career-compass',
  },
  
  // Job API settings
  jobApi: {
    apiKey: process.env.JOB_API_KEY || 'your-api-key',
    baseUrl: 'https://api.example.com/v1',
  },
  
  // Feature flags
  features: {
    enableRealTimeData: true,
    enableVectorMemory: true,
    enableLLM: false, // Set to false for mock responses
  }
};
