import type { ReactNode } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'

function NavTab({ to, children }: { to: string; children: ReactNode }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        cn(
          'rounded-md px-3 py-1.5 text-sm transition-colors hover:text-foreground',
          isActive ? 'text-foreground' : 'text-muted-foreground',
        )
      }
    >
      {children}
    </NavLink>
  )
}

export function AppShell() {
  const { isAuthenticated, isAdmin, logout } = useAuth()

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border/60 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
          <NavLink to="/" className="font-mono text-sm font-semibold tracking-widest text-foreground">
            MONKEY
          </NavLink>
          <nav className="flex items-center gap-1">
            <NavTab to="/">대시보드</NavTab>
            {isAuthenticated && isAdmin ? (
              <>
                <NavTab to="/admin">관리자</NavTab>
                <Button variant="ghost" size="sm" onClick={logout}>
                  로그아웃
                </Button>
              </>
            ) : (
              <NavTab to="/login">관리자 로그인</NavTab>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <Outlet />
      </main>
      <footer className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        Monkey Project · 무작위 트레이더 실험을 위한 모의투자 모니터링 대시보드
      </footer>
    </div>
  )
}
