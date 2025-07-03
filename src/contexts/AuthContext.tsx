import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string, userType: 'operations' | 'client') => Promise<void>;
  signup: (email: string, password: string) => Promise<string>;
  logout: () => void;
  verifyEmail: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: false,
  });

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setAuthState({
        user: JSON.parse(storedUser),
        isAuthenticated: true,
        loading: false,
      });
    }
  }, []);

  const login = async (email: string, password: string, userType: 'operations' | 'client') => {
    setAuthState(prev => ({ ...prev, loading: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      type: userType,
      verified: userType === 'operations' ? true : true, // For demo purposes
    };
    
    localStorage.setItem('user', JSON.stringify(user));
    setAuthState({
      user,
      isAuthenticated: true,
      loading: false,
    });
  };

  const signup = async (email: string, password: string): Promise<string> => {
    setAuthState(prev => ({ ...prev, loading: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const encryptedUrl = `https://secure-verify.example.com/verify/${btoa(email)}-${Date.now()}`;
    
    setAuthState(prev => ({ ...prev, loading: false }));
    return encryptedUrl;
  };

  const logout = () => {
    localStorage.removeItem('user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      loading: false,
    });
  };

  const verifyEmail = async (token: string) => {
    setAuthState(prev => ({ ...prev, loading: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (authState.user) {
      const updatedUser = { ...authState.user, verified: true };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setAuthState({
        user: updatedUser,
        isAuthenticated: true,
        loading: false,
      });
    }
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      signup,
      logout,
      verifyEmail,
    }}>
      {children}
    </AuthContext.Provider>
  );
};