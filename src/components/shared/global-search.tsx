import * as React from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Settings } from 'lucide-react';
import { navItems } from '@/config/navigation';
import { useSearch } from '@/hooks/use-search';

export function GlobalSearch() {
  const { open, setOpen } = useSearch();
  const navigate = useNavigate();

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false);
      command();
    },
    [setOpen]
  );

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {navItems.map((item) => (
            <CommandItem
              key={item.path}
              onSelect={() => runCommand(() => navigate({ to: item.path as any }))}
            >
              <item.icon className="mr-2 size-4" />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem onSelect={() => runCommand(() => navigate({ to: '/settings' }))}>
            <Settings className="mr-2 size-4" />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
