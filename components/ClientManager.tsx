import React, { useState } from 'react';
import { Client } from '../types';
import { UserPlus, Mail, Phone, FileText, X, Briefcase } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useToast, ToastContainer } from './Toast';

const initialClients: Client[] = [];

const ClientManager: React.FC = () => {
  const [clients, setClients] = useLocalStorage<Client[]>('lexflow_clients', initialClients);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  // New Client Form State
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<'PF' | 'PJ'>('PF');
  const [newDocument, setNewDocument] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const handleAddClient = () => {
    if (!newName || !newDocument) return;

    const newClient: Client = {
      id: Date.now().toString(),
      name: newName,
      type: newType,
      document: newDocument,
      email: newEmail,
      phone: newPhone,
      activeCases: 0
    };

    setClients([newClient, ...clients]);
    addToast('Cliente cadastrado com sucesso!', 'success');
    setIsModalOpen(false);

    // Reset Form
    setNewName('');
    setNewType('PF');
    setNewDocument('');
    setNewEmail('');
    setNewPhone('');
  };

  return (
    <div className="space-y-6">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Carteira de Clientes</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <UserPlus size={18} /> Novo Cliente
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <div key={client.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                  {client.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{client.name}</h3>
                  <span className="text-xs text-slate-500 px-2 py-0.5 bg-slate-100 rounded-full">{client.type}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-slate-400" />
                <span>{client.document}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-slate-400" />
                <a href={`mailto:${client.email}`} className="hover:text-indigo-600 transition-colors">{client.email || 'Não informado'}</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-slate-400" />
                <span>{client.phone || 'Não informado'}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
              <span className="text-sm font-medium text-slate-600">{client.activeCases} Processos Ativos</span>
              <button
                onClick={() => alert(`Detalhes do cliente ${client.name} em desenvolvimento`)}
                className="text-sm text-indigo-600 font-medium hover:underline"
              >
                Ver Detalhes
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <UserPlus size={20} className="text-indigo-600" /> Adicionar Cliente
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo / Razão Social</label>
                <input
                  type="text"
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
                  <select
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newType}
                    onChange={e => setNewType(e.target.value as 'PF' | 'PJ')}
                  >
                    <option value="PF">Pessoa Física</option>
                    <option value="PJ">Pessoa Jurídica</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">CPF / CNPJ</label>
                  <input
                    type="text"
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newDocument}
                    onChange={e => setNewDocument(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Telefone</label>
                <input
                  type="tel"
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value)}
                />
              </div>
              <button
                onClick={handleAddClient}
                disabled={!newName || !newDocument}
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
              >
                Salvar Cliente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientManager;