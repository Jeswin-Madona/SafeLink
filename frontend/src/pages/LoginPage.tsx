import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await authApi.login({ email, password });
      if (res.success && res.data) {
        login(res.data.token, res.data.user);
        const role = res.data.user.role;
        if (role === 'ROLE_OFFICIAL' || role === 'ROLE_ADMIN') {
          navigate('/official/dashboard');
        } else if (role === 'ROLE_GUARDIAN') {
          navigate('/guardian/dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-md">
            <Shield className="h-7 w-7 text-brand-500" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-slate-900">
          SAFELINK
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500 uppercase tracking-wider font-semibold">
          AI-Powered Women's Safety & Emergency Response Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-sm border border-slate-200 sm:rounded-lg">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-3 border border-red-200 flex items-start gap-2 text-xs text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Email Address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@safelink.org"
                  className="block w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-800 focus:border-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-800 focus:border-slate-800"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Authenticating...' : 'Sign in to Console'}
              </button>
            </div>
          </form>

          {/* Quick Demo Pre-sets for Viva/Demonstration */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Select Demo Role (1-Click Login):
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => fillQuickDemo('user@safelink.org', 'User@123')}
                className="p-2 border border-slate-200 rounded text-left hover:bg-slate-50 hover:border-slate-400 transition-colors"
              >
                <span className="font-semibold text-slate-800 block">Woman User</span>
                <span className="text-[10px] text-slate-500">user@safelink.org</span>
              </button>
              <button
                type="button"
                onClick={() => fillQuickDemo('guardian@safelink.org', 'Guardian@123')}
                className="p-2 border border-slate-200 rounded text-left hover:bg-slate-50 hover:border-slate-400 transition-colors"
              >
                <span className="font-semibold text-slate-800 block">Guardian / Parent</span>
                <span className="text-[10px] text-slate-500">guardian@safelink.org</span>
              </button>
              <button
                type="button"
                onClick={() => fillQuickDemo('official@safelink.org', 'Official@123')}
                className="p-2 border border-slate-200 rounded text-left hover:bg-slate-50 hover:border-slate-400 transition-colors"
              >
                <span className="font-semibold text-slate-800 block">Official (Police)</span>
                <span className="text-[10px] text-slate-500">official@safelink.org</span>
              </button>
              <button
                type="button"
                onClick={() => fillQuickDemo('admin@safelink.org', 'Admin@123')}
                className="p-2 border border-slate-200 rounded text-left hover:bg-slate-50 hover:border-slate-400 transition-colors"
              >
                <span className="font-semibold text-slate-800 block">Administrator</span>
                <span className="text-[10px] text-slate-500">admin@safelink.org</span>
              </button>
            </div>
          </div>

          <div className="mt-4 text-center">
            <Link
              to="/register"
              className="text-xs text-brand-700 hover:text-brand-900 font-semibold inline-flex items-center gap-1"
            >
              Need an account? Register as User or Official <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
