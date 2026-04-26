import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabase';
import LoginPage from './pages/LoginPage';
import MainLayout from './layouts/MainLayout';
import DashboardPage from './pages/DashboardPage';
import CrmSubPage from './pages/CrmSubPage';
import TicketSubPage from './pages/TicketSubPage';
import IncomeTab from './components/income/IncomeTab';
import SettingsTab from './components/settings/SettingsTab';
import QuotationBaogiaPage from './pages/QuotationBaogiaPage';
import type { Session } from '@supabase/supabase-js';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={session ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />
        <Route
          path="/baogiafinal.html"
          element={session ? <QuotationBaogiaPage /> : <Navigate to="/login" replace />}
        />
        <Route
          element={session ? <MainLayout /> : <Navigate to="/login" replace />}
        >
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/crm" element={<Navigate to="/crm/overview" replace />} />
          <Route path="/crm/:sub" element={<CrmSubPage />} />
          <Route path="/ticket" element={<Navigate to="/ticket/overview" replace />} />
          <Route path="/ticket/:sub" element={<TicketSubPage />} />
          <Route path="/income" element={<IncomeTab />} />
          <Route path="/settings" element={<SettingsTab />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
