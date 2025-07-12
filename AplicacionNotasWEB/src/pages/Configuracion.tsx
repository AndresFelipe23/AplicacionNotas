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
    id: 'apariencia',
    name: 'Apariencia',
    icon: Settings,
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'notificaciones',
    name: 'Notificaciones',
    icon: Bell,
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'seguridad',
    name: 'Seguridad',
    icon: Shield,
    color: 'from-red-500 to-red-600'
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
                            {!isEditingName && (
                              <button
                                onClick={startEditingName}
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                              >
                                <Edit3 className="w-4 h-4" />
                                Editar
                              </button>
                            )}
                          </div>

                          {isEditingName ? (
                            <div className="flex items-center gap-3">
                              <input
                                type="text"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Tu nombre completo"
                              />
                              <button
                                onClick={saveNameEdit}
                                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                              >
                                <Save className="w-4 h-4" />
                              </button>
                              <button
                                onClick={cancelNameEdit}
                                className="p-2 bg-slate-300 text-slate-600 rounded-lg hover:bg-slate-400 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="text-slate-600">
                              {user?.nombre} {user?.apellido}
                            </div>
                          )}
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-6">
                          <h3 className="text-lg font-semibold text-slate-900 mb-4">Email</h3>
                          <div className="text-slate-600">{user?.email}</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Apariencia */}
                  {activeTab === 'apariencia' && (
                    <div className="p-8">
                      <div className="mb-8">
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Personalización</h2>
                            <p className="text-slate-600">Adapta la apariencia a tu gusto</p>
                          </div>
                          <motion.button
                            onClick={resetTheme}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all"
                          >
                            <RotateCcw className="w-4 h-4" />
                            Restablecer
                          </motion.button>
                        </div>
                      </div>

                      <div className="space-y-8">
                        {/* Modo de tema */}
                        <div className="bg-slate-50 rounded-2xl p-6">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-100 rounded-xl">
                              <Palette className="w-5 h-5 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900">Modo de Tema</h3>
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            {[
                              { id: 'light', name: 'Claro', icon: Sun, color: 'bg-yellow-500' },
                              { id: 'dark', name: 'Oscuro', icon: Moon, color: 'bg-slate-600' },
                              { id: 'auto', name: 'Automático', icon: Monitor, color: 'bg-gradient-to-r from-blue-500 to-purple-500' }
                            ].map((mode) => (
                              <motion.button
                                key={mode.id}
                                onClick={() => updateTheme({ mode: mode.id as 'light' | 'dark' | 'auto' })}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`p-4 rounded-xl border-2 transition-all ${
                                  theme.mode === mode.id
                                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                                    : 'border-slate-200 bg-white hover:border-slate-300'
                                }`}
                              >
                                <div className={`w-8 h-8 ${mode.color} rounded-lg mx-auto mb-3 flex items-center justify-center`}>
                                  <mode.icon className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-sm font-medium text-slate-900">{mode.name}</span>
                              </motion.button>
                            ))}
                          </div>
                        </div>

                        {/* Color del sidebar */}
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                              <Settings className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Color del Sidebar</h3>
                          </div>
                          <div className="grid grid-cols-4 gap-3">
                            {Object.entries(colorSchemes.sidebar).map(([key, color]) => {
                              // Función para obtener la vista previa del color del sidebar
                              const getSidebarPreview = () => {
                                if (key === 'auto') {
                                  const isDarkMode = theme.mode === 'dark' || (theme.mode === 'auto' && document.documentElement.classList.contains('dark'));
                                  return isDarkMode ? 'bg-slate-900' : 'bg-white';
                                } else if (key === 'white') {
                                  return 'bg-white';
                                } else if (key === 'black') {
                                  return 'bg-slate-900';
                                } else {
                                  return color.class;
                                }
                              };

                              return (
                                <motion.button
                                  key={key}
                                  onClick={() => updateTheme({ sidebarColor: key })}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className={`p-3 rounded-xl border-2 transition-all ${
                                    theme.sidebarColor === key
                                      ? 'border-slate-400 dark:border-slate-500 shadow-lg'
                                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                                  }`}
                                >
                                  <div className={`w-full h-8 ${getSidebarPreview()} rounded-lg mb-2 border border-slate-200 dark:border-slate-600`}></div>
                                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{color.name}</span>
                                </motion.button>
                              );
                            })}
                          </div>
                          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-xs text-blue-700 dark:text-blue-300">
                              <strong>Automático:</strong> Se adapta al tema (blanco en modo claro, negro en modo oscuro)
                            </p>
                          </div>
                        </div>

                        {/* Color de botones */}
                        <div className="bg-slate-50 rounded-2xl p-6">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-green-100 rounded-xl">
                              <Zap className="w-5 h-5 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900">Color de Botones</h3>
                          </div>
                          <div className="grid grid-cols-4 gap-3">
                            {Object.entries(colorSchemes.button).map(([key, color]) => (
                              <motion.button
                                key={key}
                                onClick={() => updateTheme({ buttonColor: key })}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`p-3 rounded-xl border-2 transition-all ${
                                  theme.buttonColor === key
                                    ? 'border-slate-400 shadow-lg'
                                    : 'border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                <div className={`w-full h-8 ${color.class} rounded-lg mb-2`}></div>
                                <span className="text-xs font-medium text-slate-700">{color.name}</span>
                              </motion.button>
                            ))}
                          </div>
                        </div>

                        {/* Color de acento */}
                        <div className="bg-slate-50 rounded-2xl p-6">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-orange-100 rounded-xl">
                              <Palette className="w-5 h-5 text-orange-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900">Color de Acento</h3>
                          </div>
                          <div className="grid grid-cols-4 gap-3">
                            {Object.entries(colorSchemes.accent).map(([key, color]) => (
                              <motion.button
                                key={key}
                                onClick={() => updateTheme({ accentColor: key })}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`p-3 rounded-xl border-2 transition-all ${
                                  theme.accentColor === key
                                    ? 'border-slate-400 shadow-lg'
                                    : 'border-slate-200 hover:border-slate-300'
                                }`}
                              >
                                <div className={`w-full h-8 ${color.bg} ${color.border} rounded-lg mb-2 flex items-center justify-center`}>
                                  <div className={`w-4 h-4 ${color.class.replace('text-', 'bg-')} rounded-full`}></div>
                                </div>
                                <span className="text-xs font-medium text-slate-700">{color.name}</span>
                              </motion.button>
                            ))}
                          </div>
                        </div>

                        {/* Configuraciones adicionales */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Border radius */}
                          <div className="bg-slate-50 rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">Radio de Bordes</h3>
                            <div className="space-y-3">
                              {[
                                { id: 'sm', name: 'Pequeño', preview: 'rounded' },
                                { id: 'md', name: 'Mediano', preview: 'rounded-md' },
                                { id: 'lg', name: 'Grande', preview: 'rounded-lg' },
                                { id: 'xl', name: 'Extra Grande', preview: 'rounded-xl' }
                              ].map((option) => (
                                <motion.button
                                  key={option.id}
                                  onClick={() => updateTheme({ borderRadius: option.id as any })}
                                  whileHover={{ scale: 1.02 }}
                                  className={`w-full p-3 rounded-lg border-2 transition-all ${
                                    theme.borderRadius === option.id
                                      ? 'border-blue-500 bg-blue-50'
                                      : 'border-slate-200 bg-white hover:border-slate-300'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium text-slate-900">{option.name}</span>
                                    <div className={`w-6 h-6 bg-blue-500 ${option.preview}`}></div>
                                  </div>
                                </motion.button>
                              ))}
                            </div>
                          </div>

                          {/* Animation speed */}
                          <div className="bg-slate-50 rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-slate-900 mb-4">Velocidad de Animación</h3>
                            <div className="space-y-3">
                              {[
                                { id: 'slow', name: 'Lenta', icon: '🐌' },
                                { id: 'normal', name: 'Normal', icon: '⚡' },
                                { id: 'fast', name: 'Rápida', icon: '🚀' }
                              ].map((option) => (
                                <motion.button
                                  key={option.id}
                                  onClick={() => updateTheme({ animationSpeed: option.id as any })}
                                  whileHover={{ scale: 1.02 }}
                                  className={`w-full p-3 rounded-lg border-2 transition-all ${
                                    theme.animationSpeed === option.id
                                      ? 'border-blue-500 bg-blue-50'
                                      : 'border-slate-200 bg-white hover:border-slate-300'
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium text-slate-900">{option.name}</span>
                                    <span className="text-lg">{option.icon}</span>
                                  </div>
                                </motion.button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Vista previa */}
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Vista Previa</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white dark:bg-slate-700 rounded-xl p-4 border border-slate-200 dark:border-slate-600">
                              <div className={`w-full h-3 ${(() => {
                                const sidebarColor = theme.sidebarColor;
                                if (sidebarColor === 'auto') {
                                  const isDarkMode = theme.mode === 'dark' || (theme.mode === 'auto' && document.documentElement.classList.contains('dark'));
                                  return isDarkMode ? 'bg-slate-900' : 'bg-white';
                                } else if (sidebarColor === 'white') {
                                  return 'bg-white';
                                } else if (sidebarColor === 'black') {
                                  return 'bg-slate-900';
                                } else {
                                  return colorSchemes.sidebar[sidebarColor as keyof typeof colorSchemes.sidebar].class;
                                }
                              })()} rounded-lg mb-3 border border-slate-200 dark:border-slate-600`}></div>
                              <div className="space-y-2">
                                <div className="h-2 bg-slate-200 dark:bg-slate-600 rounded"></div>
                                <div className="h-2 bg-slate-200 dark:bg-slate-600 rounded w-3/4"></div>
                              </div>
                            </div>
                            <div className="bg-white dark:bg-slate-700 rounded-xl p-4 border border-slate-200 dark:border-slate-600">
                              <div className={`w-full h-8 ${colorSchemes.button[theme.buttonColor as keyof typeof colorSchemes.button].class} rounded-lg mb-3`}></div>
                              <div className="space-y-2">
                                <div className="h-2 bg-slate-200 dark:bg-slate-600 rounded"></div>
                                <div className="h-2 bg-slate-200 dark:bg-slate-600 rounded w-2/3"></div>
                              </div>
                            </div>
                            <div className="bg-white dark:bg-slate-700 rounded-xl p-4 border border-slate-200 dark:border-slate-600">
                              <div className={`w-full h-8 ${colorSchemes.accent[theme.accentColor as keyof typeof colorSchemes.accent].bg} ${colorSchemes.accent[theme.accentColor as keyof typeof colorSchemes.accent].border} rounded-lg mb-3 flex items-center justify-center`}>
                                <span className={`text-sm font-medium ${colorSchemes.accent[theme.accentColor as keyof typeof colorSchemes.accent].class}`}>Acento</span>
                              </div>
                              <div className="space-y-2">
                                <div className="h-2 bg-slate-200 dark:bg-slate-600 rounded"></div>
                                <div className="h-2 bg-slate-200 dark:bg-slate-600 rounded w-1/2"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notificaciones */}
                  {activeTab === 'notificaciones' && (
                    <div className="p-8">
                      <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Centro de Notificaciones</h2>
                        <p className="text-slate-600">Controla cuándo y cómo recibes alertas</p>
                      </div>

                      <div className="space-y-6">
                        {Object.entries(notifications).map(([key, value]) => {
                          const icons = {
                            email: Mail,
                            push: Smartphone,
                            tareas: Check,
                            recordatorios: Bell,
                            marketing: Heart
                          };
                          const Icon = icons[key as keyof typeof icons];
                          
                          const labels = {
                            email: 'Notificaciones por email',
                            push: 'Notificaciones push',
                            tareas: 'Recordatorios de tareas',
                            recordatorios: 'Recordatorios generales',
                            marketing: 'Actualizaciones de producto'
                          };
                          
                          const descriptions = {
                            email: 'Recibe resúmenes y updates importantes',
                            push: 'Alertas instantáneas en tu navegador',
                            tareas: 'Avisos sobre deadlines y tareas pendientes',
                            recordatorios: 'Recordatorios personalizados',
                            marketing: 'Novedades, tips y actualizaciones'
                          };

                          return (
                            <motion.div
                              key={key}
                              whileHover={{ scale: 1.01 }}
                              className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all"
                            >
                              <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${value ? 'bg-blue-100' : 'bg-slate-200'}`}>
                                  <Icon className={`w-5 h-5 ${value ? 'text-blue-600' : 'text-slate-500'}`} />
                                </div>
                                <div>
                                  <div className="font-semibold text-slate-900">
                                    {labels[key as keyof typeof labels]}
                                  </div>
                                  <div className="text-sm text-slate-600">
                                    {descriptions[key as keyof typeof descriptions]}
                                  </div>
                                </div>
                              </div>
                              
                              <button
                                onClick={() => setNotifications(prev => ({ ...prev, [key]: !value }))}
                                className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                                  value ? 'bg-blue-500 shadow-lg' : 'bg-slate-300'
                                }`}
                              >
                                <motion.div
                                  className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center"
                                  animate={{ x: value ? 32 : 2 }}
                                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                >
                                  {value && <Check className="w-3 h-3 text-blue-500" />}
                                </motion.div>
                              </button>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Seguridad */}
                  {activeTab === 'seguridad' && (
                    <div className="p-8">
                      <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Seguridad y Privacidad</h2>
                        <p className="text-slate-600">Mantén tu cuenta segura y protegida</p>
                      </div>

                      <div className="space-y-6">
                        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <Shield className="w-6 h-6 text-green-600" />
                            <h3 className="text-lg font-semibold text-slate-900">Estado de Seguridad</h3>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-green-700 font-medium">Tu cuenta está protegida</span>
                            <div className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-green-600" />
                              <span className="text-sm text-green-600">Verificado</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-slate-50 rounded-xl p-6 hover:bg-slate-100 transition-colors">
                            <Key className="w-6 h-6 text-slate-500 mb-3" />
                            <h4 className="font-semibold text-slate-900 mb-2">Autenticación en dos pasos</h4>
                            <p className="text-sm text-slate-600 mb-4">Agrega una capa extra de seguridad</p>
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                              Configurar →
                            </button>
                          </div>

                          <div className="bg-slate-50 rounded-xl p-6 hover:bg-slate-100 transition-colors">
                            <Globe className="w-6 h-6 text-slate-500 mb-3" />
                            <h4 className="font-semibold text-slate-900 mb-2">Sesiones activas</h4>
                            <p className="text-sm text-slate-600 mb-4">Revisa dónde está abierta tu cuenta</p>
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                              Ver detalles →
                            </button>
                          </div>
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
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">NotasApp</h2>
                        <p className="text-slate-600 mb-4">Tu espacio personal para organizar ideas</p>
                        <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          Versión 2.1.0
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-slate-50 rounded-xl p-6">
                          <h3 className="font-semibold text-slate-900 mb-3">Desarrollado con ❤️</h3>
                          <p className="text-slate-600 text-sm">Por un equipo apasionado por la productividad y el diseño elegante.</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-6">
                          <h3 className="font-semibold text-slate-900 mb-3">Última actualización</h3>
                          <p className="text-slate-600 text-sm">Julio 2025 - Nuevas funciones de colaboración</p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-medium"
                        >
                          <Github className="w-4 h-4" />
                          Ver en GitHub
                          <ExternalLink className="w-3 h-3" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center gap-2 px-6 py-3 border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium"
                        >
                          <Twitter className="w-4 h-4" />
                          Síguenos
                          <ExternalLink className="w-3 h-3" />
                        </motion.button>
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