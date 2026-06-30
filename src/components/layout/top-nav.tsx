import { Search, ChevronRight } from 'lucide-react';
import { Link, useMatches } from '@tanstack/react-router';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/shared/mode-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { mockUser } from '@/data/user';

export function TopNav() {
  const matches = useMatches();
  const currentMatch = matches[matches.length - 1];
  const breadcrumbs =
    (currentMatch?.staticData?.breadcrumbs as { label: string; path?: string }[]) || [];

  return (
    <header className="border-border/60 bg-background/90 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b px-4 backdrop-blur">
      <SidebarTrigger className="hover:bg-accent size-8" />
      <Separator orientation="vertical" className="bg-border/60 h-4" />

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-sm">
        {breadcrumbs.map((crumb, i) => (
          <div key={crumb.label} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="text-muted-foreground/60 size-3.5" />}
            {crumb.path && i < breadcrumbs.length - 1 ? (
              <Link
                to={crumb.path}
                className="text-muted-foreground hover:text-foreground transition-colors duration-150"
              >
                {crumb.label}
              </Link>
            ) : (
              <span
                className={
                  i === breadcrumbs.length - 1
                    ? 'text-foreground font-semibold'
                    : 'text-muted-foreground'
                }
              >
                {crumb.label}
              </span>
            )}
          </div>
        ))}
      </nav>

      {/* Right side */}
      <div className="ml-auto flex items-center gap-2">
        {/* Global Search */}
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-accent-foreground hover:bg-accent hidden h-8 items-center gap-2 px-2 md:flex"
          onClick={() => window.dispatchEvent(new Event('open-global-search'))}
        >
          <Search className="size-4" />
          <kbd className="border-border/60 bg-muted/50 text-muted-foreground pointer-events-none flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-xs font-medium opacity-100 select-none">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>

        <ModeToggle />

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="hover:bg-accent size-8 rounded-full">
              <Avatar className="ring-border size-7 ring-1">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                  {mockUser.avatar}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold">{mockUser.name}</span>
                <span className="text-muted-foreground text-xs">{mockUser.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/settings" className="w-full cursor-pointer">
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>View Portfolio</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
