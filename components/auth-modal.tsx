'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Mail, Lock, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [mode, setMode] = useState<'signin' | 'signup'>('signin');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            if (mode === 'signup') {
                const { error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                        },
                    },
                });

                if (signUpError) throw signUpError;
                setMessage('Check your email for the confirmation link.');
            } else {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (signInError) throw signInError;
                onClose();
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-[#FAF9F6]">
                        <h2 className="text-xl font-['Cormorant_Garamond'] font-bold text-[#4A3B32]">
                            {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
                        </h2>
                        <button onClick={onClose} className="p-2 hover:bg-neutral-200 rounded-full transition-colors">
                            <X className="w-5 h-5 text-neutral-500" />
                        </button>
                    </div>

                    <div className="p-8">
                        {message ? (
                            <div className="text-center py-8 text-green-600 bg-green-50 rounded-lg">
                                <p>{message}</p>
                                <Button
                                    variant="link"
                                    onClick={() => setMessage(null)}
                                    className="mt-4"
                                >
                                    Back to Sign In
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleAuth} className="space-y-4">
                                {mode === 'signup' && (
                                    <div className="space-y-1">
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 w-5 h-5 text-neutral-400" />
                                            <Input
                                                type="text"
                                                placeholder="Full Name"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                className="pl-10 h-12 bg-neutral-50 border-neutral-200 focus:bg-white"
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-1">
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 w-5 h-5 text-neutral-400" />
                                        <Input
                                            type="email"
                                            placeholder="Email Address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-10 h-12 bg-neutral-50 border-neutral-200 focus:bg-white"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 w-5 h-5 text-neutral-400" />
                                        <Input
                                            type="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pl-10 h-12 bg-neutral-50 border-neutral-200 focus:bg-white"
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg text-center">
                                        {error}
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-[#4A3B32] hover:bg-[#2e241f] text-white rounded-full uppercase tracking-widest text-xs font-bold"
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (mode === 'signin' ? 'Sign In' : 'Sign Up')}
                                </Button>

                                <div className="text-center pt-4">
                                    <p className="text-sm text-neutral-500">
                                        {mode === 'signin' ? "Don't have an account? " : "Already have an account? "}
                                        <button
                                            type="button"
                                            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                                            className="font-bold text-[#4A3B32] hover:underline"
                                        >
                                            {mode === 'signin' ? 'Sign Up' : 'Sign In'}
                                        </button>
                                    </p>
                                </div>
                            </form>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
