import { Plus, Menu } from 'lucide-react';

interface DashboardNavbarProps {
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
  sidebarMinimized?: boolean;
  setSidebarMinimized?: (minimized: boolean) => void;
}

export default function DashboardNavbar({ 
  sidebarOpen, 
  setSidebarOpen, 
  sidebarMinimized, 
  setSidebarMinimized 
}: DashboardNavbarProps) {
  return (
    <nav className="h-16 w-full flex items-center justify-between px-4 md:px-8 bg-black border-b border-neutral-800 text-gray-200 shadow-sm">
      <div className="flex items-center gap-2">
        {/* Botón para abrir sidebar en móvil */}
        {setSidebarOpen && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
        )}
        <span className="font-bold text-lg tracking-tight text-white select-none">Dashboard</span>
      </div>
      <div className="flex items-center gap-3 md:gap-4">
        <button
          className="flex items-center gap-2 bg-white hover:bg-neutral-100 text-black font-semibold px-4 py-2 rounded-lg shadow transition-all text-sm md:text-base border border-neutral-300"
        >
          <Plus className="w-5 h-5 text-black" />
          <span>Crear carpetass</span>
        </button>
      </div>
    </nav>
  );
} 