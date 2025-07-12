import { motion } from 'framer-motion';
import { 
  BookOpen, 
  CheckSquare, 
  FolderOpen, 
  Shield, 
  Zap, 
  Smartphone, 
  ArrowRight,
  Play
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const LandingPage = () => {
  const features = [
    {
      icon: BookOpen,
      title: 'Notas Inteligentes',
      description: 'Crea, edita y organiza tus notas con un editor rico en funcionalidades. Soporte para markdown, etiquetas y búsqueda avanzada.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: CheckSquare,
      title: 'Gestión de Tareas',
      description: 'Organiza tus tareas con prioridades, fechas de vencimiento y seguimiento de progreso. Nunca más pierdas una tarea importante.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: FolderOpen,
      title: 'Organización por Carpetas',
      description: 'Organiza tus notas y tareas en carpetas personalizadas. Mantén todo ordenado y fácil de encontrar.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Shield,
      title: 'Seguridad Total',
      description: 'Tus datos están protegidos con encriptación de extremo a extremo. Tu privacidad es nuestra prioridad.',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: Zap,
      title: 'Sincronización Instantánea',
      description: 'Accede a tus notas desde cualquier dispositivo. Los cambios se sincronizan automáticamente en tiempo real.',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      icon: Smartphone,
      title: 'Acceso Móvil',
      description: 'Aplicación optimizada para móviles. Toma notas y gestiona tareas desde tu smartphone o tablet.',
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Usuarios Activos' },
    { number: '1M+', label: 'Notas Creadas' },
    { number: '99.9%', label: 'Tiempo Activo' },
    { number: '24/7', label: 'Soporte' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#181c2b] via-[#232946] to-[#1a1a2e] text-white">
      {/* Hero Section */}
      <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight text-white drop-shadow-lg">
                Organiza tu vida con
                <span className="block bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  NotasApp
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
                La aplicación más completa para gestionar notas, tareas y organizar tu vida digital. 
                Simple, segura y sincronizada en todos tus dispositivos.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link to="/register">
                <Button variant="primary" size="xl" className="flex items-center space-x-3">
                  <span>Comenzar Gratis</span>
                  <ArrowRight className="w-6 h-6" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="xl" className="flex items-center space-x-3 bg-white/20 border border-white/30 text-white hover:bg-white/30">
                  <span>Iniciar Sesión</span>
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="text-4xl md:text-5xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300">
                  {stat.number}
                </div>
                <div className="text-blue-200 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-[#232946]/60 to-[#181c2b]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Todo lo que necesitas en una sola aplicación
            </h2>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Diseñada para ser simple pero potente, NotasApp te ayuda a mantener todo organizado
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-white/10 dark:bg-white/10 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20 backdrop-blur-xl"
              >
                <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-blue-100 leading-relaxed text-lg">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-800 via-purple-800 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
              ¿Listo para organizar tu vida?
            </h2>
            <p className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed">
              Únete a miles de usuarios que ya están organizando su vida con NotasApp
            </p>
            <Link to="/register">
              <Button variant="secondary" size="xl" className="text-blue-600 hover:text-blue-400 bg-white/20 border border-white/30">
                Crear Cuenta Gratis
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#181c2b] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">NotasApp</span>
              </div>
              <p className="text-blue-200 text-lg leading-relaxed">
                La mejor aplicación para organizar tu vida digital.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-6">Producto</h3>
              <ul className="space-y-3 text-blue-200">
                <li><a href="#" className="hover:text-white transition-colors duration-200">Características</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Precios</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-6">Soporte</h3>
              <ul className="space-y-3 text-blue-200">
                <li><a href="#" className="hover:text-white transition-colors duration-200">Ayuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Contacto</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Estado</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-6">Legal</h3>
              <ul className="space-y-3 text-blue-200">
                <li><a href="#" className="hover:text-white transition-colors duration-200">Privacidad</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Términos</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-900 mt-12 pt-8 text-center text-blue-200">
            <p className="text-lg">&copy; 2024 NotasApp. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 