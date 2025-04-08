
import React from 'react';
import { CodesandboxIcon, DatabaseIcon, LineChartIcon, GlobeIcon, BrainIcon } from 'lucide-react';
import TrendCard from './TrendCard';

const techSkills = [
  "Machine Learning & AI",
  "Cloud Computing (AWS, Azure, GCP)",
  "Data Science & Analytics",
  "Full-Stack Development",
  "Cybersecurity"
];

const softSkills = [
  "Adaptability & Resilience",
  "Remote Collaboration",
  "Critical Thinking",
  "Communication",
  "Project Management"
];

const remoteJobs = [
  "Software Engineering",
  "Digital Marketing",
  "UX/UI Design",
  "Technical Writing",
  "Customer Success"
];

const salaryTrends = [
  "DevOps Engineers: $120k-$175k",
  "Data Scientists: $115k-$165k",
  "Full-Stack Developers: $100k-$150k",
  "Blockchain Developers: $140k-$200k",
  "AI Specialists: $130k-$190k"
];

const TrendingSkills = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <TrendCard 
        title="Top Technical Skills" 
        items={techSkills} 
        icon={<CodesandboxIcon className="h-5 w-5 text-brand-purple" />}
      />
      <TrendCard 
        title="In-Demand Soft Skills" 
        items={softSkills}
        icon={<BrainIcon className="h-5 w-5 text-brand-purple" />}
      />
      <TrendCard 
        title="Remote Job Opportunities" 
        items={remoteJobs}
        icon={<GlobeIcon className="h-5 w-5 text-brand-purple" />}
      />
      <TrendCard 
        title="Salary Trends" 
        items={salaryTrends}
        icon={<LineChartIcon className="h-5 w-5 text-brand-purple" />}
      />
    </div>
  );
};

export default TrendingSkills;
