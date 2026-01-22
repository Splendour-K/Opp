
import { Opportunity, Deadline } from './types';

// Helper to get a date X days from now
const daysFromNow = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
};

export const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: '1',
    title: 'Tech Innovation Grant 2024',
    type: 'Grant',
    description: 'Funding for startups focusing on decentralized infrastructure and green computing solutions.',
    organization: 'Global Science Found.',
    amount: '$50,000',
    deadline: '2 Days Left',
    deadlineDate: daysFromNow(2),
    isUrgent: true,
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1000',
    matchScore: 98,
    source: {
      name: 'Global Science Foundation',
      url: 'https://example.com/grants/tech-innovation-2024'
    }
  },
  {
    id: '2',
    title: 'Global Venture Fund',
    type: 'Investment',
    description: 'Equity-based investment program for early-stage B2B SaaS platforms with proven traction.',
    organization: 'Strategic Equity Partners',
    amount: '$250k - $1M',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000',
    matchScore: 85,
    source: {
      name: 'Strategic Equity Partners Portal',
      url: 'https://example.com/investment/global-fund'
    }
  },
  {
    id: '3',
    title: 'Design Leadership Conference',
    type: 'Conference',
    description: 'Join 5,000 global designers for a 3-day immersive experience in San Francisco.',
    organization: 'Creative Agency Co.',
    amount: 'Full Travel Grant',
    deadline: '1 Day Left',
    deadlineDate: daysFromNow(1),
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000',
    matchScore: 92,
    source: {
      name: 'DesignLeadership 2024',
      url: 'https://example.com/conferences/design-leadership'
    }
  },
  {
    id: '4',
    title: 'HealthTech Series A Accelerator',
    type: 'Accelerator',
    description: 'Equity-free funding and 6 months of mentorship for scalable digital health solutions focused on patient care.',
    organization: 'MediGrowth Labs',
    amount: '$250k - $500k',
    matchScore: 98,
    tags: ['Biotech', 'Health'],
    source: {
      name: 'MediGrowth Official',
      url: 'https://example.com/accelerators/healthtech'
    }
  }
];

export const MOCK_DEADLINES: Deadline[] = [
  {
    id: 'd1',
    title: 'CleanTech Innovation Grant',
    organization: 'Dept. of Energy',
    timeLeft: '48h left',
    deadlineDate: daysFromNow(2),
    progress: 85,
    isUrgent: true
  },
  {
    id: 'd2',
    title: 'Global VC Seed Fund 2024',
    organization: 'Vanguard Partners',
    timeLeft: '4 days left',
    deadlineDate: daysFromNow(4),
    progress: 40
  }
];
