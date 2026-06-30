'use client';

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="text-success size-4" />,
        info: <InfoIcon className="text-info size-4" />,
        warning: <TriangleAlertIcon className="text-warning size-4" />,
        error: <OctagonXIcon className="text-destructive size-4" />,
        loading: <Loader2Icon className="text-primary size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            'group border-border/60 shadow-lg shadow-black/5 dark:shadow-black/20 rounded-lg text-sm',
          title: 'font-semibold text-foreground',
          description: 'text-xs text-muted-foreground',
          actionButton:
            'text-xs font-medium bg-primary text-primary-foreground rounded-md px-2.5 py-1',
          cancelButton: 'text-xs font-medium text-muted-foreground hover:text-foreground',
        },
      }}
      style={
        {
          '--normal-bg': 'var(--card)',
          '--normal-text': 'var(--card-foreground)',
          '--normal-border': 'var(--border)',
          '--border-radius': 'var(--radius)',
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
