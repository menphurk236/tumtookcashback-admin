import { useEffect } from 'react'

import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'

import { HomePage } from './pages/index'
import { LoginPage } from './pages/login'
import { DashboardPage } from './pages/backoffice/dashboard'
import { CustomerPage } from './pages/backoffice/customer'
import { BalancePage } from './pages/backoffice/balance'
import { BalanceIdPage } from './pages/backoffice/balance/@id'
import { AdminPage } from './pages/backoffice/admin'
import { CustomerCreatePage } from './pages/backoffice/customer/create'
import { CustomerEditPage } from './pages/backoffice/customer/@id/edit'
import { AdminCreatePage } from './pages/backoffice/admin/create'
import { AdminEditPage } from './pages/backoffice/admin/@id/edit'
import BackofficeLayout from './layouts/Backoffice'
import DefaultLayout from './layouts/Default'

function App() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  // - Protect page for guest only
  // useEffect(() => {
  //   if (isAuth) navigate('/backoffice/')
  // }, [isAuth, navigate])

  // - Protect /app
  useEffect(() => {
    if (pathname === '/backoffice') navigate('/backoffice/dashboard')
  }, [navigate, pathname])

  return (
    <Routes>
      <Route path="/" element={<DefaultLayout />}>
        <Route index element={<HomePage />} />
      </Route>

      <Route element={<BackofficeLayout />}>
        <Route path="/backoffice/dashboard" element={<DashboardPage />} />

        <Route path="/backoffice/customer" element={<CustomerPage />} />
        <Route path="/backoffice/customer/create" element={<CustomerCreatePage />} />
        <Route path="/backoffice/customer/:id/edit" element={<CustomerEditPage />} />

        <Route path="/backoffice/balance" element={<BalancePage />} />
        <Route path="/backoffice/balance/:id" element={<BalanceIdPage />} />

        <Route path="/backoffice/admin" element={<AdminPage />} />
        <Route path="/backoffice/admin/create" element={<AdminCreatePage />} />
        <Route path="/backoffice/admin/:id/edit" element={<AdminEditPage />} />
      </Route>

      <Route path="login" element={<LoginPage />} />
    </Routes>
  )
}

export default App
