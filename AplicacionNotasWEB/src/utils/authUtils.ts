// Utilidades para manejar la autenticación
export function isTokenValid(): boolean {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    // Decodificar el token JWT para verificar si ha expirado
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000; // Convertir a milisegundos
    const currentTime = Date.now();
    
    return currentTime < expirationTime;
  } catch (error) {
    console.error('Error al verificar token:', error);
    return false;
  }
}

export function getToken(): string | null {
  const token = localStorage.getItem('token');
  if (!token || !isTokenValid()) {
    localStorage.removeItem('token');
    return null;
  }
  return token;
}

export function logout(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // La navegación debe hacerse desde el componente llamador usando useNavigate
}

export function redirectToLogin(): void {
  window.location.href = '/login';
} 