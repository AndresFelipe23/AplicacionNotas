import { BookOpen, CheckSquare, Settings, LogOut, Menu, X, Home, Plus, Trash2, ChevronRight, Calendar } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useState, useEffect } from 'react';
import { papeleraService } from '../services/papeleraService';
import { usePapelera } from '../contexts/PapeleraContext';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  CheckCircleIcon, 
  CalendarIcon,
  BookOpenIcon,
  Cog6ToothIcon, 
  TrashIcon 
} from '@heroicons/react/24/outline';

const menu = [
  { name: 'Inicio', icon: Home, to: '/' },
  { name: 'Notas', icon: BookOpen, to: '/notas' },
  { name: 'Tareas', icon: CheckSquare, to: '/tareas' },
  { name: 'Calendario', icon: Calendar, to: '/calendario' },
  { name: 'Diario', icon: Calendar, to: '/diario' },
  { name: 'Configuración', icon: Settings, to: '/configuracion' },
];

const opciones = [
  { name: 'Crear Nota', icon: Plus, to: '/notas', action: 'crear-nota' },
  { name: 'Crear Tarea', icon: CheckSquare, to: '/tareas', action: 'crear-tarea' },
  { name: 'Abrir Papelera', icon: Trash2, to: '/papelera', action: 'papelera' },
  { name: 'Abrir Diario', icon: Calendar, to: '/diario', action: 'diario' },
];

export default function Sidebar({ 
  sidebarOpen, 
  setSidebarOpen, 
  sidebarMinimized, 
  setSidebarMinimized,
  forceBlueSidebar
}: { 
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  sidebarMinimized: boolean;
  setSidebarMinimized: (v: boolean) => void;
  forceBlueSidebar?: boolean;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const [isMobile, setIsMobile] = useState(false);
  const { contador, actualizarContador } = usePapelera();

  useEffect(() => {
    actualizarContador();
  }, [actualizarContador]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleOpcionClick = (opcion: any) => {
    switch (opcion.action) {
      case 'crear-nota':
        navigate('/notas');
        break;
      case 'crear-carpeta':
        navigate('/carpetas');
        break;
      case 'crear-tarea':
        navigate('/tareas');
        break;
      case 'papelera':
        navigate('/papelera');
        break;
      case 'diario':
        navigate('/diario');
        break;
      default:
        navigate(opcion.to);
    }
    // Cerrar sidebar en móvil después de navegar
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleMenuItemClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Overlay para móvil */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          border-r shadow-xl
          transition-all duration-300 ease-in-out
          ${isMobile 
            ? `fixed top-0 left-0 z-50 h-full ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
            : 'relative h-screen'
          }
          ${sidebarMinimized && !isMobile ? 'w-16' : 'w-72'}
          overflow-x-hidden
          bg-blue-600
          border-slate-700
        `}
      >
        {/* Header */}
        <div className={`h-16 flex items-center justify-between ${sidebarMinimized && !isMobile ? 'px-2' : 'px-4'}`}>
          {(!sidebarMinimized || isMobile) && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-white">NexusNote</span>
            </div>
          )}
          {/* Botones de control */}
          <div className="flex items-center gap-2">
            {/* Botón minimizar (solo desktop) */}
            {!isMobile && (
              <button
                onClick={() => setSidebarMinimized(!sidebarMinimized)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                title={sidebarMinimized ? 'Expandir sidebar' : 'Minimizar sidebar'}
              >
                <Menu className="w-4 h-4 text-white" />
              </button>
            )}
            {/* Botón cerrar (solo móvil) */}
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        </div>

        {/* Usuario */}
        {user && (!sidebarMinimized || isMobile) && (
          <div className={`p-4 ${sidebarMinimized && !isMobile ? 'hidden' : ''}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user.nombre?.[0]}{user.apellido?.[0]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user.nombre} {user.apellido}
                </p>
                <p className="text-xs text-white truncate">
                  {user.email || 'Usuario'}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Navegación principal */}
          <nav className={`flex-1 ${sidebarMinimized && !isMobile ? 'p-2' : 'p-4'} space-y-1`}>
            {menu.map(item => {
              const selected = location.pathname === item.to;
              return (
                <Link
                  key={item.name}
                  to={item.to}
                  onClick={handleMenuItemClick}
                  className={`
                    group relative flex items-center gap-3 ${sidebarMinimized && !isMobile ? 'px-2 py-2.5' : 'px-3 py-2.5'} rounded-xl
                    transition-all duration-200 font-medium
                    text-white hover:bg-blue-700 hover:text-white
                    ${selected ? 'bg-white/20 text-white shadow-sm' : ''}
                    ${sidebarMinimized && !isMobile ? 'justify-center' : ''}
                  `}
                  title={sidebarMinimized && !isMobile ? item.name : ''}
                >
                  <item.icon className={`shrink-0 ${sidebarMinimized && !isMobile ? 'w-6 h-6' : 'w-5 h-5'} text-white`} />
                  {(!sidebarMinimized || isMobile) && (
                    <span className="truncate text-white">{item.name}</span>
                  )}
                  {(!sidebarMinimized || isMobile) && selected && (
                    <ChevronRight className="w-4 h-4 ml-auto text-white" />
                  )}
                  {/* Tooltip para modo minimizado */}
                  {sidebarMinimized && !isMobile && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                      {item.name}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sección de acciones rápidas */}
          <div className={`${sidebarMinimized && !isMobile ? 'p-2' : 'p-4'}`}>
            {(!sidebarMinimized || isMobile) && (
              <div className="mb-3">
                <span className="text-xs font-medium text-white uppercase tracking-wide">
                  Acciones rápidas
                </span>
              </div>
            )}
            <div className="space-y-1">
              {opciones.map(opcion => (
                <button
                  key={opcion.name}
                  onClick={() => handleOpcionClick(opcion)}
                  className={`
                    group relative w-full flex items-center gap-3 ${sidebarMinimized && !isMobile ? 'px-2 py-2' : 'px-3 py-2'} rounded-lg
                    text-white hover:text-white hover:bg-white/10
                    transition-all duration-200 font-medium
                    ${sidebarMinimized && !isMobile ? 'justify-center' : ''}
                  `}
                  title={sidebarMinimized && !isMobile ? opcion.name : ''}
                >
                  <div className="relative">
                    <opcion.icon className={`shrink-0 ${sidebarMinimized && !isMobile ? 'w-6 h-6' : 'w-4 h-4'}`} />
                    {opcion.action === 'papelera' && contador > 0 && (
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                        {contador > 99 ? '99+' : contador}
                      </span>
                    )}
                  </div>
                  {(!sidebarMinimized || isMobile) && (
                    <span className="truncate text-sm">{opcion.name}</span>
                  )}
                  {/* Tooltip para modo minimizado */}
                  {sidebarMinimized && !isMobile && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                      {opcion.name}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Cerrar sesión */}
          <div className={`${sidebarMinimized && !isMobile ? 'p-2' : 'p-4'}`}>
            <button
              onClick={handleLogout}
              className={`
                group relative w-full flex items-center gap-3 ${sidebarMinimized && !isMobile ? 'px-2 py-2' : 'px-3 py-2'} rounded-lg
                bg-blue-800 text-white hover:bg-blue-900 transition-all duration-200 font-medium
                ${sidebarMinimized && !isMobile ? 'justify-center' : ''}
              `}
              title={sidebarMinimized && !isMobile ? 'Cerrar sesión' : ''}
            >
              <LogOut className={`shrink-0 ${sidebarMinimized && !isMobile ? 'w-6 h-6' : 'w-4 h-4'}`} />
              {(!sidebarMinimized || isMobile) && (
                <span className="truncate">Cerrar sesión</span>
              )}
              {sidebarMinimized && !isMobile && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-slate-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                  Cerrar sesión
                </div>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}