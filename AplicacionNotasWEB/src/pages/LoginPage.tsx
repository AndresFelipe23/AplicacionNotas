import { useState } from "react";
import { login } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Mail, Lock, FileText, Shield, Zap, Users } from "lucide-react";
import { useUser } from '../contexts/UserContext';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      const data = await login(email, password);
      localStorage.setItem("token", data.data.token);
      setUser(data.data);
      navigate("/home");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
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
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-xl mb-3 sm:mb-4">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Bienvenido</h1>
            <p className="text-gray-600 text-xs sm:text-sm">Ingresa a <span className="font-semibold text-blue-600">NotasApp</span></p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {/* Email */}
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
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
                className="w-full pl-10 pr-12 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
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

            {/* Botón */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm sm:text-base"
            >
              {loading ? "Ingresando..." : "Iniciar Sesión"}
            </button>

            {/* Enlaces */}
            <div className="text-center text-xs sm:text-sm">
              <Link to="/forgot-password" className="text-blue-600 hover:text-blue-500 block mb-2">
                ¿Olvidaste tu contraseña?
              </Link>
              <span className="text-gray-600">
                ¿No tienes cuenta?{' '}
                <Link to="/register" className="text-blue-600 hover:text-blue-500 font-semibold">
                  Regístrate
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>

      {/* Columna de Información */}
      <div className="hidden lg:flex flex-1 bg-blue-50 p-6 lg:p-8 flex-col justify-center items-center">
        <div className="max-w-md w-full">
          {/* Título */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Organiza tu vida digital
            </h2>
            <p className="text-gray-600">
              Únete a más de 50,000 usuarios que confían en NotasApp
            </p>
          </div>

          {/* Características */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Seguridad Total</h3>
                <p className="text-sm text-gray-600">Tus datos protegidos con cifrado</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Zap className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Sincronización Rápida</h3>
                <p className="text-sm text-gray-600">Acceso desde cualquier dispositivo</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Colaboración</h3>
                <p className="text-sm text-gray-600">Comparte y trabaja en equipo</p>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-blue-600">50K+</div>
              <div className="text-sm text-gray-600">Usuarios</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-green-600">2M+</div>
              <div className="text-sm text-gray-600">Notas</div>
            </div>
          </div>

          {/* Testimonio */}
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-600">
            <p className="text-gray-700 text-sm mb-2">
              "La mejor app de notas que he usado. Simple y poderosa."
            </p>
            <div className="text-xs text-gray-500">— Ana García, Diseñadora</div>
          </div>
        </div>
      </div>
    </div>
  );
}