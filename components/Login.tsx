import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LogIn, Loader2 } from 'lucide-react';
import { useToast, ToastContainer } from './Toast';

const Login: React.FC<{ onSuccess: () => void; onRegisterClick?: () => void }> = ({ onSuccess, onRegisterClick }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const { toasts, addToast, removeToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            addToast('Por favor, preencha todos os campos', 'error');
            return;
        }

        setLoading(true);

        try {
            const { error } = await signIn(email, password);

            if (error) {
                addToast(error.message || 'Erro ao fazer login', 'error');
            } else {
                addToast('Login realizado com sucesso!', 'success');
                setTimeout(onSuccess, 500);
            }
        } catch (err) {
            addToast('Erro inesperado ao fazer login', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4">
                            <LogIn className="text-white" size={32} />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-800">LexFlow</h1>
                        <p className="text-slate-500 mt-2">Gestão Jurídica Inteligente</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Senha
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Entrando...
                                </>
                            ) : (
                                <>
                                    <LogIn size={20} />
                                    Entrar
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-500">
                            Não tem uma conta?{' '}
                            <button
                                onClick={onRegisterClick}
                                className="text-indigo-600 hover:text-indigo-700 font-medium underline-offset-2 hover:underline"
                            >
                                Criar conta
                            </button>
                        </p>
                    </div>
                </div>

                {/* Info */}
                <div className="mt-6 text-center text-sm text-slate-500">
                    <p>Versão 1.0.0 • Powered by Supabase</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
