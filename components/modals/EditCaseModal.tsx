import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

interface Case {
    id: string;
    title: string;
    number: string;
    client: string;
    status: string;
    type: string;
    court: string;
    judge: string;
    value: number;
    description: string;
}

interface EditCaseModalProps {
    caseData: Case | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (caseData: Case) => void;
}

const EditCaseModal: React.FC<EditCaseModalProps> = ({
    caseData,
    isOpen,
    onClose,
    onSave
}) => {
    const [formData, setFormData] = useState<Case | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (caseData) {
            setFormData({ ...caseData });
        }
    }, [caseData]);

    if (!isOpen || !formData) return null;

    const validateCNJ = (cnj: string): boolean => {
        const pattern = /^\d{7}-\d{2}\.\d{4}\.\d{1}\.\d{2}\.\d{4}$/;
        return pattern.test(cnj);
    };

    const formatCNJ = (value: string): string => {
        // Remove tudo que não é número
        const numbers = value.replace(/\D/g, '');

        // Aplica a máscara: 0000000-00.0000.0.00.0000
        if (numbers.length <= 7) {
            return numbers;
        } else if (numbers.length <= 9) {
            return `${numbers.slice(0, 7)}-${numbers.slice(7)}`;
        } else if (numbers.length <= 13) {
            return `${numbers.slice(0, 7)}-${numbers.slice(7, 9)}.${numbers.slice(9)}`;
        } else if (numbers.length <= 14) {
            return `${numbers.slice(0, 7)}-${numbers.slice(7, 9)}.${numbers.slice(9, 13)}.${numbers.slice(13)}`;
        } else if (numbers.length <= 16) {
            return `${numbers.slice(0, 7)}-${numbers.slice(7, 9)}.${numbers.slice(9, 13)}.${numbers.slice(13, 14)}.${numbers.slice(14)}`;
        } else {
            return `${numbers.slice(0, 7)}-${numbers.slice(7, 9)}.${numbers.slice(9, 13)}.${numbers.slice(13, 14)}.${numbers.slice(14, 16)}.${numbers.slice(16, 20)}`;
        }
    };

    const handleChange = (field: keyof Case, value: string | number) => {
        setFormData({ ...formData, [field]: value });

        // Limpar erro do campo ao editar
        if (errors[field]) {
            setErrors({ ...errors, [field]: '' });
        }
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCNJ(e.target.value);
        handleChange('number', formatted);
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Título é obrigatório';
        }

        if (!formData.number.trim()) {
            newErrors.number = 'Número do processo é obrigatório';
        } else if (!validateCNJ(formData.number)) {
            newErrors.number = 'Formato CNJ inválido (0000000-00.0000.0.00.0000)';
        }

        if (!formData.client.trim()) {
            newErrors.client = 'Cliente é obrigatório';
        }

        if (!formData.court.trim()) {
            newErrors.court = 'Tribunal é obrigatório';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validate()) {
            onSave(formData);
            onClose();
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
                    className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-slate-800">Editar Processo</h2>
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
                        <div className="space-y-4">
                            {/* Título */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Título do Processo *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.title ? 'border-rose-500' : 'border-slate-200'
                                        }`}
                                    placeholder="Ex: Silva vs Tech Solutions"
                                />
                                {errors.title && (
                                    <div className="flex items-center gap-1 mt-1 text-rose-600 text-sm">
                                        <AlertCircle size={14} />
                                        <span>{errors.title}</span>
                                    </div>
                                )}
                            </div>

                            {/* Número CNJ */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Número do Processo (CNJ) *
                                </label>
                                <input
                                    type="text"
                                    value={formData.number}
                                    onChange={handleNumberChange}
                                    maxLength={25}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.number ? 'border-rose-500' : 'border-slate-200'
                                        }`}
                                    placeholder="0000000-00.0000.0.00.0000"
                                />
                                {errors.number && (
                                    <div className="flex items-center gap-1 mt-1 text-rose-600 text-sm">
                                        <AlertCircle size={14} />
                                        <span>{errors.number}</span>
                                    </div>
                                )}
                            </div>

                            {/* Grid 2 colunas */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Cliente */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Cliente *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.client}
                                        onChange={(e) => handleChange('client', e.target.value)}
                                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.client ? 'border-rose-500' : 'border-slate-200'
                                            }`}
                                    />
                                    {errors.client && (
                                        <div className="flex items-center gap-1 mt-1 text-rose-600 text-sm">
                                            <AlertCircle size={14} />
                                            <span>{errors.client}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Status
                                    </label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => handleChange('status', e.target.value)}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="Ativo">Ativo</option>
                                        <option value="Pendente">Pendente</option>
                                        <option value="Arquivado">Arquivado</option>
                                        <option value="Suspenso">Suspenso</option>
                                    </select>
                                </div>

                                {/* Tipo */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Tipo
                                    </label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => handleChange('type', e.target.value)}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="Trabalhista">Trabalhista</option>
                                        <option value="Cível">Cível</option>
                                        <option value="Criminal">Criminal</option>
                                        <option value="Tributário">Tributário</option>
                                    </select>
                                </div>

                                {/* Valor */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Valor da Causa (R$)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.value}
                                        onChange={(e) => handleChange('value', parseFloat(e.target.value) || 0)}
                                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            </div>

                            {/* Tribunal */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Tribunal *
                                </label>
                                <input
                                    type="text"
                                    value={formData.court}
                                    onChange={(e) => handleChange('court', e.target.value)}
                                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.court ? 'border-rose-500' : 'border-slate-200'
                                        }`}
                                    placeholder="Ex: TRT 2ª Região"
                                />
                                {errors.court && (
                                    <div className="flex items-center gap-1 mt-1 text-rose-600 text-sm">
                                        <AlertCircle size={14} />
                                        <span>{errors.court}</span>
                                    </div>
                                )}
                            </div>

                            {/* Juiz */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Juiz Responsável
                                </label>
                                <input
                                    type="text"
                                    value={formData.judge}
                                    onChange={(e) => handleChange('judge', e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Descrição */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Descrição
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="Detalhes do processo..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                            <Save size={18} />
                            Salvar Alterações
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditCaseModal;
