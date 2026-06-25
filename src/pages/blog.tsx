import { useState } from "react"
import {
  Plus, Search, ArrowUpDown, Eye, MoreHorizontal,
  Pencil, Trash2, Star, BookOpen, Clock,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { mockBlogs } from "@/data/mock"
import { formatDateTime, formatNumber } from "@/lib/utils"
import { toast } from "sonner"

type Blog = typeof mockBlogs[0]

const statusStyles: Record<string, string> = {
  published: "bg-success/8 text-success border-success/20",
  draft: "bg-warning/8 text-warning border-warning/20",
}

export function Blog() {
  const [blogs, setBlogs] = useState(mockBlogs)
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("updatedAt")
  const [activeTab, setActiveTab] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<Blog | null>(null)

  const filtered = blogs
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
      if (sortBy === "views") return b.views - a.views
      if (sortBy === "title") return a.title.localeCompare(b.title)
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })

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
    <div className="flex flex-col gap-4 p-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Blog</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {blogs.length} posts · {counts.published} published
          </p>
        </div>
        <Button size="sm" onClick={() => { setEditingBlog(null); setDialogOpen(true) }} className="h-8 gap-1.5">
          <Plus className="size-3.5" />
          New Post
        </Button>
      </div>

      {/* Tabs + Filters */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <TabsList className="h-7">
            <TabsTrigger value="all" className="text-[11px] h-5 px-2.5">All ({counts.all})</TabsTrigger>
            <TabsTrigger value="published" className="text-[11px] h-5 px-2.5">Published ({counts.published})</TabsTrigger>
            <TabsTrigger value="draft" className="text-[11px] h-5 px-2.5">Drafts ({counts.draft})</TabsTrigger>
            <TabsTrigger value="featured" className="text-[11px] h-5 px-2.5">Featured ({counts.featured})</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/60 pointer-events-none" />
              <Input placeholder="Search posts..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8 h-8 text-xs w-48" />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32 h-8 text-xs">
                <ArrowUpDown className="size-3 mr-1 text-muted-foreground/60" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updatedAt">Last Updated</SelectItem>
                <SelectItem value="views">Most Views</SelectItem>
                <SelectItem value="title">Title</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value={activeTab} className="mt-3">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
                <BookOpen className="size-5 text-muted-foreground" />
              </div>
              <p className="font-medium text-sm">No posts found</p>
              <Button size="sm" variant="outline" onClick={() => setSearch("")}>Clear search</Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filtered.map((blog) => (
                <Card key={blog.id} className="card-hover border-border/60 group">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          {blog.featured && <Star className="size-3.5 text-warning fill-warning shrink-0" />}
                          <h3 className="font-semibold text-sm leading-snug">{blog.title}</h3>
                          <Badge variant="outline" className={`text-[9px] h-4 px-1 shrink-0 ${statusStyles[blog.status] ?? ""}`}>
                            {blog.status}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{blog.excerpt}</p>
                        <div className="flex flex-wrap items-center gap-1">
                          {blog.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-[9px] h-4 px-1 font-normal border-border/60">{tag}</Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <div className="hidden md:flex flex-col items-end gap-0.5">
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Eye className="size-3" />{formatNumber(blog.views)}
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Clock className="size-3" />{blog.readTime} min
                          </div>
                          <span className="text-[9px] text-muted-foreground/60">
                            {blog.publishedAt ? formatDateTime(blog.publishedAt) : "Unpublished"}
                          </span>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-7 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => openEdit(blog)}><Pencil className="size-3.5" />Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleFeatured(blog.id)}>
                              <Star className="size-3.5" />{blog.featured ? "Unfeature" : "Feature"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleStatusChange(blog.id, blog.status === "published" ? "draft" : "published")}>
                              {blog.status === "published" ? "Unpublish" : "Publish"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={() => setDeleteDialog(blog)}>
                              <Trash2 className="size-3.5" />Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit/New Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-base">{editingBlog ? "Edit Post" : "New Post"}</DialogTitle>
            <DialogDescription className="text-xs">{editingBlog ? "Update post details." : "Create a new blog post."}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-1">
            <div className="grid gap-1.5">
              <Label className="text-xs">Title</Label>
              <Input defaultValue={editingBlog?.title} placeholder="Post title" className="h-8 text-xs" />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs">Slug</Label>
              <Input defaultValue={editingBlog?.slug} placeholder="post-slug-here" className="h-8 text-xs" />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs">Excerpt</Label>
              <Textarea defaultValue={editingBlog?.excerpt} placeholder="Short summary..." rows={2} className="text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label className="text-xs">Category</Label>
                <Input defaultValue={editingBlog?.category} placeholder="e.g. Engineering" className="h-8 text-xs" />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs">Read Time (minutes)</Label>
                <Input type="number" defaultValue={editingBlog?.readTime} min={1} className="h-8 text-xs" />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs">Tags (comma-separated)</Label>
              <Input defaultValue={editingBlog?.tags.join(", ")} placeholder="React, TypeScript, ..." className="h-8 text-xs" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2.5">
                <Label className="text-xs font-medium">Featured</Label>
                <Switch defaultChecked={editingBlog?.featured} />
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-2.5">
                <Label className="text-xs font-medium">Published</Label>
                <Switch defaultChecked={editingBlog?.status === "published"} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={() => { setDialogOpen(false); toast.success(editingBlog ? "Post updated" : "Post created") }}>
              {editingBlog ? "Save Changes" : "Create Post"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">Delete Post</DialogTitle>
            <DialogDescription className="text-xs">Delete <strong>"{deleteDialog?.title}"</strong>? This cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDeleteDialog(null)}>Cancel</Button>
            <Button variant="destructive" size="sm" onClick={() => deleteDialog && handleDelete(deleteDialog)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
