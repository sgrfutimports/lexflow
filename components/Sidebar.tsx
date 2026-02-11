import React from 'react';
import { LayoutDashboard, Users, FileText, Scale, Settings, Files, DollarSign } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Painel de Controle', icon: <LayoutDashboard size={20} /> },
    { id: 'processes', label: 'Gestão de Processos', icon: <Scale size={20} /> },
    { id: 'finance', label: 'Financeiro', icon: <DollarSign size={20} /> },
    { id: 'documents', label: 'Redator Jurídico IA', icon: <FileText size={20} /> },
    { id: 'files', label: 'Nuvem de Documentos', icon: <Files size={20} /> },
    { id: 'clients', label: 'CRM Jurídico', icon: <Users size={20} /> },
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0 border-r border-slate-800">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2 tracking-tight">
          <span className="bg-indigo-600 px-1.5 py-0.5 rounded text-lg">OS</span> LegalOS
        </h1>
        <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-semibold">Enterprise Edition</p>
      </div>

      <nav className="flex-1 px-4 space-y-1.5">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium group
              ${activeTab === item.id
                ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]'
                : 'hover:bg-slate-800 hover:text-white'
              }`}
          >
            <span className={`${activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <button
          onClick={() => setActiveTab('settings')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium
            ${activeTab === 'settings'
              ? 'bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]'
              : 'hover:bg-slate-800 text-slate-300'
            }`}
        >
          <Settings size={20} className={activeTab === 'settings' ? 'text-white' : 'text-slate-400'} />
          Configurações
        </button>
        <div className="mt-4 flex items-center gap-3 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-inner">
            {user?.email?.[0].toUpperCase() || 'U'}
          </div>
          <div>
            <p className="text-xs text-white font-medium">{user?.email || 'Usuário'}</p>
            <p className="text-[10px] text-slate-500">Online</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
