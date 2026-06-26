import { useState } from "react"
import {
  Plus, Pencil, Trash2, MoreHorizontal, GraduationCap, Calendar,
  Star, BookOpen, MapPin, Landmark, Trophy, Users, Briefcase
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { mockEducation } from "@/data/education"
import { formatDate } from "@/lib/utils"
import { toast } from "sonner"
import { MonthPicker } from "@/components/ui/month-picker"

type Education = typeof mockEducation[0]

function getDurationInYears(start: string, end: string | null) {
  const d1 = new Date(start)
  const d2 = end ? new Date(end) : new Date()

  let months = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth())
  if (months < 0) months = 0
  months += 1 // Inclusive of end month

  const years = Math.floor(months / 12)
  if (years > 0) return `${years} Years (Full-time)`
  return `${months} Months`
}

function getActivityIcon(activity: string) {
  const lower = activity.toLowerCase()
  if (lower.includes("president") || lower.includes("member") || lower.includes("club") || lower.includes("chapter")) {
    return <Users className="size-3.5 text-primary" />
  }
  if (lower.includes("hackathon") || lower.includes("award") || lower.includes("winner")) {
    return <Trophy className="size-3.5 text-emerald-500" />
  }
  if (lower.includes("teaching") || lower.includes("assistant") || lower.includes("tutor")) {
    return <GraduationCap className="size-3.5 text-blue-500" />
  }
  return <Briefcase className="size-3.5 text-muted-foreground" />
}

export function Education() {
  const [educations, setEducations] = useState(mockEducation)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingEdu, setEditingEdu] = useState<Education | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<Education | null>(null)
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()

  function handleDelete(edu: Education) {
    setEducations((prev) => prev.filter((e) => e.id !== edu.id))
    setDeleteDialog(null)
    toast.success("Education entry removed")
  }

  function openEdit(edu: Education) {
    setEditingEdu(edu)
    setStartDate(new Date(edu.startDate))
    setEndDate(edu.endDate ? new Date(edu.endDate) : undefined)
    setDialogOpen(true)
  }

  function openNew() {
    setEditingEdu(null)
    setStartDate(undefined)
    setEndDate(undefined)
    setDialogOpen(true)
  }

  return (
    <div className="flex flex-col gap-6 p-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Education</h1>
          <p className="text-[15px] text-muted-foreground mt-0.5">{educations.length} entries</p>
        </div>
        <Button size="sm" onClick={openNew} className="h-9 gap-1.5">
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
          <Button size="sm" onClick={openNew}>Add education</Button>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {educations.map((edu) => (
            <Card key={edu.id} className="card-hover border-border/60 py-0 overflow-hidden">
              <CardContent className="p-0 flex flex-col md:flex-row">

                {/* Left Area (Main Content) */}
                <div className="flex-1 p-6 flex flex-col">
                  {/* Header Row */}
                  <div className="flex items-start gap-4">
                    {/* Logo Box */}
                    <div className="flex size-[52px] shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary text-md font-bold shadow-sm">
                      {edu.logo}
                    </div>

                    <div className="flex flex-col gap-1.5 pt-0.5">
                      <h2 className="text-xl font-bold tracking-tight text-foreground leading-none">{edu.institution}</h2>
                      <p className="text-[15px] font-medium text-primary">
                        {edu.degree} in {edu.field}
                      </p>

                      <div className="flex items-center gap-3 mt-1 text-[13.5px] text-muted-foreground font-medium">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="size-4 opacity-70" />
                          {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                        </span>
                        {edu.gpa && (
                          <>
                            <span className="text-muted-foreground/30">•</span>
                            <span className="flex items-center gap-1.5">
                              <Star className="size-4 opacity-70" />
                              GPA: {edu.gpa}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  {edu.description && (
                    <p className="text-[15px] text-muted-foreground mt-6 leading-relaxed max-w-2xl">
                      {edu.description}
                    </p>
                  )}

                  {/* Divider */}
                  {edu.activities.length > 0 && (
                    <>
                      <div className="w-full h-px bg-border/50 my-6" />

                      {/* Activities Section */}
                      <div className="flex flex-col gap-3">
                        <h4 className="text-xs font-bold tracking-wider text-muted-foreground uppercase">Activities</h4>
                        <div className="flex flex-wrap gap-2.5">
                          {edu.activities.map((act) => (
                            <div
                              key={act}
                              className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border/60 bg-background text-[13.5px] font-medium shadow-sm"
                            >
                              {getActivityIcon(act)}
                              <span>{act}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Right Area (Sidebar details) */}
                <div className="w-full md:w-72 border-t md:border-t-0 md:border-l border-border/50 bg-muted/10 p-6 flex flex-col gap-6 relative">
                  {/* Actions Menu */}
                  <div className="absolute top-4 right-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(edu)}><Pencil className="size-3.5 mr-2" />Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => setDeleteDialog(edu)}>
                          <Trash2 className="size-3.5 mr-2" />Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Sidebar Info Items */}
                  <div className="flex flex-col gap-6 mt-6 md:mt-4">
                    {/* Degree Detail */}
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <BookOpen className="size-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] text-muted-foreground font-medium">Degree</span>
                        <span className="text-[14.5px] font-medium text-foreground">{edu.degree}</span>
                      </div>
                    </div>

                    {/* Institution Detail */}
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        <Landmark className="size-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] text-muted-foreground font-medium">Institution</span>
                        <span className="text-[14.5px] font-medium text-foreground">{edu.institution}</span>
                      </div>
                    </div>

                    {/* Location Detail */}
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <MapPin className="size-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] text-muted-foreground font-medium">Location</span>
                        <span className="text-[14.5px] font-medium text-foreground">{edu.location || "N/A"}</span>
                      </div>
                    </div>

                    {/* Duration Detail */}
                    <div className="flex items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        <Calendar className="size-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] text-muted-foreground font-medium">Duration</span>
                        <span className="text-[14.5px] font-medium text-foreground">{getDurationInYears(edu.startDate, edu.endDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>

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
          <div className="grid gap-4 py-2">
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
                <MonthPicker value={startDate} onChange={setStartDate} className="w-full h-9 text-[15px]" />
              </div>
              <div className="grid gap-2">
                <Label className="text-[15px]">End Date</Label>
                <MonthPicker value={endDate} onChange={setEndDate} className="w-full h-9 text-[15px]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label className="text-[15px]">GPA (optional)</Label>
                <Input defaultValue={editingEdu?.gpa} placeholder="e.g. 3.8" className="h-9 text-[15px]" />
              </div>
              <div className="grid gap-2">
                <Label className="text-[15px]">Location</Label>
                <Input defaultValue={editingEdu?.location} placeholder="e.g. Pittsburgh, PA" className="h-9 text-[15px]" />
              </div>
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
          <DialogFooter className="pt-2">
            <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)} className="h-9">Cancel</Button>
            <Button size="sm" onClick={() => { setDialogOpen(false); toast.success(editingEdu ? "Education updated" : "Education added") }} className="h-9">
              {editingEdu ? "Save Changes" : "Add Education"}
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
