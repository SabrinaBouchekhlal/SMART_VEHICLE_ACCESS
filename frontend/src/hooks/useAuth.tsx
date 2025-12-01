import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, authAPI } from '../services/api'; // IMPORT authAPI
import toast from 'react-hot-toast';

// Types for authentication
interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
  is_active: boolean;
  created_at: string;
  last_login?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

// Create authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Authentication provider component
 * Manages user authentication state and provides auth methods
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated
  const isAuthenticated = !!user;

  /**
   * Initialize authentication state
   * Checks for stored token and validates it
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const userDataStr = localStorage.getItem('user_data');
        
        if (token && userDataStr) {
          // Set token in API client
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Use the stored user data
          const userData = JSON.parse(userDataStr);
          setUser(userData);
        }
      } catch (error) {
        console.warn('Auth initialization failed, clearing token:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_data');
        delete api.defaults.headers.common['Authorization'];
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Login user with username and password
   * @param username - User's username
   * @param password - User's password
   */
  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Use the actual API instead of hardcoded logic
      const result = await authAPI.login(username, password);
      
      // Store token and user data from API response
      localStorage.setItem('access_token', result.access_token);
      localStorage.setItem('user_data', JSON.stringify(result.user));
      
      // Set API headers
      api.defaults.headers.common['Authorization'] = `Bearer ${result.access_token}`;
      
      // Update state with the user from API response
      setUser(result.user);
      
      toast.success('Login successful!');
      return;
      
    } catch (error: any) {
      const message = error.message || 'Login failed. Please try again.';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout user and clear authentication state
   */
  const logout = () => {
    try {
      // Clear local storage
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_data');
      
      // Clear API headers
      delete api.defaults.headers.common['Authorization'];
      
      // Clear state
      setUser(null);
      
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  /**
   * Update user information
   * @param userData - Partial user data to update
   */
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use authentication context
 * @returns Authentication context value
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}