import * as React from "react"

export function useSearch() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    const handleOpenSearch = () => setOpen(true)
    
    document.addEventListener("keydown", down)
    window.addEventListener("open-global-search", handleOpenSearch)
    
    return () => {
      document.removeEventListener("keydown", down)
      window.removeEventListener("open-global-search", handleOpenSearch)
    }
  }, [])

  return {
    open,
    setOpen,
  }
}
