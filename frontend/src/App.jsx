import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Login from './pages/Login';
import Register from './pages/Register';
import ChatWindow from './components/ChatWindow';

function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) return <div>Loading...</div>; // Or a proper loader

  return isAuthenticated ? children : <Navigate to="/login" />;
}

export default function App() {
  const { checkAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <div className="flex h-screen flex-col bg-slate-50 overflow-hidden">
              <header className="bg-white/90 backdrop-blur border-b px-6 py-4 flex justify-between items-center z-50 shadow-sm sticky top-0">
                <div className="flex items-center gap-2">
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <div className="w-4 h-4 border-2 border-white rounded-full"></div>
                  </div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-800">HEART <span className="text-blue-600">Assistant</span></h1>
                </div>
                <button
                  onClick={() => useAuthStore.getState().logout()}
                  className="text-slate-500 hover:text-red-600 text-sm font-medium transition-colors"
                >
                  Sign Out
                </button>
              </header>
              <div className="flex-1 overflow-hidden relative">
                <ChatWindow />
              </div>
            </div>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
