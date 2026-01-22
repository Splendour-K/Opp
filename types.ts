
export type OpportunityType = 'Grant' | 'Investment' | 'Internship' | 'Growth' | 'Accelerator' | 'Fellowship' | 'Conference' | 'Job' | 'Scholarship';

export type TaskStatus = 'Yet to Start' | 'Started' | 'Finished' | 'Submitted';

export interface OpportunitySource {
  name: string;
  url: string;
}

export interface UserSettings {
  reminderThreshold: number; // in days
}

export interface Opportunity {
  id: string;
  title: string;
  type: OpportunityType;
  description: string;
  content?: string;
  organization: string;
  amount: string;
  deadline?: string;
  deadlineDate?: string; // ISO format for calculation
  tags?: string[];
  imageUrl?: string;
  imageUrls?: string[]; 
  isUrgent?: boolean;
  source?: OpportunitySource;
  matchScore?: number;
}

export interface UserTask {
  id: string;
  opportunityId: string;
  status: TaskStatus;
  addedAt: string;
}

export interface Deadline {
  id: string;
  title: string;
  organization: string;
  timeLeft: string;
  deadlineDate?: string; // ISO format
  progress: number;
  isUrgent?: boolean;
}
