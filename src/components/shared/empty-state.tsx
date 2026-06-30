import { Button } from '@/components/ui/button';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = 'py-16',
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className="bg-muted/50 flex size-14 items-center justify-center rounded-xl">
        <Icon className="text-muted-foreground size-6" />
      </div>
      <p className="text-foreground text-base font-medium">{title}</p>
      {description && <p className="text-muted-foreground text-sm">{description}</p>}
      {action && (
        <Button size="sm" variant="outline" onClick={action.onClick} className="mt-1">
          {action.label}
        </Button>
      )}
    </div>
  );
}
