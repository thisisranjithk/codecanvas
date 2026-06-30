import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { RootLayout } from '@/components/layout/root-layout';
import {
  Dashboard,
  Projects,
  Skills,
  Experience,
  Education,
  Certifications,
  Blog,
  Settings,
  Login
} from '@/pages';

// Type for our route's static data
export type RouteStaticData = {
  breadcrumbs: { label: string; path?: string }[];
};

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Dashboard,
  staticData: {
    breadcrumbs: [{ label: 'Dashboard' }],
  } as RouteStaticData,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login,
  staticData: {
    breadcrumbs: [{ label: 'Login', path: '/login' }],
  } as RouteStaticData,
});

const projectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/projects',
  component: Projects,
  staticData: {
    breadcrumbs: [{ label: 'Dashboard', path: '/' }, { label: 'Projects' }],
  } as RouteStaticData,
});

const skillsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/skills',
  component: Skills,
  staticData: {
    breadcrumbs: [{ label: 'Dashboard', path: '/' }, { label: 'Skills' }],
  } as RouteStaticData,
});

const experienceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/experience',
  component: Experience,
  staticData: {
    breadcrumbs: [{ label: 'Dashboard', path: '/' }, { label: 'Experience' }],
  } as RouteStaticData,
});

const educationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/education',
  component: Education,
  staticData: {
    breadcrumbs: [{ label: 'Dashboard', path: '/' }, { label: 'Education' }],
  } as RouteStaticData,
});

const certificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/certifications',
  component: Certifications,
  staticData: {
    breadcrumbs: [{ label: 'Dashboard', path: '/' }, { label: 'Certifications' }],
  } as RouteStaticData,
});

const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog',
  component: Blog,
  staticData: {
    breadcrumbs: [{ label: 'Dashboard', path: '/' }, { label: 'Blog' }],
  } as RouteStaticData,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: Settings,
  staticData: {
    breadcrumbs: [{ label: 'Dashboard', path: '/' }, { label: 'Settings' }],
  } as RouteStaticData,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  projectsRoute,
  skillsRoute,
  experienceRoute,
  educationRoute,
  certificationsRoute,
  blogRoute,
  settingsRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
  interface StaticDataRouteOption {
    breadcrumbs?: { label: string; path?: string }[];
  }
}
