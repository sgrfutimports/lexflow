import React, { useState } from 'react';
import { X, Search, Filter, AlertTriangle, Lightbulb, Zap } from 'lucide-react';

interface Alert {
    id: string;
    type: 'Risk' | 'Opportunity' | 'Alert';
    title: string;
    desc: string;
    risk?: string;
    date?: string;
}

interface AllInsightsModalProps {
    alerts: Alert[];
    isOpen: boolean;
    onClose: () => void;
    onSelectAlert: (alert: Alert) => void;
    ignoredAlerts: string[];
}

const AllInsightsModal: React.FC<AllInsightsModalProps> = ({
    alerts,
    isOpen,
    onClose,
    onSelectAlert,
    ignoredAlerts
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'All' | 'Risk' | 'Opportunity' | 'Alert'>('All');
    const [sortBy, setSortBy] = useState<'date' | 'priority'>('priority');

    if (!isOpen) return null;

    // Filtrar alertas
    const filteredAlerts = alerts
        .filter(alert => !ignoredAlerts.includes(alert.id))
        .filter(alert => filterType === 'All' || alert.type === filterType)
        .filter(alert =>
            alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            alert.desc.toLowerCase().includes(searchTerm.toLowerCase())
        );

    const getIcon = (type: string) => {
        switch (type) {
            case 'Risk':
                return <AlertTriangle size={18} className="text-rose-600" />;
            case 'Opportunity':
                return <Lightbulb size={18} className="text-emerald-600" />;
            case 'Alert':
                return <Zap size={18} className="text-amber-600" />;
        }
    };

    const getColorClasses = (type: string) => {
        switch (type) {
            case 'Risk':
                return 'bg-rose-50 border-rose-200 hover:bg-rose-100';
            case 'Opportunity':
                return 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100';
            case 'Alert':
                return 'bg-amber-50 border-amber-200 hover:bg-amber-100';
        }
    };

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
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-slate-800">Todos os Insights</h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Search and Filters */}
                        <div className="flex gap-3">
                            <div className="flex-1 relative">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar insights..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value as any)}
                                className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="All">Todos</option>
                                <option value="Risk">Riscos</option>
                                <option value="Opportunity">Oportunidades</option>
                                <option value="Alert">Alertas</option>
                            </select>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                        {filteredAlerts.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-slate-400 mb-2">
                                    <Search size={48} className="mx-auto" />
                                </div>
                                <p className="text-slate-500">Nenhum insight encontrado</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filteredAlerts.map((alert) => (
                                    <div
                                        key={alert.id}
                                        onClick={() => {
                                            onSelectAlert(alert);
                                            onClose();
                                        }}
                                        className={`p-4 border rounded-lg cursor-pointer transition-all ${getColorClasses(alert.type)}`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="mt-1">
                                                {getIcon(alert.type)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-1">
                                                    <h3 className="font-semibold text-slate-800">{alert.title}</h3>
                                                    {alert.risk && (
                                                        <span className="text-[10px] bg-white px-2 py-1 rounded-full font-bold border">
                                                            RISCO {alert.risk}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-slate-600 line-clamp-2">{alert.desc}</p>
                                                {alert.date && (
                                                    <p className="text-xs text-slate-500 mt-2">{alert.date}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
                        <p className="text-sm text-slate-600">
                            {filteredAlerts.length} insight{filteredAlerts.length !== 1 ? 's' : ''} encontrado{filteredAlerts.length !== 1 ? 's' : ''}
                        </p>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium transition-colors"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AllInsightsModal;
