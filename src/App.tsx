import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './layouts/AppLayout.tsx';
import { LandingPage } from './pages/LandingPage.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { InventoryPage } from './pages/InventoryPage.tsx';
import { RecommendationsPage } from './pages/RecommendationsPage.tsx';
import { ProjectLibraryPage } from './pages/ProjectLibraryPage.tsx';
import { ProjectDetailsPage } from './pages/ProjectDetailsPage.tsx';
import { SustainabilityPage } from './pages/SustainabilityPage.tsx';
import { AdminPage } from './pages/AdminPage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { RegisterPage } from './pages/RegisterPage.tsx';
import { useAuthStore } from './store/useAuthStore.ts';
import { useInventoryStore } from './store/useInventoryStore.ts';

export default function App() {
  const { initAuth, user } = useAuthStore();
  const { fetchMasterCatalog } = useInventoryStore();

  useEffect(() => {
    initAuth();
    fetchMasterCatalog();
  }, [initAuth, fetchMasterCatalog]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/projects" element={<ProjectLibraryPage />} />
          <Route path="/projects/:id" element={<ProjectDetailsPage />} />
          <Route path="/sustainability" element={<SustainabilityPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
