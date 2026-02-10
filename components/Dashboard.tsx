import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Briefcase, AlertTriangle, CheckCircle, Clock, TrendingUp, Lightbulb, Zap } from 'lucide-react';
import AlertDetailsModal from './modals/AlertDetailsModal';
import AllInsightsModal from './modals/AllInsightsModal';

const dataStatus = [
  { name: 'Ativos', value: 45, color: '#4f46e5' }, // Indigo 600
  { name: 'Pendente', value: 15, color: '#f59e0b' }, // Amber 500
  { name: 'Arquivado', value: 30, color: '#64748b' }, // Slate 500
  { name: 'Suspenso', value: 10, color: '#ef4444' }, // Red 500
];

const dataRevenue = [
  { name: 'Jan', revenue: 12000 },
  { name: 'Fev', revenue: 15500 },
  { name: 'Mar', revenue: 18000 },
  { name: 'Abr', revenue: 14000 },
  { name: 'Mai', revenue: 22000 },
  { name: 'Jun', revenue: 25000 },
];

const StatCard = ({ title, value, icon, colorClass, trend }: { title: string, value: string, icon: React.ReactNode, colorClass: string, trend?: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow">
    <div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
      {trend && <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1"><TrendingUp size={12} /> {trend}</p>}
    </div>
    <div className={`p-3 rounded-full ${colorClass}`}>
      {icon}
    </div>
  </div>
);

const SmartFeedItem = ({ type, title, desc, risk, id, onViewDetails, onIgnore }: {
  type: 'Risk' | 'Opportunity' | 'Alert',
  title: string,
  desc: string,
  risk?: string,
  id: string,
  onViewDetails: (id: string) => void,
  onIgnore?: (id: string) => void
}) => (
  <div className="p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors flex gap-4 items-start bg-white">
    <div className={`mt-1 p-2 rounded-lg flex-shrink-0 
        ${type === 'Risk' ? 'bg-rose-100 text-rose-600' : ''}
        ${type === 'Opportunity' ? 'bg-emerald-100 text-emerald-600' : ''}
        ${type === 'Alert' ? 'bg-amber-100 text-amber-600' : ''}
     `}>
      {type === 'Risk' && <AlertTriangle size={18} />}
      {type === 'Opportunity' && <Lightbulb size={18} />}
      {type === 'Alert' && <Zap size={18} />}
    </div>
    <div className="flex-1">
      <div className="flex justify-between items-start">
        <h4 className="text-sm font-bold text-slate-800">{title}</h4>
        {risk && <span className="text-[10px] bg-rose-50 text-rose-600 border border-rose-100 px-2 py-0.5 rounded-full font-bold">RISCO {risk}</span>}
      </div>
      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{desc}</p>
      <div className="mt-2 flex gap-2">
        <button
          onClick={() => onViewDetails(id)}
          className="text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
        >
          Ver Detalhes
        </button>
        {type === 'Risk' && onIgnore && (
          <button
            onClick={() => onIgnore(id)}
            className="text-xs font-medium text-slate-500 hover:text-slate-700"
          >
            Ignorar
          </button>
        )}
      </div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  // Estados para modais
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAllInsightsModal, setShowAllInsightsModal] = useState(false);
  const [ignoredAlerts, setIgnoredAlerts] = useState<string[]>([]);

  // Dados completos dos alertas
  const allAlerts = [
    {
      id: 'alert-1',
      type: 'Risk' as const,
      title: 'Probabilidade de Revelia',
      desc: 'Processo 0045-22: O prazo para contestação expira em 24h e a minuta ainda está em Draft.',
      risk: 'ALTO',
      date: 'Hoje, 14:30',
      details: {
        process: 'Processo 0045-22 - Silva vs Tech Solutions',
        deadline: 'Amanhã, 15:00',
        recommendations: [
          'Finalizar a minuta de contestação imediatamente',
          'Revisar jurisprudência relacionada',
          'Protocolar antes do prazo final'
        ],
        relatedCases: ['Processo 0032-21', 'Processo 0018-22']
      }
    },
    {
      id: 'alert-2',
      type: 'Opportunity' as const,
      title: 'Tese Favorável no STJ',
      desc: 'Nova jurisprudência detectada (Tema 1050) favorece seu argumento no processo da Tech Solutions SA.',
      date: 'Ontem, 10:15',
      details: {
        process: 'Processo 0067-21 - Tech Solutions SA',
        recommendations: [
          'Incluir citação do Tema 1050 nos memoriais',
          'Atualizar estratégia processual',
          'Notificar o cliente sobre a oportunidade'
        ]
      }
    },
    {
      id: 'alert-3',
      type: 'Alert' as const,
      title: 'Inconsistência em Contrato',
      desc: 'A IA detectou cláusula de foro conflitante na minuta \'Contrato Prestação de Serviços v2.pdf\'.',
      date: '2 dias atrás',
      details: {
        recommendations: [
          'Revisar cláusula 15.3 do contrato',
          'Alinhar com cláusula 8.2',
          'Solicitar aprovação do cliente'
        ]
      }
    },
    {
      id: 'alert-4',
      type: 'Risk' as const,
      title: 'Execução Fiscal',
      desc: 'Bloqueio judicial iminente detectado no monitoramento do CNPJ do cliente Grupo Alfa.',
      risk: 'MÉDIO',
      date: '3 dias atrás',
      details: {
        process: 'Execução Fiscal 1234-20',
        deadline: 'Próxima semana',
        recommendations: [
          'Contatar cliente urgentemente',
          'Verificar possibilidade de acordo',
          'Preparar defesa administrativa'
        ],
        relatedCases: ['Processo 0089-19']
      }
    }
  ];

  // Carregar alertas ignorados do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ignoredAlerts');
    if (saved) {
      try {
        setIgnoredAlerts(JSON.parse(saved));
      } catch (error) {
        console.error('Erro ao carregar alertas ignorados:', error);
      }
    }
  }, []);

  // Salvar alertas ignorados no localStorage
  useEffect(() => {
    localStorage.setItem('ignoredAlerts', JSON.stringify(ignoredAlerts));
  }, [ignoredAlerts]);

  // Handlers
  const handleViewDetails = (alertId: string) => {
    const alert = allAlerts.find(a => a.id === alertId);
    if (alert) {
      setSelectedAlert(alert);
      setShowDetailsModal(true);
    }
  };

  const handleIgnoreAlert = (alertId: string) => {
    setIgnoredAlerts([...ignoredAlerts, alertId]);
  };

  const handleResolveAlert = (alertId: string) => {
    // Futuramente: marcar como resolvido no banco
    setIgnoredAlerts([...ignoredAlerts, alertId]);
  };

  // Filtrar alertas visíveis (não ignorados)
  const visibleAlerts = allAlerts.filter(alert => !ignoredAlerts.includes(alert.id));


  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Stat Cards - Command Center */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Processos Ativos"
          value="45"
          icon={<Briefcase size={24} className="text-indigo-600" />}
          colorClass="bg-indigo-50"
          trend="+3 novos"
        />
        <StatCard
          title="Prazos na Semana"
          value="12"
          icon={<Clock size={24} className="text-amber-600" />}
          colorClass="bg-amber-50"
        />
        <StatCard
          title="Produtividade"
          value="94%"
          icon={<CheckCircle size={24} className="text-emerald-600" />}
          colorClass="bg-emerald-50"
          trend="+5% vs mês ant."
        />
        <StatCard
          title="Alertas Críticos"
          value="3"
          icon={<AlertTriangle size={24} className="text-rose-600" />}
          colorClass="bg-rose-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal - Gráficos */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Honorários vs Metas</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dataRevenue}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value / 1000}k`} />
                  <Tooltip
                    cursor={{ fill: '#f1f5f9' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="revenue" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Distribuição</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dataStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {dataStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Próximas Audiências</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-indigo-50 border border-indigo-100">
                  <div className="text-center bg-white rounded p-1 min-w-[40px]">
                    <p className="text-xs text-slate-500 font-bold">OUT</p>
                    <p className="text-sm font-bold text-indigo-700">28</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Conciliação - Caso 998</p>
                    <p className="text-xs text-slate-500">14:30 - Virtual (Zoom)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="text-center bg-white rounded p-1 min-w-[40px]">
                    <p className="text-xs text-slate-500 font-bold">NOV</p>
                    <p className="text-sm font-bold text-slate-700">03</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">Instrução - Trabalhista</p>
                    <p className="text-xs text-slate-500">10:00 - 2ª Vara SP</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna Lateral - Inteligência Estratégica & Feed */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Zap size={20} className="text-amber-500" /> Inteligência & Riscos
              </h3>
              <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">AI Live</span>
            </div>

            <div className="space-y-4">
              <SmartFeedItem
                type="Risk"
                title="Probabilidade de Revelia"
                desc="Processo 0045-22: O prazo para contestação expira em 24h e a minuta ainda está em Draft."
                risk="ALTO"
                id="alert-1"
                onViewDetails={handleViewDetails}
                onIgnore={handleIgnoreAlert}
              />

              <SmartFeedItem
                type="Opportunity"
                title="Tese Favorável no STJ"
                desc="Nova jurisprudência detectada (Tema 1050) favorece seu argumento no processo da Tech Solutions SA."
                id="alert-2"
                onViewDetails={handleViewDetails}
              />

              <SmartFeedItem
                type="Alert"
                title="Inconsistência em Contrato"
                desc="A IA detectou cláusula de foro conflitante na minuta 'Contrato Prestação de Serviços v2.pdf'."
                id="alert-3"
                onViewDetails={handleViewDetails}
              />

              <SmartFeedItem
                type="Risk"
                title="Execução Fiscal"
                desc="Bloqueio judicial iminente detectado no monitoramento do CNPJ do cliente Grupo Alfa."
                risk="MÉDIO"
                id="alert-4"
                onViewDetails={handleViewDetails}
                onIgnore={handleIgnoreAlert}
              />
            </div>

            <button
              onClick={() => setShowAllInsightsModal(true)}
              className="w-full mt-6 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Ver todos os insights
            </button>
          </div>
        </div>
      </div>

      {/* Modais */}
      <AlertDetailsModal
        alert={selectedAlert}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        onIgnore={handleIgnoreAlert}
        onResolve={handleResolveAlert}
      />

      <AllInsightsModal
        alerts={allAlerts}
        isOpen={showAllInsightsModal}
        onClose={() => setShowAllInsightsModal(false)}
        onSelectAlert={(alert) => {
          setSelectedAlert(alert);
          setShowDetailsModal(true);
        }}
        ignoredAlerts={ignoredAlerts}
      />
    </div>
  );
};

export default Dashboard;
