import { Button } from '@/components/ui/button';

interface PageHeaderProps {
  title: string;
  description?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 sm:items-center">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-foreground text-2xl font-bold tracking-tight">{title}</h1>
        {description && (
          <div className="text-muted-foreground flex items-center gap-1.5 text-[15px] font-medium">
            {description}
          </div>
        )}
      </div>
      {action && (
        <Button
          size="sm"
          onClick={action.onClick}
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 shrink-0 gap-2 rounded-md px-4 font-medium"
        >
          {action.icon}
          {action.label}
        </Button>
      )}
    </div>
  );
}
