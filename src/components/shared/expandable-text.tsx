import { useState, useLayoutEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExpandableTextProps {
  text: string;
  lines?: 2 | 3 | 4;
  className?: string;
}

const CLAMP_CLASSES: Record<number, string> = {
  2: 'line-clamp-2',
  3: 'line-clamp-3',
  4: 'line-clamp-4',
};


export function ExpandableText({ text, lines = 3, className }: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsToggle, setNeedsToggle] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prev = el.style.webkitLineClamp;
    el.style.webkitLineClamp = String(lines);
    const clamped = el.scrollHeight > el.clientHeight + 1;
    el.style.webkitLineClamp = prev;
    setNeedsToggle(clamped);
  }, [text, lines]);

  const clampClass = CLAMP_CLASSES[lines] ?? 'line-clamp-3';

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <p
        ref={ref}
        className={cn(
          'text-muted-foreground text-sm leading-relaxed',
          !isExpanded && clampClass
        )}
      >
        {text}
      </p>

      {needsToggle && (
        <button
          type="button"
          onClick={() => setIsExpanded((v) => !v)}
          className="text-primary/60 hover:text-primary mt-0.5 flex items-center gap-0.5 self-start text-xs font-medium transition-colors"
        >
          {isExpanded ? 'Show less' : 'Show more'}
          <ChevronDown
            className={cn(
              'size-3 transition-transform duration-200',
              isExpanded && 'rotate-180'
            )}
          />
        </button>
      )}
    </div>
  );
}
