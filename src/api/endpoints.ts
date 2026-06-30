export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me',
    CHANGE_PASSWORD: '/auth/change-password',
    DELETE_ACCOUNT: '/auth/account',
  },

  PROFILE: {
    CREATE: '/profile',
    GET: '/profile',
    UPDATE: '/profile',
    PORTFOLIO_SETTINGS: '/profile/portfolio-settings',
  },

  PROJECTS: {
    LIST: '/projects',
    CREATE: '/projects',
    DETAIL: (id: string) => `/projects/${id}`,
    UPDATE: (id: string) => `/projects/${id}`,
    DELETE: (id: string) => `/projects/${id}`,
  },

  SKILLS: {
    LIST: '/skills',
    CREATE: '/skills',
    DETAIL: (id: string) => `/skills/${id}`,
    UPDATE: (id: string) => `/skills/${id}`,
    DELETE: (id: string) => `/skills/${id}`,
  },

  CATEGORIES: {
    LIST: '/categories',
    CREATE: '/categories',
    DROPDOWN: '/categories/dropdown',
    DETAIL: (id: string) => `/categories/${id}`,
    UPDATE: (id: string) => `/categories/${id}`,
    DELETE: (id: string) => `/categories/${id}`,
  },

  EXPERIENCES: {
    LIST: '/experiences',
    CREATE: '/experiences',
    DETAIL: (id: string) => `/experiences/${id}`,
    UPDATE: (id: string) => `/experiences/${id}`,
    DELETE: (id: string) => `/experiences/${id}`,
  },

  EDUCATIONS: {
    LIST: '/educations',
    CREATE: '/educations',
    DETAIL: (id: string) => `/educations/${id}`,
    UPDATE: (id: string) => `/educations/${id}`,
    DELETE: (id: string) => `/educations/${id}`,
  },

  CERTIFICATIONS: {
    LIST: '/certifications',
    CREATE: '/certifications',
    DETAIL: (id: string) => `/certifications/${id}`,
    UPDATE: (id: string) => `/certifications/${id}`,
    DELETE: (id: string) => `/certifications/${id}`,
  },

  BLOGS: {
    LIST: '/blogs',
    CREATE: '/blogs',
    DETAIL: (id: string) => `/blogs/${id}`,
    UPDATE: (id: string) => `/blogs/${id}`,
    DELETE: (id: string) => `/blogs/${id}`,
  },

  MEDIA: {
    UPLOAD: '/media/upload',
    GET: (id: string) => `/media/${id}`,
    DELETE: (id: string) => `/media/${id}`,
  },

  DASHBOARD: {
    STATS: '/dashboard',
  },

  PORTFOLIO: {
    HOMEPAGE: (username: string) => `/portfolio/${username}`,
    PROJECTS: (username: string) => `/portfolio/${username}/projects`,
    PROJECT_DETAIL: (username: string, id: string) =>
      `/portfolio/${username}/projects/${id}`,
    BLOGS: (username: string) => `/portfolio/${username}/blogs`,
    BLOG_DETAIL: (username: string, slug: string) =>
      `/portfolio/${username}/blogs/${slug}`,
  },

} as const;
