
// This service simulates API calls to job market data sources
// In a real implementation, this would connect to actual APIs

export interface JobTrend {
  skill: string;
  growth: number;
  demandScore: number;
}

export interface SalaryInfo {
  role: string;
  averageSalary: number;
  salaryRange: {
    min: number;
    max: number;
  };
}

export interface JobOpportunity {
  title: string;
  company: string;
  location: string;
  remote: boolean;
  description: string;
  skills: string[];
  salary?: string;
  postedDate: string;
}

class JobMarketService {
  async getTopSkills(industry?: string): Promise<JobTrend[]> {
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock data - would be replaced with real API call
    const trends: Record<string, JobTrend[]> = {
      default: [
        { skill: "Machine Learning", growth: 34, demandScore: 92 },
        { skill: "Cloud Computing", growth: 29, demandScore: 89 },
        { skill: "Data Analysis", growth: 25, demandScore: 87 },
        { skill: "JavaScript", growth: 18, demandScore: 85 },
        { skill: "Cybersecurity", growth: 32, demandScore: 91 }
      ],
      software: [
        { skill: "React", growth: 27, demandScore: 90 },
        { skill: "TypeScript", growth: 30, demandScore: 88 },
        { skill: "Node.js", growth: 22, demandScore: 86 },
        { skill: "Python", growth: 25, demandScore: 89 },
        { skill: "Docker/Kubernetes", growth: 35, demandScore: 92 }
      ],
      data: [
        { skill: "Python", growth: 31, demandScore: 94 },
        { skill: "SQL", growth: 20, demandScore: 88 },
        { skill: "Machine Learning", growth: 38, demandScore: 95 },
        { skill: "Data Visualization", growth: 26, demandScore: 87 },
        { skill: "Big Data", growth: 29, demandScore: 91 }
      ]
    };
    
    if (industry && trends[industry.toLowerCase()]) {
      return trends[industry.toLowerCase()];
    }
    
    return trends.default;
  }
  
  async getSalaryInfo(role?: string): Promise<SalaryInfo[]> {
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const salaries: Record<string, SalaryInfo[]> = {
      default: [
        { role: "Software Engineer", averageSalary: 120000, salaryRange: { min: 95000, max: 160000 } },
        { role: "Data Scientist", averageSalary: 135000, salaryRange: { min: 100000, max: 180000 } },
        { role: "Product Manager", averageSalary: 130000, salaryRange: { min: 110000, max: 170000 } },
        { role: "UX Designer", averageSalary: 110000, salaryRange: { min: 85000, max: 150000 } },
        { role: "DevOps Engineer", averageSalary: 125000, salaryRange: { min: 100000, max: 165000 } }
      ],
      engineer: [
        { role: "Frontend Engineer", averageSalary: 115000, salaryRange: { min: 90000, max: 150000 } },
        { role: "Backend Engineer", averageSalary: 125000, salaryRange: { min: 100000, max: 160000 } },
        { role: "Full Stack Engineer", averageSalary: 130000, salaryRange: { min: 105000, max: 170000 } },
        { role: "Mobile Engineer", averageSalary: 120000, salaryRange: { min: 95000, max: 155000 } },
        { role: "Systems Engineer", averageSalary: 135000, salaryRange: { min: 110000, max: 180000 } }
      ]
    };
    
    if (role && role.toLowerCase().includes('engineer')) {
      return salaries.engineer;
    }
    
    return salaries.default;
  }
  
  async getJobOpportunities(filters?: {
    location?: string,
    remote?: boolean,
    skills?: string[]
  }): Promise<JobOpportunity[]> {
    // Simulating API call delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const allJobs: JobOpportunity[] = [
      {
        title: "Senior Frontend Developer",
        company: "TechCorp",
        location: "San Francisco, CA",
        remote: true,
        description: "Building responsive web applications with React and TypeScript",
        skills: ["React", "TypeScript", "CSS", "Jest"],
        salary: "$140,000 - $180,000",
        postedDate: "2025-04-02"
      },
      {
        title: "Data Scientist",
        company: "DataWorks",
        location: "New York, NY",
        remote: true,
        description: "Analyzing large datasets to derive insights and build ML models",
        skills: ["Python", "SQL", "Machine Learning", "Statistics"],
        salary: "$130,000 - $170,000",
        postedDate: "2025-04-01"
      },
      {
        title: "Full Stack Engineer",
        company: "GrowthStartup",
        location: "Austin, TX",
        remote: true,
        description: "Building features across the stack for our SaaS platform",
        skills: ["JavaScript", "Node.js", "React", "MongoDB"],
        salary: "$120,000 - $160,000",
        postedDate: "2025-04-03"
      },
      {
        title: "Product Manager",
        company: "ProductHQ",
        location: "Seattle, WA",
        remote: false,
        description: "Leading product development for our enterprise solution",
        skills: ["Product Strategy", "Agile", "User Research"],
        salary: "$140,000 - $180,000",
        postedDate: "2025-04-02"
      },
      {
        title: "DevOps Engineer",
        company: "CloudScale",
        location: "Remote",
        remote: true,
        description: "Building and maintaining our cloud infrastructure",
        skills: ["AWS", "Kubernetes", "Terraform", "CI/CD"],
        salary: "$130,000 - $170,000",
        postedDate: "2025-04-02"
      }
    ];
    
    if (!filters) return allJobs;
    
    return allJobs.filter(job => {
      // Filter by location if specified
      if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase()) && !job.remote) {
        return false;
      }
      
      // Filter by remote if specified
      if (filters.remote === true && !job.remote) {
        return false;
      }
      
      // Filter by skills if specified
      if (filters.skills && filters.skills.length > 0) {
        const hasRequiredSkill = filters.skills.some(skill => 
          job.skills.some(jobSkill => jobSkill.toLowerCase().includes(skill.toLowerCase()))
        );
        if (!hasRequiredSkill) return false;
      }
      
      return true;
    });
  }
}

export const jobMarketService = new JobMarketService();
