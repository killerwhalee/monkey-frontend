import { QueryClientProvider } from '@tanstack/react-query'
import { lazy, Suspense, type ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/app-shell'
import { ProtectedRoute } from '@/components/layout/protected-route'
import { Skeleton } from '@/components/ui/skeleton'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/hooks/use-auth'
import { ConfirmProvider } from '@/hooks/use-confirm'
import { queryClient } from '@/lib/query-client'
import { DashboardPage } from '@/pages/dashboard-page'
import { NotFoundPage } from '@/pages/not-found-page'

// Admin and login screens are split out so public dashboard visitors don't download them.
const LoginPage = lazy(() =>
  import('@/pages/login-page').then((module) => ({ default: module.LoginPage })),
)
const ManagePage = lazy(() =>
  import('@/pages/manage-page').then((module) => ({ default: module.ManagePage })),
)

function Lazy({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col gap-6" aria-busy="true">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-64 w-full" />
        </div>
      }
    >
      {children}
    </Suspense>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ConfirmProvider>
            <Routes>
              <Route element={<AppShell />}>
                <Route index element={<DashboardPage />} />
                <Route path="login" element={<Lazy><LoginPage /></Lazy>} />
                <Route element={<ProtectedRoute />}>
                  <Route path="manage" element={<Lazy><ManagePage /></Lazy>} />
                </Route>
                <Route path="404" element={<NotFoundPage />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Route>
            </Routes>
            <Toaster theme="dark" position="top-center" />
          </ConfirmProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
