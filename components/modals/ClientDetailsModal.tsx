import React, { useState } from 'react';
import { X, User, Briefcase, DollarSign, FileText, Edit2, Save } from 'lucide-react';

interface Client {
    id: string;
    name: string;
    type: 'PF' | 'PJ';
    document: string;
    email: string;
    phone: string;
    activeCases: number;
}

interface ClientDetailsModalProps {
    client: Client | null;
    isOpen: boolean;
    onClose: () => void;
    onSave?: (client: Client) => void;
}

const ClientDetailsModal: React.FC<ClientDetailsModalProps> = ({
    client,
    isOpen,
    onClose,
    onSave
}) => {
    const [activeTab, setActiveTab] = useState<'info' | 'cases' | 'financial' | 'documents'>('info');
    const [isEditing, setIsEditing] = useState(false);
    const [editedClient, setEditedClient] = useState<Client | null>(null);

    if (!isOpen || !client) return null;

    const currentClient = isEditing ? editedClient : client;

    const handleEdit = () => {
        setEditedClient({ ...client });
        setIsEditing(true);
    };

    const handleSave = () => {
        if (editedClient && onSave) {
            onSave(editedClient);
        }
        setIsEditing(false);
        onClose();
    };

    const handleCancel = () => {
        setEditedClient(null);
        setIsEditing(false);
    };

    const tabs = [
        { id: 'info' as const, label: 'Informações', icon: <User size={16} /> },
        { id: 'cases' as const, label: 'Processos', icon: <Briefcase size={16} /> },
        { id: 'financial' as const, label: 'Financeiro', icon: <DollarSign size={16} /> },
        { id: 'documents' as const, label: 'Documentos', icon: <FileText size={16} /> }
    ];

    // Dados mockados para demonstração
    const mockCases = [
        { id: '1', number: '0045-22', title: 'Silva vs Tech Solutions', status: 'Ativo', nextDeadline: '15/02/2026' },
        { id: '2', number: '0032-21', title: 'Contrato de Prestação', status: 'Em Análise', nextDeadline: '20/02/2026' }
    ];

    const mockFinancial = [
        { id: '1', description: 'Honorários - Processo 0045-22', amount: 5000, status: 'Pago', date: '01/02/2026' },
        { id: '2', description: 'Honorários - Processo 0032-21', amount: 3500, status: 'Pendente', date: '10/02/2026' }
    ];

    const mockDocuments = [
        { id: '1', name: 'Procuração.pdf', date: '05/01/2026', size: '245 KB' },
        { id: '2', name: 'RG_CPF.pdf', date: '05/01/2026', size: '1.2 MB' },
        { id: '3', name: 'Comprovante_Residencia.pdf', date: '05/01/2026', size: '890 KB' }
    ];

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800">{currentClient?.name}</h2>
                                <p className="text-sm text-slate-600 mt-1">
                                    {currentClient?.type === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'} • {currentClient?.document}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                {!isEditing && (
                                    <button
                                        onClick={handleEdit}
                                        className="p-2 hover:bg-white/50 rounded-lg transition-colors flex items-center gap-2 text-indigo-600"
                                    >
                                        <Edit2 size={18} />
                                        <span className="text-sm font-medium">Editar</span>
                                    </button>
                                )}
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-2 mt-4">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === tab.id
                                            ? 'bg-white text-indigo-600 shadow-sm'
                                            : 'text-slate-600 hover:bg-white/50'
                                        }`}
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
                        {/* Tab: Informações */}
                        {activeTab === 'info' && (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-semibold text-slate-700 block mb-2">Nome Completo</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={editedClient?.name || ''}
                                                onChange={(e) => setEditedClient({ ...editedClient!, name: e.target.value })}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        ) : (
                                            <p className="text-slate-600">{currentClient?.name}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-slate-700 block mb-2">
                                            {currentClient?.type === 'PF' ? 'CPF' : 'CNPJ'}
                                        </label>
                                        <p className="text-slate-600">{currentClient?.document}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-semibold text-slate-700 block mb-2">Email</label>
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                value={editedClient?.email || ''}
                                                onChange={(e) => setEditedClient({ ...editedClient!, email: e.target.value })}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        ) : (
                                            <p className="text-slate-600">{currentClient?.email}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-slate-700 block mb-2">Telefone</label>
                                        {isEditing ? (
                                            <input
                                                type="tel"
                                                value={editedClient?.phone || ''}
                                                onChange={(e) => setEditedClient({ ...editedClient!, phone: e.target.value })}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            />
                                        ) : (
                                            <p className="text-slate-600">{currentClient?.phone}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-slate-700 block mb-2">Processos Ativos</label>
                                    <p className="text-slate-600">{currentClient?.activeCases}</p>
                                </div>
                            </div>
                        )}

                        {/* Tab: Processos */}
                        {activeTab === 'cases' && (
                            <div className="space-y-3">
                                {mockCases.map((caso) => (
                                    <div key={caso.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-semibold text-slate-800">{caso.title}</h4>
                                                <p className="text-sm text-slate-500">Processo {caso.number}</p>
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${caso.status === 'Ativo' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                                                }`}>
                                                {caso.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-600">Próximo prazo: {caso.nextDeadline}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Tab: Financeiro */}
                        {activeTab === 'financial' && (
                            <div className="space-y-3">
                                {mockFinancial.map((item) => (
                                    <div key={item.id} className="p-4 border border-slate-200 rounded-lg">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-semibold text-slate-800">{item.description}</h4>
                                                <p className="text-sm text-slate-500">{item.date}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-slate-800">R$ {item.amount.toLocaleString('pt-BR')}</p>
                                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${item.status === 'Pago' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Tab: Documentos */}
                        {activeTab === 'documents' && (
                            <div className="space-y-3">
                                {mockDocuments.map((doc) => (
                                    <div key={doc.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <FileText size={20} className="text-indigo-600" />
                                            <div>
                                                <h4 className="font-semibold text-slate-800">{doc.name}</h4>
                                                <p className="text-sm text-slate-500">{doc.date} • {doc.size}</p>
                                            </div>
                                        </div>
                                        <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                                            Download
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                                >
                                    <Save size={18} />
                                    Salvar Alterações
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors"
                            >
                                Fechar
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ClientDetailsModal;
