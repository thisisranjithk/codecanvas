import { useState, useEffect } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  MoreHorizontal,
  GraduationCap,
  Calendar,
  Star,
  MapPin,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { mockEducation } from '@/data/education';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { FormInput, FormTextarea, FormMonthPicker } from '@/components/shared/form-field';
import { ConfirmDeleteDialog } from '@/components/shared/confirm-delete-dialog';
import { getEducationActivityIcon } from '@/lib/utils';
import { educationSchema, type EducationFormData } from '@/schemas';

type Education = (typeof mockEducation)[0];

export function Education() {
  const [educations, setEducations] = useState(mockEducation);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<Education | null>(null);

  function handleDelete(edu: Education) {
    setEducations((prev) => prev.filter((e) => e.id !== edu.id));
    setDeleteDialog(null);
    toast.success('Education entry removed');
  }

  function openEdit(edu: Education) {
    setEditingEdu(edu);
    setDialogOpen(true);
  }

  function openNew() {
    setEditingEdu(null);
    setDialogOpen(true);
  }

  return (
    <div className="animate-fade-in flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Education</h1>
          <p className="text-muted-foreground mt-0.5 text-[15px]">{educations.length} entries</p>
        </div>
        <Button size="sm" onClick={openNew} className="h-9 gap-1.5">
          <Plus className="size-4" />
          Add Education
        </Button>
      </div>

      {educations.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16">
          <div className="bg-muted flex size-12 items-center justify-center rounded-xl">
            <GraduationCap className="text-muted-foreground size-5" />
          </div>
          <p className="text-base font-medium">No education added</p>
          <Button size="sm" onClick={openNew}>
            Add education
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {educations.map((edu) => (
            <Card key={edu.id} className="border-border/60 card-hover overflow-hidden">
              <CardContent className="flex flex-col p-4 sm:p-6">
                <div className="flex flex-col gap-3 sm:gap-4">
                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-3 sm:gap-4">
                    <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                      <div className="bg-primary/10 border-primary/20 text-primary flex size-11 shrink-0 items-center justify-center rounded-xl border text-base font-bold shadow-sm sm:size-12 sm:text-lg">
                        {edu.logo || <GraduationCap className="size-5" />}
                      </div>
                      <div className="mt-0.5 flex min-w-0 flex-col">
                        <h2 className="text-foreground truncate text-base font-bold tracking-tight sm:text-[17px]">
                          {edu.institution}
                        </h2>
                        <p className="text-primary truncate text-[13px] font-semibold sm:text-sm">
                          {edu.degree} in {edu.field}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-foreground -mr-2 size-8"
                          >
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(edu)}>
                            <Pencil className="mr-2 size-3.5" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setDeleteDialog(edu)}
                          >
                            <Trash2 className="mr-2 size-3.5" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Metadata Row */}
                  <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12px] font-medium sm:pl-[64px] sm:text-[13px]">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="size-3.5 opacity-70" />
                      {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                    </span>

                    {edu.location && (
                      <>
                        <span className="text-muted-foreground/30 hidden sm:inline">•</span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="size-3.5 opacity-70" />
                          {edu.location}
                        </span>
                      </>
                    )}

                    {edu.gpa && (
                      <>
                        <span className="text-muted-foreground/30 hidden sm:inline">•</span>
                        <span className="flex items-center gap-1.5">
                          <Star className="size-3.5 opacity-70" />
                          GPA: {edu.gpa}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Description Text */}
                  {edu.description && (
                    <p className="text-muted-foreground max-w-4xl text-[13.5px] leading-relaxed sm:pl-[64px] sm:text-sm">
                      {edu.description}
                    </p>
                  )}
                </div>

                {/* Divider */}
                {edu.activities && edu.activities.length > 0 && (
                  <div className="bg-border/50 my-4 h-px w-full sm:my-5 sm:ml-[64px] sm:w-[calc(100%-64px)]" />
                )}

                {/* Activities section */}
                {edu.activities && edu.activities.length > 0 && (
                  <div className="flex flex-col gap-2.5 sm:pl-[64px]">
                    <h4 className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">
                      Activities & Societies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {edu.activities.map((act) => (
                        <div
                          key={act}
                          className="border-border/60 bg-muted/20 hover:bg-muted/40 flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-[12px] font-medium shadow-sm transition-colors sm:text-[13px]"
                        >
                          {getEducationActivityIcon(act)}
                          <span>{act}</span>
                        </div>
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
      <EducationDialog education={editingEdu} open={dialogOpen} onOpenChange={setDialogOpen} />

      {/* Delete Dialog */}
      <ConfirmDeleteDialog
        isOpen={!!deleteDialog}
        onClose={() => setDeleteDialog(null)}
        onConfirm={() => deleteDialog && handleDelete(deleteDialog)}
        title="Delete Education"
        description={
          <>
            Remove <strong>"{deleteDialog?.institution}"</strong>?
          </>
        }
      />
    </div>
  );
}

function EducationDialog({
  education,
  open,
  onOpenChange,
}: {
  education: Education | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: '',
      degree: '',
      field: '',
      startDate: undefined as unknown as Date,
      endDate: null,
      gpa: '',
      location: '',
      description: '',
      activities: '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        institution: education?.institution ?? '',
        degree: education?.degree ?? '',
        field: education?.field ?? '',
        startDate: education?.startDate
          ? new Date(education.startDate)
          : (undefined as unknown as Date),
        endDate: education?.endDate ? new Date(education.endDate) : null,
        gpa: education?.gpa ?? '',
        location: education?.location ?? '',
        description: education?.description ?? '',
        activities: education?.activities.join(', ') ?? '',
      });
    }
  }, [open, education, reset]);

  function onSubmit(_data: EducationFormData) {
    onOpenChange(false);
    toast.success(education ? 'Education updated' : 'Education added');
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg">
            {education ? 'Edit Education' : 'Add Education'}
          </DialogTitle>
          <DialogDescription className="text-[15px]">
            {education ? 'Update education details.' : 'Add an education entry.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid py-2">
            <FormInput
              label="Institution"
              registration={register('institution')}
              error={errors.institution}
              placeholder="e.g. Carnegie Mellon University"
              required
              labelClassName="text-[15px]"
              inputClassName="h-9 text-[15px]"
            />
            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label="Degree"
                registration={register('degree')}
                error={errors.degree}
                placeholder="e.g. Bachelor of Science"
                required
                labelClassName="text-[15px]"
                inputClassName="h-9 text-[15px]"
              />
              <FormInput
                label="Field of Study"
                registration={register('field')}
                error={errors.field}
                placeholder="e.g. Computer Science"
                required
                labelClassName="text-[15px]"
                inputClassName="h-9 text-[15px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
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
                labelClassName="text-[15px]"
                pickerClassName="w-full h-9 text-[15px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label="GPA (optional)"
                registration={register('gpa')}
                error={errors.gpa}
                placeholder="e.g. 3.8"
                labelClassName="text-[15px]"
                inputClassName="h-9 text-[15px]"
              />
              <FormInput
                label="Location"
                registration={register('location')}
                error={errors.location}
                placeholder="e.g. Pittsburgh, PA"
                labelClassName="text-[15px]"
                inputClassName="h-9 text-[15px]"
              />
            </div>
            <FormTextarea
              label="Description"
              registration={register('description')}
              error={errors.description}
              placeholder="Describe your studies, thesis, or focus areas..."
              rows={3}
              labelClassName="text-[15px]"
              textareaClassName="text-[15px]"
            />
            <FormInput
              label="Activities (comma-separated)"
              registration={register('activities')}
              placeholder="ACM Chapter, Hackathon Organizer, ..."
              labelClassName="text-[15px]"
              inputClassName="h-9 text-[15px]"
            />
          </div>
          <DialogFooter className="pt-2">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => onOpenChange(false)}
              className="h-9"
            >
              Cancel
            </Button>
            <Button size="sm" type="submit" className="h-9">
              {education ? 'Save Changes' : 'Add Education'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
