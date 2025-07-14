import Sidebar from '../components/Sidebar';
import { type ReactNode, useState, useEffect } from 'react';
import { Menu } from 'lucide-react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      if (mobile) {
        setSidebarOpen(false);
        setSidebarMinimized(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div className="min-h-screen bg-white flex h-screen">
      {/* Sidebar principal */}
      {(!isMobile && sidebarOpen) && (
        <Sidebar 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen}
          sidebarMinimized={sidebarMinimized} 
          setSidebarMinimized={setSidebarMinimized} 
          forceBlueSidebar={true}
        />
      )}

      {isMobile && (
        <Sidebar 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen}
          sidebarMinimized={sidebarMinimized} 
          setSidebarMinimized={setSidebarMinimized} 
          forceBlueSidebar={true}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 h-full overflow-hidden bg-white">
        {/* Header móvil */}
        {isMobile && (
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0 z-30">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Menu className="w-5 h-5 text-slate-600" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-md flex items-center justify-center">
                <span className="text-xs font-bold text-white">N</span>
              </div>
              <span className="text-lg font-semibold text-white">NexusNote</span>
            </div>
            <div className="w-9"></div>
          </header>
        )}

        {/* Contenido principal con padding para páginas dashboard */}
        <main className={`${isMobile ? 'h-[calc(100%-4rem)]' : 'h-full'} overflow-y-auto bg-white`}>
          <div className="px-6 py-8 h-full">
            <div className="w-full max-w-7xl mx-auto h-full">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}