export const queryKeys = {
  auth: {
    all: () => ['auth'] as const,
    me: () => [...queryKeys.auth.all(), 'me'] as const,
  },

  profile: {
    all: () => ['profile'] as const,
    get: () => [...queryKeys.profile.all(), 'get'] as const,
    portfolioSettings: () => [...queryKeys.profile.all(), 'portfolio-settings'] as const,
  },

  projects: {
    all: () => ['projects'] as const,
    lists: () => [...queryKeys.projects.all(), 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.projects.lists(), filters] as const,
    details: () => [...queryKeys.projects.all(), 'detail'] as const,
    detail: (id: string) => [...queryKeys.projects.details(), id] as const,
  },

  skills: {
    all: () => ['skills'] as const,
    lists: () => [...queryKeys.skills.all(), 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.skills.lists(), filters] as const,
    details: () => [...queryKeys.skills.all(), 'detail'] as const,
    detail: (id: string) => [...queryKeys.skills.details(), id] as const,
  },

  categories: {
    all: () => ['categories'] as const,
    lists: () => [...queryKeys.categories.all(), 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.categories.lists(), filters] as const,
    dropdown: () => [...queryKeys.categories.all(), 'dropdown'] as const,
    details: () => [...queryKeys.categories.all(), 'detail'] as const,
    detail: (id: string) => [...queryKeys.categories.details(), id] as const,
  },

  experiences: {
    all: () => ['experiences'] as const,
    lists: () => [...queryKeys.experiences.all(), 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.experiences.lists(), filters] as const,
    details: () => [...queryKeys.experiences.all(), 'detail'] as const,
    detail: (id: string) => [...queryKeys.experiences.details(), id] as const,
  },

  educations: {
    all: () => ['educations'] as const,
    lists: () => [...queryKeys.educations.all(), 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.educations.lists(), filters] as const,
    details: () => [...queryKeys.educations.all(), 'detail'] as const,
    detail: (id: string) => [...queryKeys.educations.details(), id] as const,
  },

  certifications: {
    all: () => ['certifications'] as const,
    lists: () => [...queryKeys.certifications.all(), 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.certifications.lists(), filters] as const,
    details: () => [...queryKeys.certifications.all(), 'detail'] as const,
    detail: (id: string) => [...queryKeys.certifications.details(), id] as const,
  },

  blogs: {
    all: () => ['blogs'] as const,
    lists: () => [...queryKeys.blogs.all(), 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...queryKeys.blogs.lists(), filters] as const,
    details: () => [...queryKeys.blogs.all(), 'detail'] as const,
    detail: (id: string) => [...queryKeys.blogs.details(), id] as const,
  },

  media: {
    all: () => ['media'] as const,
    detail: (id: string) => [...queryKeys.media.all(), id] as const,
  },

  dashboard: {
    all: () => ['dashboard'] as const,
    stats: () => [...queryKeys.dashboard.all(), 'stats'] as const,
  },

  portfolio: {
    all: () => ['portfolio'] as const,
    homepage: (username: string) =>
      [...queryKeys.portfolio.all(), username] as const,
    projects: (username: string) =>
      [...queryKeys.portfolio.all(), username, 'projects'] as const,
    projectDetail: (username: string, id: string) =>
      [...queryKeys.portfolio.all(), username, 'projects', id] as const,
    blogs: (username: string) =>
      [...queryKeys.portfolio.all(), username, 'blogs'] as const,
    blogDetail: (username: string, slug: string) =>
      [...queryKeys.portfolio.all(), username, 'blogs', slug] as const,
  },
} as const;
