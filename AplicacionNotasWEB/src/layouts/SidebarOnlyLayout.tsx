import Sidebar from '../components/Sidebar';
import { type ReactNode, useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function SidebarOnlyLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Verificar si estamos en una ruta que tiene su propio sidebar
  const hasOwnSidebar = location.pathname === '/notas' || location.pathname === '/tareas';

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
    <div className="fixed inset-0 flex overflow-hidden">
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

      {/* Main Content Area - Ocupa todo el espacio restante */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        {/* Header móvil - Solo aparece en móvil */}
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
        
        {/* Contenido principal - Ocupa toda la altura restante */}
        <div className="flex-1 overflow-hidden bg-white">
          {children}
        </div>
      </div>
    </div>
  );
}