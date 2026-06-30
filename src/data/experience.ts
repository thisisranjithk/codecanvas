import type { Experience } from '@/types';

export const mockExperience: Experience[] = [
  {
    id: '1',
    company: 'Vercel',
    role: 'Senior Software Engineer',
    type: 'Full-time',
    location: 'Remote',
    startDate: '2022-03',
    endDate: null,
    current: true,
    description:
      'Leading frontend infrastructure for the Vercel dashboard. Architected a new component system adopted across 12 teams.',
    responsibilities: [
      'Architected and deployed new edge computing features serving millions of requests daily.',
      'Mentored junior engineers and led technical design discussions.',
      'Optimized build times by 40% through aggressive caching strategies.',
    ],
    technologies: ['Next.js', 'React', 'TypeScript', 'Go', 'Postgres'],
    logo: 'V',
  },
  {
    id: '2',
    company: 'Stripe',
    role: 'Software Engineer II',
    type: 'Full-time',
    location: 'San Francisco, CA',
    startDate: '2020-06',
    endDate: '2022-02',
    current: false,
    description:
      'Leading the core infrastructure team. Responsible for architecture and deployment of new edge computing features.',
    responsibilities: [
      'Developed reusable UI components and maintained design systems.',
      'Implemented responsive designs and cross-browser compatibility.',
      'Integrated REST APIs and handled state management using React Context.',
    ],
    technologies: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Go'],
    logo: 'S',
  },
  {
    id: '3',
    company: 'Linear',
    role: 'Frontend Engineer',
    type: 'Contract',
    location: 'Remote',
    startDate: '2019-09',
    endDate: '2020-05',
    current: false,
    description:
      'Developed and maintained the Stripe Dashboard. Improved performance and accessibility across the platform.',
    responsibilities: [
      'Built the initial version of the issue tracker from scratch.',
      'Set up CI/CD pipelines and automated testing with GitHub Actions.',
      'Collaborated with product designers to implement pixel-perfect UIs.',
    ],
    technologies: ['React', 'TypeScript', 'GraphQL', 'Jest', 'Cypress'],
    logo: 'L',
  },
  {
    id: '4',
    company: 'Freelance',
    role: 'Full Stack Developer',
    type: 'Freelance',
    location: 'Remote',
    startDate: '2018-01',
    endDate: '2019-08',
    current: false,
    description:
      'Delivered 15+ web applications for clients across fintech, healthcare, and e-commerce sectors. Specialized in React frontends with Node.js/Express backends.',
    responsibilities: [
      'Gathered requirements from clients and delivered full-stack web applications.',
      'Integrated third-party payment gateways and mapping services.',
      'Provided post-launch support and ongoing maintenance for legacy systems.',
    ],
    technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'AWS'],
    logo: 'F',
  },
];
