import React from 'react';
import { X, AlertTriangle, Lightbulb, Zap, CheckCircle } from 'lucide-react';

interface Alert {
    id: string;
    type: 'Risk' | 'Opportunity' | 'Alert';
    title: string;
    desc: string;
    risk?: string;
    details?: {
        process?: string;
        deadline?: string;
        recommendations?: string[];
        relatedCases?: string[];
    };
}

interface AlertDetailsModalProps {
    alert: Alert | null;
    isOpen: boolean;
    onClose: () => void;
    onIgnore?: (id: string) => void;
    onResolve?: (id: string) => void;
}

const AlertDetailsModal: React.FC<AlertDetailsModalProps> = ({
    alert,
    isOpen,
    onClose,
    onIgnore,
    onResolve
}) => {
    if (!isOpen || !alert) return null;

    const getIcon = () => {
        switch (alert.type) {
            case 'Risk':
                return <AlertTriangle size={24} className="text-rose-600" />;
            case 'Opportunity':
                return <Lightbulb size={24} className="text-emerald-600" />;
            case 'Alert':
                return <Zap size={24} className="text-amber-600" />;
        }
    };

    const getColorClasses = () => {
        switch (alert.type) {
            case 'Risk':
                return 'bg-rose-50 border-rose-200 text-rose-800';
            case 'Opportunity':
                return 'bg-emerald-50 border-emerald-200 text-emerald-800';
            case 'Alert':
                return 'bg-amber-50 border-amber-200 text-amber-800';
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
                    className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className={`p-6 border-b border-slate-200 ${getColorClasses()}`}>
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white rounded-lg shadow-sm">
                                    {getIcon()}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">{alert.title}</h2>
                                    {alert.risk && (
                                        <span className="inline-block mt-2 text-xs font-bold px-3 py-1 bg-white rounded-full shadow-sm">
                                            RISCO {alert.risk}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                        {/* Description */}
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-slate-700 mb-2">Descrição</h3>
                            <p className="text-slate-600 leading-relaxed">{alert.desc}</p>
                        </div>

                        {/* Details */}
                        {alert.details && (
                            <>
                                {alert.details.process && (
                                    <div className="mb-6">
                                        <h3 className="text-sm font-semibold text-slate-700 mb-2">Processo Relacionado</h3>
                                        <p className="text-slate-600">{alert.details.process}</p>
                                    </div>
                                )}

                                {alert.details.deadline && (
                                    <div className="mb-6">
                                        <h3 className="text-sm font-semibold text-slate-700 mb-2">Prazo</h3>
                                        <p className="text-slate-600 font-medium">{alert.details.deadline}</p>
                                    </div>
                                )}

                                {alert.details.recommendations && alert.details.recommendations.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-sm font-semibold text-slate-700 mb-3">Ações Recomendadas</h3>
                                        <ul className="space-y-2">
                                            {alert.details.recommendations.map((rec, index) => (
                                                <li key={index} className="flex items-start gap-2">
                                                    <CheckCircle size={16} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                                                    <span className="text-slate-600 text-sm">{rec}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {alert.details.relatedCases && alert.details.relatedCases.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-sm font-semibold text-slate-700 mb-3">Casos Relacionados</h3>
                                        <div className="space-y-2">
                                            {alert.details.relatedCases.map((caseItem, index) => (
                                                <div key={index} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                                                    <p className="text-sm text-slate-700">{caseItem}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
                        {alert.type === 'Risk' && onIgnore && (
                            <button
                                onClick={() => {
                                    onIgnore(alert.id);
                                    onClose();
                                }}
                                className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
                            >
                                Ignorar
                            </button>
                        )}
                        {onResolve && (
                            <button
                                onClick={() => {
                                    onResolve(alert.id);
                                    onClose();
                                }}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                            >
                                Marcar como Resolvido
                            </button>
                        )}
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

export default AlertDetailsModal;
