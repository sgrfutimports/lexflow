import React, { useState, useEffect } from 'react';
import { Case, CaseStatus, Task } from '../types';
import { Search, Filter, MoreHorizontal, FolderOpen, ClipboardList, Plus, X, Calendar, User, CheckSquare, Square, Trash2, Flag, DollarSign, Briefcase, History, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useToast, ToastContainer } from './Toast';
import EditCaseModal from './modals/EditCaseModal';

const initialCases: Case[] = [
  { id: '1', number: '0001234-55.2023.8.26.0100', title: 'Ação de Cobrança - Silva vs. Souza', client: 'João da Silva', court: 'TJSP - 14ª Vara Cível', status: CaseStatus.ACTIVE, nextDeadline: '2023-11-15', value: 45000 },
  { id: '2', number: '0054321-11.2023.8.26.0000', title: 'Divórcio Litigioso - Família Oliveira', client: 'Maria Oliveira', court: 'TJSP - 2ª Vara Família', status: CaseStatus.PENDING, nextDeadline: '2023-11-20', value: 0 },
  { id: '3', number: '1002003-99.2022.5.02.0001', title: 'Reclamação Trabalhista - Costa vs Tech Ltda', client: 'Pedro Costa', court: 'TRT-2', status: CaseStatus.ACTIVE, nextDeadline: '2023-11-05', value: 120000 },
  { id: '4', number: '5552221-33.2021.4.03.6100', title: 'Mandado de Segurança - Tributário', client: 'Tech Solutions SA', court: 'TRF-3', status: CaseStatus.SUSPENDED, nextDeadline: '—', value: 500000 },
  { id: '5', number: '0000001-22.2020.8.26.0500', title: 'Inventário - Espólio Santos', client: 'Ana Santos', court: 'TJSP', status: CaseStatus.ARCHIVED, nextDeadline: '—', value: 2500000 },
];

const initialTasks: Task[] = [
  { id: '101', caseId: '1', description: 'Protocolar réplica', deadline: '2023-11-14', assignee: 'Dr. Carlos', completed: false, priority: 'Alta', billable: true, value: 1500 },
  { id: '102', caseId: '1', description: 'Reunião com cliente', deadline: '2023-11-10', assignee: 'Dra. Ana', completed: true, priority: 'Média' },
  { id: '103', caseId: '3', description: 'Calcular verbas rescisórias', deadline: '2023-11-04', assignee: 'Dr. Carlos', completed: false, priority: 'Alta', billable: true, value: 800 },
];

const CaseManager: React.FC = () => {
  const [cases, setCases] = useLocalStorage<Case[]>('lexflow_cases', initialCases);
  const [tasks, setTasks] = useLocalStorage<Task[]>('lexflow_tasks', initialTasks);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);
  const { toasts, addToast, removeToast } = useToast();

  // Modals State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<Case | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Form State for new Task
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskDeadline, setNewTaskDeadline] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'Alta' | 'Média' | 'Baixa'>('Média');

  // New Financial Fields for Task
  const [newTaskBillable, setNewTaskBillable] = useState(false);
  const [newTaskValue, setNewTaskValue] = useState('');

  // Form State for New Case
  const [newCaseNumber, setNewCaseNumber] = useState('');
  const [newCaseTitle, setNewCaseTitle] = useState('');
  const [newCaseClient, setNewCaseClient] = useState('');
  const [newCaseCourt, setNewCaseCourt] = useState('');
  const [newCaseValue, setNewCaseValue] = useState('');

  const openTaskModal = (c: Case) => {
    setSelectedCase(c);
    setIsTaskModalOpen(true);
    resetTaskForm();
  };

  const resetTaskForm = () => {
    setNewTaskDesc('');
    setNewTaskDeadline('');
    setNewTaskAssignee('');
    setNewTaskPriority('Média');
    setNewTaskBillable(false);
    setNewTaskValue('');
  };

  const handleAddTask = () => {
    if (!selectedCase || !newTaskDesc || !newTaskDeadline) return;

    const newTask: Task = {
      id: Date.now().toString(),
      caseId: selectedCase.id,
      description: newTaskDesc,
      deadline: newTaskDeadline,
      assignee: newTaskAssignee || 'Não atribuído',
      completed: false,
      priority: newTaskPriority,
      billable: newTaskBillable,
      value: newTaskBillable && newTaskValue ? parseFloat(newTaskValue) : undefined
    };

    setTasks([...tasks, newTask]);
    addToast('Tarefa adicionada com sucesso!', 'success');
    resetTaskForm();
  };

  const handleAddCase = () => {
    if (!newCaseTitle || !newCaseClient) return;

    const newCase: Case = {
      id: Date.now().toString(),
      number: newCaseNumber || 'Em autuação',
      title: newCaseTitle,
      client: newCaseClient,
      court: newCaseCourt || 'Não distribuído',
      status: CaseStatus.ACTIVE,
      nextDeadline: '—',
      value: newCaseValue ? parseFloat(newCaseValue) : 0
    };

    setCases([newCase, ...cases]);
    addToast('Processo criado com sucesso!', 'success');
    setIsNewCaseModalOpen(false);
    resetNewCaseForm();
  };

  const handleEditCase = (updatedCase: Case) => {
    setCases(cases.map(c => c.id === updatedCase.id ? updatedCase : c));
    addToast('Processo atualizado com sucesso!', 'success');
  };

  const resetNewCaseForm = () => {
    setNewCaseNumber('');
    setNewCaseTitle('');
    setNewCaseClient('');
    setNewCaseCourt('');
    setNewCaseValue('');
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
    addToast('Tarefa removida', 'info');
  };

  const getTasksForCase = (caseId: string) => tasks.filter(t => t.caseId === caseId);

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'Alta': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Média': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Baixa': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  // Helper render function to avoid code duplication in render
  const renderTaskItem = (task: Task) => (
    <div key={task.id} className={`group flex items-start gap-3 p-4 rounded-xl border transition-all shadow-sm ${task.completed ? 'bg-slate-50 border-slate-100 opacity-80' : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'}`}>
      <button
        onClick={() => toggleTaskCompletion(task.id)}
        className={`mt-1 flex-shrink-0 transition-colors ${task.completed ? 'text-emerald-500' : 'text-slate-300 hover:text-indigo-500'}`}
      >
        {task.completed ? <CheckSquare size={20} /> : <Square size={20} />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <p className={`text-sm font-medium break-words ${task.completed ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
            {task.description}
          </p>
          <button onClick={() => deleteTask(task.id)} className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity">
            <Trash2 size={16} />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-2">
          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium flex items-center gap-1 ${getPriorityColor(task.priority)}`}>
            <Flag size={10} /> {task.priority}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            <Calendar size={12} /> {task.deadline}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            <User size={12} /> {task.assignee}
          </span>
          {task.billable && task.value !== undefined && (
            <span className="flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
              <DollarSign size={10} /> R$ {task.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  // Filtrar processos por busca
  const filteredCases = cases.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 relative">
      <EditCaseModal
        caseData={editingCase}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingCase(null);
        }}
        onSave={handleEditCase}
      />

      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Gestão de Processos</h2>
        <button
          onClick={() => setIsNewCaseModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <FolderOpen size={18} /> Novo Processo
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por número, cliente ou título..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 px-3 py-2 border border-slate-200 rounded-lg hover:border-indigo-300 transition-colors">
            <Filter size={18} /> Filtrar
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Processo / Título</th>
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">Vara / Tribunal</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Tarefas Pendentes</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCases.map((processo) => {
                const caseTasks = getTasksForCase(processo.id);
                const pendingCount = caseTasks.filter(t => !t.completed).length;

                return (
                  <tr key={processo.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-800">{processo.title}</span>
                        <span className="text-xs text-slate-500 font-mono mt-1">{processo.number}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{processo.client}</td>
                    <td className="px-6 py-4 text-slate-600 text-sm">{processo.court}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                        ${processo.status === CaseStatus.ACTIVE ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : ''}
                        ${processo.status === CaseStatus.PENDING ? 'bg-amber-50 text-amber-700 border-amber-200' : ''}
                        ${processo.status === CaseStatus.ARCHIVED ? 'bg-slate-100 text-slate-600 border-slate-200' : ''}
                        ${processo.status === CaseStatus.SUSPENDED ? 'bg-rose-50 text-rose-700 border-rose-200' : ''}
                      `}>
                        {processo.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {pendingCount > 0 ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
                          <ClipboardList size={14} /> {pendingCount} Pendentes
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 flex items-center gap-1"><CheckSquare size={14} /> Em dia</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openTaskModal(processo)}
                          className="p-2 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 rounded-lg transition-colors tooltip"
                          title="Gerenciar Tarefas"
                        >
                          <ClipboardList size={18} />
                        </button>
                        <div className="relative">
                          <button
                            onClick={() => setOpenActionMenu(openActionMenu === processo.id ? null : processo.id)}
                            className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
                          >
                            <MoreHorizontal size={18} />
                          </button>

                          {openActionMenu === processo.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setOpenActionMenu(null)}
                              />
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20">
                                <button
                                  onClick={() => {
                                    const caseToEdit = cases.find(c => c.id === processo.id);
                                    if (caseToEdit) {
                                      setEditingCase(caseToEdit);
                                      setShowEditModal(true);
                                    }
                                    setOpenActionMenu(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  Editar
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm(`Tem certeza que deseja excluir o processo "${processo.title}"?`)) {
                                      setCases(cases.filter(c => c.id !== processo.id));
                                      setTasks(tasks.filter(t => t.caseId !== processo.id));
                                    }
                                    setOpenActionMenu(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  Excluir
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Case Modal */}
      {isNewCaseModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Briefcase size={20} className="text-indigo-600" /> Cadastrar Novo Processo
              </h3>
              <button
                onClick={() => setIsNewCaseModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Título da Ação</label>
                <input type="text" className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ex: Ação de Danos Morais..." value={newCaseTitle} onChange={e => setNewCaseTitle(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Número CNJ</label>
                  <input type="text" className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="0000000-00.0000.0.00.0000" value={newCaseNumber} onChange={e => setNewCaseNumber(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Valor da Causa (R$)</label>
                  <input type="number" className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="0,00" value={newCaseValue} onChange={e => setNewCaseValue(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cliente</label>
                <input type="text" className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Nome do cliente" value={newCaseClient} onChange={e => setNewCaseClient(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Vara / Tribunal</label>
                <input type="text" className="w-full p-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ex: 1ª Vara Cível de SP" value={newCaseCourt} onChange={e => setNewCaseCourt(e.target.value)} />
              </div>

              <button
                onClick={handleAddCase}
                disabled={!newCaseTitle || !newCaseClient}
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
              >
                Cadastrar Processo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Modal */}
      {isTaskModalOpen && selectedCase && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Gestão de Tarefas</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{selectedCase.number}</span>
                  <span className="text-sm text-slate-600 truncate max-w-[300px]">{selectedCase.title}</span>
                </div>
              </div>
              <button
                onClick={() => setIsTaskModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
              {/* Split Tasks into Pending and Completed */}
              {(() => {
                const caseTasks = getTasksForCase(selectedCase.id);
                const pendingTasks = caseTasks.filter(t => !t.completed);
                const completedTasks = caseTasks.filter(t => t.completed);

                return (
                  <div className="space-y-8">
                    {/* Seção Pendentes */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                          <ClipboardList size={16} className="text-indigo-600" /> Tarefas Pendentes
                        </h4>
                        <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium">{pendingTasks.length}</span>
                      </div>

                      {pendingTasks.length === 0 ? (
                        <div className="text-center py-6 bg-white rounded-xl border border-dashed border-slate-300">
                          <CheckSquare className="mx-auto text-emerald-500 mb-2" size={24} />
                          <p className="text-sm text-slate-500 font-medium">Tudo em dia!</p>
                          <p className="text-xs text-slate-400">Nenhuma tarefa pendente para este processo.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {pendingTasks.map(task => renderTaskItem(task))}
                        </div>
                      )}
                    </div>

                    {/* Seção Concluídas (Histórico) */}
                    {completedTasks.length > 0 && (
                      <div className="pt-6 border-t border-slate-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <History size={16} /> Histórico de Conclusão
                          </h4>
                          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{completedTasks.length}</span>
                        </div>
                        <div className="space-y-3">
                          {completedTasks.map(task => renderTaskItem(task))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Add Task Form */}
            <div className="p-6 bg-white border-t border-slate-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
              <h4 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                <Plus size={16} className="text-indigo-600" /> Adicionar Nova Tarefa
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-12">
                  <input
                    type="text"
                    placeholder="Descrição da tarefa (ex: Protocolar Petição Inicial)"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                    value={newTaskDesc}
                    onChange={(e) => setNewTaskDesc(e.target.value)}
                  />
                </div>
                <div className="md:col-span-4">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Calendar size={14} /></span>
                    <input
                      type="date"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-600"
                      value={newTaskDeadline}
                      onChange={(e) => setNewTaskDeadline(e.target.value)}
                    />
                  </div>
                </div>
                <div className="md:col-span-4">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><User size={14} /></span>
                    <input
                      type="text"
                      placeholder="Responsável"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      value={newTaskAssignee}
                      onChange={(e) => setNewTaskAssignee(e.target.value)}
                    />
                  </div>
                </div>
                <div className="md:col-span-4">
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as 'Alta' | 'Média' | 'Baixa')}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-600"
                  >
                    <option value="Alta">Alta Prioridade</option>
                    <option value="Média">Média Prioridade</option>
                    <option value="Baixa">Baixa Prioridade</option>
                  </select>
                </div>

                {/* Seção Financeira */}
                <div className="md:col-span-12 mt-2 pt-2 border-t border-slate-100">
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={newTaskBillable}
                        onChange={(e) => setNewTaskBillable(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      Vincular honorários/custos a esta tarefa?
                    </label>

                    {newTaskBillable && (
                      <div className="relative w-full md:w-48 animate-in slide-in-from-left-2 fade-in duration-200">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600 font-bold text-xs">R$</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="Valor (0,00)"
                          className="w-full pl-8 pr-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-emerald-800 placeholder-emerald-800/50"
                          value={newTaskValue}
                          onChange={(e) => setNewTaskValue(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={handleAddTask}
                disabled={!newTaskDesc || !newTaskDeadline}
                className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow active:scale-[0.99]"
              >
                Adicionar Tarefa ao Processo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseManager;