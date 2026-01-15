
import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

interface AdminLoginPageProps {
  onLogin: (password: string) => boolean;
  isAuthenticated: boolean;
}

const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLogin, isAuthenticated }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/admin";

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogin(password)) {
      navigate(from, { replace: true });
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white serif mb-2">Lumina Admin</h1>
          <p className="text-slate-400">Please enter your credentials to access the dashboard</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Access Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="••••••••"
                className={`w-full px-4 py-3 rounded-xl bg-slate-50 border ${error ? 'border-red-500' : 'border-slate-200'} focus:ring-2 focus:ring-indigo-500 outline-none transition`}
              />
              {error && <p className="text-red-500 text-xs mt-2 font-medium">Invalid password. Access denied.</p>}
            </div>

            <button 
              type="submit"
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-indigo-600 transition shadow-lg shadow-indigo-100"
            >
              Unlock Dashboard
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => navigate('/')}
              className="text-slate-400 text-sm hover:text-slate-600 transition flex items-center justify-center gap-2 mx-auto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Public Site
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
