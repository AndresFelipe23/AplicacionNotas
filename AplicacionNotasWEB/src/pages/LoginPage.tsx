import { useState } from "react";
import { login } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useUser } from '../contexts/UserContext';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      console.log("Respuesta completa:", data);
      localStorage.setItem("token", data.data.token);
      setUser(data.data); // <-- Actualiza el contexto correctamente
      console.log("Usuario guardado:", data.data);
      navigate("/home");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex dark bg-gradient-to-br from-[#181c2b] via-[#232946] to-[#1a1a2e] relative">
      {/* Flecha a inicio */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 z-10 p-2 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-lg text-white transition"
        aria-label="Volver al inicio"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>
      {/* Formulario */}
      <div className="flex-1 flex items-center justify-center p-8">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white/10 dark:bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-10 space-y-8 border border-white/20"
        >
          <h2 className="text-3xl font-bold text-center text-white mb-2">Iniciar Sesión</h2>
          <p className="text-center text-gray-300 mb-6">Bienvenido de nuevo a <span className="font-bold text-blue-400">NotasApp</span></p>
          {error && <div className="text-red-400 text-center">{error}</div>}
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full bg-white/20 text-white placeholder-gray-300 border border-white/20 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full bg-white/20 text-white placeholder-gray-300 border border-white/20 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition"
            disabled={loading}
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
          <div className="text-center text-gray-300 mt-4">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-blue-400 hover:underline">Regístrate</Link>
          </div>
        </form>
      </div>
      {/* Información/promoción */}
      <div className="hidden lg:flex flex-1 flex-col justify-center items-center p-12 bg-gradient-to-br from-blue-900/60 via-purple-900/60 to-blue-800/60 backdrop-blur-2xl">
        <h1 className="text-5xl font-extrabold text-white mb-6 drop-shadow-lg">NotasApp</h1>
        <p className="text-xl text-blue-100 max-w-md text-center mb-8">
          Organiza tu vida digital con seguridad, velocidad y estilo. ¡Tus notas y tareas siempre a mano, en cualquier dispositivo!
        </p>
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <div className="bg-white/10 border border-white/20 rounded-xl p-4 text-white text-center shadow-lg">
            <span className="font-bold text-blue-300">+10K</span> usuarios activos
          </div>
          <div className="bg-white/10 border border-white/20 rounded-xl p-4 text-white text-center shadow-lg">
            <span className="font-bold text-purple-300">+1M</span> notas creadas
          </div>
        </div>
      </div>
    </div>
  );
} 