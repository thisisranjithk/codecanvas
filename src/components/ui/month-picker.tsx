import * as React from "react"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { format, setMonth, setYear } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface MonthPickerProps {
  value?: Date
  onChange?: (date: Date) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr",
  "May", "Jun", "Jul", "Aug",
  "Sep", "Oct", "Nov", "Dec"
]

export function MonthPicker({
  value,
  onChange,
  placeholder = "Pick a month",
  className,
  disabled = false,
}: MonthPickerProps) {
  const [open, setOpen] = React.useState(false)

  // Track the currently viewed year in the popover
  const [viewYear, setViewYear] = React.useState<number>(value ? value.getFullYear() : new Date().getFullYear())

  // Reset view year when popover opens
  React.useEffect(() => {
    if (open && value) {
      setViewYear(value.getFullYear())
    } else if (open && !value) {
      setViewYear(new Date().getFullYear())
    }
  }, [open, value])

  const handleSelectMonth = (monthIndex: number) => {
    const newDate = setMonth(setYear(new Date(), viewYear), monthIndex)
    onChange?.(newDate)
    setOpen(false)
  }

  const selectedMonth = value ? value.getMonth() : undefined
  const selectedYear = value ? value.getFullYear() : undefined

  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          disabled={disabled}
          className={cn(
            "w-[240px] justify-start text-left font-normal h-9",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />
          {value ? format(value, "MMMM yyyy") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-3 rounded-xl shadow-lg border-border/50 backdrop-blur-sm" align="start">
        {/* Header with year navigation */}
        <div className="flex items-center justify-between pt-1 pb-4">
          <Button
            variant="outline"
            className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
            onClick={() => setViewYear(viewYear - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium">{viewYear}</div>
          <Button
            variant="outline"
            className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
            onClick={() => setViewYear(viewYear + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Months grid */}
        <div className="grid grid-cols-3 gap-2">
          {MONTHS.map((month, index) => {
            const isSelected = selectedMonth === index && selectedYear === viewYear
            const isToday = currentMonth === index && currentYear === viewYear

            return (
              <Button
                key={month}
                variant={isSelected ? "default" : "ghost"}
                className={cn(
                  "h-9 w-full text-sm font-normal",
                  isToday && !isSelected && "bg-accent text-accent-foreground",
                  isSelected && "hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground"
                )}
                onClick={() => handleSelectMonth(index)}
              >
                {month}
              </Button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
