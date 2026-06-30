import { useState, useMemo, useEffect } from 'react';
import {
  Plus,
  Search,
  MoreHorizontal,
  ExternalLink,
  Pencil,
  Trash2,
  Star,
  BookOpen,
  Clock,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { mockBlogs } from '@/data/blogs';
import { formatPublishDate } from '@/lib/utils';
import { toast } from 'sonner';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';
import { ConfirmDeleteDialog } from '@/components/shared/confirm-delete-dialog';
import { StatusBadge } from '@/components/shared/status-badge';
import { FormInput, FormTextarea, FormSwitch } from '@/components/shared/form-field';
import { blogSchema, type BlogFormData } from '@/schemas';

type Blog = (typeof mockBlogs)[0];

// A simple placeholder generator based on blog id
function BlogImagePlaceholder({ id }: { id: string }) {
  const numId = parseInt(id) || 1;
  const colors = [
    'from-blue-600/20 to-indigo-600/20',
    'from-emerald-600/20 to-teal-600/20',
    'from-purple-600/20 to-fuchsia-600/20',
    'from-cyan-600/20 to-blue-600/20',
    'from-indigo-600/20 to-blue-600/20',
  ];
  const color = colors[(numId - 1) % colors.length];
  return (
    <div
      className={`h-full w-full bg-gradient-to-br ${color} flex items-center justify-center opacity-80 transition-opacity group-hover:opacity-100`}
    >
      <div className="bg-background/10 flex h-20 w-20 items-center justify-center rounded-xl border border-white/10 backdrop-blur-sm">
        <BookOpen className="size-8 text-white/40" />
      </div>
    </div>
  );
}

export function Blog() {
  const [blogs, setBlogs] = useState(mockBlogs);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<Blog | null>(null);

  const filtered = useMemo(() => {
    return blogs
      .filter((b) => {
        const matchSearch =
          b.title.toLowerCase().includes(search.toLowerCase()) ||
          b.excerpt.toLowerCase().includes(search.toLowerCase()) ||
          b.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
        const matchTab =
          activeTab === 'all' ||
          (activeTab === 'published' && b.status === 'published') ||
          (activeTab === 'draft' && b.status === 'draft') ||
          (activeTab === 'featured' && b.featured);
        return matchSearch && matchTab;
      })
      .sort((a, b) => {
        return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
      });
  }, [blogs, search, activeTab]);

  function handleDelete(blog: Blog) {
    setBlogs((prev) => prev.filter((b) => b.id !== blog.id));
    setDeleteDialog(null);
    toast.success('Blog post deleted');
  }

  function handleToggleFeatured(id: string) {
    setBlogs((prev) => prev.map((b) => (b.id === id ? { ...b, featured: !b.featured } : b)));
    toast.success('Featured updated');
  }

  function handleStatusChange(id: string, status: string) {
    setBlogs((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    toast.success('Status updated');
  }

  function openEdit(blog: Blog) {
    setEditingBlog(blog);
    setDialogOpen(true);
  }

  const counts = {
    all: blogs.length,
    published: blogs.filter((b) => b.status === 'published').length,
    draft: blogs.filter((b) => b.status === 'draft').length,
    featured: blogs.filter((b) => b.featured).length,
  };

  return (
    <div className="animate-fade-in flex flex-col gap-6 p-6">
      {/* Header */}
      <PageHeader
        title="Blog"
        description={
          <div className="flex flex-col gap-0.5">
            <span>Manage and organize your blog posts</span>
            <div className="text-3 flex items-center gap-1.5 font-medium">
              <span>{counts.all} posts</span>
              <span>•</span>
              <span className="text-emerald-500">{counts.published} published</span>
            </div>
          </div>
        }
        action={{
          label: 'New Post',
          onClick: () => {
            setEditingBlog(null);
            setDialogOpen(true);
          },
          icon: <Plus className="size-4" />,
        }}
      />

      {/* Tabs + Filters */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList className="bg-muted/40 border-border/40 h-10 w-full justify-start border p-1 sm:w-auto">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-background text-3 h-8 rounded-md px-4 data-[state=active]:shadow-sm"
            >
              All ({counts.all})
            </TabsTrigger>
            <TabsTrigger
              value="published"
              className="data-[state=active]:bg-background text-3 h-8 rounded-md px-4 data-[state=active]:shadow-sm"
            >
              Published ({counts.published})
            </TabsTrigger>
            <TabsTrigger
              value="draft"
              className="data-[state=active]:bg-background text-3 h-8 rounded-md px-4 data-[state=active]:shadow-sm"
            >
              Drafts ({counts.draft})
            </TabsTrigger>
            <TabsTrigger
              value="featured"
              className="data-[state=active]:bg-background text-3 h-8 rounded-md px-4 data-[state=active]:shadow-sm"
            >
              Featured ({counts.featured})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex w-full items-center gap-3 sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="text-muted-foreground/60 pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-muted/20 border-border/60 text-3 h-10 pl-9 sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* Blog List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No posts found"
          action={{ label: 'Clear search', onClick: () => setSearch('') }}
          className="py-24"
        />
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((blog) => (
            <BlogCard
              key={blog.id}
              blog={blog}
              onEdit={openEdit}
              onToggleFeatured={handleToggleFeatured}
              onStatusChange={handleStatusChange}
              onDelete={setDeleteDialog}
            />
          ))}
        </div>
      )}

      {/* Edit/New Dialog */}
      <BlogDialog blog={editingBlog} open={dialogOpen} onOpenChange={setDialogOpen} />

      {/* Delete Dialog */}
      <ConfirmDeleteDialog
        isOpen={!!deleteDialog}
        onClose={() => setDeleteDialog(null)}
        onConfirm={() => deleteDialog && handleDelete(deleteDialog)}
        title="Delete Post"
        itemName={deleteDialog?.title}
      />
    </div>
  );
}

function BlogDialog({
  blog,
  open,
  onOpenChange,
}: {
  blog: Blog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: '',
      slug: '',
      link: '',
      excerpt: '',
      category: '',
      readTime: 5,
      tags: '',
      featured: false,
      published: false,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        title: blog?.title ?? '',
        slug: blog?.slug ?? '',
        link: blog?.link ?? '',
        excerpt: blog?.excerpt ?? '',
        category: blog?.category ?? '',
        readTime: blog?.readTime ?? 5,
        tags: blog?.tags.join(', ') ?? '',
        featured: blog?.featured ?? false,
        published: blog?.status === 'published',
      });
    }
  }, [open, blog, reset]);

  function onSubmit(_data: BlogFormData) {
    onOpenChange(false);
    toast.success(blog ? 'Post updated' : 'Post created');
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">{blog ? 'Edit Post' : 'New Post'}</DialogTitle>
          <DialogDescription className="text-base">
            {blog ? 'Update post details.' : 'Create a new blog post.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid py-2">
            <FormInput
              label="Title"
              registration={register('title')}
              error={errors.title}
              placeholder="Post title"
              required
              labelClassName="text-base"
              inputClassName="h-9 text-base"
            />
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Slug"
                registration={register('slug')}
                error={errors.slug}
                placeholder="post-slug-here"
                required
                labelClassName="text-base"
                inputClassName="h-9 text-base"
              />
              <FormInput
                label="External Link (Optional)"
                registration={register('link')}
                error={errors.link}
                placeholder="https://..."
                labelClassName="text-base"
                inputClassName="h-9 text-base"
              />
            </div>
            <FormTextarea
              label="Excerpt"
              registration={register('excerpt')}
              error={errors.excerpt}
              placeholder="Short summary..."
              rows={3}
              required
              labelClassName="text-base"
              textareaClassName="text-base"
            />
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Category"
                registration={register('category')}
                error={errors.category}
                placeholder="e.g. Engineering"
                required
                labelClassName="text-base"
                inputClassName="h-9 text-base"
              />
              <FormInput
                label="Read Time (minutes)"
                registration={register('readTime', { valueAsNumber: true })}
                error={errors.readTime}
                type="number"
                min={1}
                required
                labelClassName="text-base"
                inputClassName="h-9 text-base"
              />
            </div>
            <FormInput
              label="Tags (comma-separated)"
              registration={register('tags')}
              error={errors.tags}
              placeholder="React, TypeScript, ..."
              required
              labelClassName="text-base"
              inputClassName="h-9 text-base"
            />
            <div className="grid grid-cols-2 gap-4">
              <FormSwitch
                label="Featured Post"
                name="featured"
                control={control}
                className="bg-muted/20"
                labelClassName="text-base"
              />
              <FormSwitch
                label="Published Status"
                name="published"
                control={control}
                className="bg-muted/20"
                labelClassName="text-base"
              />
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => onOpenChange(false)}
              className="h-9 text-base"
            >
              Cancel
            </Button>
            <Button size="sm" type="submit" className="h-9 text-base">
              {blog ? 'Save Changes' : 'Create Post'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function BlogCard({
  blog,
  onEdit,
  onToggleFeatured,
  onStatusChange,
  onDelete,
}: {
  blog: Blog;
  onEdit: (blog: Blog) => void;
  onToggleFeatured: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
  onDelete: (blog: Blog) => void;
}) {
  return (
    <Card className="border-border/60 card-hover group overflow-hidden py-0">
      <CardContent className="flex flex-col p-0 sm:flex-row">
        {/* Image Area */}
        <div className="border-border/50 relative h-48 w-full shrink-0 overflow-hidden border-b sm:h-auto sm:w-56 sm:border-r sm:border-b-0 md:w-64">
          {blog.link ? (
            <a href={blog.link} target="_blank" rel="noreferrer" className="block h-full w-full">
              {blog.coverImage ? (
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <BlogImagePlaceholder id={blog.id} />
              )}
            </a>
          ) : (
            <>
              {blog.coverImage ? (
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <BlogImagePlaceholder id={blog.id} />
              )}
            </>
          )}
        </div>

        {/* Content Area */}
        <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              {/* Category & Status */}
              <div className="mb-1 flex flex-wrap items-center gap-2">
                {blog.featured && (
                  <Badge
                    variant="secondary"
                    className="h-5 shrink-0 border-transparent bg-amber-500/10 px-1.5 text-xs text-amber-600 hover:bg-amber-500/20 sm:text-xs"
                  >
                    <Star className="mr-1 size-3 fill-amber-600" /> Featured
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className="bg-primary/5 text-primary border-primary/20 h-5 shrink-0 rounded-md px-2 text-xs font-medium sm:text-xs"
                >
                  {blog.category}
                </Badge>
                <StatusBadge
                  status={`blog-${blog.status}`}
                  className="h-5 shrink-0 px-2 text-xs tracking-wider uppercase sm:text-xs"
                />
              </div>

              {/* Title */}
              {blog.link ? (
                <a
                  href={blog.link}
                  target="_blank"
                  rel="noreferrer"
                  className="block hover:underline"
                >
                  <h3 className="text-foreground group-hover:text-primary line-clamp-2 text-lg leading-tight font-bold transition-colors">
                    {blog.title}
                  </h3>
                </a>
              ) : (
                <h3 className="text-foreground group-hover:text-primary line-clamp-2 text-lg leading-tight font-bold transition-colors">
                  {blog.title}
                </h3>
              )}

              {/* Excerpt */}
              <p className="text-muted-foreground mt-1 line-clamp-2 text-[13.5px] leading-relaxed sm:text-sm">
                {blog.excerpt}
              </p>
            </div>

            {/* Actions Menu */}
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
                <DropdownMenuItem onClick={() => onEdit(blog)}>
                  <Pencil className="mr-2 size-3.5" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onToggleFeatured(blog.id)}>
                  <Star className="mr-2 size-3.5" />
                  {blog.featured ? 'Unfeature' : 'Feature'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    onStatusChange(blog.id, blog.status === 'published' ? 'draft' : 'published')
                  }
                >
                  {blog.status === 'published' ? 'Unpublish' : 'Publish'}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={() => onDelete(blog)}>
                  <Trash2 className="mr-2 size-3.5" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
            {/* Tags */}
            <div className="flex flex-wrap items-center gap-1.5">
              {blog.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-secondary/60 hover:bg-secondary/80 h-5 border-transparent px-2 py-0 text-xs font-medium sm:text-xs"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Meta: Date & Read Time */}
            <div className="text-muted-foreground sm:text-3 ml-auto flex shrink-0 items-center gap-2.5 text-xs font-medium">
              <span>{formatPublishDate(blog.publishedAt)}</span>
              <span className="text-muted-foreground/30">•</span>
              <span className="flex items-center gap-1">
                <Clock className="size-3.5 opacity-70" />
                {blog.readTime} min
              </span>

              {blog.link && (
                <>
                  <span className="text-muted-foreground/30 ml-1">•</span>
                  <a
                    href={blog.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary ml-1 flex items-center gap-1 hover:underline"
                  >
                    Read Post <ExternalLink className="size-3" />
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
