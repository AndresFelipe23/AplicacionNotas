import { useState } from 'react';
import { Menu, X, BookOpen, CheckSquare, FolderOpen, Settings, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Container from './Container';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Notas', icon: BookOpen, href: '#notas' },
    { name: 'Tareas', icon: CheckSquare, href: '#tareas' },
    { name: 'Carpetas', icon: FolderOpen, href: '#carpetas' },
    { name: 'Configuración', icon: Settings, href: '#configuracion' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#232946]/80 via-[#181c2b]/80 to-[#232946]/80 backdrop-blur-md border-b border-blue-900 shadow-sm">
      <Container>
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              NexusNote
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="group flex items-center space-x-2 text-blue-100 hover:text-blue-400 transition-colors duration-200 font-medium py-2 px-3 rounded-lg hover:bg-blue-900/30"
              >
                <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                <span>{item.name}</span>
              </a>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              className="flex items-center space-x-2 text-blue-100 hover:text-blue-400 transition-colors duration-200 font-medium py-2 px-4 rounded-lg hover:bg-blue-900/30"
              onClick={() => navigate('/login')}
            >
              <LogIn className="w-5 h-5" />
              <span>Iniciar Sesión</span>
            </button>
            <button
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
              onClick={() => navigate('/register')}
            >
              Registrarse
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg text-blue-100 hover:text-blue-400 hover:bg-blue-900/30 transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-blue-900 bg-gradient-to-r from-[#232946]/95 via-[#181c2b]/95 to-[#232946]/95 backdrop-blur-md"
            >
              <div className="py-6 space-y-4">
                {menuItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-3 text-blue-100 hover:text-blue-400 transition-colors duration-200 font-medium px-4 py-3 rounded-xl hover:bg-blue-900/30"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </a>
                ))}
                <div className="pt-4 border-t border-blue-900 space-y-3">
                  <button
                    className="w-full flex items-center justify-center space-x-2 text-blue-100 hover:text-blue-400 transition-colors duration-200 font-medium px-4 py-3 rounded-xl hover:bg-blue-900/30"
                    onClick={() => { setIsMenuOpen(false); navigate('/login'); }}
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Iniciar Sesión</span>
                  </button>
                  <button
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg"
                    onClick={() => { setIsMenuOpen(false); navigate('/register'); }}
                  >
                    Registrarse
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </header>
  );
};

export default Header; 