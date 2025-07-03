import React, { useState } from 'react';
import { Mail, Lock, Shield, Users, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthFormProps {
  mode: 'login' | 'signup';
  onModeChange: (mode: 'login' | 'signup') => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ mode, onModeChange }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'operations' | 'client'>('client');
  const [showPassword, setShowPassword] = useState(false);
  const [encryptedUrl, setEncryptedUrl] = useState('');
  const { login, signup, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (mode === 'login') {
        await login(email, password, userType);
      } else {
        const url = await signup(email, password);
        setEncryptedUrl(url);
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  if (encryptedUrl) {
    return (
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mb-4">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
          <p className="text-gray-600">
            We've sent a verification email to <strong>{email}</strong>
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mb-6">
          <p className="text-sm font-medium text-gray-700 mb-2">Your encrypted verification URL:</p>
          <div className="bg-white p-3 rounded border font-mono text-xs break-all text-blue-600">
            {encryptedUrl}
          </div>
        </div>

        <button
          onClick={() => {
            setEncryptedUrl('');
            onModeChange('login');
          }}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-[1.02]"
        >
          Continue to Login
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20 max-w-md w-full">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4">
          <Shield className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-gray-600">
          {mode === 'login' 
            ? 'Sign in to access your secure files' 
            : 'Join our secure file sharing platform'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {mode === 'login' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUserType('operations')}
                className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg border-2 transition-all duration-200 ${
                  userType === 'operations'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <Shield className="h-5 w-5" />
                <span className="font-medium">Operations</span>
              </button>
              <button
                type="button"
                onClick={() => setUserType('client')}
                className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg border-2 transition-all duration-200 ${
                  userType === 'client'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <Users className="h-5 w-5" />
                <span className="font-medium">Client</span>
              </button>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center space-x-2"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <>
              <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => onModeChange(mode === 'login' ? 'signup' : 'login')}
          className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
        >
          {mode === 'login' 
            ? "Don't have an account? Sign up" 
            : 'Already have an account? Sign in'
          }
        </button>
      </div>
    </div>
  );
};

export default AuthForm;