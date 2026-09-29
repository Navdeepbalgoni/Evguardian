import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Zap, ArrowRight, User, Mail, Lock, ShieldCheck } from 'lucide-react';

export const RegisterView = ({ onNavigate }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    fullName: 'Anish Sharma',
    email: 'anish@cleanmobility.org',
    password: 'password123',
    confirmPassword: 'password123'
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    register(formData);
    onNavigate('vehicle-setup');
  };

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col justify-center items-center p-4 relative overflow-hidden bg-grid-pattern">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/15 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/15 rounded-full blur-[128px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-500 p-0.5 shadow-glow-cyan mb-4">
            <div className="w-full h-full bg-dark-950 rounded-[14px] flex items-center justify-center">
              <Zap className="w-7 h-7 text-cyan-400" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-mono">
            CREATE ACCOUNT
          </h1>
          <p className="text-xs sm:text-sm text-cyan-400 font-medium tracking-wide uppercase mt-1">
            Register EV Guardian Telematics Account
          </p>
        </div>

        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-xl">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-xs text-rose-300 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Anish Sharma"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="anish@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm tracking-wide shadow-glow-cyan transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>Create Account & Setup Vehicle</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4 ml-1"
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
