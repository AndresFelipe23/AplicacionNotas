import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { PinDiarioProvider } from './contexts/PinDiarioContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import DashboardLayout from './layouts/DashboardLayout';
import SidebarOnlyLayout from './layouts/SidebarOnlyLayout'; // Agregar esta importación
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Home from './pages/Home';
import Notas from './pages/Notas';
import Tareas from './pages/Tareas';
import Calendario from './pages/Calendario';
import { Diario } from './pages/Diario';
import Configuracion from './pages/Configuracion';
import Papelera from './pages/Papelera';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <PinDiarioProvider>
          <Router>
            <div>
              <Routes>
                {/* Rutas públicas - solo accesibles si NO está autenticado */}
                <Route path="/" element={
                  <PublicRoute>
                    <LandingPage />
                  </PublicRoute>
                } />
                <Route path="/login" element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                } />
                <Route path="/register" element={
                  <PublicRoute>
                    <RegisterPage />
                  </PublicRoute>
                } />
                
                {/* Rutas protegidas - solo accesibles si está autenticado */}
                <Route path="/home" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Home />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                {/* Rutas con sidebar propio - usan SidebarOnlyLayout */}
                <Route path="/notas" element={
                  <ProtectedRoute>
                    <SidebarOnlyLayout>
                      <Notas />
                    </SidebarOnlyLayout>
                  </ProtectedRoute>
                } />
                <Route path="/tareas" element={
                  <ProtectedRoute>
                    <SidebarOnlyLayout>
                      <Tareas />
                    </SidebarOnlyLayout>
                  </ProtectedRoute>
                } />
                
                {/* Rutas tipo dashboard - usan DashboardLayout */}
                <Route path="/calendario" element={
                  <ProtectedRoute>
                    <SidebarOnlyLayout>
                      <Calendario />
                    </SidebarOnlyLayout>
                  </ProtectedRoute>
                } />
                <Route path="/diario" element={
                  <ProtectedRoute>
                    <SidebarOnlyLayout>
                      <Diario />
                    </SidebarOnlyLayout>
                  </ProtectedRoute>
                } />
                <Route path="/configuracion" element={
                  <ProtectedRoute>
                    <SidebarOnlyLayout>
                      <Configuracion />
                    </SidebarOnlyLayout>
                  </ProtectedRoute>
                } />
                <Route path="/papelera" element={
                  <ProtectedRoute>
                    <SidebarOnlyLayout>
                      <Papelera />
                    </SidebarOnlyLayout>
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </Router>
        </PinDiarioProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;