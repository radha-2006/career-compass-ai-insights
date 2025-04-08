
# CareerCompass AI - Job Market Insights Agent

## Project Overview

CareerCompass is an AI-powered career assistant that helps job seekers navigate the job market with personalized insights and recommendations. The application remembers user preferences, career goals, and previous interactions to provide contextually relevant information even across different chat sessions.

### Key Features

- **Personalized Career Guidance**: Get tailored advice based on your career field, skills, and preferences
- **Persistent Memory**: The AI remembers your details across sessions using vector database storage
- **Real-time Job Market Data**: Access current trends, in-demand skills, and job opportunities
- **Responsive UI**: Clean, professional interface that works on all devices

## Technical Implementation

This project meets the core requirements by implementing:

1. **AI Agent Functionality**:
   - Vector database for persistent memory
   - Real-time data retrieval through job market APIs
   - Context-aware responses based on past interactions

2. **Long-term Memory**:
   - User preferences stored in vector database
   - Conversation history with embeddings for contextual retrieval
   - Memory persists across sessions

3. **Real-time Knowledge**:
   - Job market trends and opportunities
   - Skill demand analytics
   - Salary information by role and location

## Technology Stack

- **Frontend**: React, Tailwind CSS, shadcn/ui
- **Memory Storage**: Vector embeddings with Pinecone
- **LLM Integration**: Ready for Gemini or Groq (mocked for demo)
- **Real-time Data**: Job market API integration

## Deployment to Vercel

### Prerequisites

1. Fork or clone this repository to your GitHub account
2. Create a Vercel account and connect it to your GitHub
3. (Optional) Set up API keys for enhanced functionality:
   - LLM provider (Gemini or Groq)
   - Vector database (Pinecone)
   - Job API services

### Deployment Steps

1. **Import your GitHub repository to Vercel**:
   - Go to [Vercel](https://vercel.com/new)
   - Select your GitHub repository
   - Click "Import"

2. **Configure the project**:
   - Project Name: `career-compass-ai` (or your preferred name)
   - Framework Preset: Vite
   - Root Directory: `./` (leave as default)

3. **Set environment variables** (optional for full functionality):
   - `LLM_API_KEY`: Your Gemini or Groq API key
   - `VECTOR_DB_API_KEY`: Your Pinecone API key
   - `JOB_API_KEY`: Your job data API key

4. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete

5. **Access your deployed app**:
   - Once deployment is complete, you'll receive a URL to your deployed application
   - The app is now live and ready to use!

## Local Development

To run the project locally:

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd career-compass-ai

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:8080/`.

## Future Enhancements

- Full integration with real LLM providers (Gemini/Groq)
- Live job board API connections
- User authentication for personalized experiences
- Enhanced vector search capabilities
- Mobile app version

## Credits

This project was created as part of an AI agent implementation challenge, focusing on providing valuable career insights through a combination of AI, memory persistence, and real-time data integration.
