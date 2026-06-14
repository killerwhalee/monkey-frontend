import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useAutoCreateMonkeys } from '@/hooks/use-monkeys'

export function MonkeyAutoCreateDialog() {
  const [open, setOpen] = useState(false)
  const autoCreateMonkeys = useAutoCreateMonkeys()

  function handleAutoCreate() {
    autoCreateMonkeys.mutate(undefined, {
      onSuccess: (created) => {
        if (created.length === 0) {
          toast.info('할당 가능한 미사용 현금이 부족해 생성된 원숭이가 없습니다.')
        } else {
          toast.success(`원숭이 ${created.length}마리를 자동 생성했습니다.`)
        }
        setOpen(false)
      },
      onError: () => toast.error('자동 생성에 실패했습니다.'),
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">자동 생성</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>원숭이 자동 생성</DialogTitle>
          <DialogDescription>
            KIS 계좌의 미할당 현금을 100만 원 단위로 나누어 원숭이를 자동으로 생성합니다.
          </DialogDescription>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          이 작업은 매 영업일 정해진 시각에 주기적으로도 자동 실행됩니다. 아래 버튼으로 지금 즉시
          실행할 수도 있습니다.
        </p>
        <DialogFooter>
          <Button onClick={handleAutoCreate} disabled={autoCreateMonkeys.isPending}>
            {autoCreateMonkeys.isPending ? '생성 중...' : '지금 생성'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
