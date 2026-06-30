import type { Stats, ProfileCompletion, ActivityFeedItem, ChartData } from '@/types';

export const mockStats: Stats = {
  totalProjects: 6,
  publishedProjects: 4,
  totalBlogs: 5,
  publishedBlogs: 4,
  totalSkills: 12,
  totalViews: 14000,
  thisMonthViews: 3200,
  viewsGrowth: 12.4,
};

export const mockProfileCompletion: ProfileCompletion = {
  percentage: 85,
  checklist: [
    { label: 'Personal Information', done: true },
    { label: 'Profile Picture', done: true },
    { label: 'Bio / About', done: true },
    { label: 'Social Links', done: true },
    { label: 'Skills', done: true },
    { label: 'Projects', done: true },
    { label: 'Experience', done: true },
    { label: 'Education', done: false },
    { label: 'Certifications', done: false },
    { label: 'Blog Posts', done: false },
  ],
};

export const mockActivityFeed: ActivityFeedItem[] = [
  {
    id: '1',
    type: 'project',
    text: "Project 'AI Writing Assistant' updated",
    time: '2 hours ago',
    icon: 'code-2',
  },
  {
    id: '2',
    type: 'blog',
    text: "Blog post 'Real-time Collaborative Editor' hit 8,000 views",
    time: '5 hours ago',
    icon: 'trending-up',
  },
  {
    id: '3',
    type: 'project',
    text: "Project 'Mobile Finance Tracker' created",
    time: '1 day ago',
    icon: 'plus-circle',
  },
  {
    id: '4',
    type: 'blog',
    text: "Draft saved: 'Shipping a Design System'",
    time: '2 days ago',
    icon: 'file-pen',
  },
  { id: '5', type: 'cert', text: 'AWS certification renewed', time: '3 days ago', icon: 'award' },
  {
    id: '6',
    type: 'project',
    text: "Project 'E-Commerce Platform' published",
    time: '4 days ago',
    icon: 'globe',
  },
];

export const mockChartData: ChartData = {
  monthlyViews: [
    { month: 'Oct', views: 1800, visitors: 940 },
    { month: 'Nov', views: 2200, visitors: 1100 },
    { month: 'Dec', views: 1600, visitors: 820 },
    { month: 'Jan', views: 2800, visitors: 1350 },
    { month: 'Feb', views: 3100, visitors: 1500 },
    { month: 'Mar', views: 2900, visitors: 1420 },
    { month: 'Apr', views: 3200, visitors: 1580 },
  ],
  projectCategories: [
    { name: 'Full Stack', count: 2 },
    { name: 'AI / ML', count: 1 },
    { name: 'Data / Analytics', count: 1 },
    { name: 'Mobile', count: 1 },
    { name: 'UI / Design', count: 1 },
  ],
  blogTags: [
    { name: 'Engineering', count: 3 },
    { name: 'Reviews', count: 1 },
    { name: 'Design', count: 1 },
  ],
};
