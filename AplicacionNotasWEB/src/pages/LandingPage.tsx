import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Disclosure, Tab } from '@headlessui/react';
import { 
  BookOpen, 
  CheckSquare, 
  Calendar,
  Edit3,
  BarChart3,
  FolderOpen,
  Shield,
  Zap,
  Users,
  Globe,
  Star,
  ArrowRight,
  Menu,
  X,
  Play,
  Check,
  ChevronDown,
  Trash2,
  Settings,
  Clock,
  Heart,
  Award,
  Target,
  FileText,
  Database,
  Lock,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  const features = [
    {
      icon: BookOpen,
      title: 'Notas Inteligentes',
      description: 'Crea, edita y organiza tus notas con un editor rico en funcionalidades. Soporte para markdown, etiquetas y búsqueda avanzada.',
      color: 'from-blue-500 to-blue-600',
      details: ['Editor de texto enriquecido', 'Soporte markdown completo', 'Etiquetas y categorías', 'Búsqueda instantánea'],
      hasImage: true
    },
    {
      icon: FolderOpen,
      title: 'Organización por Carpetas',
      description: 'Mantén todo perfectamente organizado con carpetas personalizadas. Crea jerarquías y estructura tu contenido.',
      color: 'from-purple-500 to-purple-600',
      details: ['Carpetas anidadas ilimitadas', 'Organización por colores', 'Vista de árbol intuitiva', 'Arrastrar y soltar'],
      hasImage: true
    },
    {
      icon: CheckSquare,
      title: 'Gestión de Tareas Avanzada',
      description: 'Sistema completo de tareas con vista Kanban, prioridades, fechas límite y seguimiento de progreso.',
      color: 'from-green-500 to-green-600',
      details: ['Tablero Kanban interactivo', 'Prioridades y etiquetas', 'Fechas de vencimiento', 'Seguimiento de progreso'],
      hasImage: true
    },
    {
      icon: Calendar,
      title: 'Calendario Integrado',
      description: 'Visualiza todas tus tareas y eventos en un calendario intuitivo. Planifica tu tiempo de manera eficiente.',
      color: 'from-orange-500 to-orange-600',
      details: ['Vista mensual y semanal', 'Eventos y recordatorios', 'Integración con tareas', 'Vista de agenda'],
      hasImage: true
    },
    {
      icon: Edit3,
      title: 'Diario Personal Privado',
      description: 'Espacio privado para reflexiones diarias. Protegido con PIN y completamente seguro.',
      color: 'from-pink-500 to-pink-600',
      details: ['Entradas diarias privadas', 'Protección con PIN', 'Estados de ánimo', 'Estadísticas personales'],
      hasImage: true
    },
    {
      icon: Trash2,
      title: 'Papelera Inteligente',
      description: 'Sistema de papelera que te permite recuperar elementos eliminados de forma segura.',
      color: 'from-red-500 to-red-600',
      details: ['Recuperación de elementos', 'Eliminación programada', 'Vaciado automático', 'Historial de cambios'],
      hasImage: false
    },
    {
      icon: BarChart3,
      title: 'Estadísticas y Análisis',
      description: 'Obtén insights sobre tu productividad con gráficos y métricas detalladas.',
      color: 'from-indigo-500 to-indigo-600',
      details: ['Métricas de productividad', 'Gráficos interactivos', 'Reportes automáticos', 'Análisis de tendencias'],
      hasImage: false
    },
    {
      icon: Settings,
      title: 'Configuración Avanzada',
      description: 'Personaliza completamente tu experiencia con temas, configuraciones y preferencias.',
      color: 'from-gray-500 to-gray-600',
      details: ['Temas personalizables', 'Configuraciones avanzadas', 'Exportación de datos', 'Copias de seguridad'],
      hasImage: false
    }
  ];

  const benefits = [
    {
      icon: Zap,
      title: 'Totalmente Gratis',
      description: 'Sin costos ocultos, sin límites artificiales. Todas las funciones disponibles gratuitamente.'
    },
    {
      icon: Shield,
      title: 'Privacidad Garantizada',
      description: 'Tus datos son tuyos. Sin rastreo, sin publicidad, sin venta de información personal.'
    },
    {
      icon: Globe,
      title: 'Acceso Universal',
      description: 'Disponible en navegadores web modernos. Funciona en cualquier dispositivo con internet.'
    },
    {
      icon: Database,
      title: 'Sin Límites',
      description: 'Crea tantas notas, carpetas, tareas y entradas como necesites. Sin restricciones.'
    }
  ];

  const platforms = [
    {
      icon: Monitor,
      name: 'Escritorio',
      description: 'Optimizado para navegadores de escritorio'
    },
    {
      icon: Tablet,
      name: 'Tablet',
      description: 'Interfaz adaptada para tablets'
    },
    {
      icon: Smartphone,
      name: 'Móvil',
      description: 'Diseño responsive para móviles'
    }
  ];

  const testimonials = [
    {
      name: 'María González',
      role: 'Estudiante Universitaria',
      avatar: '👩‍🎓',
      content: 'Perfecto para organizar mis apuntes por materias. Las carpetas y el diario me ayudan mucho con mis estudios.'
    },
    {
      name: 'Carlos Rodríguez',
      role: 'Trabajador Remoto',
      avatar: '👨‍💻',
      content: 'La integración entre notas, tareas y calendario es increíble. Todo en un solo lugar y gratis.'
    },
    {
      name: 'Ana Martín',
      role: 'Freelancer',
      avatar: '👩‍💼',
      content: 'Gestiono todos mis proyectos aquí. La vista Kanban y las carpetas organizadas son esenciales para mi trabajo.'
    }
  ];

  const stats = [
    { number: '100%', label: 'Gratis Siempre', icon: Heart },
    { number: 'Ilimitado', label: 'Notas y Carpetas', icon: FolderOpen },
    { number: '8', label: 'Funciones Principales', icon: Target },
    { number: '24/7', label: 'Disponible', icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">NotasApp</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
                Funciones
              </a>
              <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
                Cómo Funciona
              </a>
              <a href="#testimonials" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
                Testimonios
              </a>
              <a href="#faq" className="text-slate-600 hover:text-slate-900 font-medium transition-colors">
                FAQ
              </a>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <a 
                href="/login" 
                className="text-slate-600 hover:text-slate-900 font-medium transition-colors px-4 py-2"
              >
                Iniciar Sesión
              </a>
              <a 
                href="/register" 
                className="bg-slate-900 text-white px-6 py-2 rounded-lg hover:bg-slate-800 transition-colors font-medium"
              >
                Registrarse
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-slate-200 py-4 space-y-4"
            >
              <a href="#features" className="block text-slate-600 hover:text-slate-900 font-medium py-2">
                Funciones
              </a>
              <a href="#how-it-works" className="block text-slate-600 hover:text-slate-900 font-medium py-2">
                Cómo Funciona
              </a>
              <a href="#testimonials" className="block text-slate-600 hover:text-slate-900 font-medium py-2">
                Testimonios
              </a>
              <div className="pt-4 space-y-2">
                <a href="/login" className="block text-center border-2 border-slate-300 text-slate-700 px-4 py-2 rounded-lg">
                  Iniciar Sesión
                </a>
                <a href="/register" className="block text-center bg-slate-900 text-white px-4 py-2 rounded-lg">
                  Registrarse
                </a>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <motion.div 
          style={{ y }}
          className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white"
        />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 rounded-full px-6 py-2 mb-8">
                <Heart className="w-4 h-4" />
                <span className="text-sm font-medium">100% Gratis • Sin Límites • Para Siempre</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight text-slate-900">
                Organiza tu vida
                <span className="block bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                  completamente gratis
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed">
                NotasApp es la plataforma completa y gratuita para gestionar notas, carpetas, tareas, 
                calendario y diario personal. Todo en un solo lugar, sin costo alguno.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <a 
                href="/register"
                className="flex items-center space-x-3 bg-slate-900 text-white px-8 py-4 rounded-lg hover:bg-slate-800 transition-all font-medium text-lg transform hover:scale-105 shadow-lg"
              >
                <span>Comenzar Gratis</span>
                <ArrowRight className="w-5 h-5" />
              </a>
              <a 
                href="/login"
                className="flex items-center space-x-3 border-2 border-slate-300 text-slate-700 px-8 py-4 rounded-lg hover:border-slate-400 hover:bg-slate-50 transition-all font-medium text-lg"
              >
                <span>Ya tengo cuenta</span>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap justify-center items-center gap-8 text-sm text-slate-500"
            >
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Sin registro de tarjeta</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Acceso inmediato</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Siempre gratis</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-900 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with Images */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
              Todo lo que necesitas, completamente gratis
            </h2>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Funciones profesionales sin costo alguno. Sin límites, sin restricciones.
            </p>
          </motion.div>

          <div className="space-y-24">
            {features.filter(f => f.hasImage).map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}
              >
                {/* Content */}
                <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                  <ul className="space-y-3">
                    {feature.details.map((detail, i) => (
                      <li key={i} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-500 shrink-0" />
                        <span className="text-slate-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Image Placeholder */}
                <div className={`${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl h-80 flex items-center justify-center border border-slate-200">
                    <div className="text-center space-y-4">
                      <feature.icon className="w-16 h-16 mx-auto text-slate-400" />
                      <div className="text-slate-500 font-medium">
                        Imagen de {feature.title}
                      </div>
                      <div className="text-sm text-slate-400">
                        Screenshot o demo interactivo
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Other Features Grid */}
          <div className="mt-24">
            <h3 className="text-2xl font-bold text-slate-900 mb-12 text-center">Y mucho más...</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {features.filter(f => !f.hasImage).map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-4">
                    {feature.title}
                  </h4>
                  <p className="text-slate-600 mb-6">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.details.map((detail, i) => (
                      <li key={i} className="flex items-center space-x-2 text-sm text-slate-500">
                        <Check className="w-4 h-4 text-green-500 shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              ¿Por qué elegir NotasApp?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Una alternativa gratuita y completa a las aplicaciones de pago
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-2xl mb-6">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  {benefit.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Compatibility */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Accede desde cualquier dispositivo
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Diseño responsive que se adapta perfectamente a todos tus dispositivos
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {platforms.map((platform, index) => (
              <motion.div
                key={platform.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-8 bg-slate-50 rounded-2xl"
              >
                <platform.icon className="w-16 h-16 mx-auto mb-6 text-slate-700" />
                <h3 className="text-xl font-bold text-slate-900 mb-4">
                  {platform.name}
                </h3>
                <p className="text-slate-600">
                  {platform.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">
              Lo que dicen nuestros usuarios
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Miles de personas ya organizan su vida con NotasApp
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center space-x-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-700 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{testimonial.avatar}</div>
                  <div>
                    <div className="font-semibold text-slate-900">{testimonial.name}</div>
                    <div className="text-sm text-slate-600">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Preguntas Frecuentes
            </h2>
            <p className="text-xl text-slate-600">
              Todo lo que necesitas saber sobre NotasApp
            </p>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                question: "¿Es realmente gratis para siempre?",
                answer: "Sí, NotasApp es completamente gratuita. No hay planes de pago, no hay límites artificiales y no hay funciones premium. Creemos que las herramientas de organización personal deben ser accesibles para todos."
              },
              {
                question: "¿Necesito descargar alguna aplicación?",
                answer: "No, NotasApp funciona completamente en tu navegador web. Es una aplicación web progresiva que se adapta a cualquier dispositivo - computadora, tablet o móvil."
              },
              {
                question: "¿Mis datos están seguros?",
                answer: "Absolutamente. Utilizamos cifrado de extremo a extremo para proteger tus datos. Tus entradas de diario están protegidas con PIN adicional y nunca accedemos a tu contenido personal."
              },
              {
                question: "¿Hay límites en el número de notas o carpetas?",
                answer: "No hay límites. Puedes crear tantas notas, carpetas, tareas y entradas de diario como necesites. Tu único límite es el espacio de almacenamiento de tu cuenta."
              },
              {
                question: "¿Puedo exportar mis datos?",
                answer: "Sí, puedes exportar todas tus notas, tareas y entradas en formatos estándar como PDF, texto plano o datos estructurados. Tus datos siempre son tuyos."
              },
              {
                question: "¿Funciona sin conexión a internet?",
                answer: "NotasApp requiere conexión a internet para funcionar, pero guarda automáticamente tus cambios. Si pierdes la conexión temporalmente, tus datos se sincronizan cuando vuelvas a conectarte."
              },
              {
                question: "¿Cómo se financia si es gratis?",
                answer: "NotasApp es un proyecto personal creado para ayudar a las personas a organizarse mejor. No hay publicidad, no vendemos datos y no hay costos ocultos."
              }
            ].map((faq, index) => (
              <Disclosure key={index}>
                {({ open }) => (
                  <div className="border border-slate-200 rounded-lg">
                    <Disclosure.Button className="flex justify-between items-center w-full p-6 text-left hover:bg-slate-50 transition-colors">
                      <span className="font-medium text-slate-900 text-lg">{faq.question}</span>
                      <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-6 pb-6">
                      <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                    </Disclosure.Panel>
                  </div>
                )}
              </Disclosure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
              ¿Listo para organizarte mejor?
            </h2>
            <p className="text-xl md:text-2xl text-slate-300 mb-12 leading-relaxed">
              Únete a miles de usuarios que ya han transformado su productividad con NotasApp
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <a 
                href="/register"
                className="inline-flex items-center space-x-3 bg-white text-slate-900 px-8 py-4 rounded-lg hover:bg-slate-100 transition-all font-medium text-lg transform hover:scale-105 shadow-lg"
              >
                <span>Comenzar Gratis Ahora</span>
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-8 text-slate-400 text-sm">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4" />
                <span>Sin costo alguno</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4" />
                <span>Sin límites</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4" />
                <span>Acceso inmediato</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Logo y descripción */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900">NotasApp</span>
              </div>
              <p className="text-slate-600 leading-relaxed mb-6 max-w-md">
                La plataforma gratuita y completa para organizar tu vida digital. 
                Notas, carpetas, tareas, calendario y diario personal en una sola aplicación.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-slate-500">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span>Creado con ❤️ para la comunidad</span>
                </div>
              </div>
            </div>

            {/* Funciones */}
            <div>
              <h3 className="font-bold text-slate-900 mb-6">Funciones</h3>
              <ul className="space-y-3 text-slate-600">
                <li><a href="#features" className="hover:text-slate-900 transition-colors duration-200 flex items-center space-x-2"><BookOpen className="w-4 h-4" /><span>Notas</span></a></li>
                <li><a href="#features" className="hover:text-slate-900 transition-colors duration-200 flex items-center space-x-2"><FolderOpen className="w-4 h-4" /><span>Carpetas</span></a></li>
                <li><a href="#features" className="hover:text-slate-900 transition-colors duration-200 flex items-center space-x-2"><CheckSquare className="w-4 h-4" /><span>Tareas</span></a></li>
                <li><a href="#features" className="hover:text-slate-900 transition-colors duration-200 flex items-center space-x-2"><Calendar className="w-4 h-4" /><span>Calendario</span></a></li>
                <li><a href="#features" className="hover:text-slate-900 transition-colors duration-200 flex items-center space-x-2"><Edit3 className="w-4 h-4" /><span>Diario</span></a></li>
                <li><a href="#features" className="hover:text-slate-900 transition-colors duration-200 flex items-center space-x-2"><Trash2 className="w-4 h-4" /><span>Papelera</span></a></li>
              </ul>
            </div>

            {/* Recursos */}
            <div>
              <h3 className="font-bold text-slate-900 mb-6">Recursos</h3>
              <ul className="space-y-3 text-slate-600">
                <li><a href="/help" className="hover:text-slate-900 transition-colors duration-200">Centro de Ayuda</a></li>
                <li><a href="/tutorials" className="hover:text-slate-900 transition-colors duration-200">Tutoriales</a></li>
                <li><a href="/blog" className="hover:text-slate-900 transition-colors duration-200">Blog</a></li>
                <li><a href="/contact" className="hover:text-slate-900 transition-colors duration-200">Contacto</a></li>
                <li><a href="/privacy" className="hover:text-slate-900 transition-colors duration-200">Privacidad</a></li>
                <li><a href="/terms" className="hover:text-slate-900 transition-colors duration-200">Términos</a></li>
              </ul>
            </div>
          </div>

          {/* Footer bottom */}
          <div className="border-t border-slate-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-slate-600 text-sm mb-4 md:mb-0">
              &copy; 2024 NotasApp. Todos los derechos reservados. Hecho con ❤️ para la comunidad.
            </div>
            <div className="flex items-center space-x-6 text-sm text-slate-500">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Datos protegidos</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>100% Gratis</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4" />
                <span>Acceso mundial</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;