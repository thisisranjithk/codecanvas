import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Users, Trophy, GraduationCap, Briefcase } from "lucide-react"
import React from "react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Present"
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export function formatPublishDate(dateString: string | null): string {
  if (!dateString) return "Unpublished"
  const d = new Date(dateString)
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export function formatNumber(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + "k"
  return n.toString()
}

export function getSkillProficiencyLabel(proficiency: number): string {
  if (proficiency >= 90) return "Expert"
  if (proficiency >= 75) return "Advanced"
  if (proficiency >= 55) return "Intermediate"
  return "Beginner"
}

export function getSkillProficiencyBadgeClass(proficiency: number): string {
  if (proficiency >= 90) return "bg-primary/10 text-primary border-primary/20"
  if (proficiency >= 75) return "bg-secondary text-secondary-foreground border-transparent"
  if (proficiency >= 55) return "bg-muted text-muted-foreground border-border/50"
  return "bg-background text-muted-foreground border-border/50"
}

export function getEmploymentDuration(start: string, end: string | null): string {
  const d1 = new Date(start)
  const d2 = end ? new Date(end) : new Date()

  let months = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth())
  if (months < 0) months = 0

  months += 1

  const years = Math.floor(months / 12)
  const remMonths = months % 12

  if (years > 0 && remMonths > 0) return `${years} yr ${remMonths} mos`
  if (years > 0) return `${years} yr`
  return `${remMonths} mos`
}

export function getEducationActivityIcon(activity: string): React.ReactNode {
  const lower = activity.toLowerCase()
  if (lower.includes("president") || lower.includes("member") || lower.includes("club") || lower.includes("chapter")) {
    return React.createElement(Users, { className: "size-3.5 text-primary" })
  }
  if (lower.includes("hackathon") || lower.includes("award") || lower.includes("winner")) {
    return React.createElement(Trophy, { className: "size-3.5 text-emerald-500" })
  }
  if (lower.includes("teaching") || lower.includes("assistant") || lower.includes("tutor")) {
    return React.createElement(GraduationCap, { className: "size-3.5 text-blue-500" })
  }
  return React.createElement(Briefcase, { className: "size-3.5 text-muted-foreground" })
}
