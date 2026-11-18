import { useState, type ReactNode } from "react";

import Navbar from "../organisms/Navbar";
import Sidebar from "../organisms/Sidebar";
import PageHeader from "../molecules/PageHeader";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

function DashboardLayout({
  children,
  title,
  description,
}: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleOpenSidebar = () => {
    setIsSidebarOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />

      <div className="min-w-0 flex-1">
        <Navbar onMenuClick={handleOpenSidebar} />

        <main className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
          {title && <PageHeader title={title} description={description} />}

          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
