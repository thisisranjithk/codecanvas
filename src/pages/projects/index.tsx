import { useState, useMemo, useEffect } from 'react';
import { useProjects, useProject, useCreateProject, useUpdateProject, useDeleteProject } from '@/hooks/api/project';
import { useCategoryDropdown } from '@/hooks/api/category/use-category-dropdown';
import {
  Plus,
  Search,
  Eye,
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Trash2,
  Star,
  Archive,
  Code2,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader } from '@/components/ui/loader';
import { formatDateTime, formatNumber } from '@/lib/utils';
import { toast } from 'sonner';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { ConfirmDeleteDialog } from '@/components/shared/confirm-delete-dialog';
import { StatusBadge } from '@/components/shared/status-badge';
import { FormInput, FormTextarea, FormSelect, FormSwitch } from '@/components/shared/form-field';
import { projectSchema, type ProjectFormData } from '@/schemas';
import type { Project } from '@/types/project.types';

export function Projects() {
  const { data: projects = [], isLoading, isError, error, refetch } = useProjects();
  const { data: categoryData, isLoading: isCategoryLoading } = useCategoryDropdown('PROJECT');

  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<Project | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  const categoryOptions = useMemo(
    () => (categoryData ?? []).map((c) => ({ label: c.name, value: c.id })),
    [categoryData]
  );

  const filtered = useMemo(() => {
    const list = Array.isArray(projects) ? projects : [];
    return list
      .filter((p) => {
        const matchSearch =
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase()) ||
          p.technologies.some((t) => t.toLowerCase().includes(search.toLowerCase()));
        const matchStatus = statusFilter === 'all' || p.status === statusFilter;
        const matchCategory = categoryFilter === 'all' || p.categoryId === categoryFilter;
        return matchSearch && matchStatus && matchCategory;
      })
      .sort((a, b) => new Date(b.updatedAt ?? 0).getTime() - new Date(a.updatedAt ?? 0).getTime());
  }, [projects, search, statusFilter, categoryFilter]);

  function handleDelete(project: Project) {
    deleteProject.mutate(project.id, {
      onSuccess: (data) => {
        setDeleteDialog(null);
        toast.success(data.message || `"${project.title}" deleted`);
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || 'Failed to delete project');
      },
    });
  }

  function openEdit(project: Project) {
    setEditingProjectId(project.id);
    setDialogOpen(true);
  }

  function openNew() {
    setEditingProjectId(null);
    setDialogOpen(true);
  }

  if (isLoading) {
    return <Loader variant="section" text="Loading projects..." />;
  }

  if (isError) {
    return (
      <div className="p-6">
        <ErrorState
          title="Failed to load projects"
          description={error?.message || 'An unexpected error occurred.'}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <main className="animate-fade-in max-w-5xl mx-auto px-6 py-8 pb-20 space-y-12 w-full">
      {/* Header */}
      <PageHeader
        title="Projects"
        description={`${projects.length} projects · ${projects.filter((p) => p.status === 'PUBLISHED').length} published`}
        action={{ label: 'New Project', onClick: openNew, icon: <Plus className="size-4" /> }}
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative max-w-xs min-w-48 flex-1">
          <Search className="text-muted-foreground/60 pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <Input
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 pl-9 text-sm"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-32 text-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="ARCHIVED">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter} disabled={isCategoryLoading}>
          <SelectTrigger className="h-9 w-36 text-sm">
            <SelectValue placeholder={isCategoryLoading ? 'Loading…' : 'Category'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categoryOptions.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Code2}
          title="No projects found"
          description="Try adjusting your search or filters"
          action={{
            label: 'Clear filters',
            onClick: () => {
              setSearch('');
              setStatusFilter('all');
              setCategoryFilter('all');
            },
          }}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((project) => (
            <Card
              key={project.id}
              className="card-hover border-border/60 group overflow-hidden"
            >
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3 sm:gap-4 flex-1">
                    <div className="bg-primary/10 border-primary/20 text-primary flex size-11 shrink-0 items-center justify-center rounded-xl border shadow-sm sm:size-12">
                      <Code2 className="size-5" />
                    </div>

                    <div className="mt-0.5 flex min-w-0 flex-col gap-1 w-full">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-foreground truncate text-sm leading-tight font-bold sm:text-sm">
                          {project.title}
                        </h3>
                        {project.featured && (
                          <Star className="text-warning fill-warning size-3.5 shrink-0" />
                        )}
                        <StatusBadge status={project.status} />
                      </div>

                      <span className="text-primary/80 text-sm truncate font-medium sm:text-sm">
                        {project.category?.name ?? ''}
                      </span>

                      <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed mt-1">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {project.technologies.slice(0, 4).map((tech) => (
                          <Badge
                            key={tech}
                            variant="secondary"
                            className="bg-secondary/60 hover:bg-secondary/80 h-6 border-transparent px-2.5 text-xs font-normal sm:text-xs"
                          >
                            {tech}
                          </Badge>
                        ))}
                        {project.technologies.length > 4 && (
                          <Badge variant="secondary" className="bg-secondary/60 h-6 border-transparent px-2.5 text-xs font-normal sm:text-xs">
                            +{project.technologies.length - 4}
                          </Badge>
                        )}
                      </div>

                      <div className="bg-border/50 my-2.5 h-px w-full" />

                      <div className="flex items-center justify-between">
                        <div className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
                          <Eye className="size-3.5 opacity-70" />
                          {formatNumber(project.views ?? 0)} views
                        </div>
                        <div className="flex items-center gap-2">
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary bg-primary/5 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium transition-colors hover:underline sm:text-xs"
                            >
                              GitHub <ExternalLink className="size-3" />
                            </a>
                          )}
                          <span className="text-muted-foreground/30 hidden sm:inline">•</span>
                          <span className="text-muted-foreground text-xs font-medium">
                            {formatDateTime(project.updatedAt ?? '')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-foreground -mr-2 size-8 shrink-0 opacity-100 transition-opacity group-hover:opacity-100 sm:opacity-0"
                      >
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem onClick={() => openEdit(project)}>
                        <Pencil className="size-3.5" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => openEdit(project)}>
                        <Archive className="size-3.5" />
                        Change Status
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setDeleteDialog(project)}
                      >
                        <Trash2 className="size-3.5" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit / New Dialog */}
      <ProjectDialog
        projectId={editingProjectId}
        editMode={!!editingProjectId}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        categoryOptions={categoryOptions}
        isCategoryLoading={isCategoryLoading}
        createMutation={createProject}
        updateMutation={updateProject}
      />

      {/* Delete Confirmation */}
      <ConfirmDeleteDialog
        isOpen={!!deleteDialog}
        onClose={() => setDeleteDialog(null)}
        onConfirm={() => deleteDialog && handleDelete(deleteDialog)}
        title="Delete Project"
        description={
          <>
            Delete <strong>"{deleteDialog?.title}"</strong> from your portfolio?
          </>
        }
        isLoading={deleteProject.isPending}
        itemName={deleteDialog?.title}
      />
    </main>
  );
}

function ProjectDialog({
  projectId,
  editMode,
  open,
  onOpenChange,
  categoryOptions,
  isCategoryLoading,
  createMutation,
  updateMutation,
}: {
  projectId: string | null;
  editMode: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryOptions: { label: string; value: string }[];
  isCategoryLoading: boolean;
  createMutation: ReturnType<typeof useCreateProject>;
  updateMutation: ReturnType<typeof useUpdateProject>;
}) {
  const { data: fetchedProject, isFetching: isFetchingProject } = useProject(
    open ? (projectId || '') : ''
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      categoryId: '',
      status: 'DRAFT',
      technologies: '',
      liveUrl: '',
      githubUrl: '',
      featured: false,
    },
  });

  useEffect(() => {
    if (open) {
      if (editMode && fetchedProject) {
        reset({
          title: fetchedProject.title ?? '',
          description: fetchedProject.description ?? '',
          categoryId: fetchedProject.categoryId ?? '',
          status: fetchedProject.status ?? 'DRAFT',
          technologies: fetchedProject.technologies.join(', '),
          liveUrl: fetchedProject.liveUrl ?? '',
          githubUrl: fetchedProject.githubUrl ?? '',
          featured: fetchedProject.featured ?? false,
        });
      } else if (!editMode) {
        reset({
          title: '',
          description: '',
          categoryId: '',
          status: 'DRAFT',
          technologies: '',
          liveUrl: '',
          githubUrl: '',
          featured: false,
        });
      }
    }
  }, [open, editMode, fetchedProject, reset]);

  const isPending = createMutation.isPending || updateMutation.isPending || isFetchingProject;

  function parseTechnologies(raw: string): string[] {
    return raw
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
  }

  function onSubmit(data: ProjectFormData) {
    const payload = {
      ...data,
      technologies: parseTechnologies(data.technologies),
      liveUrl: data.liveUrl || null,
      githubUrl: data.githubUrl || null,
    };

    if (editMode && projectId) {
      updateMutation.mutate(
        { id: projectId, data: payload },
        {
          onSuccess: (res) => {
            onOpenChange(false);
            toast.success(res.message || 'Project updated successfully');
          },
          onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Failed to update project');
          },
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: (res) => {
          onOpenChange(false);
          toast.success(res.message || 'Project created successfully');
        },
        onError: (err: any) => {
          toast.error(err.response?.data?.message || 'Failed to create project');
        },
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => !isPending && onOpenChange(val)}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-lg">{editMode ? 'Edit Project' : 'New Project'}</DialogTitle>
          <DialogDescription className="text-sm">
            {editMode ? 'Update project details.' : 'Fill in details to create a new project.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid py-2">
            <FormInput
              label="Title"
              registration={register('title')}
              error={errors.title}
              placeholder="Project title"
              required
            />
            <FormTextarea
              label="Description"
              registration={register('description')}
              error={errors.description}
              placeholder="Short description..."
              rows={3}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <FormSelect
                label="Category"
                name="categoryId"
                control={control}
                error={errors.categoryId}
                options={categoryOptions}
                placeholder={isCategoryLoading ? 'Loading…' : 'Select category'}
                required
                selectClassName={isCategoryLoading ? 'opacity-60' : undefined}
              />
              <FormSelect
                label="Status"
                name="status"
                control={control}
                error={errors.status}
                options={[
                  { label: 'Draft', value: 'DRAFT' },
                  { label: 'Published', value: 'PUBLISHED' },
                  { label: 'Archived', value: 'ARCHIVED' },
                ]}
                required
              />
            </div>
            <FormInput
              label="Technologies (comma-separated)"
              registration={register('technologies')}
              error={errors.technologies}
              placeholder="React, TypeScript, ..."
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <FormInput
                label="Live URL"
                registration={register('liveUrl')}
                error={errors.liveUrl}
                placeholder="https://"
              />
              <FormInput
                label="GitHub URL"
                registration={register('githubUrl')}
                error={errors.githubUrl}
                placeholder="https://github.com/..."
              />
            </div>
            <FormSwitch
              label="Featured Project"
              name="featured"
              control={control}
              description="Show prominently on your portfolio"
            />
          </div>
          <DialogFooter className="mt-4">
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
              {editMode ? 'Save Changes' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
