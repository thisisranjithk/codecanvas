import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'default' | 'lg' | 'xl';
  text?: string;
  variant?: 'default' | 'fullscreen' | 'section';
}

export function Loader({
  className,
  size = 'default',
  text,
  variant = 'default',
  ...props
}: LoaderProps) {
  const sizeClasses = {
    sm: 'size-4',
    default: 'size-8',
    lg: 'size-12',
    xl: 'size-16',
  };

  const containerClasses = {
    default: 'flex flex-col items-center justify-center p-4',
    section: 'flex flex-col h-[calc(100vh-4rem)] w-full items-center justify-center',
    fullscreen: 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm',
  };

  return (
    <div className={cn(containerClasses[variant], className)} {...props}>
      <div className="relative flex items-center justify-center">
        {/* Outer glowing pulse */}
        <div
          className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse"
        />
        {/* Main spinner */}
        <Loader2
          className={cn('relative z-10 animate-spin text-primary', sizeClasses[size])}
        />
      </div>
      {text && (
        <p className="mt-4 text-sm font-medium text-muted-foreground animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}
