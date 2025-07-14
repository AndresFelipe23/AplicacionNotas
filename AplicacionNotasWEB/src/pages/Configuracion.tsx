import { useUser } from '../contexts/UserContext';
import { useTheme, colorSchemes } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  User,
  Bell,
  Shield,
  Key,
  Globe,
  Check,
  Mail,
  Smartphone,
  Heart,
  Github,
  Twitter,
  ExternalLink,
  LogOut,
  Edit3,
  Save,
  X,
  Sun,
  Moon,
  Monitor,
  Palette,
  Zap,
  RotateCcw
} from 'lucide-react';
import { useState } from 'react';

const tabs = [
  {
    id: 'perfil',
    name: 'Perfil',
    icon: User,
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'acerca',
    name: 'Acerca de',
    icon: Settings,
    color: 'from-gray-500 to-gray-600'
  }
];

export default function Configuracion() {
  const { user } = useUser();
  const { theme, updateTheme, resetTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('perfil');
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    tareas: true,
    recordatorios: false,
    marketing: false
  });

  const handleLogout = () => {
    // TODO: Implementar logout
    console.log('Logout');
  };

  const startEditingName = () => {
    setIsEditingName(true);
    setEditedName(`${user?.nombre} ${user?.apellido}`);
  };

  const saveNameEdit = () => {
    // TODO: Implementar guardado
    setIsEditingName(false);
  };

  const cancelNameEdit = () => {
    setIsEditingName(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Configuración</h1>
                <p className="text-blue-100">Personaliza tu experiencia</p>
              </div>
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </motion.button>
            </div>
          </div>

          <div className="flex">
            {/* Sidebar */}
            <div className="w-80 bg-slate-50 p-6 border-r border-slate-200">
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                      activeTab === tab.id
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  {/* Perfil */}
                  {activeTab === 'perfil' && (
                    <div className="p-8">
                      <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Información Personal</h2>
                        <p className="text-slate-600">Actualiza tu información de perfil</p>
                      </div>

                      <div className="space-y-6">
                        <div className="bg-slate-50 rounded-2xl p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-slate-900">Nombre completo</h3>
                          </div>

                          <div className="text-slate-600">
                            {user?.nombre} {user?.apellido}
                          </div>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-6">
                          <h3 className="text-lg font-semibold text-slate-900 mb-4">Email</h3>
                          <div className="text-slate-600">{user?.email}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Acerca de */}
                  {activeTab === 'acerca' && (
                    <div className="p-8">
                      <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-xl">
                          <span className="text-white font-bold text-2xl">N</span>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">NexusNote</h2>
                        <p className="text-slate-600 mb-4">Tu espacio personal para organizar ideas</p>
                        <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          Versión 2.1.0
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-slate-50 rounded-xl p-6 flex flex-col items-center justify-center">
                          <h3 className="font-semibold text-slate-900 mb-3">Desarrollado por</h3>
                          <a
                            href="https://github.com/andresespitia"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-lg mb-2"
                          >
                            <Github className="w-5 h-5" />
                            Andres Espitia
                          </a>
                          <span className="text-slate-600 text-sm">¡Sígueme en GitHub!</span>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-6 flex flex-col items-center justify-center">
                          <h3 className="font-semibold text-slate-900 mb-3">¿Te gusta la app?</h3>
                          <p className="text-slate-600 text-sm mb-3">Si quieres apoyar el desarrollo, puedes invitarme a un café ☕</p>
                          <a
                            href="https://www.buymeacoffee.com/andresespitia"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-4 py-2 bg-yellow-400 text-slate-900 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
                          >
                            Invítame un café
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 