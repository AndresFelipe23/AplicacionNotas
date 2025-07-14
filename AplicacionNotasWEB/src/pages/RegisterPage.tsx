import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User, FileText, Shield, Zap, Users, Star } from "lucide-react";
import { useUser } from '../contexts/UserContext';

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/Auth/register`, {
        email,
        password,
        nombre,
        apellido,
      });
      localStorage.setItem("token", response.data.data.token);
      setUser(response.data.data.usuario);
      navigate("/home");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Botón de regreso */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 z-20 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-all duration-200"
        aria-label="Volver al inicio"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      {/* Columna del Formulario */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-sm mx-auto">
          {/* Header */}
          <div className="text-center mb-5 sm:mb-6">
            <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-xl mb-3 sm:mb-4">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Crear Cuenta</h1>
            <p className="text-gray-600 text-xs sm:text-sm">Únete a <span className="font-semibold text-blue-600">NexusNote</span></p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {/* Nombre */}
            <div className="relative">
              <User className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Nombre"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                required
              />
            </div>

            {/* Apellido */}
            <div className="relative">
              <User className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Apellido"
                value={apellido}
                onChange={e => setApellido(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Contraseña */}
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Términos */}
            <div className="text-xs text-gray-600">
              Al registrarte, aceptas nuestros{' '}
              <Link to="/terms" className="text-blue-600 hover:text-blue-500">Términos de Servicio</Link>
              {' '}y{' '}
              <Link to="/privacy" className="text-blue-600 hover:text-blue-500">Política de Privacidad</Link>
            </div>

            {/* Botón */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm sm:text-base"
            >
              {loading ? "Registrando..." : "Crear Cuenta"}
            </button>

            {/* Login */}
            <div className="text-center text-xs sm:text-sm">
              <span className="text-gray-600">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-500 font-semibold">
                  Iniciar Sesión
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>

      {/* Columna de Información */}
      <div className="hidden lg:flex flex-1 bg-green-50 p-6 lg:p-8 flex-col justify-center items-center">
        <div className="max-w-md w-full">
          {/* Título */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Comienza gratis hoy
            </h2>
            <p className="text-gray-600">
              Únete a miles de usuarios que ya organizan su vida con NexusNote
            </p>
          </div>

          {/* Beneficios */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">100% Gratis</h3>
                <p className="text-sm text-gray-600">Sin costos ocultos ni suscripciones</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Configuración Instantánea</h3>
                <p className="text-sm text-gray-600">Listo para usar en segundos</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Comunidad Activa</h3>
                <p className="text-sm text-gray-600">Soporte y tips de otros usuarios</p>
              </div>
            </div>
          </div>

          {/* Proceso simple */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Proceso simple:</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                <span>Crea tu cuenta gratis</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                <span>Verifica tu email</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                <span>¡Comienza a organizar!</span>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <div className="text-xl font-bold text-green-600">50K+</div>
              <div className="text-xs text-gray-600">Usuarios</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg shadow-sm">
              <div className="text-xl font-bold text-blue-600">4.9</div>
              <div className="text-xs text-gray-600 flex items-center justify-center">
                <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                Rating
              </div>
            </div>
          </div>

          {/* CTA adicional */}
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-600">
            <p className="text-gray-700 text-sm mb-1 font-semibold">
              🎉 Oferta de lanzamiento
            </p>
            <p className="text-xs text-gray-600">
              Obtén 6 meses de funciones premium gratis al registrarte hoy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}