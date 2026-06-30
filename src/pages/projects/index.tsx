import { useState, useMemo, useEffect } from 'react';
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
import { mockProjects } from '@/data/projects';
import { formatDateTime, formatNumber } from '@/lib/utils';
import { toast } from 'sonner';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { ConfirmDeleteDialog } from '@/components/shared/confirm-delete-dialog';
import { StatusBadge } from '@/components/shared/status-badge';
import { FormInput, FormTextarea, FormSelect, FormSwitch } from '@/components/shared/form-field';
import { projectSchema, type ProjectFormData } from '@/schemas';

type Project = (typeof mockProjects)[0];

export function Projects() {
  const [projects, setProjects] = useState(mockProjects);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const categories = useMemo(() => Array.from(new Set(mockProjects.map((p) => p.category))), []);

  const filtered = useMemo(() => {
    return projects
      .filter((p) => {
        const matchSearch =
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase()) ||
          p.technologies.some((t) => t.toLowerCase().includes(search.toLowerCase()));
        const matchStatus = statusFilter === 'all' || p.status === statusFilter;
        const matchCategory = categoryFilter === 'all' || p.category === categoryFilter;
        return matchSearch && matchStatus && matchCategory;
      })
      .sort((a, b) => {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }, [projects, search, statusFilter, categoryFilter]);

  function handleDelete(project: Project) {
    setProjects((prev) => prev.filter((p) => p.id !== project.id));
    setDeleteDialog(null);
    toast.success(`"${project.title}" deleted`);
  }

  function handleToggleFeatured(id: string) {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p)));
    toast.success('Featured updated');
  }

  function handleStatusChange(id: string, status: string) {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    toast.success('Status updated');
  }

  function openEdit(project: Project) {
    setEditingProject(project);
    setDialogOpen(true);
  }

  function openNew() {
    setEditingProject(null);
    setDialogOpen(true);
  }

  return (
    <div className="animate-fade-in flex flex-col gap-5 p-6">
      {/* Header */}
      <PageHeader
        title="Projects"
        description={`${projects.length} projects · ${projects.filter((p) => p.status === 'published').length} published`}
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
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="h-9 w-36 text-sm">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
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
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <Card
              key={project.id}
              className="card-hover border-border/60 group overflow-hidden py-0"
            >
              {/* Color bar */}
              <div
                className={`h-0.5 w-full ${
                  project.status === 'published'
                    ? 'bg-success'
                    : project.status === 'draft'
                      ? 'bg-warning'
                      : 'bg-muted-foreground/30'
                }`}
              />
              <CardContent className="flex flex-col gap-3 p-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <div className="flex items-center gap-1.5">
                      {project.featured && (
                        <Star className="text-warning fill-warning size-3.5 shrink-0" />
                      )}
                      <span className="truncate text-base leading-tight font-semibold">
                        {project.title}
                      </span>
                    </div>
                    <span className="text-muted-foreground text-xs">{project.category}</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <StatusBadge status={project.status} />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => openEdit(project)}>
                          <Pencil className="size-3.5" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleToggleFeatured(project.id)}>
                          <Star className="size-3.5" />
                          {project.featured ? 'Unfeature' : 'Feature'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            handleStatusChange(
                              project.id,
                              project.status === 'published' ? 'draft' : 'published'
                            )
                          }
                        >
                          {project.status === 'published' ? 'Unpublish' : 'Publish'}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(project.id, 'archived')}
                        >
                          <Archive className="size-3.5" />
                          Archive
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
                </div>

                <p className="text-muted-foreground line-clamp-2 flex-1 text-xs leading-relaxed">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="bg-secondary/60 h-5 px-1.5 text-xs font-normal"
                    >
                      {tech}
                    </Badge>
                  ))}
                  {project.technologies.length > 4 && (
                    <Badge variant="outline" className="h-5 px-1.5 text-xs font-normal">
                      +{project.technologies.length - 4}
                    </Badge>
                  )}
                </div>

                <div className="border-border/40 flex items-center justify-between border-t pt-2">
                  <div className="text-muted-foreground flex items-center gap-1 text-xs">
                    <Eye className="size-3.5" />
                    {formatNumber(project.views)}
                  </div>
                  <div className="flex items-center gap-0.5">
                    {project.githubUrl && (
                      <Button variant="ghost" size="icon" className="size-7" asChild>
                        <a href={project.githubUrl} target="_blank" rel="noreferrer">
                          <ExternalLink className="size-3.5" />
                        </a>
                      </Button>
                    )}
                    <span className="text-muted-foreground/60 text-xs">
                      {formatDateTime(project.updatedAt)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit / New Dialog */}
      <ProjectDialog project={editingProject} open={dialogOpen} onOpenChange={setDialogOpen} />

      {/* Delete Confirmation */}
      <ConfirmDeleteDialog
        isOpen={!!deleteDialog}
        onClose={() => setDeleteDialog(null)}
        onConfirm={() => deleteDialog && handleDelete(deleteDialog)}
        title="Delete Project"
        itemName={deleteDialog?.title}
      />
    </div>
  );
}

function ProjectDialog({
  project,
  open,
  onOpenChange,
}: {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      status: 'draft',
      technologies: '',
      liveUrl: '',
      githubUrl: '',
      featured: false,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        title: project?.title ?? '',
        description: project?.description ?? '',
        category: project?.category ?? '',
        status: (project?.status as ProjectFormData['status']) ?? 'draft',
        technologies: project?.technologies.join(', ') ?? '',
        liveUrl: project?.liveUrl ?? '',
        githubUrl: project?.githubUrl ?? '',
        featured: project?.featured ?? false,
      });
    }
  }, [open, project, reset]);

  function onSubmit(_data: ProjectFormData) {
    onOpenChange(false);
    toast.success(project ? 'Project updated' : 'Project created');
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-lg">{project ? 'Edit Project' : 'New Project'}</DialogTitle>
          <DialogDescription className="text-sm">
            {project ? 'Update project details.' : 'Fill in details to create a new project.'}
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
              <FormInput
                label="Category"
                registration={register('category')}
                error={errors.category}
                placeholder="e.g. Full Stack"
                required
              />
              <FormSelect
                label="Status"
                name="status"
                control={control}
                error={errors.status}
                options={[
                  { label: 'Draft', value: 'draft' },
                  { label: 'Published', value: 'published' },
                  { label: 'Archived', value: 'archived' },
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
            <Button variant="outline" size="sm" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button size="sm" type="submit">
              {project ? 'Save Changes' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
