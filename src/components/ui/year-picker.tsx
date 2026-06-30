import * as React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface YearPickerProps {
  value?: number;
  onChange?: (year: number) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minYear?: number;
  maxYear?: number;
}

export function YearPicker({
  value,
  onChange,
  placeholder = 'Pick a year',
  className,
  disabled = false,
  minYear = 1900,
  maxYear = 2100,
}: YearPickerProps) {
  const [open, setOpen] = React.useState(false);

  // Track the start of the currently viewed decade/12-year block
  const [startYear, setStartYear] = React.useState<number>(
    value ? Math.floor(value / 12) * 12 : Math.floor(new Date().getFullYear() / 12) * 12
  );

  // Reset view when popover opens
  React.useEffect(() => {
    if (open && value) {
      setStartYear(Math.floor(value / 12) * 12);
    } else if (open && !value) {
      setStartYear(Math.floor(new Date().getFullYear() / 12) * 12);
    }
  }, [open, value]);

  const handleSelectYear = (year: number) => {
    onChange?.(year);
    setOpen(false);
  };

  const currentYear = new Date().getFullYear();
  const endYear = startYear + 11;

  // Generate 12 years for the grid
  const years = Array.from({ length: 12 }, (_, i) => startYear + i);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          disabled={disabled}
          className={cn(
            'h-9 w-[120px] justify-start text-left font-normal',
            !value && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
          {value ? <span>{value}</span> : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="border-border/50 w-[280px] rounded-xl p-3 shadow-lg backdrop-blur-sm"
        align="start"
      >
        {/* Header with decade navigation */}
        <div className="flex items-center justify-between pt-1 pb-4">
          <Button
            variant="outline"
            className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
            onClick={() => setStartYear(startYear - 12)}
            disabled={startYear <= minYear}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium">
            {startYear} - {endYear}
          </div>
          <Button
            variant="outline"
            className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
            onClick={() => setStartYear(startYear + 12)}
            disabled={endYear >= maxYear}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Years grid */}
        <div className="grid grid-cols-3 gap-2">
          {years.map((year) => {
            const isSelected = value === year;
            const isToday = currentYear === year;
            const isDisabled = year < minYear || year > maxYear;

            return (
              <Button
                key={year}
                variant={isSelected ? 'default' : 'ghost'}
                disabled={isDisabled}
                className={cn(
                  'h-9 w-full text-sm font-normal',
                  isToday && !isSelected && 'bg-accent text-accent-foreground',
                  isSelected &&
                    'hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground'
                )}
                onClick={() => handleSelectYear(year)}
              >
                {year}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
