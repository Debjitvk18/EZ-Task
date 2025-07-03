import React from 'react';
import { LogOut, Shield, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {user && (
        <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    SecureShare
                  </h1>
                  <p className="text-xs text-gray-500">Enterprise File Sharing</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full">
                  {user.type === 'operations' ? (
                    <Shield className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Users className="h-4 w-4 text-indigo-600" />
                  )}
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {user.type} User
                  </span>
                </div>
                
                <span className="text-sm text-gray-600">{user.email}</span>
                
                <button
                  onClick={logout}
                  className="inline-flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-red-700 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>
      )}
      
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;