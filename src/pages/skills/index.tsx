import { useState, useMemo, useEffect } from 'react';
import { useCategoryDropdown } from '@/hooks/api/category';
import { useSkills, useSkill, useCreateSkill, useUpdateSkill, useDeleteSkill } from '@/hooks/api/skill';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  MoreHorizontal,
  Code2,
  ChevronDown,
  ChevronRight,
  Terminal,
  Layers,
  Server,
  Database,
  Cloud,
  PenTool,
  type LucideIcon,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getSkillProficiencyBadgeClass, getSkillProficiencyLabel } from '@/lib/utils';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { ConfirmDeleteDialog } from '@/components/shared/confirm-delete-dialog';
import { FormInput, FormSelect, FormSlider } from '@/components/shared/form-field';
import { skillSchema, type SkillFormData } from '@/schemas';
import type { Skill } from '@/types/skill.types';
import { ErrorState } from '@/components/shared/error-state';
import { Loader } from '@/components/ui/loader';

const categoryIcons: Record<string, LucideIcon> = {
  Languages: Terminal,
  Frontend: Layers,
  Backend: Server,
  Databases: Database,
  'Cloud / DevOps': Cloud,
  Design: PenTool,
};

export function Skills() {
  const { data: skills = [], isLoading: isLoadingSkills, isError, error, refetch } = useSkills();
  const { data: categoryDropdown } = useCategoryDropdown('SKILL');

  const createSkill = useCreateSkill();
  const updateSkill = useUpdateSkill();
  const deleteSkill = useDeleteSkill();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<Skill | null>(null);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const categories = useMemo(() => categoryDropdown || [], [categoryDropdown]);

  const filtered = useMemo(() => {
    return skills.filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
      const catName = s.category?.name || 'Uncategorized';
      const matchCat = categoryFilter === 'all' || catName === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [skills, search, categoryFilter]);

  const grouped = useMemo(() => {
    return filtered.reduce<Record<string, Skill[]>>((acc, skill) => {
      const catName = skill.category?.name || 'Uncategorized';
      if (!acc[catName]) {
        acc[catName] = [];
      }
      acc[catName].push(skill);
      return acc;
    }, {});
  }, [filtered]);

  function handleDelete(skill: Skill) {
    deleteSkill.mutate(skill.id, {
      onSuccess: (data) => {
        setDeleteDialog(null);
        toast.success(data.message || `"${skill.name}" skill deleted successfully`);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to delete skill');
      },
    });
  }

  function openEdit(skill: Skill) {
    setEditingSkillId(skill.id);
    setDialogOpen(true);
  }

  function openNew() {
    setEditingSkillId(null);
    setDialogOpen(true);
  }

  function toggleCollapse(cat: string) {
    setCollapsed((prev) => ({ ...prev, [cat]: !prev[cat] }));
  }

  if (isLoadingSkills) {
    return <Loader variant="section" text="Loading certifications..." />;
  }

  if (isError) {
    return (
      <div className="p-6">
        <ErrorState
          title="Failed to load skills"
          description={error?.message || 'An unexpected error occurred.'}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="animate-fade-in flex flex-col gap-5 p-6">
      {/* Header */}
      <PageHeader
        title="Skills"
        description={`${skills.length} skills across ${categories.length} categories`}
        action={{
          label: 'Add Skill',
          onClick: openNew,
          icon: <Plus className="size-4" />,
        }}
      />

      {/* Filters */}
      <div className="flex items-center gap-2">
        <div className="relative max-w-64 flex-1">
          <Search className="text-muted-foreground/60 pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
          <Input
            placeholder="Search skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 pl-9 text-sm"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="h-9 w-44 text-sm">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.name}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grouped Skills */}
      {Object.entries(grouped).length === 0 ? (
        <EmptyState
          icon={Code2}
          title="No skills found"
          action={{
            label: 'Clear filters',
            onClick: () => {
              setSearch('');
              setCategoryFilter('all');
            },
          }}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {Object.entries(grouped).map(([cat, catSkills]) => {
            const Icon = categoryIcons[cat] ?? Code2;
            const isCollapsed = collapsed[cat];
            const avg = Math.round(
              catSkills.reduce((sum, s) => sum + s.proficiency, 0) / catSkills.length
            );

            return (
              <div key={cat} className="flex flex-col gap-3">
                {/* Section Header */}
                <button
                  onClick={() => toggleCollapse(cat)}
                  className="group flex items-center gap-2 py-1"
                >
                  {isCollapsed ? (
                    <ChevronRight className="text-muted-foreground/60 group-hover:text-foreground size-4 transition-colors" />
                  ) : (
                    <ChevronDown className="text-muted-foreground/60 group-hover:text-foreground size-4 transition-colors" />
                  )}
                  <Icon className="text-muted-foreground/60 size-4" />
                  <h2 className="text-foreground text-base font-semibold tracking-tight">{cat}</h2>
                  <Badge variant="secondary" className="bg-muted ml-1 h-4 px-1.5 text-xs">
                    {catSkills.length}
                  </Badge>
                  <div className="ml-auto flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="text-muted-foreground text-xs">Avg {avg}%</span>
                    <div className="bg-muted h-1.5 w-16 overflow-hidden rounded-full">
                      <div
                        className="bg-primary/40 h-full rounded-full"
                        style={{ width: `${avg}%` }}
                      />
                    </div>
                  </div>
                </button>

                {/* Skill Cards */}
                {!isCollapsed && (
                  <div className="grid gap-3 pt-1 pl-2 sm:pl-6 lg:grid-cols-2 xl:grid-cols-3">
                    {catSkills.map((skill) => (
                      <SkillCard
                        key={skill.id}
                        skill={skill}
                        onEdit={openEdit}
                        onDelete={setDeleteDialog}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Edit/New Dialog */}
      <SkillDialog
        skillId={editingSkillId}
        editMode={!!editingSkillId}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        categories={categories}
        createMutation={createSkill}
        updateMutation={updateSkill}
      />

      {/* Delete Dialog */}
      <ConfirmDeleteDialog
        isOpen={!!deleteDialog}
        onClose={() => setDeleteDialog(null)}
        onConfirm={() => deleteDialog && handleDelete(deleteDialog)}
        title="Remove Skill"
        description={
          <>
            Remove <strong>"{deleteDialog?.name}"</strong> from your portfolio?
          </>
        }
        isLoading={deleteSkill.isPending}
      />
    </div>
  );
}

function SkillDialog({
  skillId,
  editMode,
  open,
  onOpenChange,
  categories,
  createMutation,
  updateMutation,
}: {
  skillId: string | null;
  editMode: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: { id: string; name: string }[];
  createMutation: ReturnType<typeof useCreateSkill>;
  updateMutation: ReturnType<typeof useUpdateSkill>;
}) {
  const { data: fetchedSkill, isFetching: isFetchingSkill } = useSkill(open ? (skillId || '') : '');

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: '',
      categoryId: '',
      proficiency: 80,
      yearsOfExperience: 0,
    },
  });

  useEffect(() => {
    if (open) {
      if (editMode) {
        if (fetchedSkill) {
          reset({
            name: fetchedSkill.name ?? '',
            categoryId: fetchedSkill.categoryId ?? '',
            proficiency: fetchedSkill.proficiency ?? 80,
            yearsOfExperience: fetchedSkill.yearsOfExperience ?? 0,
          });
        }
      } else {
        // Reset for new skill
        reset({
          name: '',
          categoryId: '',
          proficiency: 80,
          yearsOfExperience: 0,
        });
      }
    }
  }, [open, editMode, fetchedSkill, reset]);

  const isPending = createMutation.isPending || updateMutation.isPending || isFetchingSkill;

  function onSubmit(data: SkillFormData) {
    if (editMode && skillId) {
      updateMutation.mutate(
        { id: skillId, data },
        {
          onSuccess: (data) => {
            onOpenChange(false);
            toast.success(data.message || 'Skill updated successfully');
          },
          onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update skill');
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: (data) => {
          onOpenChange(false);
          toast.success(data.message || 'Skill added successfully');
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || 'Failed to add skill');
        },
      });
    }
  }

  const categoryOptions = categories.map((c) => ({ label: c.name, value: c.id }));

  return (
    <Dialog open={open} onOpenChange={(val) => !isPending && onOpenChange(val)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">{editMode ? 'Edit Skill' : 'Add Skill'}</DialogTitle>
          <DialogDescription className="text-sm">
            {editMode ? 'Update skill details.' : 'Add a new skill to your portfolio.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid py-2">
            <FormInput
              label="Skill Name"
              registration={register('name')}
              error={errors.name}
              placeholder="e.g. TypeScript"
              required
            />
            <FormSelect
              label="Category"
              name="categoryId"
              control={control}
              error={errors.categoryId}
              placeholder="Select Category"
              options={categoryOptions}
              required
            />
            <FormSlider
              label="Proficiency"
              name="proficiency"
              control={control}
              error={errors.proficiency}
              min={0}
              max={100}
              step={1}
              renderValue={(v) => `${v}% — ${getSkillProficiencyLabel(v)}`}
            />
            <FormInput
              label="Years of Experience"
              registration={register('yearsOfExperience', {
                valueAsNumber: true,
              })}
              error={errors.yearsOfExperience}
              placeholder="e.g. 3"
              type="number"
              min={0}
              max={30}
              step="any"
              required
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
              {editMode ? 'Save Changes' : 'Add Skill'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function SkillCard({
  skill,
  onEdit,
  onDelete,
}: {
  skill: Skill;
  onEdit: (skill: Skill) => void;
  onDelete: (skill: Skill) => void;
}) {
  return (
    <Card
      className={cn(
        'group border-border/60 transition-all duration-300',
        'hover:border-primary/20 bg-card/40 hover:bg-card/80 hover:shadow-sm'
      )}
    >
      <CardContent className="flex h-full flex-col justify-between gap-3 p-4">
        {/* Top: Icon + Name + Menu */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-3">
            <div className="bg-primary/10 border-primary/20 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl border shadow-sm">
              <Code2 className="size-5" />
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="text-foreground group-hover:text-primary truncate text-[14.5px] font-bold transition-colors">
                {skill.name}
              </span>
              <span className="text-muted-foreground text-xs font-medium">
                {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? 'year' : 'years'} exp
              </span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="-mt-1 -mr-2 size-8 shrink-0 opacity-100 transition-opacity group-hover:opacity-100 sm:opacity-0"
              >
                <MoreHorizontal className="text-muted-foreground size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem onClick={() => onEdit(skill)}>
                <Pencil className="mr-2 size-3.5" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={() => onDelete(skill)}>
                <Trash2 className="mr-2 size-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Bottom: Proficiency Badge + Tiny minimal bar */}
        <div className="border-border/40 mt-1 flex items-center justify-between gap-3 border-t pt-2">
          <Badge
            variant="outline"
            className={cn(
              'bg-background/50 h-5 px-2 text-xs font-medium',
              getSkillProficiencyBadgeClass(skill.proficiency)
            )}
          >
            {getSkillProficiencyLabel(skill.proficiency)}
          </Badge>

          <div className="flex flex-1 items-center justify-end gap-2">
            <div className="bg-muted h-1.5 max-w-16 flex-1 overflow-hidden rounded-full">
              <div
                className="bg-primary/60 group-hover:bg-primary h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${skill.proficiency}%` }}
              />
            </div>
            <span className="text-muted-foreground text-xs font-semibold tabular-nums">
              {skill.proficiency}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
