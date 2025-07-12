export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('token');
};

export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000; // Convertir a milisegundos
    return Date.now() < expirationTime;
  } catch {
    return false;
  }
}; 