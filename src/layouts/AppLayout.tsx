import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar.tsx';
import { Sidebar } from '../components/common/Sidebar.tsx';
import { ToastContainer } from '../components/common/Toast.tsx';
import { AddComponentModal } from '../components/inventory/AddComponentModal.tsx';
import { useAuthStore } from '../store/useAuthStore.ts';

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  const isLandingPage = location.pathname === '/';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  // Workspace routes show sidebar when authenticated
  const showSidebar = !isLandingPage && !isAuthPage && isAuthenticated;

  return (
    <div className="min-h-screen bg-[#0B1220] text-slate-100 flex flex-col font-sans selection:bg-teal-500/20 selection:text-teal-300">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Container */}
      <div className="flex-1 flex w-full">
        {showSidebar && <Sidebar />}

        <main className={`flex-1 ${showSidebar ? 'p-4 sm:p-6 lg:p-8 max-w-7xl' : ''} w-full overflow-x-hidden`}>
          <Outlet />
        </main>
      </div>

      {/* Modals & Floating Components */}
      <AddComponentModal />
      <ToastContainer />
    </div>
  );
};
