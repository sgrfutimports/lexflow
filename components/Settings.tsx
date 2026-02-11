import React, { useState } from 'react';
import { User, Bell, Lock, Monitor, Save, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast, ToastContainer } from './Toast';

const Settings: React.FC = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const { toasts, addToast, removeToast } = useToast();

    const handleSave = async () => {
        setLoading(true);
        // Simulação de salvamento
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false);
        addToast('Configurações salvas com sucesso!', 'success');
    };

    const tabs = [
        { id: 'profile', label: 'Meu Perfil', icon: <User size={18} /> },
        { id: 'notifications', label: 'Notificações', icon: <Bell size={18} /> },
        { id: 'security', label: 'Segurança', icon: <Lock size={18} /> },
        { id: 'system', label: 'Sistema', icon: <Monitor size={18} /> },
    ];

    return (
        <div className="space-y-6">
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Configurações</h1>
                    <p className="text-slate-500">Gerencie suas preferências e dados da conta</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    Salvar Alterações
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
                {/* Sidebar de Tabs */}
                <div className="w-full md:w-64 border-r border-slate-200 bg-slate-50 p-4">
                    <nav className="space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                  ${activeTab === tab.id
                                        ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200'
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Conteúdo */}
                <div className="flex-1 p-8">
                    {activeTab === 'profile' && (
                        <div className="max-w-xl space-y-6">
                            <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-4">Informações Pessoais</h3>

                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center text-3xl font-bold text-slate-400">
                                    {user?.email?.[0].toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                                        Alterar Foto
                                    </button>
                                    <p className="text-xs text-slate-500 mt-2">JPG, GIF ou PNG. Max 1MB.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Nome Completo</label>
                                    <input type="text" placeholder="Seu nome completo" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Cargo</label>
                                    <input type="text" placeholder="Seu cargo" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-slate-700">Email</label>
                                    <input type="email" defaultValue={user?.email} disabled className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium text-slate-700">Bio</label>
                                    <textarea rows={4} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Escreva um pouco sobre você..." />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="max-w-xl space-y-6">
                            <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-4">Preferências de Notificação</h3>

                            <div className="space-y-4">
                                {[
                                    { title: 'Novos Processos', desc: 'Receba alertas quando novos processos forem cadastrados' },
                                    { title: 'Prazos Próximos', desc: 'Alertas sobre vencimentos de prazos em 24h e 48h' },
                                    { title: 'Atualizações de Clientes', desc: 'Notificações sobre atividades dos clientes' },
                                    { title: 'Relatórios Semanais', desc: 'Resumo semanal de produtividade por email' }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                                        <div>
                                            <h4 className="text-sm font-medium text-slate-800">{item.title}</h4>
                                            <p className="text-xs text-slate-500">{item.desc}</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="max-w-xl space-y-6">
                            <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-4">Segurança da Conta</h3>

                            <div className="space-y-4">
                                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
                                    <h4 className="flex items-center gap-2 text-indigo-800 font-medium text-sm">
                                        <Lock size={16} /> Autenticação de Dois Fatores (2FA)
                                    </h4>
                                    <p className="text-xs text-indigo-600 mt-1">Recomendamos ativar o 2FA para maior segurança.</p>
                                    <button className="mt-3 text-xs font-semibold text-white bg-indigo-600 px-3 py-1.5 rounded hover:bg-indigo-700 transition-colors">
                                        Configurar 2FA
                                    </button>
                                </div>

                                <div className="space-y-4 pt-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Senha Atual</label>
                                        <input type="password" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Nova Senha</label>
                                        <input type="password" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Confirmar Nova Senha</label>
                                        <input type="password" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'system' && (
                        <div className="max-w-xl space-y-6">
                            <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-4">Preferências do Sistema</h3>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Tema</label>
                                    <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white">
                                        <option value="light">Claro (Padrão)</option>
                                        <option value="dark">Escuro</option>
                                        <option value="system">Sistema</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Idioma</label>
                                    <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white">
                                        <option value="pt-BR">Português (Brasil)</option>
                                        <option value="en-US">English (US)</option>
                                        <option value="es">Español</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Formato de Data</label>
                                    <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white">
                                        <option value="dd/mm/yyyy">DD/MM/AAAA (31/12/2024)</option>
                                        <option value="mm/dd/yyyy">MM/DD/AAAA (12/31/2024)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
