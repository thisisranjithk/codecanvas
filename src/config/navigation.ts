import {
  LayoutDashboard,
  FolderKanban,
  Zap,
  Briefcase,
  GraduationCap,
  Award,
  BookOpen,
  type LucideIcon,
  Code2,
} from 'lucide-react';

export interface NavItem {
  label: string;
  icon: LucideIcon;
  path: string;
}

export const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Skills', icon: Zap, path: '/skills' },
  { label: 'Experience', icon: Briefcase, path: '/experience' },
  { label: 'Education', icon: GraduationCap, path: '/education' },
  { label: 'Projects', icon: FolderKanban, path: '/projects' },
  { label: 'Certifications', icon: Award, path: '/certifications' },
  { label: 'Blog', icon: BookOpen, path: '/blog' },
  { label: 'Developer', icon: Code2, path: '/developer' },
];
