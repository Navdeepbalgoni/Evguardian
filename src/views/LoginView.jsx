import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Zap, ShieldCheck, ArrowRight, Lock, Mail, Activity, Sparkles, Key } from 'lucide-react';

export const LoginView = ({ onNavigate }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('engineer@evguardian.ai');
  const [password, setPassword] = useState('••••••••••••');
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
    onNavigate('home');
  };

  const handleQuickDemo = (roleEmail) => {
    login(roleEmail, 'demo1234');
    onNavigate('home');
  };

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col justify-center items-center p-4 relative overflow-hidden bg-grid-pattern">
      {/* Ambient background glow effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/15 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/15 rounded-full blur-[128px] pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-500 p-0.5 shadow-glow-cyan mb-4">
            <div className="w-full h-full bg-dark-950 rounded-[14px] flex items-center justify-center">
              <Zap className="w-7 h-7 text-cyan-400" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-mono">
            EV GUARDIAN
          </h1>
          <p className="text-xs sm:text-sm text-cyan-400 font-medium tracking-wide uppercase mt-1">
            AI-Powered Predictive Health Monitoring
          </p>
          <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto">
            Digital Twin Powertrain Observer & Early Anomaly Detection System
          </p>
        </div>

        {/* Login Form Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="engineer@evguardian.ai"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm tracking-wide shadow-glow-cyan transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>Login to Digital Twin</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Logins */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <span className="block text-center text-[11px] uppercase tracking-wider font-mono text-slate-400 mb-2.5">
              Instant Demo Access
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('fleet.engineer@evguardian.ai')}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Fleet Engineer</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('ev.owner@evguardian.ai')}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
              >
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>EV Owner</span>
              </button>
            </div>
          </div>

          {/* Registration link */}
          <div className="mt-6 text-center text-xs text-slate-400">
            Don't have an EV Guardian account?{' '}
            <button
              type="button"
              onClick={() => onNavigate('register')}
              className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4 ml-1"
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Footer badges */}
        <div className="mt-6 flex items-center justify-center gap-4 text-[11px] font-mono text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> CAN Bus 2.0B
          </span>
          <span>•</span>
          <span>ISO 26262 ASIL-D Compliant Architecture</span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel p-6 rounded-2xl max-w-sm w-full border border-slate-700">
            <h3 className="text-base font-bold text-white mb-2">Reset Password</h3>
            <p className="text-xs text-slate-300 mb-4">
              Enter your email to receive a password reset token for your vehicle telematics account.
            </p>
            <input
              type="email"
              defaultValue={email}
              className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-slate-700 text-white text-xs mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowForgotModal(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Reset link sent to ' + email);
                  setShowForgotModal(false);
                }}
                className="px-4 py-1.5 rounded-lg bg-cyan-500 text-slate-950 text-xs font-bold"
              >
                Send Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
