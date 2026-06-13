import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export interface ConfirmOptions {
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'default' | 'destructive'
}

interface ConfirmDialogProps {
  open: boolean
  options: ConfirmOptions | null
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ open, options, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onCancel()
      }}
    >
      <DialogContent showCloseButton={false} className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{options?.title}</DialogTitle>
          {options?.description ? (
            <DialogDescription>{options.description}</DialogDescription>
          ) : null}
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            {options?.cancelLabel ?? '취소'}
          </Button>
          <Button
            variant={options?.variant === 'destructive' ? 'destructive' : 'default'}
            onClick={onConfirm}
          >
            {options?.confirmLabel ?? '확인'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
