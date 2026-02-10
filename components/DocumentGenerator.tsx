import React, { useState } from 'react';
import { generateLegalDraft } from '../services/geminiService';
import { FileText, Download, Copy, Loader2, Sparkles } from 'lucide-react';
import { useToast, ToastContainer } from './Toast';
import jsPDF from 'jspdf';

const DocumentGenerator: React.FC = () => {
  const [docType, setDocType] = useState('Procuração Ad Judicia');
  const [partyA, setPartyA] = useState('');
  const [partyB, setPartyB] = useState('');
  const [details, setDetails] = useState('');
  const [generatedDoc, setGeneratedDoc] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  const handleGenerate = async () => {
    if (!partyA || !details) {
      addToast("Por favor, preencha pelo menos o Cliente e os Detalhes.", 'error');
      return;
    }
    setIsLoading(true);
    const content = await generateLegalDraft(docType, partyA, partyB, details);
    setGeneratedDoc(content);
    setIsLoading(false);
    addToast('Documento gerado com sucesso!', 'success');
  };

  const handleCopy = () => {
    if (!generatedDoc) {
      addToast('Não há conteúdo para copiar.', 'info');
      return;
    }
    navigator.clipboard.writeText(generatedDoc);
    addToast('Documento copiado para a área de transferência!', 'success');
  };

  const handleDownloadPDF = () => {
    if (!generatedDoc) {
      addToast('Não há conteúdo para baixar.', 'info');
      return;
    }
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const maxWidth = pageWidth - 2 * margin;

      // Título
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(docType || 'Documento Jurídico', margin, margin);

      // Conteúdo
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');

      const lines = doc.splitTextToSize(generatedDoc, maxWidth);
      let yPosition = margin + 15;

      lines.forEach((line: string) => {
        if (yPosition > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(line, margin, yPosition);
        yPosition += 7;
      });

      // Salvar PDF
      const fileName = `${docType.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      addToast('PDF baixado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      addToast('Erro ao gerar PDF. Tente novamente.', 'error');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      {/* Configuration Panel */}
      <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-100 overflow-y-auto">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="text-indigo-600" size={24} />
          <h2 className="text-xl font-bold text-slate-800">Gerador IA</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Documento</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
            >
              <option>Procuração Ad Judicia</option>
              <option>Petição Inicial</option>
              <option>Contestação</option>
              <option>Contrato de Honorários</option>
              <option>Notificação Extrajudicial</option>
              <option>Recurso de Apelação</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Parte A (Seu Cliente)</label>
            <input
              type="text"
              value={partyA}
              onChange={(e) => setPartyA(e.target.value)}
              placeholder="Nome, Estado Civil, Profissão, CPF..."
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Parte B (Parte Contrária)</label>
            <input
              type="text"
              value={partyB}
              onChange={(e) => setPartyB(e.target.value)}
              placeholder="Nome da empresa ou pessoa..."
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Fatos e Detalhes</label>
            <textarea
              rows={6}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Descreva os fatos principais, valores envolvidos, datas e o que se pede..."
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
            {isLoading ? "Gerando Minuta..." : "Gerar Documento"}
          </button>
        </div>
      </div>

      {/* Editor Panel */}
      <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <FileText size={20} /> Editor de Minuta
          </h3>
          <div className="flex gap-2">
            <button onClick={handleCopy} className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg tooltip" title="Copiar">
              <Copy size={18} />
            </button>
            <button onClick={handleDownloadPDF} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg tooltip" title="Baixar PDF">
              <Download size={18} />
            </button>
          </div>
        </div>

        <textarea
          value={generatedDoc}
          onChange={(e) => setGeneratedDoc(e.target.value)}
          placeholder="O documento gerado pela IA aparecerá aqui para edição..."
          className="flex-1 w-full p-4 border border-slate-200 rounded-lg font-mono text-sm leading-relaxed focus:outline-none focus:border-indigo-500 resize-none bg-slate-50"
        />

        <div className="mt-2 text-xs text-slate-500 flex justify-between">
          <span>* A IA pode cometer erros. Sempre revise o conteúdo jurídico.</span>
          <span>{generatedDoc.length} caracteres</span>
        </div>
      </div>
    </div>
  );
};

export default DocumentGenerator;
