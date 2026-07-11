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
  Hash,
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
import { formatYear, getEducationActivityIcon, sortByDateDesc } from '@/lib/utils';
import { toast } from 'sonner';
import { FormInput, FormTextarea, FormMonthPicker } from '@/components/shared/form-field';
import { ConfirmDeleteDialog } from '@/components/shared/confirm-delete-dialog';
import { educationSchema, type EducationFormData } from '@/schemas';
import { ErrorState } from '@/components/shared/error-state';
import {
  useEducations,
  useEducation,
  useCreateEducation,
  useUpdateEducation,
  useDeleteEducation
} from '@/hooks/api/education';
import type { Education, CreateEducationRequest } from '@/types/education.types';
import { Loader } from '@/components/ui/loader';
import { ExpandableText } from '@/components/shared/expandable-text';

export function Education() {
  const { data: educations = [], isLoading, isError, error, refetch } = useEducations();
  const deleteMutation = useDeleteEducation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEduId, setEditingEduId] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<Education | null>(null);

  // Sort by displayOrder ascending
  const sortedEducations = [...educations].sort((a, b) => a.displayOrder - b.displayOrder);

  function handleDelete(edu: Education) {
    deleteMutation.mutate(edu.id, {
      onSuccess: (data) => {
        setDeleteDialog(null);
        toast.success(data.message || 'Education deleted successfully');
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || 'Failed to delete education');
      }
    });
  }

  function openEdit(edu: Education) {
    setEditingEduId(edu.id);
    setDialogOpen(true);
  }

  function openNew() {
    setEditingEduId(null);
    setDialogOpen(true);
  }

  if (isLoading) {
    return <Loader variant="section" text="Loading educations..." />;
  }

  if (isError) {
    return (
      <div className="p-6">
        <ErrorState
          title="Failed to load education"
          description={error?.message || 'An unexpected error occurred.'}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <main className="animate-fade-in max-w-5xl mx-auto px-6 py-8 pb-20 space-y-8 w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Education</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">
            {educations.length} {educations.length === 1 ? 'entry' : 'entries'} · sorted by display order
          </p>
        </div>
        <Button size="sm" onClick={openNew} className="h-9 gap-1.5">
          <Plus className="size-4" />
          Add Education
        </Button>
      </div>

      {sortedEducations.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16">
          <div className="bg-muted flex size-12 items-center justify-center rounded-xl">
            <GraduationCap className="text-muted-foreground size-5" />
          </div>
          <p className="text-sm font-medium">No education added</p>
          <Button size="sm" onClick={openNew}>
            Add education
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {sortByDateDesc(educations).map((edu, idx) => (
            <div
              key={edu.id}
              className="animate-fade-in"
              style={{ animationFillMode: 'both', animationDelay: `${idx * 100}ms` }}
            >
              <Card className="border-border/60 card-hover overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/20">
                <CardContent className="flex flex-col p-4 sm:p-6">
                  <div className="flex flex-col gap-3 sm:gap-4">
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-3 sm:gap-4">
                      <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                        <div className="bg-primary/10 border-primary/20 text-primary flex size-11 shrink-0 items-center justify-center rounded-xl border text-base font-bold shadow-sm sm:size-12 sm:text-lg">
                          <GraduationCap className="size-5" />
                        </div>
                        <div className="mt-0.5 flex min-w-0 flex-col">
                          <h2 className="text-foreground truncate text-sm font-bold tracking-tight sm:text-sm">
                            {edu.institution}
                          </h2>
                          <p className="text-primary text-sm truncate font-semibold mt-2 sm:text-sm">
                            {edu.degree} in {edu.fieldOfStudy}
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
                    <div className="text-muted-foreground sm:text-xs flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-medium sm:pl-16">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="size-3.5 opacity-70" />
                        {formatYear(edu.startDate)} — {edu.endDate ? formatYear(edu.endDate) : 'Present'}
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
                      <ExpandableText text={edu.description} lines={3} className="sm:pl-16 max-w-4xl" />
                    )}
                  </div>

                  {/* Divider */}
                  {edu.activities && edu.activities.length > 0 && (
                    <div className="bg-border/50 my-4 h-px w-full sm:my-5 sm:ml-16 sm:w-[calc(100%-64px)]" />
                  )}

                  {/* Activities section */}
                  {edu.activities && edu.activities.length > 0 && (
                    <div className="flex flex-col gap-2.5 sm:pl-16">
                      <h4 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                        Activities & Societies
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {edu.activities.map((act) => (
                          <div
                            key={act}
                            className="border-border/60 bg-muted/20 hover:bg-muted/40 sm:text-xs flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs font-medium shadow-sm transition-colors"
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
            </div>
          ))}
        </div>
      )}

      {/* Edit/New Dialog */}
      <EducationDialog
        educationId={editingEduId}
        editMode={!!editingEduId}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        nextOrder={educations.length + 1}
      />

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
        isLoading={deleteMutation.isPending}
      />
    </main>
  );
}

function EducationDialog({
  educationId,
  editMode,
  open,
  onOpenChange,
  nextOrder,
}: {
  educationId: string | null;
  editMode: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nextOrder: number;
}) {
  const { data: fetchedEdu, isFetching } = useEducation(open ? (educationId || '') : '');
  const createMutation = useCreateEducation();
  const updateMutation = useUpdateEducation();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: undefined as unknown as Date,
      endDate: null,
      gpa: '',
      location: '',
      description: '',
      activities: '',
      displayOrder: nextOrder,
    },
  });

  useEffect(() => {
    if (open) {
      if (editMode && fetchedEdu) {
        reset({
          institution: fetchedEdu.institution ?? '',
          degree: fetchedEdu.degree ?? '',
          fieldOfStudy: fetchedEdu.fieldOfStudy ?? '',
          startDate: fetchedEdu.startDate
            ? new Date(fetchedEdu.startDate)
            : (undefined as unknown as Date),
          endDate: fetchedEdu.endDate ? new Date(fetchedEdu.endDate) : null,
          gpa: fetchedEdu.gpa ?? '',
          location: fetchedEdu.location ?? '',
          description: fetchedEdu.description ?? '',
          activities: fetchedEdu.activities?.join(', ') ?? '',
          displayOrder: fetchedEdu.displayOrder ?? 1,
        });
      } else if (!editMode) {
        reset({
          institution: '',
          degree: '',
          fieldOfStudy: '',
          startDate: undefined as unknown as Date,
          endDate: null,
          gpa: '',
          location: '',
          description: '',
          activities: '',
          displayOrder: nextOrder,
        });
      }
    }
  }, [open, editMode, fetchedEdu, reset, nextOrder]);

  const isPending = createMutation.isPending || updateMutation.isPending || isFetching;

  function onSubmit(data: EducationFormData) {
    const payload: CreateEducationRequest = {
      institution: data.institution,
      degree: data.degree,
      fieldOfStudy: data.fieldOfStudy,
      startDate: data.startDate.toISOString(),
      endDate: data.endDate ? data.endDate.toISOString() : null,
      gpa: data.gpa,
      location: data.location,
      description: data.description,
      activities: data.activities
        ? data.activities.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      displayOrder: data.displayOrder,
    };

    if (editMode && educationId) {
      updateMutation.mutate(
        { id: educationId, data: payload },
        {
          onSuccess: (data) => {
            onOpenChange(false);
            toast.success(data.message || 'Education updated successfully');
          },
          onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update education');
          }
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: (data) => {
          onOpenChange(false);
          toast.success(data.message || 'Education added successfully');
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || 'Failed to add education');
        }
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !isPending && onOpenChange(val)}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg">
            {editMode ? 'Edit Education' : 'Add Education'}
          </DialogTitle>
          <DialogDescription className="text-base">
            {editMode ? 'Update education details.' : 'Add an education entry.'}
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
            />
            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label="Degree"
                registration={register('degree')}
                error={errors.degree}
                placeholder="e.g. Bachelor of Science"
                required
              />
              <FormInput
                label="Field of Study"
                registration={register('fieldOfStudy')}
                error={errors.fieldOfStudy}
                placeholder="e.g. Computer Science"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormMonthPicker
                label="Start Date"
                name="startDate"
                control={control}
                error={errors.startDate}
                required pickerClassName="w-full"
              />
              <FormMonthPicker
                label="End Date"
                name="endDate"
                control={control}
                error={errors.endDate} pickerClassName="w-full"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <FormInput
                label="GPA (optional)"
                registration={register('gpa')}
                error={errors.gpa}
                placeholder="e.g. 3.8"
              />
              <FormInput
                label="Location"
                registration={register('location')}
                error={errors.location}
                placeholder="e.g. Pittsburgh, PA"
              />
              <FormInput
                label="Display Order"
                registration={register('displayOrder', { valueAsNumber: true })}
                error={errors.displayOrder}
                placeholder="e.g. 1"
                type="number"
                description="Portfolio order"
                required
              />
            </div>
            <FormTextarea
              label="Description"
              registration={register('description')}
              error={errors.description}
              placeholder="Describe your studies, thesis, or focus areas..."
              rows={3}
            />
            <FormInput
              label="Activities (comma-separated)"
              registration={register('activities')}
              placeholder="ACM Chapter, Hackathon Organizer, ..."
            />
          </div>
          <DialogFooter className="pt-2">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => onOpenChange(false)}
              className="h-9"
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button size="sm" type="submit" className="h-9" disabled={isPending || (editMode && !isDirty)}>
              {editMode ? 'Save Changes' : 'Add Education'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
