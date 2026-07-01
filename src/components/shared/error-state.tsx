import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'An unexpected error occurred while loading this content.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 py-16', className)}>
      <div className="bg-destructive/10 text-destructive flex size-14 items-center justify-center rounded-xl">
        <AlertTriangle className="size-6" />
      </div>
      <p className="text-foreground text-base font-medium">{title}</p>
      {description && (
        <p className="text-muted-foreground max-w-sm text-center text-sm">{description}</p>
      )}
      {onRetry && (
        <Button size="sm" variant="outline" onClick={onRetry} className="mt-2">
          <RefreshCcw className="mr-2 size-4" />
          Retry
        </Button>
      )}
    </div>
  );
}
