import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/Auth`;

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/login`, {
    email,
    password,
  });
  return response.data;
};

export const register = async (email: string, password: string, nombre: string, apellido: string) => {
  const response = await axios.post(`${API_URL}/register`, {
    email,
    password,
    nombre,
    apellido,
  });
  return response.data;
};

class AuthService {
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  removeToken(): void {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService(); 