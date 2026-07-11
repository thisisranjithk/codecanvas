import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, MoreHorizontal, MapPin, Calendar, Briefcase } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import {
  formatYear,
  getEmploymentDuration,
  sortByDateDesc,
} from '@/lib/utils';
import { toast } from 'sonner';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { ConfirmDeleteDialog } from '@/components/shared/confirm-delete-dialog';
import {
  FormInput,
  FormTextarea,
  FormSelect,
  FormSwitch,
  FormMonthPicker,
} from '@/components/shared/form-field';
import { experienceSchema, type ExperienceFormData } from '@/schemas';
import { useExperiences, useExperience, useCreateExperience, useUpdateExperience, useDeleteExperience } from '@/hooks/api/experience';
import { useCategoryDropdown } from '@/hooks/api/category';
import type { Experience as ExperienceType } from '@/types';
import { Loader } from '@/components/ui/loader';
import { ErrorState } from '@/components/shared/error-state';
import { ExpandableText } from '@/components/shared/expandable-text';

export function Experience() {
  const { data: response, isLoading, isError, error, refetch } = useExperiences();
  const experiences = response?.data || [];

  const deleteMutation = useDeleteExperience();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<ExperienceType | null>(null);

  function handleDelete(exp: ExperienceType) {
    deleteMutation.mutate(exp.id, {
      onSuccess: () => {
        setDeleteDialog(null);
        toast.success(`"${exp.role} at ${exp.company}" removed`);
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Failed to delete experience');
      },
    });
  }

  function openEdit(exp: ExperienceType) {
    setEditingExpId(exp.id);
    setDialogOpen(true);
  }

  function openNew() {
    setEditingExpId(null);
    setDialogOpen(true);
  }

  if (isLoading) {
    return <Loader variant="section" text="Loading certifications..." />;
  }

  if (isError) {
    return (
      <div className="p-6">
        <ErrorState
          title="Failed to load certifications"
          description={error?.message || 'An unexpected error occurred.'}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <main className="animate-fade-in max-w-5xl mx-auto px-6 py-8 pb-20 space-y-12 w-full">
      <PageHeader
        title="Experience"
        description={`${experiences.length} positions`}
        action={{ label: 'Add Experience', onClick: openNew, icon: <Plus className="size-4" /> }}
      />

      {experiences.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No experience added"
          action={{ label: 'Add your first position', onClick: openNew }}
        />
      ) : (
        <div className="flex flex-col gap-5">
          {sortByDateDesc(experiences).map((exp) => (
            <Card key={exp.id} className="border-border/60 card-hover overflow-hidden">
              <CardContent className="flex flex-col p-4 sm:p-6">
                <div className="flex flex-col gap-3 sm:gap-4">
                  {/* Header Row */}
                  <div className="flex items-start justify-between gap-3 sm:gap-4">
                    <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                      <div className="bg-primary/10 border-primary/20 text-primary flex size-11 shrink-0 items-center justify-center rounded-xl border text-base font-bold shadow-sm sm:size-12 sm:text-lg">
                        <Briefcase className="size-5" />
                      </div>
                      <div className="mt-0.5 flex min-w-0 flex-col">
                        <h2 className="text-foreground truncate text-sm font-bold tracking-tight sm:text-sm">
                          {exp.company}
                        </h2>
                        <p className="text-primary text-sm truncate mt-2 font-semibold sm:text-sm">
                          {exp.role}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 text-primary hover:bg-primary/10 hidden h-6 rounded-md border-transparent px-2.5 text-xs font-medium sm:flex"
                      >
                        {getEmploymentDuration(exp.startDate, exp.isCurrent ? null : exp.endDate)}
                      </Badge>
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
                          <DropdownMenuItem onClick={() => openEdit(exp)}>
                            <Pencil className="mr-2 size-3.5" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setDeleteDialog(exp)}
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
                      {formatYear(exp.startDate)} —{' '}
                      {exp.isCurrent ? 'Present' : (exp.endDate ? formatYear(exp.endDate) : '')}
                      <span className="ml-1 sm:hidden">
                        ({getEmploymentDuration(exp.startDate, exp.isCurrent ? null : exp.endDate)})
                      </span>
                    </span>
                    <span className="text-muted-foreground/30 hidden sm:inline">•</span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-3.5 opacity-70" />
                      {exp.location}
                    </span>
                    <span className="text-muted-foreground/30 hidden sm:inline">•</span>
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="size-3.5 opacity-70" />
                      {exp.employmentType?.name || 'Full-time'}
                    </span>
                  </div>

                  {/* Description Text */}
                  {exp.description && (
                    <ExpandableText text={exp.description} lines={3} className="sm:pl-16 max-w-4xl" />
                  )}
                </div>

                {/* Divider */}
                {(exp.responsibilities?.length > 0 || exp.technologies?.length > 0) && (
                  <div className="bg-border/50 my-4 h-px w-full sm:my-5 sm:ml-16 sm:w-[calc(100%-64px)]" />
                )}

                {/* Responsibilities & Tech */}
                <div className="flex flex-col gap-5 sm:gap-8 lg:flex-row sm:pl-16">
                  {/* Left Column: Responsibilities */}
                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <div className="flex flex-1 flex-col gap-2.5">
                      <h4 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                        Key Responsibilities
                      </h4>
                      <ul className="flex flex-col gap-2">
                        {exp.responsibilities.map((item, i) => (
                          <li
                            key={i}
                            className="text-foreground/90 text-sm flex items-start gap-2.5"
                          >
                            <span className="bg-primary/60 mt-1.5 size-1 shrink-0 rounded-full" />
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Right Column: Technologies */}
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex shrink-0 flex-col gap-2.5 lg:w-64">
                      <h4 className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                        Technologies
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {exp.technologies.map((tech) => (
                          <Badge
                            key={tech}
                            variant="secondary"
                            className="bg-secondary/60 hover:bg-secondary/80 h-6 border-transparent px-2.5 text-xs font-normal sm:text-xs"
                          >
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
      <ExperienceDialog experienceId={editingExpId} editMode={!!editingExpId} open={dialogOpen} onOpenChange={setDialogOpen} />

      {/* Delete Dialog */}
      <ConfirmDeleteDialog
        isOpen={!!deleteDialog}
        onClose={() => setDeleteDialog(null)}
        onConfirm={() => deleteDialog && handleDelete(deleteDialog)}
        title="Delete Experience"
        description={
          <>
            Remove{' '}
            <strong>
              "{deleteDialog?.role} at {deleteDialog?.company}"
            </strong>
            ?
          </>
        }
        isLoading={deleteMutation.isPending}
      />
    </main>
  );
}

function ExperienceDialog({
  experienceId,
  editMode,
  open,
  onOpenChange,
}: {
  experienceId: string | null;
  editMode: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: fetchedExperience, isFetching: isFetchingExperience } = useExperience(open ? (experienceId || '') : '');
  const { data: dropdownResponse } = useCategoryDropdown('EMPLOYMENT_TYPE');
  const employmentTypes = dropdownResponse || [];

  const createMutation = useCreateExperience();
  const updateMutation = useUpdateExperience();

  const isPending = createMutation.isPending || updateMutation.isPending || isFetchingExperience;

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      company: '',
      role: '',
      employmentTypeId: '',
      location: '',
      startDate: undefined as unknown as Date,
      endDate: null,
      current: false,
      description: '',
      responsibilities: '',
      technologies: '',
    },
  });

  useEffect(() => {
    if (open) {
      if (editMode) {
        if (fetchedExperience?.data) {
          const expData = fetchedExperience.data;
          reset({
            company: expData.company ?? '',
            role: expData.role ?? '',
            employmentTypeId: expData.employmentTypeId ?? '',
            location: expData.location ?? '',
            startDate: expData.startDate
              ? new Date(expData.startDate)
              : (undefined as unknown as Date),
            endDate: expData.endDate ? new Date(expData.endDate) : null,
            current: expData.isCurrent ?? false,
            description: expData.description ?? '',
            responsibilities: expData.responsibilities?.join('\n') ?? '',
            technologies: expData.technologies?.join(', ') ?? '',
          });
        }
      } else {
        reset({
          company: '',
          role: '',
          employmentTypeId: '',
          location: '',
          startDate: undefined as unknown as Date,
          endDate: null,
          current: false,
          description: '',
          responsibilities: '',
          technologies: '',
        });
      }
    }
  }, [open, editMode, fetchedExperience, reset]);

  const isCurrent = watch('current');

  function onSubmit(data: ExperienceFormData) {
    const payload = {
      ...data,
      startDate: data.startDate.toISOString(),
      endDate: data.current ? null : (data.endDate ? data.endDate.toISOString() : null),
      isCurrent: data.current,
      responsibilities: data.responsibilities
        ? data.responsibilities.split('\n').map((r) => r.trim()).filter(Boolean)
        : [],
      technologies: data.technologies
        ? data.technologies.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
    };

    if (editMode && experienceId) {
      updateMutation.mutate(
        { id: experienceId, data: payload },
        {
          onSuccess: (data) => {
            onOpenChange(false);
            toast.success(data.message || 'Experience updated successfully');
          },
          onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to update experience');
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: (data) => {
          onOpenChange(false);
          toast.success(data.message || 'Experience added successfully');
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || 'Failed to create experience');
        },
      });
    }
  }

  const employmentTypeOptions = employmentTypes.map((type) => ({
    label: type.name,
    value: type.id,
  }));

  return (
    <Dialog open={open} onOpenChange={isPending ? undefined : onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">
            {editMode ? 'Edit Experience' : 'Add Experience'}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {editMode ? 'Update position details.' : 'Add a work experience entry.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid py-2">
            <FormInput
              label="Company"
              registration={register('company')}
              error={errors.company}
              placeholder="TechCorp Pvt. Ltd."
              required
            />
            <FormInput
              label="Role / Title"
              registration={register('role')}
              error={errors.role}
              placeholder="Frontend Developer"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <FormSelect
                label="Employment Type"
                name="employmentTypeId"
                control={control}
                error={errors.employmentTypeId}
                options={employmentTypeOptions}
                placeholder="Select Employment Type"
                required
                selectClassName="w-full"
              />
              <FormInput
                label="Location"
                registration={register('location')}
                error={errors.location}
                placeholder="Bengaluru, India"
                required
                inputClassName="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormMonthPicker
                label="Start Date"
                name="startDate"
                control={control}
                error={errors.startDate}
                required
                pickerClassName="w-full"
              />
              <FormMonthPicker
                label="End Date"
                name="endDate"
                control={control}
                error={errors.endDate}
                disabled={isCurrent || isPending}
                pickerClassName="w-full"
              />
            </div>

            <FormSwitch
              label="I currently work here"
              name="current"
              control={control}
              description="This will hide the end date"
              className="bg-muted/20 mb-4"
            />

            <FormTextarea
              label="Short Description"
              registration={register('description')}
              error={errors.description}
              placeholder="Brief summary of your role..."
              rows={2}
            />

            <FormTextarea
              label="Key Responsibilities"
              registration={register('responsibilities')}
              placeholder="List your responsibilities (one per line)..."
              rows={4}
              description="Press Enter to separate each responsibility bullet point."
            />

            <FormInput
              label="Technologies"
              registration={register('technologies')}
              placeholder="React, Next.js, Tailwind CSS..."
              description="Separate each technology with a comma."
            />
          </div>
          <DialogFooter className="pt-2">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button size="sm" type="submit" disabled={isPending || (editMode && !isDirty)}>
              {editMode ? 'Save Changes' : 'Add Experience'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
