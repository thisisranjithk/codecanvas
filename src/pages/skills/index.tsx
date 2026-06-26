import { useState, useMemo } from "react"
import {
  Plus, Search, Pencil, Trash2, MoreHorizontal, Code2,
  ChevronDown, ChevronRight, Terminal, Layers, Server,
  Database, Cloud, PenTool, type LucideIcon,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { mockSkills } from "@/data/skills"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog"

type Skill = typeof mockSkills[0]

const categoryIcons: Record<string, LucideIcon> = {
  "Languages": Terminal,
  "Frontend": Layers,
  "Backend": Server,
  "Databases": Database,
  "Cloud / DevOps": Cloud,
  "Design": PenTool,
}

function getProficiencyLabel(p: number) {
  if (p >= 90) return "Expert"
  if (p >= 75) return "Advanced"
  if (p >= 55) return "Intermediate"
  return "Beginner"
}

function getProficiencyBadgeClass(p: number) {
  if (p >= 90) return "bg-primary/10 text-primary border-primary/20"
  if (p >= 75) return "bg-secondary text-secondary-foreground border-transparent"
  if (p >= 55) return "bg-muted text-muted-foreground border-border/50"
  return "bg-background text-muted-foreground border-border/50"
}

export function Skills() {
  const [skills, setSkills] = useState(mockSkills)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<Skill | null>(null)
  const [proficiency, setProficiency] = useState(80)
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const categories = useMemo(() => Array.from(new Set(mockSkills.map((s) => s.category))), [])

  const filtered = useMemo(() => {
    return skills.filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase())
      const matchCat = categoryFilter === "all" || s.category === categoryFilter
      return matchSearch && matchCat
    })
  }, [skills, search, categoryFilter])

  const grouped = useMemo(() => {
    return categories.reduce<Record<string, Skill[]>>((acc, cat) => {
      const inCategory = filtered.filter((s) => s.category === cat)
      if (inCategory.length > 0) acc[cat] = inCategory
      return acc
    }, {})
  }, [categories, filtered])

  function handleDelete(skill: Skill) {
    setSkills((prev) => prev.filter((s) => s.id !== skill.id))
    setDeleteDialog(null)
    toast.success(`"${skill.name}" removed`)
  }

  function openEdit(skill: Skill) {
    setEditingSkill(skill)
    setProficiency(skill.proficiency)
    setDialogOpen(true)
  }

  function openNew() {
    setEditingSkill(null)
    setProficiency(80)
    setDialogOpen(true)
  }

  function toggleCollapse(cat: string) {
    setCollapsed((prev) => ({ ...prev, [cat]: !prev[cat] }))
  }

  return (
    <div className="flex flex-col gap-5 p-6 animate-fade-in">
      {/* Header */}
      <PageHeader
        title="Skills"
        description={`${skills.length} skills across ${categories.length} categories`}
        action={{ label: "Add Skill", onClick: openNew, icon: <Plus className="size-4" /> }}
      />

      {/* Filters */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60 pointer-events-none" />
          <Input
            placeholder="Search skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-44 h-9 text-sm">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>


      {/* Grouped Skills */}
      {Object.entries(grouped).length === 0 ? (
        <EmptyState
          icon={Code2}
          title="No skills found"
          action={{ label: "Clear filters", onClick: () => { setSearch(""); setCategoryFilter("all") } }}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {Object.entries(grouped).map(([cat, catSkills]) => {
            const Icon = categoryIcons[cat] ?? Code2
            const isCollapsed = collapsed[cat]
            const avg = Math.round(catSkills.reduce((sum, s) => sum + s.proficiency, 0) / catSkills.length)

            return (
              <div key={cat} className="flex flex-col gap-3">
                {/* Section Header */}
                <button
                  onClick={() => toggleCollapse(cat)}
                  className="flex items-center gap-2 group py-1"
                >
                  {isCollapsed ? (
                    <ChevronRight className="size-4 text-muted-foreground/60 group-hover:text-foreground transition-colors" />
                  ) : (
                    <ChevronDown className="size-4 text-muted-foreground/60 group-hover:text-foreground transition-colors" />
                  )}
                  <Icon className="size-4 text-muted-foreground/60" />
                  <h2 className="text-[15px] font-semibold tracking-tight text-foreground">
                    {cat}
                  </h2>
                  <Badge variant="secondary" className="ml-1 text-[10px] h-4 px-1.5 bg-muted">
                    {catSkills.length}
                  </Badge>
                  <div className="ml-auto flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs text-muted-foreground">Avg {avg}%</span>
                    <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary/40"
                        style={{ width: `${avg}%` }}
                      />
                    </div>
                  </div>
                </button>

                {/* Skill Cards */}
                {!isCollapsed && (
                  <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 pl-6">
                    {catSkills.map((skill) => (
                      <Card
                        key={skill.id}
                        className={cn(
                          "group border-border/60 transition-all duration-200",
                          "hover:shadow-md hover:-translate-y-0.5 hover:border-border"
                        )}
                      >
                        <CardContent className="p-3.5 flex flex-col gap-2.5">
                          {/* Top row: icon + name + menu */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="flex size-8 items-center justify-center rounded-md shrink-0 bg-muted/50 border border-border/40 text-muted-foreground">
                                <Code2 className="size-4" />
                              </div>
                              <span className="text-base font-medium truncate">{skill.name}</span>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 -mr-1"
                                >
                                  <MoreHorizontal className="size-4 text-muted-foreground" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-36">
                                <DropdownMenuItem onClick={() => openEdit(skill)}>
                                  <Pencil className="size-3.5 mr-2" />Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => setDeleteDialog(skill)}
                                >
                                  <Trash2 className="size-3.5 mr-2" />Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {/* Proficiency bar */}
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground font-medium">Proficiency</span>
                              <span className="text-sm font-semibold tabular-nums">{skill.proficiency}%</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-700 ease-out bg-primary"
                                style={{ width: `${skill.proficiency}%` }}
                              />
                            </div>
                          </div>

                          {/* Bottom row: years + level badge */}
                          <div className="flex items-center justify-between pt-0.5">
                            <span className="text-xs text-muted-foreground">
                              {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? "year" : "years"} exp.
                            </span>
                            <Badge
                              variant="outline"
                              className={cn("text-[11px] h-5 px-1.5 font-medium", getProficiencyBadgeClass(skill.proficiency))}
                            >
                              {getProficiencyLabel(skill.proficiency)}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Edit/New Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg">
              {editingSkill ? "Edit Skill" : "Add Skill"}
            </DialogTitle>
            <DialogDescription className="text-sm">
              {editingSkill ? "Update skill details." : "Add a new skill to your portfolio."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-1">
            <div className="grid gap-2">
              <Label className="text-sm">Skill Name</Label>
              <Input
                defaultValue={editingSkill?.name}
                placeholder="e.g. TypeScript"
                className="h-9 text-sm"
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-sm">Category</Label>
              <Select defaultValue={editingSkill?.category ?? "Frontend"}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Proficiency</Label>
                <span className="text-sm font-medium tabular-nums">
                  {proficiency}% — {getProficiencyLabel(proficiency)}
                </span>
              </div>
              <Slider
                value={[proficiency]}
                onValueChange={([v]) => setProficiency(v)}
                min={0}
                max={100}
                step={1}
              />
            </div>
            <div className="grid gap-2">
              <Label className="text-sm">Years of Experience</Label>
              <Input
                type="number"
                defaultValue={editingSkill?.yearsOfExperience}
                placeholder="e.g. 3"
                min={0}
                max={30}
                className="h-9 text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setDialogOpen(false)
                toast.success(editingSkill ? "Skill updated" : "Skill added")
              }}
            >
              {editingSkill ? "Save Changes" : "Add Skill"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <ConfirmDeleteDialog
        isOpen={!!deleteDialog}
        onClose={() => setDeleteDialog(null)}
        onConfirm={() => deleteDialog && handleDelete(deleteDialog)}
        title="Remove Skill"
        description={<>Remove <strong>"{deleteDialog?.name}"</strong> from your portfolio?</>}
      />
    </div>
  )
}
