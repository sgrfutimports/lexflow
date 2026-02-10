import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserPlus, Loader2 } from 'lucide-react';
import { useToast, ToastContainer } from './Toast';

const Register: React.FC<{ onSuccess: () => void; onBackToLogin: () => void }> = ({ onSuccess, onBackToLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();
    const { toasts, addToast, removeToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password || !fullName) {
            addToast('Por favor, preencha todos os campos', 'error');
            return;
        }

        if (password.length < 6) {
            addToast('A senha deve ter pelo menos 6 caracteres', 'error');
            return;
        }

        if (password !== confirmPassword) {
            addToast('As senhas não coincidem', 'error');
            return;
        }

        setLoading(true);

        try {
            const { error } = await signUp(email, password);

            if (error) {
                addToast(error.message || 'Erro ao criar conta', 'error');
            } else {
                addToast('Conta criada com sucesso! Faça login para continuar.', 'success');
                setTimeout(onBackToLogin, 1500);
            }
        } catch (err) {
            addToast('Erro inesperado ao criar conta', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-4">
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-2xl mb-4">
                            <UserPlus className="text-white" size={32} />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-800">Criar Conta</h1>
                        <p className="text-slate-500 mt-2">Comece a usar o LexFlow hoje</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Nome Completo
                            </label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="João da Silva"
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
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
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                disabled={loading}
                            />
                            <p className="text-xs text-slate-500 mt-1">Mínimo de 6 caracteres</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Confirmar Senha
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Criando conta...
                                </>
                            ) : (
                                <>
                                    <UserPlus size={20} />
                                    Criar Conta
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-500">
                            Já tem uma conta?{' '}
                            <button
                                onClick={onBackToLogin}
                                className="text-purple-600 hover:text-purple-700 font-medium"
                            >
                                Fazer login
                            </button>
                        </p>
                    </div>
                </div>

                {/* Info */}
                <div className="mt-6 text-center text-sm text-slate-500">
                    <p>Ao criar uma conta, você concorda com nossos Termos de Uso</p>
                </div>
            </div>
        </div>
    );
};

export default Register;
