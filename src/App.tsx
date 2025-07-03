import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import AuthForm from './components/AuthForm';
import OperationsDashboard from './components/OperationsDashboard';
import ClientDashboard from './components/ClientDashboard';

const AppContent: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <AuthForm 
          mode={authMode} 
          onModeChange={setAuthMode}
        />
      </div>
    );
  }

  return (
    <Layout>
      <div className="py-8">
        {user?.type === 'operations' ? (
          <OperationsDashboard />
        ) : (
          <ClientDashboard />
        )}
      </div>
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;