import * as React from "react"
import { useNavigate } from "@tanstack/react-router"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { 
  LayoutDashboard, 
  Briefcase, 
  Code2, 
  History, 
  GraduationCap, 
  Award, 
  FileText, 
  Settings 
} from "lucide-react"
import { useSearch } from "@/hooks/use-search"

export function GlobalSearch() {
  const { open, setOpen } = useSearch()
  const navigate = useNavigate()

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [setOpen])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => navigate({ to: "/" }))}>
            <LayoutDashboard className="mr-2 size-4" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate({ to: "/projects" }))}>
            <Briefcase className="mr-2 size-4" />
            <span>Projects</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate({ to: "/skills" }))}>
            <Code2 className="mr-2 size-4" />
            <span>Skills</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate({ to: "/experience" }))}>
            <History className="mr-2 size-4" />
            <span>Experience</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate({ to: "/education" }))}>
            <GraduationCap className="mr-2 size-4" />
            <span>Education</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate({ to: "/certifications" }))}>
            <Award className="mr-2 size-4" />
            <span>Certifications</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate({ to: "/blog" }))}>
            <FileText className="mr-2 size-4" />
            <span>Blog</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem onSelect={() => runCommand(() => navigate({ to: "/settings" }))}>
            <Settings className="mr-2 size-4" />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
