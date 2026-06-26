import { useState } from "react"
import { Plus, Pencil, Trash2, MoreHorizontal, GraduationCap, Calendar } from "lucide-react"
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
import { mockEducation } from "@/data/mock"
import { formatDate } from "@/lib/utils"
import { toast } from "sonner"

type Education = typeof mockEducation[0]

export function Education() {
  const [educations, setEducations] = useState(mockEducation)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEdu, setEditingEdu] = useState<Education | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<Education | null>(null)

  function handleDelete(edu: Education) {
    setEducations((prev) => prev.filter((e) => e.id !== edu.id))
    setDeleteDialog(null)
    toast.success("Education entry removed")
  }

  function openEdit(edu: Education) {
    setEditingEdu(edu)
    setDialogOpen(true)
  }

  return (
    <div className="flex flex-col gap-5 p-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Education</h1>
          <p className="text-[15px] text-muted-foreground mt-0.5">{educations.length} entries</p>
        </div>
        <Button size="sm" onClick={() => { setEditingEdu(null); setDialogOpen(true) }} className="h-9 gap-1.5">
          <Plus className="size-4" />
          Add Education
        </Button>
      </div>

      {educations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
            <GraduationCap className="size-5 text-muted-foreground" />
          </div>
          <p className="font-medium text-base">No education added</p>
          <Button size="sm" onClick={() => { setEditingEdu(null); setDialogOpen(true) }}>Add education</Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {educations.map((edu) => (
            <Card key={edu.id} className="card-hover border-border/60 group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border bg-muted text-[13px] font-bold">
                      {edu.logo}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <h3 className="font-semibold text-base">{edu.institution}</h3>
                      <p className="text-[15px] text-muted-foreground">
                        {edu.degree} in <span className="font-medium text-foreground">{edu.field}</span>
                      </p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="flex items-center gap-1 text-[13px] text-muted-foreground">
                          <Calendar className="size-3.5" />
                          {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                        </span>
                        {edu.gpa && (
                          <Badge variant="secondary" className="text-xs h-5 px-1.5 bg-secondary/60">GPA: {edu.gpa}</Badge>
                        )}
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
                      <DropdownMenuItem onClick={() => openEdit(edu)}><Pencil className="size-3.5" />Edit</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => setDeleteDialog(edu)}><Trash2 className="size-3.5" />Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {edu.description && (
                  <p className="text-[15px] text-muted-foreground mt-3 leading-relaxed">{edu.description}</p>
                )}

                {edu.activities.length > 0 && (
                  <div className="mt-2.5">
                    <p className="text-[13px] font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">Activities</p>
                    <div className="flex flex-wrap gap-1.5">
                      {edu.activities.map((act) => (
                        <Badge key={act} variant="secondary" className="text-xs font-normal bg-secondary/60">{act}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit/New Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg">{editingEdu ? "Edit Education" : "Add Education"}</DialogTitle>
            <DialogDescription className="text-[15px]">{editingEdu ? "Update education details." : "Add an education entry."}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-1">
            <div className="grid gap-2">
              <Label className="text-[15px]">Institution</Label>
              <Input defaultValue={editingEdu?.institution} placeholder="e.g. Carnegie Mellon University" className="h-9 text-[15px]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label className="text-[15px]">Degree</Label>
                <Input defaultValue={editingEdu?.degree} placeholder="e.g. Bachelor of Science" className="h-9 text-[15px]" />
              </div>
              <div className="grid gap-2">
                <Label className="text-[15px]">Field of Study</Label>
                <Input defaultValue={editingEdu?.field} placeholder="e.g. Computer Science" className="h-9 text-[15px]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label className="text-[15px]">Start Date</Label>
                <Input type="month" defaultValue={editingEdu?.startDate} className="h-9 text-[15px]" />
              </div>
              <div className="grid gap-2">
                <Label className="text-[15px]">End Date</Label>
                <Input type="month" defaultValue={editingEdu?.endDate ?? ""} className="h-9 text-[15px]" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label className="text-[15px]">GPA (optional)</Label>
              <Input defaultValue={editingEdu?.gpa} placeholder="e.g. 3.8" className="h-9 text-[15px]" />
            </div>
            <div className="grid gap-2">
              <Label className="text-[15px]">Description</Label>
              <Textarea defaultValue={editingEdu?.description} placeholder="Describe your studies, thesis, or focus areas..." rows={3} className="text-[15px]" />
            </div>
            <div className="grid gap-2">
              <Label className="text-[15px]">Activities (comma-separated)</Label>
              <Input defaultValue={editingEdu?.activities.join(", ")} placeholder="ACM Chapter, Hackathon Organizer, ..." className="h-9 text-[15px]" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={() => { setDialogOpen(false); toast.success(editingEdu ? "Education updated" : "Education added") }}>
              {editingEdu ? "Save Changes" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg">Delete Education</DialogTitle>
            <DialogDescription className="text-[15px]">Remove <strong>"{deleteDialog?.institution}"</strong>?</DialogDescription>
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
