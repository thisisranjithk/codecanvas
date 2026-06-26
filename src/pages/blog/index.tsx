import { useState, useMemo, useEffect } from "react"
import {
  Plus, Search, Eye, MoreHorizontal,
  Pencil, Trash2, Star, BookOpen, Clock,
} from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { mockBlogs } from "@/data/blogs"
import { formatNumber, formatPublishDate } from "@/lib/utils"
import { toast } from "sonner"
import { PageHeader } from "@/components/shared/page-header"
import { EmptyState } from "@/components/shared/empty-state"
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog"
import { StatusBadge } from "@/components/shared/status-badge"
import { FormInput, FormTextarea, FormSwitch } from "@/components/shared/form-field"
import { blogSchema, type BlogFormData } from "@/schemas"

type Blog = typeof mockBlogs[0]


// A simple placeholder generator based on blog id
function BlogImagePlaceholder({ id }: { id: string }) {
  const numId = parseInt(id) || 1
  const colors = [
    "from-blue-600/20 to-indigo-600/20",
    "from-emerald-600/20 to-teal-600/20",
    "from-purple-600/20 to-fuchsia-600/20",
    "from-cyan-600/20 to-blue-600/20",
    "from-indigo-600/20 to-blue-600/20"
  ]
  const color = colors[(numId - 1) % colors.length]
  return (
    <div className={`w-full h-full bg-gradient-to-br ${color} flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity`}>
      <div className="w-20 h-20 rounded-xl bg-background/10 backdrop-blur-sm border border-white/10 flex items-center justify-center">
        <BookOpen className="size-8 text-white/40" />
      </div>
    </div>
  )
}

export function Blog() {
  const [blogs, setBlogs] = useState(mockBlogs)
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<Blog | null>(null)

  const filtered = useMemo(() => {
    return blogs
      .filter((b) => {
        const matchSearch =
          b.title.toLowerCase().includes(search.toLowerCase()) ||
          b.excerpt.toLowerCase().includes(search.toLowerCase()) ||
          b.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
        const matchTab =
          activeTab === "all" ||
          (activeTab === "published" && b.status === "published") ||
          (activeTab === "draft" && b.status === "draft") ||
          (activeTab === "featured" && b.featured)
        return matchSearch && matchTab
      })
      .sort((a, b) => {
        return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
      })
  }, [blogs, search, activeTab])

  function handleDelete(blog: Blog) {
    setBlogs((prev) => prev.filter((b) => b.id !== blog.id))
    setDeleteDialog(null)
    toast.success("Blog post deleted")
  }

  function handleToggleFeatured(id: string) {
    setBlogs((prev) => prev.map((b) => (b.id === id ? { ...b, featured: !b.featured } : b)))
    toast.success("Featured updated")
  }

  function handleStatusChange(id: string, status: string) {
    setBlogs((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)))
    toast.success("Status updated")
  }

  function openEdit(blog: Blog) {
    setEditingBlog(blog)
    setDialogOpen(true)
  }

  const counts = {
    all: blogs.length,
    published: blogs.filter((b) => b.status === "published").length,
    draft: blogs.filter((b) => b.status === "draft").length,
    featured: blogs.filter((b) => b.featured).length,
  }

  return (
    <div className="flex flex-col gap-6 p-6 animate-fade-in">
      {/* Header */}
      <PageHeader
        title="Blog"
        description={
          <div className="flex flex-col gap-0.5">
            <span>Manage and organize your blog posts</span>
            <div className="text-[13px] font-medium flex items-center gap-1.5">
              <span>{counts.all} posts</span>
              <span>•</span>
              <span className="text-emerald-500">{counts.published} published</span>
            </div>
          </div>
        }
        action={{ label: "New Post", onClick: () => { setEditingBlog(null); setDialogOpen(true) }, icon: <Plus className="size-4" /> }}
      />

      {/* Tabs + Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList className="h-10 bg-muted/40 p-1 border border-border/40 w-full sm:w-auto justify-start">
            <TabsTrigger value="all" className="text-[13px] h-8 px-4 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">All ({counts.all})</TabsTrigger>
            <TabsTrigger value="published" className="text-[13px] h-8 px-4 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">Published ({counts.published})</TabsTrigger>
            <TabsTrigger value="draft" className="text-[13px] h-8 px-4 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">Drafts ({counts.draft})</TabsTrigger>
            <TabsTrigger value="featured" className="text-[13px] h-8 px-4 rounded-md data-[state=active]:bg-background data-[state=active]:shadow-sm">Featured ({counts.featured})</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60 pointer-events-none" />
            <Input
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 text-[13px] sm:w-64 bg-muted/20 border-border/60"
            />
          </div>
        </div>
      </div>

      {/* Blog List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No posts found"
          action={{ label: "Clear search", onClick: () => setSearch("") }}
          className="py-24"
        />
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((blog) => (
            <Card key={blog.id} className="card-hover border-border/50 group overflow-hidden bg-card/40 hover:bg-card/60 transition-colors py-0">
              <CardContent className="p-0 flex flex-col md:flex-row">

                {/* Image Area */}
                <div className="w-full md:w-64 md:h-auto h-48 bg-muted/40 shrink-0 border-b md:border-b-0 md:border-r border-border/50">
                  {blog.coverImage ? (
                    <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
                  ) : (
                    <BlogImagePlaceholder id={blog.id} />
                  )}
                </div>

                {/* Content Area */}
                <div className="flex-1 p-5 md:p-6 flex flex-col justify-between min-w-0">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start gap-3 justify-between">
                      <div className="flex flex-col gap-2 min-w-0 flex-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          {blog.featured && <Star className="size-4 text-amber-500 fill-amber-500 shrink-0" />}
                          <h3 className="font-bold text-lg leading-snug text-foreground hover:text-primary transition-colors cursor-pointer line-clamp-2">{blog.title}</h3>
                          <StatusBadge status={`blog-${blog.status}`} className="text-[10px] uppercase tracking-wider h-5 px-2" />
                        </div>
                        <p className="text-[14.5px] text-muted-foreground leading-relaxed line-clamp-2 max-w-3xl">
                          {blog.excerpt}
                        </p>
                      </div>

                      {/* Action Menu (Desktop top right of content) */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground shrink-0 md:-mt-1 md:-mr-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => openEdit(blog)}><Pencil className="size-3.5 mr-2" />Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleFeatured(blog.id)}>
                            <Star className="size-3.5 mr-2" />{blog.featured ? "Unfeature" : "Feature"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleStatusChange(blog.id, blog.status === "published" ? "draft" : "published")}>
                            {blog.status === "published" ? "Unpublish" : "Publish"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => setDeleteDialog(blog)}>
                            <Trash2 className="size-3.5 mr-2" />Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      {blog.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-secondary/40 hover:bg-secondary/60 text-[11px] font-medium px-2 py-0.5 border-border/40">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Meta Area (Right Side Sidebar in Desktop) */}
                <div className="w-full md:w-48 bg-muted/10 border-t md:border-t-0 md:border-l border-border/50 p-5 md:p-6 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4 shrink-0">
                  <div className="flex md:flex-col items-center md:items-end gap-4 md:gap-3 w-full">
                    <div className="flex items-center gap-2 text-[13px] text-muted-foreground font-medium">
                      <Eye className="size-4 opacity-70" />
                      <span>{formatNumber(blog.views)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[13px] text-muted-foreground font-medium">
                      <Clock className="size-4 opacity-70" />
                      <span>{blog.readTime} min read</span>
                    </div>
                  </div>

                  <div className="text-[13px] text-muted-foreground font-medium md:mt-2 text-right">
                    {formatPublishDate(blog.publishedAt)}
                  </div>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit/New Dialog */}
      <BlogDialog
        blog={editingBlog}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      {/* Delete Dialog */}
      <ConfirmDeleteDialog
        isOpen={!!deleteDialog}
        onClose={() => setDeleteDialog(null)}
        onConfirm={() => deleteDialog && handleDelete(deleteDialog)}
        title="Delete Post"
        itemName={deleteDialog?.title}
      />
    </div>
  )
}

function BlogDialog({
  blog,
  open,
  onOpenChange,
}: {
  blog: Blog | null
  open: boolean
  onOpenChange: (open: boolean) => void
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
      title: "",
      slug: "",
      excerpt: "",
      category: "",
      readTime: 5,
      tags: "",
      featured: false,
      published: false,
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        title: blog?.title ?? "",
        slug: blog?.slug ?? "",
        excerpt: blog?.excerpt ?? "",
        category: blog?.category ?? "",
        readTime: blog?.readTime ?? 5,
        tags: blog?.tags.join(", ") ?? "",
        featured: blog?.featured ?? false,
        published: blog?.status === "published",
      })
    }
  }, [open, blog, reset])

  function onSubmit(_data: BlogFormData) {
    onOpenChange(false)
    toast.success(blog ? "Post updated" : "Post created")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">{blog ? "Edit Post" : "New Post"}</DialogTitle>
          <DialogDescription className="text-[15px]">{blog ? "Update post details." : "Create a new blog post."}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2 py-2">
            <FormInput
              label="Title"
              registration={register("title")}
              error={errors.title}
              placeholder="Post title"
              required
              labelClassName="text-[15px]"
              inputClassName="h-9 text-[15px]"
            />
            <FormInput
              label="Slug"
              registration={register("slug")}
              error={errors.slug}
              placeholder="post-slug-here"
              required
              labelClassName="text-[15px]"
              inputClassName="h-9 text-[15px]"
            />
            <FormTextarea
              label="Excerpt"
              registration={register("excerpt")}
              error={errors.excerpt}
              placeholder="Short summary..."
              rows={3}
              required
              labelClassName="text-[15px]"
              textareaClassName="text-[15px]"
            />
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Category"
                registration={register("category")}
                error={errors.category}
                placeholder="e.g. Engineering"
                required
                labelClassName="text-[15px]"
                inputClassName="h-9 text-[15px]"
              />
              <FormInput
                label="Read Time (minutes)"
                registration={register("readTime", { valueAsNumber: true })}
                error={errors.readTime}
                type="number"
                min={1}
                required
                labelClassName="text-[15px]"
                inputClassName="h-9 text-[15px]"
              />
            </div>
            <FormInput
              label="Tags (comma-separated)"
              registration={register("tags")}
              error={errors.tags}
              placeholder="React, TypeScript, ..."
              required
              labelClassName="text-[15px]"
              inputClassName="h-9 text-[15px]"
            />
            <div className="grid grid-cols-2 gap-4">
              <FormSwitch
                label="Featured Post"
                name="featured"
                control={control}
                className="bg-muted/20"
                labelClassName="text-[15px]"
              />
              <FormSwitch
                label="Published Status"
                name="published"
                control={control}
                className="bg-muted/20"
                labelClassName="text-[15px]"
              />
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button variant="outline" size="sm" type="button" onClick={() => onOpenChange(false)} className="h-9 text-[15px]">Cancel</Button>
            <Button size="sm" type="submit" className="h-9 text-[15px]">
              {blog ? "Save Changes" : "Create Post"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
