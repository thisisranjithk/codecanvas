import { Search, ChevronRight } from "lucide-react"
import { Link, useMatches } from "@tanstack/react-router"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ModeToggle } from "@/components/mode-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { mockUser } from "@/data/mock"

export function TopNav() {
  const matches = useMatches()
  const currentMatch = matches[matches.length - 1]
  const breadcrumbs = (currentMatch?.staticData?.breadcrumbs as { label: string; path?: string }[]) || []

  return (
    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b border-border/60 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/80 px-4">
      <SidebarTrigger className="size-8 hover:bg-accent" />
      <Separator orientation="vertical" className="h-4 bg-border/60" />

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-sm">
        {breadcrumbs.map((crumb, i) => (
          <div key={crumb.label} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="size-3.5 text-muted-foreground/60" />}
            {crumb.path && i < breadcrumbs.length - 1 ? (
              <Link
                to={crumb.path}
                className="text-muted-foreground hover:text-foreground transition-colors duration-150"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className={i === breadcrumbs.length - 1 ? "font-semibold text-foreground" : "text-muted-foreground"}>
                {crumb.label}
              </span>
            )}
          </div>
        ))}
      </nav>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-2">
        {/* Global Search */}
        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-2.5 size-3.5 text-muted-foreground/60 pointer-events-none" />
          <Input
            placeholder="Search..."
            className="h-8 w-48 pl-8 pr-3 text-sm bg-muted/40 border-0 focus-visible:ring-1 focus-visible:ring-ring/50 focus-visible:bg-background rounded-md"
          />
          <kbd className="absolute right-2 pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-border/60 bg-muted/60 px-1.5 font-mono text-[10px] font-medium opacity-60 sm:flex">
            ⌘K
          </kbd>
        </div>

        <ModeToggle />

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8 rounded-full hover:bg-accent">
              <Avatar className="size-7 ring-1 ring-border">
                <AvatarFallback className="text-xs bg-primary text-primary-foreground font-semibold">
                  {mockUser.avatar}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-sm">{mockUser.name}</span>
                <span className="text-xs text-muted-foreground">{mockUser.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/settings" className="w-full cursor-pointer">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>View Portfolio</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
