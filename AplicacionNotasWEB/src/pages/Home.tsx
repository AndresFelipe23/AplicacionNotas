import NotaRapida from '../components/NotaRapida';
import { useUser } from '../contexts/UserContext';
import { motion } from 'framer-motion';
import { BookOpen, CheckSquare, Star, Sparkles, Clock } from 'lucide-react';

export default function Home() {
  const { user } = useUser();
  
  const currentHour = new Date().getHours();
  const getGreeting = () => {
    if (currentHour < 12) return '¡Buenos días!';
    if (currentHour < 18) return '¡Buenas tardes!';
    return '¡Buenas noches!';
  };

  const stats = [
    { icon: BookOpen, label: 'Notas', value: '24', color: 'text-blue-600' },
    { icon: CheckSquare, label: 'Tareas', value: '7', color: 'text-amber-600' },
    { icon: Star, label: 'Favoritos', value: '12', color: 'text-purple-600' }
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        
        {/* Bienvenida elegante */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span className="text-blue-600 dark:text-blue-400 font-medium">NotasApp</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-3">
            {getGreeting()}
            {user && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="block sm:inline sm:ml-3 text-blue-600 dark:text-blue-400"
              >
                {user.nombre}
              </motion.span>
            )}
          </h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            Captura tus ideas, organiza tus pensamientos y 
            <span className="text-blue-600 dark:text-blue-400 font-medium"> transforma tu productividad</span>
          </motion.p>
        </motion.div>

        {/* Componente NotaRapida */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
        >
          <NotaRapida />
        </motion.div>

        {/* Tip inspiracional */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="text-center mt-8 sm:mt-12"
        >
          <div className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
            <Clock className="w-4 h-4" />
            <span>Las mejores ideas surgen cuando menos las esperas</span>
            <Sparkles className="w-4 h-4" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}