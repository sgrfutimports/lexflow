import React, { useState } from 'react';
import { FinancialTransaction } from '../types';
import { DollarSign, TrendingUp, TrendingDown, Calendar, Download, Filter, Plus, X, Search, Edit, Trash2, CreditCard, FileText } from 'lucide-react';
import { generateFinancialReport } from '../utils/pdfGenerator';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useToast, ToastContainer } from './Toast';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from 'recharts';

const initialTransactions: FinancialTransaction[] = [
  { id: '1', type: 'Receita', category: 'Honorários Contratuais', description: 'Entrada - Ação Silva vs Souza', amount: 15000, date: '2023-10-25', status: 'Pago', caseId: '1' },
  { id: '2', type: 'Despesa', category: 'Custas', description: 'Guia de Preparo - Recurso 4432', amount: 890.50, date: '2023-10-24', status: 'Pago', caseId: '2' },
  { id: '3', type: 'Receita', category: 'Honorários Sucumbenciais', description: 'Proc. 1002003-99', amount: 4500, date: '2023-10-20', status: 'Pendente' },
  { id: '4', type: 'Despesa', category: 'Operacional', description: 'Aluguel Escritório', amount: 3500, date: '2023-10-05', status: 'Pago' },
  { id: '5', type: 'Receita', category: 'Honorários Contratuais', description: 'Mensalidade - Tech Solutions', amount: 5000, date: '2023-10-01', status: 'Atrasado' },
];

const cashFlowData = [
  { name: 'Jan', entrada: 25000, saida: 12000 },
  { name: 'Fev', entrada: 32000, saida: 14000 },
  { name: 'Mar', entrada: 28000, saida: 11000 },
  { name: 'Abr', entrada: 45000, saida: 18000 },
  { name: 'Mai', entrada: 38000, saida: 15000 },
  { name: 'Jun', entrada: 52000, saida: 20000 },
];

const FinanceManager: React.FC = () => {
  const [transactions, setTransactions] = useLocalStorage<FinancialTransaction[]>('lexflow_transactions', initialTransactions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  // New Transaction Form
  const [newDesc, setNewDesc] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newType, setNewType] = useState<'Receita' | 'Despesa'>('Receita');
  const [newCategory, setNewCategory] = useState('Honorários Contratuais');
  const [newStatus, setNewStatus] = useState<'Pago' | 'Pendente' | 'Atrasado'>('Pago');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);

  const handleAddTransaction = () => {
    if (!newDesc || !newAmount) return;

    const newTrans: FinancialTransaction = {
      id: Date.now().toString(),
      type: newType,
      category: newCategory as any,
      description: newDesc,
      amount: parseFloat(newAmount),
      date: newDate,
      status: newStatus
    };

    setTransactions([newTrans, ...transactions]);
    addToast(`${newType} registrada com sucesso!`, 'success');
    setIsModalOpen(false);

    // Reset Form
    setNewDesc('');
    setNewAmount('');
    setNewType('Receita');
    setNewStatus('Pago');
  };

  // Dynamic Calculations
  const totalRevenue = transactions
    .filter(t => t.type === 'Receita' && t.status === 'Pago')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'Despesa' && t.status === 'Pago')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalPending = transactions
    .filter(t => t.type === 'Receita' && (t.status === 'Pendente' || t.status === 'Atrasado'))
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netIncome = totalRevenue - totalExpense;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Gestão Financeira</h2>
          <p className="text-sm text-slate-500">Controle de honorários, custas e fluxo de caixa.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              generateFinancialReport(
                transactions.map(t => ({
                  ...t,
                  client: t.caseId || '-',
                  category: t.category
                })),
                {
                  title: 'Relatório Financeiro',
                  period: 'Período Completo',
                  includeCharts: true
                }
              );
              addToast('Relatório gerado com sucesso!', 'success');
            }}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm font-medium text-slate-700"
          >
            <Download size={18} /> Relatórios
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Plus size={18} /> Nova Transação
          </button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp size={64} className="text-emerald-600" />
          </div>
          <p className="text-sm font-medium text-slate-500">Receita Total</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-2 inline-block">Confirmado</span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingDown size={64} className="text-rose-600" />
          </div>
          <p className="text-sm font-medium text-slate-500">Despesas</p>
          <p className="text-2xl font-bold text-rose-600 mt-1">R$ {totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <span className="text-xs text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full mt-2 inline-block">Pagas</span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CreditCard size={64} className="text-indigo-600" />
          </div>
          <p className="text-sm font-medium text-slate-500">A Receber</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">R$ {totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <span className="text-xs text-slate-500 mt-2 inline-block">Pendente / Atrasado</span>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden group">
          <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign size={64} className="text-amber-600" />
          </div>
          <p className="text-sm font-medium text-slate-500">Lucro Líquido</p>
          <p className={`text - 2xl font - bold mt - 1 ${netIncome >= 0 ? 'text-emerald-600' : 'text-rose-600'} `}>R$ {netIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <span className="text-xs text-slate-400 mt-2 inline-block">Resultado operacional</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Fluxo de Caixa */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Fluxo de Caixa Semestral</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashFlowData}>
                <defs>
                  <linearGradient id="colorEntrada" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSaida" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e11d48" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(val) => `R$${val / 1000} k`} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="entrada" stroke="#059669" strokeWidth={2} fillOpacity={1} fill="url(#colorEntrada)" name="Receitas" />
                <Area type="monotone" dataKey="saida" stroke="#e11d48" strokeWidth={2} fillOpacity={1} fill="url(#colorSaida)" name="Despesas" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribuição de Receita */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Fontes de Receita</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">Honorários Mensais (Partidos)</span>
                <span className="font-medium text-slate-800">65%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">Honorários Iniciais/Êxito</span>
                <span className="font-medium text-slate-800">25%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-600">Sucumbência</span>
                <span className="font-medium text-slate-800">10%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-100">
            <h4 className="text-sm font-semibold text-slate-700 mb-2">Meta Financeira Mensal</h4>
            <p className="text-3xl font-bold text-slate-800">82%</p>
            <p className="text-xs text-slate-500 mt-1">Faltam R$ 12.500 para atingir a meta.</p>
          </div>
        </div>
      </div>

      {/* Tabela de Transações Recentes */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-semibold text-slate-800">Transações Recentes</h3>
          <button
            onClick={() => alert('Filtros avançados em desenvolvimento')}
            className="text-slate-500 hover:text-indigo-600 p-2 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Filter size={18} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Descrição / Categoria</th>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Valor</th>
                <th className="px-6 py-4 text-center">Recibo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-800">{t.description}</span>
                      <span className="text-xs text-slate-500">{t.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{t.date}</td>
                  <td className="px-6 py-4">
                    <span className={`inline - flex items - center px - 2.5 py - 0.5 rounded - full text - xs font - medium border
                        ${t.status === 'Pago' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}
                        ${t.status === 'Pendente' ? 'bg-amber-50 text-amber-700 border-amber-200' : ''}
                        ${t.status === 'Atrasado' ? 'bg-rose-50 text-rose-700 border-rose-200' : ''}
`}>
                      {t.status}
                    </span>
                  </td>
                  <td className={`px - 6 py - 4 text - right font - medium ${t.type === 'Receita' ? 'text-emerald-600' : 'text-rose-600'} `}>
                    {t.type === 'Receita' ? '+' : '-'} R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => alert('Visualização de documento em desenvolvimento')}
                      className="text-slate-400 hover:text-indigo-600 p-1"
                    >
                      <FileText size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <DollarSign size={20} className="text-emerald-600" /> Nova Transação
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="Receita">Receita</option>
                    <option value="Despesa">Despesa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Valor (R$)</label>
                  <input
                    type="number"
                    value={newAmount}
                    onChange={e => setNewAmount(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="0,00"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
                <input
                  type="text"
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Ex: Honorários Processo X..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                >
                  <option>Honorários Contratuais</option>
                  <option>Honorários Sucumbenciais</option>
                  <option>Custas</option>
                  <option>Operacional</option>
                  <option>Software</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Data</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={e => setNewStatus(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="Pago">Pago / Recebido</option>
                    <option value="Pendente">Pendente</option>
                    <option value="Atrasado">Atrasado</option>
                  </select>
                </div>
              </div>
              <button
                onClick={handleAddTransaction}
                disabled={!newDesc || !newAmount}
                className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
              >
                Registrar Transação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceManager;