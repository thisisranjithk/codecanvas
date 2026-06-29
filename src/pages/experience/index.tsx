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
import { formatDate, getEmploymentDuration } from "@/lib/utils"
import { toast } from "sonner"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog"
import {
  FormInput, FormTextarea, FormSelect, FormSwitch, FormMonthPicker,
} from "@/components/shared/form-field"
import { experienceSchema, type ExperienceFormData } from "@/schemas"

type Experience = typeof mockExperience[0]


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
            <Card key={exp.id} className="border-border/60 card-hover overflow-hidden">
              <CardContent className="p-4 sm:p-6 flex flex-col">

                <div className="flex flex-col gap-3 sm:gap-4">
                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-3 sm:gap-4">
                    <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                      <div className="flex size-11 sm:size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary text-base sm:text-lg font-bold shadow-sm">
                        {exp.logo}
                      </div>
                      <div className="flex flex-col min-w-0 mt-0.5">
                        <h2 className="text-base sm:text-[17px] font-bold tracking-tight text-foreground truncate">{exp.company}</h2>
                        <p className="text-[13px] sm:text-sm font-semibold text-primary truncate">{exp.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="secondary" className="hidden sm:flex bg-primary/10 text-primary hover:bg-primary/10 border-transparent text-xs font-medium px-2.5 h-6 rounded-md">
                        {getEmploymentDuration(exp.startDate, exp.current ? null : exp.endDate)}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8 -mr-2 text-muted-foreground hover:text-foreground">
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
                    </div>
                  </div>

                  {/* Metadata Row */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12px] sm:text-[13px] text-muted-foreground font-medium sm:pl-[64px]">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="size-3.5 opacity-70" />
                      {formatDate(exp.startDate)} — {exp.current ? "Present" : formatDate(exp.endDate)}
                      <span className="sm:hidden ml-1">({getEmploymentDuration(exp.startDate, exp.current ? null : exp.endDate)})</span>
                    </span>
                    <span className="hidden sm:inline text-muted-foreground/30">•</span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-3.5 opacity-70" />
                      {exp.location}
                    </span>
                    <span className="hidden sm:inline text-muted-foreground/30">•</span>
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="size-3.5 opacity-70" />
                      {exp.type}
                    </span>
                  </div>

                  {/* Description Text */}
                  {exp.description && (
                    <p className="text-[13.5px] sm:text-sm text-muted-foreground leading-relaxed sm:pl-[64px] max-w-4xl">
                      {exp.description}
                    </p>
                  )}
                </div>

                {/* Divider */}
                {(exp.responsibilities?.length > 0 || exp.technologies?.length > 0) && (
                  <div className="w-full h-px bg-border/50 my-4 sm:my-5 sm:ml-[64px] sm:w-[calc(100%-64px)]" />
                )}

                {/* Responsibilities & Tech */}
                <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 sm:pl-[64px]">
                  {/* Left Column: Responsibilities */}
                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <div className="flex-1 flex flex-col gap-2.5">
                      <h4 className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">Key Responsibilities</h4>
                      <ul className="flex flex-col gap-2">
                        {exp.responsibilities.map((item, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-[13px] sm:text-[13.5px] text-foreground/90">
                            <span className="mt-1.5 size-1 rounded-full bg-primary/60 shrink-0" />
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Right Column: Technologies */}
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="lg:w-64 flex flex-col gap-2.5 shrink-0">
                      <h4 className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">Technologies</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {exp.technologies.map((tech) => (
                          <Badge key={tech} variant="secondary" className="bg-secondary/60 hover:bg-secondary/80 text-[11px] sm:text-xs font-normal h-6 px-2.5 border-transparent">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
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
          <div className="grid py-2">
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


            <div className="grid grid-cols-2 gap-4">
              <FormSelect
                label="Employment Type"
                name="type"
                control={control}
                error={errors.type}
                options={employmentTypes}
                required
                labelClassName="text-[15px]"
                selectClassName="h-9 text-[15px] w-full"
              />
              <FormInput
                label="Location"
                registration={register("location")}
                error={errors.location}
                placeholder="Bengaluru, India"
                required
                labelClassName="text-[15px]"
                inputClassName="h-9 text-[15px] w-full"
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
              className="bg-muted/20 mb-4"
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
    </Dialog >
  )
}
