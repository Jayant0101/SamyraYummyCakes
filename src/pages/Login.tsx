import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Phone, Loader2, Eye, EyeOff, Shield, ArrowRight, CheckCircle, Lock } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import GlassCard from '../components/GlassCard';
import { motion, AnimatePresence } from 'framer-motion';

type AuthTab = 'email' | 'phone';
type AuthMode = 'login' | 'signup';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [tab, setTab] = useState<AuthTab>('email');
    const [mode, setMode] = useState<AuthMode>('login');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Email form
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');

    // Phone form
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);

    // Redirect if already logged in
    if (user) {
        navigate('/dashboard');
        return null;
    }

    if (!isSupabaseConfigured()) {
        return (
            <div className="min-h-screen bg-rose-50 flex items-center justify-center px-4">
                <GlassCard className="max-w-md w-full text-center p-10">
                    <Shield className="w-12 h-12 text-rose-400 mx-auto mb-4" />
                    <h2 className="font-serif text-2xl font-bold mb-2">Authentication Unavailable</h2>
                    <p className="text-gray-600">Supabase is not configured. Please set up environment variables to enable login.</p>
                </GlassCard>
            </div>
        );
    }

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            if (mode === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { full_name: fullName },
                    },
                });
                if (error) throw error;
                setMessage('Check your email for a confirmation link!');
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                navigate('/dashboard');
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleAuth = async () => {
        setLoading(true);
        setError('');
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/#/dashboard`,
                },
            });
            if (error) throw error;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Google sign-in failed');
            setLoading(false);
        }
    };

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { error } = await supabase.auth.signInWithOtp({ phone });
            if (error) throw error;
            setOtpSent(true);
            setMessage('OTP sent to your phone!');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { error } = await supabase.auth.verifyOtp({
                phone,
                token: otp,
                type: 'sms',
            });
            if (error) throw error;
            navigate('/dashboard');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'OTP verification failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
            {/* Background */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-rose-50 via-white to-purple-50 -z-10" />
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-rose-200/20 rounded-full blur-[100px] -z-10" />

            <div className="w-full max-w-md relative z-10">
                <GlassCard className="p-0 overflow-hidden shadow-2xl">
                    {/* Tab Switcher */}
                    <div className="flex border-b border-gray-100">
                        <button
                            onClick={() => { setTab('email'); setError(''); setMessage(''); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all ${tab === 'email'
                                ? 'text-rose-600 bg-rose-50/50 border-b-2 border-rose-500'
                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <Mail className="w-4 h-4" /> Email
                        </button>
                        <button
                            onClick={() => { setTab('phone'); setError(''); setMessage(''); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all ${tab === 'phone'
                                ? 'text-rose-600 bg-rose-50/50 border-b-2 border-rose-500'
                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <Phone className="w-4 h-4" /> Phone
                        </button>
                    </div>

                    <div className="p-8">
                        <div className="text-center mb-8">
                            <div className="inline-flex p-3 bg-rose-100 rounded-full text-rose-500 mb-4 shadow-inner">
                                <Lock className="w-6 h-6" />
                            </div>
                            <h1 className="font-serif text-2xl font-bold text-gray-900 mb-1">
                                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                            </h1>
                            <p className="text-gray-500 text-sm">
                                {mode === 'login' ? 'Sign in to access your dashboard' : 'Join us to track orders & rewards'}
                            </p>
                        </div>

                        {/* Error / Success Messages */}
                        <AnimatePresence>
                            {error && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                    <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm flex items-center gap-2">
                                        <div className="w-1 h-4 bg-red-400 rounded-full"></div>
                                        {error}
                                    </div>
                                </motion.div>
                            )}
                            {message && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                    <div className="bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-xl mb-4 text-sm flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4" /> {message}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* ─── Email Tab ─── */}
                        {tab === 'email' && (
                            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                                <form onSubmit={handleEmailAuth} className="space-y-4">
                                    {mode === 'signup' && (
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 mb-1 block">Full Name</label>
                                            <input
                                                type="text"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                required
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none transition-all"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 mb-1 block">Email Address</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none transition-all"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 mb-1 block">Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                minLength={6}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none transition-all pr-12"
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3.5 rounded-xl font-bold transition-all disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg shadow-rose-200 mt-2"
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                                        {mode === 'login' ? 'Sign In' : 'Create Account'}
                                    </button>
                                </form>

                                <p className="text-center text-xs text-gray-400 mt-6">
                                    {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                                    <button
                                        onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setMessage(''); }}
                                        className="text-rose-600 font-bold hover:underline"
                                    >
                                        {mode === 'login' ? 'Sign Up' : 'Sign In'}
                                    </button>
                                </p>
                            </motion.div>
                        )}

                        {/* ─── Phone Tab ─── */}
                        {tab === 'phone' && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                {!otpSent ? (
                                    <form onSubmit={handleSendOtp} className="space-y-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 mb-1 block">Phone Number</label>
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                required
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-rose-400 focus:bg-white outline-none transition-all"
                                                placeholder="+91 98765 43210"
                                            />
                                            <p className="text-xs text-gray-400 mt-1 ml-1">Include country code (e.g. +91)</p>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3.5 rounded-xl font-bold transition-all disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg shadow-rose-200 mt-2"
                                        >
                                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Phone className="w-5 h-5" />}
                                            Send OTP
                                        </button>
                                    </form>
                                ) : (
                                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                                        <p className="text-sm text-gray-600 text-center mb-2">
                                            Enter the 6-digit code sent to <br /><span className="font-bold text-rose-600">{phone}</span>
                                        </p>
                                        <div>
                                            <input
                                                type="text"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                required
                                                maxLength={6}
                                                className="w-full px-4 py-4 border-2 border-rose-100 rounded-xl focus:border-rose-400 outline-none transition-all text-center text-3xl tracking-[0.5em] font-mono text-gray-800"
                                                placeholder="000000"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3.5 rounded-xl font-bold transition-all disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg shadow-rose-200"
                                        >
                                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                                            Verify & Sign In
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { setOtpSent(false); setOtp(''); setMessage(''); }}
                                            className="w-full text-xs text-gray-400 hover:text-rose-500 font-medium transition-colors"
                                        >
                                            ← Incorrect Number? Change it
                                        </button>
                                    </form>
                                )}
                            </motion.div>
                        )}

                        {/* ─── Google Divider & Button ─── */}
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
                            <div className="relative flex justify-center text-xs uppercase tracking-wide font-bold"><span className="bg-white px-4 text-gray-400">Or continue with</span></div>
                        </div>

                        <button
                            onClick={handleGoogleAuth}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 py-3 rounded-xl font-bold text-gray-700 transition-all disabled:opacity-50"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Google
                        </button>
                    </div>
                </GlassCard>

                {/* Admin Link */}
                <div className="text-center mt-8">
                    <div className="inline-block p-2 rounded-lg hover:bg-white/50 transition-colors">
                        <Link
                            to="/admin"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-rose-600 transition-colors uppercase tracking-wider"
                        >
                            <Shield className="w-3 h-3" /> Admin Portal
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
