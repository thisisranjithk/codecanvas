import { useState, useEffect } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  MoreHorizontal,
  Award,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';
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
import { mockCertifications } from '@/data/certifications';
import { formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import { FormInput, FormMonthPicker } from '@/components/shared/form-field';
import { ConfirmDeleteDialog } from '@/components/shared/confirm-delete-dialog';
import { certificationSchema, type CertificationFormData } from '@/schemas';

type Certification = (typeof mockCertifications)[0];

export function Certifications() {
  const [certs, setCerts] = useState(mockCertifications);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<Certification | null>(null);

  function handleDelete(cert: Certification) {
    setCerts((prev) => prev.filter((c) => c.id !== cert.id));
    setDeleteDialog(null);
    toast.success('Certification removed');
  }

  function openEdit(cert: Certification) {
    setEditingCert(cert);
    setDialogOpen(true);
  }

  function openNew() {
    setEditingCert(null);
    setDialogOpen(true);
  }

  const activeCerts = certs.filter((c) => c.status === 'active');
  const expiredCerts = certs.filter((c) => c.status === 'expired');

  return (
    <div className="animate-fade-in flex flex-col gap-5 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Certifications</h1>
          <p className="text-muted-foreground mt-0.5 text-[15px]">
            {activeCerts.length} active · {expiredCerts.length} expired
          </p>
        </div>
        <Button size="sm" onClick={openNew} className="h-9 gap-1.5">
          <Plus className="size-4" />
          Add Certification
        </Button>
      </div>

      {certs.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16">
          <div className="bg-muted flex size-12 items-center justify-center rounded-xl">
            <Award className="text-muted-foreground size-5" />
          </div>
          <p className="text-base font-medium">No certifications added</p>
          <Button size="sm" onClick={openNew}>
            Add certification
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {activeCerts.length > 0 && (
            <div>
              <h2 className="text-muted-foreground mb-2.5 text-[15px] font-semibold tracking-wider uppercase">
                Active ({activeCerts.length})
              </h2>
              <div className="grid gap-2.5 md:grid-cols-2">
                {activeCerts.map((cert) => (
                  <CertCard
                    key={cert.id}
                    cert={cert}
                    onEdit={openEdit}
                    onDelete={setDeleteDialog}
                  />
                ))}
              </div>
            </div>
          )}
          {expiredCerts.length > 0 && (
            <div>
              <h2 className="text-muted-foreground/60 mb-2.5 text-[15px] font-semibold tracking-wider uppercase">
                Expired ({expiredCerts.length})
              </h2>
              <div className="grid gap-2.5 md:grid-cols-2">
                {expiredCerts.map((cert) => (
                  <CertCard
                    key={cert.id}
                    cert={cert}
                    onEdit={openEdit}
                    onDelete={setDeleteDialog}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Edit/New Dialog */}
      <CertificationDialog
        certification={editingCert}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      {/* Delete Dialog */}
      <ConfirmDeleteDialog
        isOpen={!!deleteDialog}
        onClose={() => setDeleteDialog(null)}
        onConfirm={() => deleteDialog && handleDelete(deleteDialog)}
        title="Delete Certification"
        description={
          <>
            Remove <strong>"{deleteDialog?.name}"</strong>?
          </>
        }
      />
    </div>
  );
}

function CertificationDialog({
  certification,
  open,
  onOpenChange,
}: {
  certification: Certification | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CertificationFormData>({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      name: '',
      issuer: '',
      issueDate: undefined as unknown as Date,
      expiryDate: null,
      credentialId: '',
      credentialUrl: '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: certification?.name ?? '',
        issuer: certification?.issuer ?? '',
        issueDate: certification?.issueDate
          ? new Date(certification.issueDate)
          : (undefined as unknown as Date),
        expiryDate: certification?.expiryDate ? new Date(certification.expiryDate) : null,
        credentialId: certification?.credentialId ?? '',
        credentialUrl: certification?.credentialUrl ?? '',
      });
    }
  }, [open, certification, reset]);

  function onSubmit(_data: CertificationFormData) {
    onOpenChange(false);
    toast.success(certification ? 'Certification updated' : 'Certification added');
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg">
            {certification ? 'Edit Certification' : 'Add Certification'}
          </DialogTitle>
          <DialogDescription className="text-[15px]">
            {certification ? 'Update certification details.' : 'Add a new certification.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid py-2">
            <FormInput
              label="Certification Name"
              registration={register('name')}
              error={errors.name}
              placeholder="e.g. AWS Certified Solutions Architect"
              required
              labelClassName="text-[15px]"
              inputClassName="h-9 text-[15px]"
            />
            <FormInput
              label="Issuing Organization"
              registration={register('issuer')}
              error={errors.issuer}
              placeholder="e.g. Amazon Web Services"
              required
              labelClassName="text-[15px]"
              inputClassName="h-9 text-[15px]"
            />
            <div className="grid grid-cols-2 gap-3">
              <FormMonthPicker
                label="Issue Date"
                name="issueDate"
                control={control}
                error={errors.issueDate}
                required
                labelClassName="text-[15px]"
                pickerClassName="w-full h-9 text-[15px]"
              />
              <FormMonthPicker
                label="Expiry Date (optional)"
                name="expiryDate"
                control={control}
                error={errors.expiryDate}
                labelClassName="text-[15px]"
                pickerClassName="w-full h-9 text-[15px]"
              />
            </div>
            <FormInput
              label="Credential ID"
              registration={register('credentialId')}
              error={errors.credentialId}
              placeholder="e.g. AWS-SAA-12345"
              labelClassName="text-[15px]"
              inputClassName="h-9 text-[15px]"
            />
            <FormInput
              label="Credential URL"
              registration={register('credentialUrl')}
              error={errors.credentialUrl}
              placeholder="https://..."
              labelClassName="text-[15px]"
              inputClassName="h-9 text-[15px]"
            />
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" size="sm" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button size="sm" type="submit">
              {certification ? 'Save Changes' : 'Add'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function CertCard({
  cert,
  onEdit,
  onDelete,
}: {
  cert: Certification;
  onEdit: (cert: Certification) => void;
  onDelete: (cert: Certification) => void;
}) {
  const isExpired = cert.status === 'expired';
  return (
    <Card
      className={`card-hover border-border/60 group overflow-hidden ${isExpired ? 'opacity-60 grayscale-[30%]' : ''}`}
    >
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3 sm:gap-4">
            <div className="bg-primary/10 border-primary/20 text-primary flex size-11 shrink-0 items-center justify-center rounded-xl border shadow-sm sm:size-12">
              {cert.logo || <Award className="size-5" />}
            </div>
            <div className="mt-0.5 flex min-w-0 flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-foreground truncate text-[15px] leading-tight font-bold sm:text-base">
                  {cert.name}
                </h3>
                {isExpired ? (
                  <Badge
                    variant="outline"
                    className="text-destructive border-destructive/20 bg-destructive/5 h-5 shrink-0 px-1.5 text-[10px] sm:text-xs"
                  >
                    <AlertCircle className="mr-1 size-3" />
                    Expired
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className="text-success bg-success/10 hover:bg-success/20 h-5 shrink-0 border-transparent px-1.5 text-[10px] sm:text-xs"
                  >
                    Active
                  </Badge>
                )}
              </div>

              <span className="text-primary/80 truncate text-[13px] font-medium sm:text-[14px]">
                {cert.issuer}
              </span>

              <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-medium sm:text-[13px]">
                <span>Issued {formatDate(cert.issueDate)}</span>
                {cert.expiryDate && (
                  <>
                    <span className="text-muted-foreground/30 hidden sm:inline">•</span>
                    <span className={`${isExpired ? 'text-destructive/80' : ''}`}>
                      Expires {formatDate(cert.expiryDate)}
                    </span>
                  </>
                )}
              </div>

              {(cert.credentialId || cert.credentialUrl) && (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {cert.credentialId && (
                    <span className="bg-muted/50 text-muted-foreground border-border/50 inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[11px] sm:text-[12px]">
                      ID: {cert.credentialId}
                    </span>
                  )}
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary bg-primary/5 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11.5px] font-medium transition-colors hover:underline sm:text-[12px]"
                    >
                      Verify <ExternalLink className="size-3" />
                    </a>
                  )}
                </div>
              )}
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
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(cert)}>
                <Pencil className="mr-2 size-3.5" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={() => onDelete(cert)}>
                <Trash2 className="mr-2 size-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
