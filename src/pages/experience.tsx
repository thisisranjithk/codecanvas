import { useState } from "react"
import { Plus, Pencil, Trash2, MoreHorizontal, MapPin, Calendar, Briefcase } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { mockExperience } from "@/data/mock"
import { formatDate } from "@/lib/utils"
import { toast } from "sonner"

type Experience = typeof mockExperience[0]

const typeColors: Record<string, string> = {
  "Full-time": "bg-emerald-500/8 text-emerald-500 border-emerald-500/20",
  "Contract": "bg-blue-500/8 text-blue-500 border-blue-500/20",
  "Freelance": "bg-violet-500/8 text-violet-500 border-violet-500/20",
  "Part-time": "bg-amber-500/8 text-amber-500 border-amber-500/20",
}

export function Experience() {
  const [experiences, setExperiences] = useState(mockExperience)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingExp, setEditingExp] = useState<Experience | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<Experience | null>(null)
  const [isCurrent, setIsCurrent] = useState(false)

  function handleDelete(exp: Experience) {
    setExperiences((prev) => prev.filter((e) => e.id !== exp.id))
    setDeleteDialog(null)
    toast.success(`"${exp.role} at ${exp.company}" removed`)
  }

  function openEdit(exp: Experience) {
    setEditingExp(exp)
    setIsCurrent(exp.current)
    setDialogOpen(true)
  }

  function openNew() {
    setEditingExp(null)
    setIsCurrent(false)
    setDialogOpen(true)
  }

  return (
    <div className="flex flex-col gap-5 p-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Experience</h1>
          <p className="text-[15px] text-muted-foreground mt-0.5">{experiences.length} positions</p>
        </div>
        <Button size="sm" onClick={openNew} className="h-9 gap-1.5">
          <Plus className="size-4" />
          Add Experience
        </Button>
      </div>

      {experiences.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
            <Briefcase className="size-5 text-muted-foreground" />
          </div>
          <p className="font-medium text-base">No experience added</p>
          <Button size="sm" onClick={openNew}>Add your first position</Button>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-5 bottom-5 w-px bg-border/60 hidden md:block" />

          <div className="flex flex-col gap-3">
            {experiences.map((exp) => (
              <div key={exp.id} className="relative flex gap-3 md:ml-3">
                {/* Timeline dot */}
                <div className={`hidden md:flex shrink-0 size-4 items-center justify-center rounded-full border-2 mt-5 z-10 ${exp.current ? "border-primary bg-primary" : "border-border bg-background"}`}>
                  {exp.current && <div className="size-1.5 rounded-full bg-primary-foreground" />}
                </div>

                <Card className="flex-1 card-hover border-border/60 group">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted text-[13px] font-bold">
                          {exp.logo}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-base">{exp.role}</span>
                            {exp.current && (
                              <Badge className="text-xs h-5 px-1.5 bg-primary/10 text-primary hover:bg-primary/10 border-0">
                                Current
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[15px] font-medium text-muted-foreground">{exp.company}</span>
                            <span className="text-muted-foreground/40">·</span>
                            <span className={`text-[13px] rounded-md px-1.5 py-0.5 font-medium border ${typeColors[exp.type] ?? "bg-muted text-muted-foreground border-border"}`}>
                              {exp.type}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="flex items-center gap-1 text-[13px] text-muted-foreground">
                              <Calendar className="size-3.5" />
                              {formatDate(exp.startDate)} — {exp.current ? "Present" : formatDate(exp.endDate)}
                            </span>
                            <span className="flex items-center gap-1 text-[13px] text-muted-foreground">
                              <MapPin className="size-3.5" />
                              {exp.location}
                            </span>
                          </div>
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(exp)}><Pencil className="size-3.5" />Edit</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => setDeleteDialog(exp)}><Trash2 className="size-3.5" />Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <p className="text-[15px] text-muted-foreground mt-2.5 leading-relaxed">{exp.description}</p>

                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {exp.technologies.map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs h-5 px-1.5 font-normal bg-secondary/60">{tech}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit/New Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg">{editingExp ? "Edit Experience" : "Add Experience"}</DialogTitle>
            <DialogDescription className="text-[15px]">{editingExp ? "Update position details." : "Add a work experience entry."}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label className="text-[15px]">Company</Label>
                <Input defaultValue={editingExp?.company} placeholder="Company name" className="h-9 text-[15px]" />
              </div>
              <div className="grid gap-2">
                <Label className="text-[15px]">Role / Title</Label>
                <Input defaultValue={editingExp?.role} placeholder="e.g. Senior Engineer" className="h-9 text-[15px]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label className="text-[15px]">Type</Label>
                <Select defaultValue={editingExp?.type ?? "Full-time"}>
                  <SelectTrigger className="h-9 text-[15px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Freelance">Freelance</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label className="text-[15px]">Location</Label>
                <Input defaultValue={editingExp?.location} placeholder="e.g. Remote" className="h-9 text-[15px]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label className="text-[15px]">Start Date</Label>
                <Input type="month" defaultValue={editingExp?.startDate} className="h-9 text-[15px]" />
              </div>
              <div className="grid gap-2">
                <Label className="text-[15px]">End Date</Label>
                <Input type="month" defaultValue={editingExp?.endDate ?? ""} disabled={isCurrent} className="h-9 text-[15px]" />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/60 px-4 py-3">
              <Label className="text-[15px] font-medium">Currently working here</Label>
              <Switch checked={isCurrent} onCheckedChange={setIsCurrent} />
            </div>
            <div className="grid gap-2">
              <Label className="text-[15px]">Description</Label>
              <Textarea defaultValue={editingExp?.description} placeholder="Describe your role and achievements..." rows={3} className="text-[15px]" />
            </div>
            <div className="grid gap-2">
              <Label className="text-[15px]">Technologies (comma-separated)</Label>
              <Input defaultValue={editingExp?.technologies.join(", ")} placeholder="React, TypeScript, ..." className="h-9 text-[15px]" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={() => { setDialogOpen(false); toast.success(editingExp ? "Experience updated" : "Experience added") }}>
              {editingExp ? "Save Changes" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg">Delete Experience</DialogTitle>
            <DialogDescription className="text-[15px]">Remove <strong>"{deleteDialog?.role} at {deleteDialog?.company}"</strong>?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDeleteDialog(null)}>Cancel</Button>
            <Button variant="destructive" size="sm" onClick={() => deleteDialog && handleDelete(deleteDialog)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
