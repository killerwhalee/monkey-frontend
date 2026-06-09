import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/app-shell'
import { ProtectedRoute } from '@/components/layout/protected-route'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/hooks/use-auth'
import { queryClient } from '@/lib/query-client'
import { AdminPage } from '@/pages/admin-page'
import { DashboardPage } from '@/pages/dashboard-page'
import { LoginPage } from '@/pages/login-page'
import { NotFoundPage } from '@/pages/not-found-page'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route element={<AppShell />}>
              <Route index element={<DashboardPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="admin" element={<AdminPage />} />
              </Route>
              <Route path="404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Route>
          </Routes>
          <Toaster theme="dark" position="top-center" />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
