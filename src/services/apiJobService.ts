
import { ApiJobData, ApiSkillData, ApiSalaryData, ApiTrendData } from '../types/memory';

// In a real implementation, this would connect to actual APIs like Serper, Jina, etc.
class ApiJobService {
  private API_KEY = "YOUR_API_KEY";  // Would be set from environment in real app
  
  private async fetchFromApi<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    // In a real implementation, this would make an actual API call
    console.log(`API call to ${endpoint} with params:`, params);
    
    // For now, we'll return mock data based on the endpoint
    // In a real implementation, we would fetch from an API endpoint
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    switch (endpoint) {
      case 'jobs':
        return this.getMockJobs(params) as unknown as T;
      case 'skills':
        return this.getMockSkills(params) as unknown as T;
      case 'salary':
        return this.getMockSalaries(params) as unknown as T;
      case 'trends':
        return this.getMockTrends(params) as unknown as T;
      default:
        throw new Error(`Unknown endpoint: ${endpoint}`);
    }
  }
  
  // Public methods to get job data
  async getJobs(query: string, location?: string, remote?: boolean): Promise<ApiJobData[]> {
    const params: Record<string, string> = {
      q: query,
    };
    
    if (location) params.location = location;
    if (remote !== undefined) params.remote = remote.toString();
    
    return this.fetchFromApi<ApiJobData[]>('jobs', params);
  }
  
  async getSkills(industry?: string, role?: string): Promise<ApiSkillData[]> {
    const params: Record<string, string> = {};
    
    if (industry) params.industry = industry;
    if (role) params.role = role;
    
    return this.fetchFromApi<ApiSkillData[]>('skills', params);
  }
  
  async getSalaries(role?: string, location?: string): Promise<ApiSalaryData[]> {
    const params: Record<string, string> = {};
    
    if (role) params.role = role;
    if (location) params.location = location;
    
    return this.fetchFromApi<ApiSalaryData[]>('salary', params);
  }
  
  async getTrends(query?: string): Promise<ApiTrendData[]> {
    const params: Record<string, string> = {};
    
    if (query) params.q = query;
    
    return this.fetchFromApi<ApiTrendData[]>('trends', params);
  }
  
  // Mock data methods (would be replaced by actual API calls)
  private getMockJobs(params: Record<string, string>): ApiJobData[] {
    const currentDate = new Date();
    const allJobs: ApiJobData[] = [
      {
        title: "Senior Frontend Developer",
        company: "TechCorp",
        location: "San Francisco, CA",
        description: "Building responsive web applications with React and TypeScript",
        url: "https://example.com/job1",
        salary: "$140,000 - $180,000",
        postedDate: new Date(currentDate.setDate(currentDate.getDate() - 2)).toISOString(),
        skills: ["React", "TypeScript", "CSS", "Jest"]
      },
      {
        title: "Data Scientist",
        company: "DataWorks",
        location: "New York, NY",
        description: "Analyzing large datasets to derive insights and build ML models",
        url: "https://example.com/job2",
        salary: "$130,000 - $170,000",
        postedDate: new Date(currentDate.setDate(currentDate.getDate() - 3)).toISOString(),
        skills: ["Python", "SQL", "Machine Learning", "Statistics"]
      },
      {
        title: "Full Stack Engineer",
        company: "GrowthStartup",
        location: "Austin, TX",
        description: "Building features across the stack for our SaaS platform",
        url: "https://example.com/job3",
        salary: "$120,000 - $160,000",
        postedDate: new Date(currentDate.setDate(currentDate.getDate() - 1)).toISOString(),
        skills: ["JavaScript", "Node.js", "React", "MongoDB"]
      },
      {
        title: "Product Manager",
        company: "ProductHQ",
        location: "Seattle, WA",
        description: "Leading product development for our enterprise solution",
        url: "https://example.com/job4",
        salary: "$140,000 - $180,000",
        postedDate: new Date(currentDate.setDate(currentDate.getDate() - 2)).toISOString(),
        skills: ["Product Strategy", "Agile", "User Research"]
      },
      {
        title: "DevOps Engineer",
        company: "CloudScale",
        location: "Remote",
        description: "Building and maintaining our cloud infrastructure",
        url: "https://example.com/job5",
        salary: "$130,000 - $170,000",
        postedDate: new Date(currentDate.setDate(currentDate.getDate() - 2)).toISOString(),
        skills: ["AWS", "Kubernetes", "Terraform", "CI/CD"]
      }
    ];
    
    // Filter by query
    let filteredJobs = allJobs;
    
    if (params.q) {
      const query = params.q.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.title.toLowerCase().includes(query) || 
        job.description.toLowerCase().includes(query) ||
        job.skills?.some(skill => skill.toLowerCase().includes(query))
      );
    }
    
    // Filter by location
    if (params.location) {
      const location = params.location.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.location.toLowerCase().includes(location)
      );
    }
    
    // Filter by remote
    if (params.remote === 'true') {
      filteredJobs = filteredJobs.filter(job => 
        job.location.toLowerCase().includes('remote')
      );
    }
    
    return filteredJobs;
  }
  
  private getMockSkills(params: Record<string, string>): ApiSkillData[] {
    const allSkills: Record<string, ApiSkillData[]> = {
      default: [
        { name: "Machine Learning", growth: 34, demand: 92 },
        { name: "Cloud Computing", growth: 29, demand: 89 },
        { name: "Data Analysis", growth: 25, demand: 87 },
        { name: "JavaScript", growth: 18, demand: 85 },
        { name: "Cybersecurity", growth: 32, demand: 91 }
      ],
      software: [
        { name: "React", growth: 27, demand: 90 },
        { name: "TypeScript", growth: 30, demand: 88 },
        { name: "Node.js", growth: 22, demand: 86 },
        { name: "Python", growth: 25, demand: 89 },
        { name: "Docker/Kubernetes", growth: 35, demand: 92 }
      ],
      data: [
        { name: "Python", growth: 31, demand: 94 },
        { name: "SQL", growth: 20, demand: 88 },
        { name: "Machine Learning", growth: 38, demand: 95 },
        { name: "Data Visualization", growth: 26, demand: 87 },
        { name: "Big Data", growth: 29, demand: 91 }
      ]
    };
    
    // Return based on industry param or default
    if (params.industry && allSkills[params.industry.toLowerCase()]) {
      return allSkills[params.industry.toLowerCase()];
    }
    
    return allSkills.default;
  }
  
  private getMockSalaries(params: Record<string, string>): ApiSalaryData[] {
    const allSalaries: Record<string, ApiSalaryData[]> = {
      default: [
        { role: "Software Engineer", average: 120000, range: { min: 95000, max: 160000 } },
        { role: "Data Scientist", average: 135000, range: { min: 100000, max: 180000 } },
        { role: "Product Manager", average: 130000, range: { min: 110000, max: 170000 } },
        { role: "UX Designer", average: 110000, range: { min: 85000, max: 150000 } },
        { role: "DevOps Engineer", average: 125000, range: { min: 100000, max: 165000 } }
      ],
      engineer: [
        { role: "Frontend Engineer", average: 115000, range: { min: 90000, max: 150000 } },
        { role: "Backend Engineer", average: 125000, range: { min: 100000, max: 160000 } },
        { role: "Full Stack Engineer", average: 130000, range: { min: 105000, max: 170000 } },
        { role: "Mobile Engineer", average: 120000, range: { min: 95000, max: 155000 } },
        { role: "Systems Engineer", average: 135000, range: { min: 110000, max: 180000 } }
      ],
      "san francisco": [
        { role: "Software Engineer", average: 150000, range: { min: 120000, max: 200000 }, location: "San Francisco" },
        { role: "Data Scientist", average: 165000, range: { min: 135000, max: 210000 }, location: "San Francisco" },
        { role: "Product Manager", average: 160000, range: { min: 140000, max: 210000 }, location: "San Francisco" }
      ],
      "new york": [
        { role: "Software Engineer", average: 140000, range: { min: 115000, max: 190000 }, location: "New York" },
        { role: "Data Scientist", average: 155000, range: { min: 125000, max: 200000 }, location: "New York" },
        { role: "Product Manager", average: 150000, range: { min: 130000, max: 200000 }, location: "New York" }
      ]
    };
    
    // Check for location-specific data
    if (params.location) {
      const location = params.location.toLowerCase();
      if (allSalaries[location]) {
        return allSalaries[location];
      }
    }
    
    // Check for role-specific data
    if (params.role && params.role.toLowerCase().includes('engineer')) {
      return allSalaries.engineer;
    }
    
    return allSalaries.default;
  }
  
  private getMockTrends(params: Record<string, string>): ApiTrendData[] {
    const allTrends: ApiTrendData[] = [
      {
        title: "Rise of AI in Everyday Developer Tools",
        description: "AI-powered coding assistants are transforming how developers work, with tools like GitHub Copilot and similar technologies becoming standard in development workflows.",
        source: "Tech Industry Report",
        date: "2025-03-15",
        url: "https://example.com/trend1"
      },
      {
        title: "Remote Work Normalization",
        description: "Companies are establishing permanent remote work policies, with over 70% of tech firms now offering remote-first or hybrid options as standard benefits.",
        source: "Workforce Trends",
        date: "2025-03-10",
        url: "https://example.com/trend2"
      },
      {
        title: "Specialized AI Roles Growing",
        description: "Beyond general ML engineers, companies are now hiring for specialized AI roles like Prompt Engineers, AI Ethics Specialists, and AI Infrastructure Engineers.",
        source: "Hiring Insights",
        date: "2025-03-05",
        url: "https://example.com/trend3"
      },
      {
        title: "Cybersecurity Skills Gap Widens",
        description: "As cyber threats increase in sophistication, the demand for cybersecurity professionals continues to outpace supply, driving salary increases of 15-20% year-over-year.",
        source: "Security Industry Report",
        date: "2025-02-28",
        url: "https://example.com/trend4"
      },
      {
        title: "Low-Code Development Expansion",
        description: "Enterprise adoption of low-code platforms is accelerating, creating new hybrid roles that combine business domain expertise with technical configuration skills.",
        source: "Enterprise Tech Quarterly",
        date: "2025-02-20",
        url: "https://example.com/trend5"
      }
    ];
    
    // Filter by query
    if (params.q) {
      const query = params.q.toLowerCase();
      return allTrends.filter(trend => 
        trend.title.toLowerCase().includes(query) || 
        trend.description.toLowerCase().includes(query)
      );
    }
    
    return allTrends;
  }
}

export const apiJobService = new ApiJobService();
