import { useState, useMemo } from "react"
import {
  Plus, Search, Eye, ExternalLink, MoreHorizontal,
  Pencil, Trash2, Star, Archive, Code2,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { mockProjects } from "@/data/projects"
import { formatDateTime, formatNumber } from "@/lib/utils"
import { toast } from "sonner"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog"
import { StatusBadge } from "@/components/shared/status-badge"

type Project = typeof mockProjects[0]

export function Projects() {
  const [projects, setProjects] = useState(mockProjects)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState<Project | null>(null)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  const categories = useMemo(() => Array.from(new Set(mockProjects.map((p) => p.category))), [])

  const filtered = useMemo(() => {
    return projects
      .filter((p) => {
        const matchSearch =
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase()) ||
          p.technologies.some((t) => t.toLowerCase().includes(search.toLowerCase()))
        const matchStatus = statusFilter === "all" || p.status === statusFilter
        const matchCategory = categoryFilter === "all" || p.category === categoryFilter
        return matchSearch && matchStatus && matchCategory
      })
      .sort((a, b) => {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      })
  }, [projects, search, statusFilter, categoryFilter])

  function handleDelete(project: Project) {
    setProjects((prev) => prev.filter((p) => p.id !== project.id))
    setDeleteDialog(null)
    toast.success(`"${project.title}" deleted`)
  }

  function handleToggleFeatured(id: string) {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p)))
    toast.success("Featured updated")
  }

  function handleStatusChange(id: string, status: string) {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)))
    toast.success("Status updated")
  }

  function openEdit(project: Project) {
    setEditingProject(project)
    setDialogOpen(true)
  }

  function openNew() {
    setEditingProject(null)
    setDialogOpen(true)
  }

  return (
    <div className="flex flex-col gap-5 p-6 animate-fade-in">
      {/* Header */}
      <PageHeader
        title="Projects"
        description={`${projects.length} projects · ${projects.filter((p) => p.status === "published").length} published`}
        action={{ label: "New Project", onClick: openNew, icon: <Plus className="size-4" /> }}
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60 pointer-events-none" />
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32 h-9 text-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-36 h-9 text-sm">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Code2}
          title="No projects found"
          description="Try adjusting your search or filters"
          action={{ label: "Clear filters", onClick: () => { setSearch(""); setStatusFilter("all"); setCategoryFilter("all") } }}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <Card key={project.id} className="card-hover border-border/60 overflow-hidden group py-0">
              {/* Color bar */}
              <div className={`h-0.5 w-full ${project.status === "published" ? "bg-success" :
                  project.status === "draft" ? "bg-warning" : "bg-muted-foreground/30"
                }`} />
              <CardContent className="p-4 flex flex-col gap-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <div className="flex items-center gap-1.5">
                      {project.featured && <Star className="size-3.5 text-warning fill-warning shrink-0" />}
                      <span className="font-semibold text-base leading-tight truncate">{project.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{project.category}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <StatusBadge status={project.status} />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-7 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => openEdit(project)}><Pencil className="size-3.5" />Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleFeatured(project.id)}>
                          <Star className="size-3.5" />{project.featured ? "Unfeature" : "Feature"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleStatusChange(project.id, project.status === "published" ? "draft" : "published")}>
                          {project.status === "published" ? "Unpublish" : "Publish"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(project.id, "archived")}>
                          <Archive className="size-3.5" />Archive
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => setDeleteDialog(project)}>
                          <Trash2 className="size-3.5" />Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 flex-1">{project.description}</p>

                <div className="flex flex-wrap gap-1">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-[11px] h-5 px-1.5 font-normal bg-secondary/60">{tech}</Badge>
                  ))}
                  {project.technologies.length > 4 && (
                    <Badge variant="outline" className="text-[11px] h-5 px-1.5 font-normal">+{project.technologies.length - 4}</Badge>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/40">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Eye className="size-3.5" />
                    {formatNumber(project.views)}
                  </div>
                  <div className="flex items-center gap-0.5">
                    {project.githubUrl && (
                      <Button variant="ghost" size="icon" className="size-7" asChild>
                        <a href={project.githubUrl} target="_blank" rel="noreferrer"><ExternalLink className="size-3.5" /></a>
                      </Button>
                    )}
                    <span className="text-[11px] text-muted-foreground/60">{formatDateTime(project.updatedAt)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit / New Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-lg">{editingProject ? "Edit Project" : "New Project"}</DialogTitle>
            <DialogDescription className="text-sm">
              {editingProject ? "Update project details." : "Fill in details to create a new project."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-1">
            <div className="grid gap-2">
              <Label className="text-sm">Title</Label>
              <Input id="title" defaultValue={editingProject?.title} placeholder="Project title" className="h-9 text-sm" />
            </div>
            <div className="grid gap-2">
              <Label className="text-sm">Description</Label>
              <Textarea id="description" defaultValue={editingProject?.description} placeholder="Short description..." rows={3} className="text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label className="text-sm">Category</Label>
                <Input id="category" defaultValue={editingProject?.category} placeholder="e.g. Full Stack" className="h-9 text-sm" />
              </div>
              <div className="grid gap-2">
                <Label className="text-sm">Status</Label>
                <Select defaultValue={editingProject?.status ?? "draft"}>
                  <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label className="text-sm">Technologies (comma-separated)</Label>
              <Input id="technologies" defaultValue={editingProject?.technologies.join(", ")} placeholder="React, TypeScript, ..." className="h-9 text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label className="text-sm">Live URL</Label>
                <Input id="liveUrl" defaultValue={editingProject?.liveUrl} placeholder="https://" className="h-9 text-sm" />
              </div>
              <div className="grid gap-2">
                <Label className="text-sm">GitHub URL</Label>
                <Input id="githubUrl" defaultValue={editingProject?.githubUrl} placeholder="https://github.com/..." className="h-9 text-sm" />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/60 px-4 py-3">
              <div>
                <Label htmlFor="featured" className="text-sm font-medium">Featured Project</Label>
                <p className="text-xs text-muted-foreground">Show prominently on your portfolio</p>
              </div>
              <Switch id="featured" defaultChecked={editingProject?.featured} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={() => { setDialogOpen(false); toast.success(editingProject ? "Project updated" : "Project created") }}>
              {editingProject ? "Save Changes" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDeleteDialog
        isOpen={!!deleteDialog}
        onClose={() => setDeleteDialog(null)}
        onConfirm={() => deleteDialog && handleDelete(deleteDialog)}
        title="Delete Project"
        itemName={deleteDialog?.title}
      />
    </div>
  )
}
