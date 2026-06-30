import { useState, useMemo, useEffect } from 'react';
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
import { mockSkills } from '@/data/skills';
import { getSkillProficiencyBadgeClass, getSkillProficiencyLabel } from '@/lib/utils';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { ConfirmDeleteDialog } from '@/components/shared/confirm-delete-dialog';
import { FormInput, FormSelect, FormSlider } from '@/components/shared/form-field';
import { skillSchema, type SkillFormData } from '@/schemas';

type Skill = (typeof mockSkills)[0];

const categoryIcons: Record<string, LucideIcon> = {
  Languages: Terminal,
  Frontend: Layers,
  Backend: Server,
  Databases: Database,
  'Cloud / DevOps': Cloud,
  Design: PenTool,
};

export function Skills() {
  const [skills, setSkills] = useState(mockSkills);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<Skill | null>(null);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const categories = useMemo(() => Array.from(new Set(mockSkills.map((s) => s.category))), []);

  const filtered = useMemo(() => {
    return skills.filter((s) => {
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = categoryFilter === 'all' || s.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [skills, search, categoryFilter]);

  const grouped = useMemo(() => {
    return categories.reduce<Record<string, Skill[]>>((acc, cat) => {
      const inCategory = filtered.filter((s) => s.category === cat);
      if (inCategory.length > 0) acc[cat] = inCategory;
      return acc;
    }, {});
  }, [categories, filtered]);

  function handleDelete(skill: Skill) {
    setSkills((prev) => prev.filter((s) => s.id !== skill.id));
    setDeleteDialog(null);
    toast.success(`"${skill.name}" removed`);
  }

  function openEdit(skill: Skill) {
    setEditingSkill(skill);
    setDialogOpen(true);
  }

  function openNew() {
    setEditingSkill(null);
    setDialogOpen(true);
  }

  function toggleCollapse(cat: string) {
    setCollapsed((prev) => ({ ...prev, [cat]: !prev[cat] }));
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
              <SelectItem key={c} value={c}>
                {c}
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
                  <h2 className="text-foreground text-[15px] font-semibold tracking-tight">
                    {cat}
                  </h2>
                  <Badge variant="secondary" className="bg-muted ml-1 h-4 px-1.5 text-[10px]">
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
        skill={editingSkill}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        categories={categories}
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
      />
    </div>
  );
}

function SkillDialog({
  skill,
  open,
  onOpenChange,
  categories,
}: {
  skill: Skill | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: string[];
}) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: '',
      category: 'Frontend',
      proficiency: 80,
      yearsOfExperience: 0,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: skill?.name ?? '',
        category: skill?.category ?? 'Frontend',
        proficiency: skill?.proficiency ?? 80,
        yearsOfExperience: skill?.yearsOfExperience ?? 0,
      });
    }
  }, [open, skill, reset]);

  // const proficiencyValue = watch("proficiency")

  function onSubmit(_data: SkillFormData) {
    onOpenChange(false);
    toast.success(skill ? 'Skill updated' : 'Skill added');
  }

  const categoryOptions = [
    ...categories.map((c) => ({ label: c, value: c })),
    { label: 'Other', value: 'Other' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg">{skill ? 'Edit Skill' : 'Add Skill'}</DialogTitle>
          <DialogDescription className="text-sm">
            {skill ? 'Update skill details.' : 'Add a new skill to your portfolio.'}
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
              name="category"
              control={control}
              error={errors.category}
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
              required
            />
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" size="sm" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button size="sm" type="submit">
              {skill ? 'Save Changes' : 'Add Skill'}
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
              <span className="text-muted-foreground text-[12px] font-medium">
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
              'bg-background/50 h-5 px-2 text-[10px] font-medium',
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
            <span className="text-muted-foreground text-[11px] font-semibold tabular-nums">
              {skill.proficiency}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
