import { useLocalStorage } from '../hooks/useLocalStorage';
import { Case, CaseStatus, FinancialTransaction } from '../types';

// ... inside Dashboard component ...
const [cases] = useLocalStorage<Case[]>('lexflow_cases', []);
const [transactions] = useLocalStorage<FinancialTransaction[]>('lexflow_transactions', []);

// Calculate Stats
const activeCases = cases.filter(c => c.status === CaseStatus.ACTIVE).length;
// Mock calculation for deadline (replace with real logic if available)
const deadlinesThisWeek = cases.filter(c => c.nextDeadline !== '—').length;

const totalRevenue = transactions
  .filter(t => t.type === 'Receita' && t.status === 'Pago')
  .reduce((acc, curr) => acc + curr.amount, 0);

// Dynamic Data for Charts (Simplified for verify step)
const dataStatus = [
  { name: 'Ativos', value: cases.filter(c => c.status === CaseStatus.ACTIVE).length, color: '#4f46e5' },
  { name: 'Pendente', value: cases.filter(c => c.status === CaseStatus.PENDING).length, color: '#f59e0b' },
  { name: 'Arquivado', value: cases.filter(c => c.status === CaseStatus.ARCHIVED).length, color: '#64748b' },
  { name: 'Suspenso', value: cases.filter(c => c.status === CaseStatus.SUSPENDED).length, color: '#ef4444' },
].filter(item => item.value > 0); // Only show statuses with data

// Fallback if no data
if (dataStatus.length === 0) {
  dataStatus.push({ name: 'Sem dados', value: 1, color: '#e2e8f0' });
}

return (
  <div className="space-y-6 animate-in fade-in duration-500">

    {/* Stat Cards - Command Center */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Processos Ativos"
        value={activeCases.toString()}
        icon={<Briefcase size={24} className="text-indigo-600" />}
        colorClass="bg-indigo-50"
        trend={activeCases > 0 ? "Atualizado" : "Sem dados"}
      />
      <StatCard
        title="Prazos na Semana"
        value={deadlinesThisWeek.toString()}
        icon={<Clock size={24} className="text-amber-600" />}
        colorClass="bg-amber-50"
      />
      <StatCard
        title="Receita Total"
        value={`R$ ${totalRevenue.toLocaleString('pt-BR', { notation: 'compact' })}`}
        icon={<TrendingUp size={24} className="text-emerald-600" />}
        colorClass="bg-emerald-50"
        trend="Acumulado"
      />
      <StatCard
        title="Alertas Críticos"
        value={allAlerts.filter(a => a.type === 'Risk').length.toString()}
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
