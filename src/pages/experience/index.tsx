import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, MoreHorizontal, MapPin, Calendar, Briefcase } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { mockExperience } from "@/data/experience"
import { formatDate } from "@/lib/utils"
import { toast } from "sonner"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog"
import {
  FormInput, FormTextarea, FormSelect, FormSwitch, FormMonthPicker,
} from "@/components/shared/form-field"
import { experienceSchema, type ExperienceFormData } from "@/schemas"

type Experience = typeof mockExperience[0]

function getDuration(start: string, end: string | null) {
  const d1 = new Date(start)
  const d2 = end ? new Date(end) : new Date()

  let months = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth())
  if (months < 0) months = 0

  // round up slightly for partial months to avoid 0 mos
  months += 1

  const years = Math.floor(months / 12)
  const remMonths = months % 12

  if (years > 0 && remMonths > 0) return `${years} yr ${remMonths} mos`
  if (years > 0) return `${years} yr`
  return `${remMonths} mos`
}

export function Experience() {
  const [experiences, setExperiences] = useState(mockExperience)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingExp, setEditingExp] = useState<Experience | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<Experience | null>(null)

  function handleDelete(exp: Experience) {
    setExperiences((prev) => prev.filter((e) => e.id !== exp.id))
    setDeleteDialog(null)
    toast.success(`"${exp.role} at ${exp.company}" removed`)
  }

  function openEdit(exp: Experience) {
    setEditingExp(exp)
    setDialogOpen(true)
  }

  function openNew() {
    setEditingExp(null)
    setDialogOpen(true)
  }

  return (
    <div className="flex flex-col gap-6 p-6 animate-fade-in">
      <PageHeader
        title="Experience"
        description={`${experiences.length} positions`}
        action={{ label: "Add Experience", onClick: openNew, icon: <Plus className="size-4" /> }}
      />

      {experiences.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No experience added"
          action={{ label: "Add your first position", onClick: openNew }}
        />
      ) : (
        <div className="flex flex-col gap-5">
          {experiences.map((exp) => (
            <Card key={exp.id} className="border-border/60 card-hover py-0">
              <CardContent className="p-5 md:p-6 flex flex-col">

                {/* Top Section */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {/* Logo */}
                    <div className="flex size-[52px] shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary text-xl font-bold shadow-sm">
                      {exp.logo}
                    </div>

                    {/* Headers & Meta */}
                    <div className="flex flex-col gap-1">
                      <h2 className="text-lg font-bold tracking-tight text-foreground">{exp.company}</h2>
                      <p className="text-[15px] font-semibold text-primary">{exp.role}</p>

                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <span className="flex items-center gap-1.5 text-[13px] text-muted-foreground font-medium">
                          <Calendar className="size-3.5" />
                          {formatDate(exp.startDate)} — {exp.current ? "Present" : formatDate(exp.endDate)}
                        </span>
                        <span className="text-muted-foreground/30">•</span>
                        <span className="flex items-center gap-1.5 text-[13px] text-muted-foreground font-medium">
                          <MapPin className="size-3.5" />
                          {exp.location}
                        </span>
                        <span className="text-muted-foreground/30">•</span>
                        <span className="flex items-center gap-1.5 text-[13px] text-muted-foreground font-medium">
                          <Briefcase className="size-3.5" />
                          {exp.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Duration badge */}
                  <div className="flex flex-col items-end gap-2 shrink-0 ml-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(exp)}><Pencil className="size-3.5 mr-2" />Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => setDeleteDialog(exp)}>
                          <Trash2 className="size-3.5 mr-2" />Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Badge variant="secondary" className="bg-primary/15 text-primary hover:bg-primary/15 border-transparent text-xs font-medium px-2.5 h-6 rounded-full">
                      {getDuration(exp.startDate, exp.current ? null : exp.endDate)}
                    </Badge>
                  </div>
                </div>

                {/* Description Text */}
                <p className="text-[15px] text-muted-foreground mt-5 leading-relaxed max-w-4xl">
                  {exp.description}
                </p>

                {/* Divider */}
                <div className="w-full h-px bg-border/50 my-6" />

                {/* Bottom Section: Responsibilities & Tech */}
                <div className="grid md:grid-cols-5 gap-6 md:gap-10">
                  {/* Left Column: Responsibilities */}
                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <div className="md:col-span-3 flex flex-col gap-3">
                      <h4 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Key Responsibilities</h4>
                      <ul className="flex flex-col gap-2">
                        {exp.responsibilities.map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-[14.5px] text-foreground/90">
                            <span className="mt-2 size-1.5 rounded-full bg-primary shrink-0" />
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Right Column: Technologies */}
                  <div className="md:col-span-2 flex flex-col gap-3">
                    <h4 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech) => (
                        <Badge key={tech} variant="outline" className="bg-muted/40 hover:bg-muted/60 text-[13px] font-medium h-7 px-2.5 border-border/80">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit/New Dialog */}
      <ExperienceDialog
        experience={editingExp}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      {/* Delete Dialog */}
      <ConfirmDeleteDialog
        isOpen={!!deleteDialog}
        onClose={() => setDeleteDialog(null)}
        onConfirm={() => deleteDialog && handleDelete(deleteDialog)}
        title="Delete Experience"
        description={
          <>Remove <strong>"{deleteDialog?.role} at {deleteDialog?.company}"</strong>?</>
        }
      />
    </div>
  )
}

function ExperienceDialog({
  experience,
  open,
  onOpenChange,
}: {
  experience: Experience | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      company: "",
      role: "",
      type: "Full-time",
      location: "",
      startDate: undefined as unknown as Date,
      endDate: null,
      current: false,
      description: "",
      responsibilities: "",
      technologies: "",
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        company: experience?.company ?? "",
        role: experience?.role ?? "",
        type: experience?.type ?? "Full-time",
        location: experience?.location ?? "",
        startDate: experience?.startDate ? new Date(experience.startDate) : undefined as unknown as Date,
        endDate: experience?.endDate ? new Date(experience.endDate) : null,
        current: experience?.current ?? false,
        description: experience?.description ?? "",
        responsibilities: experience?.responsibilities?.join("\n") ?? "",
        technologies: experience?.technologies.join(", ") ?? "",
      })
    }
  }, [open, experience, reset])

  const isCurrent = watch("current")

  function onSubmit(_data: ExperienceFormData) {
    onOpenChange(false)
    toast.success(experience ? "Experience updated" : "Experience added")
  }

  const employmentTypes = [
    { label: "Full-time", value: "Full-time" },
    { label: "Part-time", value: "Part-time" },
    { label: "Contract", value: "Contract" },
    { label: "Freelance", value: "Freelance" },
    { label: "Internship", value: "Internship" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">{experience ? "Edit Experience" : "Add Experience"}</DialogTitle>
          <DialogDescription className="text-[15px]">{experience ? "Update position details." : "Add a work experience entry."}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Company"
                registration={register("company")}
                error={errors.company}
                placeholder="TechCorp Pvt. Ltd."
                required
                labelClassName="text-[15px]"
                inputClassName="h-9 text-[15px]"
              />
              <FormInput
                label="Role / Title"
                registration={register("role")}
                error={errors.role}
                placeholder="Frontend Developer"
                required
                labelClassName="text-[15px]"
                inputClassName="h-9 text-[15px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormSelect
                label="Employment Type"
                name="type"
                control={control}
                error={errors.type}
                options={employmentTypes}
                required
                labelClassName="text-[15px]"
                selectClassName="h-9 text-[15px]"
              />
              <FormInput
                label="Location"
                registration={register("location")}
                error={errors.location}
                placeholder="Bengaluru, India"
                required
                labelClassName="text-[15px]"
                inputClassName="h-9 text-[15px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormMonthPicker
                label="Start Date"
                name="startDate"
                control={control}
                error={errors.startDate}
                required
                labelClassName="text-[15px]"
                pickerClassName="w-full h-9 text-[15px]"
              />
              <FormMonthPicker
                label="End Date"
                name="endDate"
                control={control}
                error={errors.endDate}
                disabled={isCurrent}
                labelClassName="text-[15px]"
                pickerClassName="w-full h-9 text-[15px]"
              />
            </div>

            <FormSwitch
              label="I currently work here"
              name="current"
              control={control}
              description="This will hide the end date"
              className="bg-muted/20"
              labelClassName="text-[15px]"
            />

            <FormTextarea
              label="Short Description"
              registration={register("description")}
              error={errors.description}
              placeholder="Brief summary of your role..."
              rows={2}
              labelClassName="text-[15px]"
              textareaClassName="text-[15px]"
            />

            <FormTextarea
              label="Key Responsibilities"
              registration={register("responsibilities")}
              placeholder="List your responsibilities (one per line)..."
              rows={4}
              description="Press Enter to separate each responsibility bullet point."
              labelClassName="text-[15px]"
              textareaClassName="text-[15px]"
            />

            <FormInput
              label="Technologies"
              registration={register("technologies")}
              placeholder="React, Next.js, Tailwind CSS..."
              description="Separate each technology with a comma."
              labelClassName="text-[15px]"
              inputClassName="h-9 text-[15px]"
            />
          </div>
          <DialogFooter className="pt-2">
            <Button variant="outline" size="sm" type="button" onClick={() => onOpenChange(false)} className="h-9 text-[15px]">Cancel</Button>
            <Button size="sm" type="submit" className="h-9 text-[15px]">
              {experience ? "Save Changes" : "Add Experience"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
