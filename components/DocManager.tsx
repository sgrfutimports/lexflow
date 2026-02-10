import React, { useState } from 'react';
import { Upload, File, Scissors, Layers, RefreshCw, Trash2, Search } from 'lucide-react';

const DocManager: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);

  const tools = [
    { name: 'Unir PDFs', icon: <Layers size={24} />, desc: 'Combine múltiplos arquivos em um único PDF.' },
    { name: 'Dividir', icon: <Scissors size={24} />, desc: 'Extraia páginas de um arquivo PDF.' },
    { name: 'Converter', icon: <RefreshCw size={24} />, desc: 'Converta Word/Images para PDF e vice-versa.' },
    { name: 'Comprimir', icon: <File size={24} />, desc: 'Reduza o tamanho do arquivo sem perder qualidade.' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Gestão Documental & Ferramentas</h2>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tools.map((tool, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer group">
            <div className="mb-4 p-3 bg-indigo-50 text-indigo-600 rounded-lg inline-block group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              {tool.icon}
            </div>
            <h3 className="font-semibold text-slate-800 mb-2">{tool.name}</h3>
            <p className="text-sm text-slate-500">{tool.desc}</p>
          </div>
        ))}
      </div>

      {/* Upload Area */}
      <div
        className={`bg-white border-2 border-dashed rounded-xl p-10 text-center transition-colors ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300'}`}
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => { e.preventDefault(); setDragActive(false); }}
      >
        <Upload className="mx-auto text-slate-400 mb-4" size={48} />
        <h3 className="text-lg font-medium text-slate-800">Arraste documentos aqui</h3>
        <p className="text-slate-500 mb-4">Suporta PDF, DOCX, JPG (Max 50MB)</p>
        <label className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-lg font-medium transition-colors">
          Selecionar Arquivos
          <input type="file" className="hidden" multiple />
        </label>
      </div>

      {/* Recent Files Table Mock */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-semibold text-slate-800">Arquivos Recentes</h3>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Buscar no conteúdo..." className="pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500" />
          </div>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Nome</th>
              <th className="px-6 py-3">Cliente / Processo</th>
              <th className="px-6 py-3">Data</th>
              <th className="px-6 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { name: 'Contrato_Honorarios_Assinado.pdf', ctx: 'João da Silva', date: 'Hoje, 14:30' },
              { name: 'Procuracao_Ad_Judicia.pdf', ctx: 'Tech Solutions SA', date: 'Ontem, 09:15' },
              { name: 'Documentos_Pessoais.zip', ctx: 'Maria Oliveira', date: '20 Out, 16:45' },
            ].map((file, i) => (
              <tr key={i} className="hover:bg-slate-50">
                <td className="px-6 py-3 flex items-center gap-2">
                  <File size={16} className="text-indigo-500" />
                  <span className="text-slate-700 font-medium">{file.name}</span>
                </td>
                <td className="px-6 py-3 text-slate-600">{file.ctx}</td>
                <td className="px-6 py-3 text-slate-500">{file.date}</td>
                <td className="px-6 py-3 text-right">
                  <button
                    onClick={() => {
                      if (confirm(`Tem certeza que deseja deletar ${file.name}?`)) {
                        alert('Arquivo deletado com sucesso!');
                      }
                    }}
                    className="text-rose-500 hover:text-rose-700 p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocManager;
