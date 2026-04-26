import React, { useState } from 'react';
import { supabase } from '../supabase';
import { Lock, Mail, Loader2, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let finalEmail = email;
      if (!email.includes('@')) {
        finalEmail = `${email}@login.pm`;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: finalEmail,
        password,
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Lỗi đăng nhập');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#020617] overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-[440px] px-6 py-12">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10 group">
          <div className="relative w-16 h-16 mb-6">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl rotate-12 group-hover:rotate-45 transition-transform duration-500 shadow-[0_0_30px_rgba(37,99,235,0.4)]"></div>
            <div className="absolute inset-0 bg-slate-900 rounded-2xl flex items-center justify-center border border-white/10 group-hover:rotate-6 transition-transform duration-500">
              <span className="text-white font-black text-3xl tracking-tighter">F</span>
            </div>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter text-center">
            F-Solution
          </h1>
        </div>

        {/* Login Card */}
        <div className="bg-white/[0.03] backdrop-blur-2xl rounded-[32px] border border-white/10 p-8 shadow-2xl relative overflow-hidden group/card">
          {/* Subtle inner glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 blur-3xl rounded-full"></div>
          
          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Tài khoản truy cập</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500 group-focus-within/input:text-blue-500 transition-colors" />
                </div>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-white/[0.05] border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all duration-300 font-medium"
                  placeholder="Tên đăng nhập hoặc Email"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2.5 ml-1">Mật khẩu</label>
              <div className="relative group/input">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500 group-focus-within/input:text-blue-500 transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-white/[0.05] border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all duration-300"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="animate-shake flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl text-rose-400 text-sm font-bold">
                <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full relative group/btn bg-gradient-to-r from-blue-600 to-indigo-600 py-4 rounded-2xl font-black text-white shadow-[0_10px_20px_-10px_rgba(37,99,235,0.5)] hover:shadow-[0_15px_30px_-5px_rgba(37,99,235,0.6)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>ĐANG XÁC THỰC...</span>
                  </>
                ) : (
                  <>
                    <span>ĐĂNG NHẬP HỆ THỐNG</span>
                    <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>
        </div>
      </div>

      {/* Decorative sparkes */}
      <div className="absolute top-20 right-[15%] text-blue-500/20">
        <Sparkles size={40} className="animate-pulse" />
      </div>
      <div className="absolute bottom-40 left-[10%] text-indigo-500/20">
        <Sparkles size={30} className="animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
};

export default LoginPage;
