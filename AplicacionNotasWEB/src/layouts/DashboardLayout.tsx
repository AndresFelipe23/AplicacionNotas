import Sidebar from '../components/Sidebar';
import { type ReactNode, useState } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen}
        sidebarMinimized={sidebarMinimized} 
        setSidebarMinimized={setSidebarMinimized} 
      />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 px-6 py-8 overflow-y-auto">
          <div className="w-full max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}