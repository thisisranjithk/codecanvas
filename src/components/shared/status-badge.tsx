import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type StatusType = 'published' | 'draft' | 'archived' | string;

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusStyles: Record<string, string> = {
  published: 'bg-success/8 text-success border-success/20',
  draft: 'bg-warning/8 text-warning border-warning/20',
  archived: 'bg-muted text-muted-foreground border-border',
};

const aliases: Record<string, string> = {
  published: statusStyles.published,
  draft: statusStyles.draft,
  archived: statusStyles.archived,
  'blog-published': 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  'blog-draft': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const style =
    aliases[status] ||
    aliases[`blog-${status}`] ||
    statusStyles[status] ||
    'bg-muted text-muted-foreground border-border';

  return (
    <Badge
      variant="outline"
      className={cn('h-5 px-1.5 text-[11px] font-medium capitalize', style, className)}
    >
      {status}
    </Badge>
  );
}
