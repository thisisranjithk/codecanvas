import { Button } from "@/components/ui/button"

interface PageHeaderProps {
  title: string
  description?: React.ReactNode
  action?: {
    label: string
    onClick: () => void
    icon?: React.ReactNode
  }
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex items-start sm:items-center justify-between gap-4">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        {description && (
          <div className="text-[15px] text-muted-foreground flex items-center gap-1.5 font-medium">
            {description}
          </div>
        )}
      </div>
      {action && (
        <Button size="sm" onClick={action.onClick} className="h-10 px-4 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-medium shrink-0">
          {action.icon}
          {action.label}
        </Button>
      )}
    </div>
  )
}
