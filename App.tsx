import React, { useState, Suspense } from 'react';
import Sidebar from './components/Sidebar';
import MobileMenu from './components/MobileMenu';
import AIAssistant from './components/AIAssistant';
import Login from './components/Login';
import Register from './components/Register';
import { useAuth } from './hooks/useAuth';
import { Bot, Bell, Search, LogOut, Menu } from 'lucide-react';

// Lazy loading components for performance optimization
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const DocumentGenerator = React.lazy(() => import('./components/DocumentGenerator'));
const CaseManager = React.lazy(() => import('./components/CaseManager'));
const ClientManager = React.lazy(() => import('./components/ClientManager'));
const DocManager = React.lazy(() => import('./components/DocManager'));
const FinanceManager = React.lazy(() => import('./components/FinanceManager'));

const LoadingFallback = () => (
  <div className="h-full flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto mb-4"></div>
      <p className="text-slate-500 text-sm">Carregando módulo...</p>
    </div>
  </div>
);

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading, signOut } = useAuth();

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Mostrar Login/Register se não autenticado
  if (!user) {
    if (showRegister) {
      return <Register onSuccess={() => setShowRegister(false)} onBackToLogin={() => setShowRegister(false)} />;
    }
    return <Login onSuccess={() => { }} onRegisterClick={() => setShowRegister(true)} />;
  }


  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'documents': return <DocumentGenerator />;
      case 'processes': return <CaseManager />;
      case 'clients': return <ClientManager />;
      case 'files': return <DocManager />;
      case 'finance': return <FinanceManager />;
      default: return <Dashboard />;
    }
  };

  const getPageTitle = () => {
    const titles: Record<string, string> = {
      dashboard: 'Legal Command Center',
      documents: 'Legal AI Writer',
      processes: 'Gestão de Processos',
      clients: 'CRM Jurídico',
      files: 'Legal Document Cloud',
      finance: 'Sistema Financeiro Integrado'
    };
    return titles[activeTab] || 'Dashboard';
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex-1 flex flex-col max-h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-100 py-4 px-4 md:px-8 flex justify-between items-center shadow-sm z-10">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu size={24} className="text-slate-700" />
            </button>

            <h2 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">
              {getPageTitle()}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Busca global (Processos, Docs...)"
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
              <button className="relative p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-full transition-all">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>
              <button
                onClick={() => setIsChatOpen(!isChatOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm border
                  ${isChatOpen
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-indigo-200'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:shadow-md'
                  }`}
              >
                <Bot size={18} className={isChatOpen ? 'text-white' : 'text-indigo-600'} />
                <span>AI Assistant</span>
              </button>
              <button
                onClick={signOut}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-white text-slate-700 border border-slate-200 hover:border-rose-300 hover:shadow-md transition-all"
                title="Sair"
              >
                <LogOut size={18} className="text-rose-500" />
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <Suspense fallback={<LoadingFallback />}>
              {renderContent()}
            </Suspense>
          </div>
        </div>
      </main>

      <AIAssistant isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default App;
