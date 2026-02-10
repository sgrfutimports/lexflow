import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSupabaseMutation } from '../hooks/useSupabase';
import { validateCPF, validateCNPJ, validateEmail, formatCPF, formatCNPJ, formatPhone } from '../utils/validators';
import { UserPlus, Search, Users, Building2 } from 'lucide-react';
import { useToast, ToastContainer } from './Toast';

interface Client {
    id: string;
    name: string;
    type: 'PF' | 'PJ';
    document: string;
    email?: string;
    phone?: string;
    active_cases: number;
}

const ClientManagerSupabase: React.FC = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'PF' | 'PJ'>('all');
    const [showModal, setShowModal] = useState(false);
    const { user } = useAuth();
    const { insert, loading } = useSupabaseMutation('clients');
    const { toasts, addToast, removeToast } = useToast();

    const [newClient, setNewClient] = useState({
        name: '',
        type: 'PF' as 'PF' | 'PJ',
        document: '',
        email: '',
        phone: ''
    });

    const handleAddClient = async () => {
        if (!user) {
            addToast('Você precisa estar logado', 'error');
            return;
        }

        if (!newClient.name || !newClient.document) {
            addToast('Preencha nome e documento', 'error');
            return;
        }

        // Validar documento
        const isValid = newClient.type === 'PF'
            ? validateCPF(newClient.document)
            : validateCNPJ(newClient.document);

        if (!isValid) {
            addToast(`${newClient.type === 'PF' ? 'CPF' : 'CNPJ'} inválido`, 'error');
            return;
        }

        // Validar email se fornecido
        if (newClient.email && !validateEmail(newClient.email)) {
            addToast('Email inválido', 'error');
            return;
        }

        try {
            const result = await insert({
                user_id: user.id,
                name: newClient.name,
                type: newClient.type,
                document: newClient.document,
                email: newClient.email || null,
                phone: newClient.phone || null,
                active_cases: 0
            });

            if (result) {
                addToast('Cliente cadastrado com sucesso!', 'success');
                setClients([...clients, result as Client]);
                setShowModal(false);
                setNewClient({ name: '', type: 'PF', document: '', email: '', phone: '' });
            }
        } catch (error) {
            addToast('Erro ao cadastrar cliente', 'error');
        }
    };

    const filteredClients = clients.filter(client => {
        const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.document.includes(searchTerm);
        const matchesType = filterType === 'all' || client.type === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="space-y-6">
            <ToastContainer toasts={toasts} removeToast={removeToast} />

            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">Gestão de Clientes</h2>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                >
                    <UserPlus size={20} />
                    Novo Cliente
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por nome ou documento..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                </div>
                <div className="flex gap-2">
                    {(['all', 'PF', 'PJ'] as const).map(type => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterType === type
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-white text-slate-700 border border-slate-300 hover:border-indigo-300'
                                }`}
                        >
                            {type === 'all' ? 'Todos' : type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Clients Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredClients.map(client => (
                    <div key={client.id} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`p-3 rounded-lg ${client.type === 'PF' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                    {client.type === 'PF' ? <Users size={24} /> : <Building2 size={24} />}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-800">{client.name}</h3>
                                    <span className={`text-xs px-2 py-1 rounded-full ${client.type === 'PF' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                                        }`}>
                                        {client.type}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2 text-sm text-slate-600">
                            <p><strong>Documento:</strong> {client.type === 'PF' ? formatCPF(client.document) : formatCNPJ(client.document)}</p>
                            {client.email && <p><strong>Email:</strong> {client.email}</p>}
                            {client.phone && <p><strong>Telefone:</strong> {formatPhone(client.phone)}</p>}
                            <p><strong>Processos Ativos:</strong> {client.active_cases}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Novo Cliente</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Nome Completo</label>
                                <input
                                    type="text"
                                    value={newClient.name}
                                    onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Tipo</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            checked={newClient.type === 'PF'}
                                            onChange={() => setNewClient({ ...newClient, type: 'PF', document: '' })}
                                            className="text-indigo-600"
                                        />
                                        <span>Pessoa Física</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            checked={newClient.type === 'PJ'}
                                            onChange={() => setNewClient({ ...newClient, type: 'PJ', document: '' })}
                                            className="text-indigo-600"
                                        />
                                        <span>Pessoa Jurídica</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    {newClient.type === 'PF' ? 'CPF' : 'CNPJ'}
                                </label>
                                <input
                                    type="text"
                                    value={newClient.document}
                                    onChange={(e) => setNewClient({ ...newClient, document: e.target.value })}
                                    placeholder={newClient.type === 'PF' ? '000.000.000-00' : '00.000.000/0000-00'}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Email (opcional)</label>
                                <input
                                    type="email"
                                    value={newClient.email}
                                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Telefone (opcional)</label>
                                <input
                                    type="tel"
                                    value={newClient.phone}
                                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                                    placeholder="(00) 00000-0000"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                                    disabled={loading}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleAddClient}
                                    disabled={loading}
                                    className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Cadastrando...' : 'Cadastrar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientManagerSupabase;
