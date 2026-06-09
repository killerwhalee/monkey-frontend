import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <p className="font-mono text-sm tracking-widest text-muted-foreground">404</p>
      <h1 className="text-2xl font-semibold">페이지를 찾을 수 없습니다</h1>
      <p className="text-sm text-muted-foreground">
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>
      <Button asChild className="mt-2">
        <Link to="/">대시보드로 돌아가기</Link>
      </Button>
    </div>
  )
}
