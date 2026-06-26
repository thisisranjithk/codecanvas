import { useState } from "react"
import { Plus, Pencil, Trash2, MoreHorizontal, Award, ExternalLink, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { mockCertifications } from "@/data/mock"
import { formatDate } from "@/lib/utils"
import { toast } from "sonner"

type Certification = typeof mockCertifications[0]

export function Certifications() {
  const [certs, setCerts] = useState(mockCertifications)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCert, setEditingCert] = useState<Certification | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<Certification | null>(null)

  function handleDelete(cert: Certification) {
    setCerts((prev) => prev.filter((c) => c.id !== cert.id))
    setDeleteDialog(null)
    toast.success("Certification removed")
  }

  function openEdit(cert: Certification) {
    setEditingCert(cert)
    setDialogOpen(true)
  }

  const activeCerts = certs.filter((c) => c.status === "active")
  const expiredCerts = certs.filter((c) => c.status === "expired")

  function CertCard({ cert }: { cert: Certification }) {
    const isExpired = cert.status === "expired"
    return (
      <Card className={`card-hover border-border/60 group ${isExpired ? "opacity-60" : ""}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-muted text-[13px] font-bold">
                {cert.logo}
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-base leading-tight">{cert.name}</span>
                  {isExpired ? (
                    <Badge variant="outline" className="text-xs h-5 px-1.5 text-destructive border-destructive/20 bg-destructive/5">
                      <AlertCircle className="size-3 mr-0.5" />Expired
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs h-5 px-1.5 text-success border-success/20 bg-success/5">
                      Active
                    </Badge>
                  )}
                </div>
                <span className="text-[15px] text-muted-foreground">{cert.issuer}</span>
                <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                  <span className="text-[13px] text-muted-foreground">Issued: {formatDate(cert.issueDate)}</span>
                  {cert.expiryDate && (
                    <span className={`text-[13px] ${isExpired ? "text-destructive" : "text-muted-foreground"}`}>
                      Expires: {formatDate(cert.expiryDate)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[13px] text-muted-foreground font-mono">ID: {cert.credentialId}</span>
                  {cert.credentialUrl && (
                    <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-0.5 text-[13px] text-primary hover:underline">
                      <ExternalLink className="size-3" />Verify
                    </a>
                  )}
                </div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-7 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => openEdit(cert)}><Pencil className="size-3.5" />Edit</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={() => setDeleteDialog(cert)}><Trash2 className="size-3.5" />Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-5 p-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Certifications</h1>
          <p className="text-[15px] text-muted-foreground mt-0.5">
            {activeCerts.length} active · {expiredCerts.length} expired
          </p>
        </div>
        <Button size="sm" onClick={() => { setEditingCert(null); setDialogOpen(true) }} className="h-9 gap-1.5">
          <Plus className="size-4" />
          Add Certification
        </Button>
      </div>

      {certs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl bg-muted">
            <Award className="size-5 text-muted-foreground" />
          </div>
          <p className="font-medium text-base">No certifications added</p>
          <Button size="sm" onClick={() => { setEditingCert(null); setDialogOpen(true) }}>Add certification</Button>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {activeCerts.length > 0 && (
            <div>
              <h2 className="text-[15px] font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">Active ({activeCerts.length})</h2>
              <div className="grid gap-2.5 md:grid-cols-2">
                {activeCerts.map((cert) => <CertCard key={cert.id} cert={cert} />)}
              </div>
            </div>
          )}
          {expiredCerts.length > 0 && (
            <div>
              <h2 className="text-[15px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2.5">Expired ({expiredCerts.length})</h2>
              <div className="grid gap-2.5 md:grid-cols-2">
                {expiredCerts.map((cert) => <CertCard key={cert.id} cert={cert} />)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Edit/New Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg">{editingCert ? "Edit Certification" : "Add Certification"}</DialogTitle>
            <DialogDescription className="text-[15px]">{editingCert ? "Update certification details." : "Add a new certification."}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-1">
            <div className="grid gap-2">
              <Label className="text-[15px]">Certification Name</Label>
              <Input defaultValue={editingCert?.name} placeholder="e.g. AWS Certified Solutions Architect" className="h-9 text-[15px]" />
            </div>
            <div className="grid gap-2">
              <Label className="text-[15px]">Issuing Organization</Label>
              <Input defaultValue={editingCert?.issuer} placeholder="e.g. Amazon Web Services" className="h-9 text-[15px]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label className="text-[15px]">Issue Date</Label>
                <Input type="month" defaultValue={editingCert?.issueDate} className="h-9 text-[15px]" />
              </div>
              <div className="grid gap-2">
                <Label className="text-[15px]">Expiry Date (optional)</Label>
                <Input type="month" defaultValue={editingCert?.expiryDate ?? ""} className="h-9 text-[15px]" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label className="text-[15px]">Credential ID</Label>
              <Input defaultValue={editingCert?.credentialId} placeholder="e.g. AWS-SAA-12345" className="h-9 text-[15px]" />
            </div>
            <div className="grid gap-2">
              <Label className="text-[15px]">Credential URL</Label>
              <Input defaultValue={editingCert?.credentialUrl} placeholder="https://..." className="h-9 text-[15px]" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={() => { setDialogOpen(false); toast.success(editingCert ? "Certification updated" : "Certification added") }}>
              {editingCert ? "Save Changes" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg">Delete Certification</DialogTitle>
            <DialogDescription className="text-[15px]">Remove <strong>"{deleteDialog?.name}"</strong>?</DialogDescription>
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
