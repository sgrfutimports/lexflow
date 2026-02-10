import React, { useState } from 'react';
import { X, FileText, Image as ImageIcon, Download } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';

// Configurar worker do PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface DocumentPreviewModalProps {
    file: {
        name: string;
        url: string;
        type: string;
    } | null;
    isOpen: boolean;
    onClose: () => void;
}

const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
    file,
    isOpen,
    onClose
}) => {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);

    if (!isOpen || !file) return null;

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setPageNumber(1);
    };

    const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name);

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = file.url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/80 z-40 animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {isPDF ? (
                                <FileText size={20} className="text-rose-600" />
                            ) : (
                                <ImageIcon size={20} className="text-indigo-600" />
                            )}
                            <h3 className="font-semibold text-slate-800 truncate max-w-md">
                                {file.name}
                            </h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleDownload}
                                className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                                title="Download"
                            >
                                <Download size={18} className="text-slate-600" />
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="overflow-y-auto max-h-[calc(90vh-140px)] bg-slate-100 flex items-center justify-center p-4">
                        {isPDF ? (
                            <div className="bg-white shadow-lg">
                                <Document
                                    file={file.url}
                                    onLoadSuccess={onDocumentLoadSuccess}
                                    loading={
                                        <div className="flex items-center justify-center p-12">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                                        </div>
                                    }
                                    error={
                                        <div className="p-12 text-center">
                                            <p className="text-rose-600">Erro ao carregar PDF</p>
                                        </div>
                                    }
                                >
                                    <Page
                                        pageNumber={pageNumber}
                                        renderTextLayer={false}
                                        renderAnnotationLayer={false}
                                        width={Math.min(window.innerWidth * 0.8, 800)}
                                    />
                                </Document>
                            </div>
                        ) : isImage ? (
                            <img
                                src={file.url}
                                alt={file.name}
                                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                            />
                        ) : (
                            <div className="text-center p-12">
                                <FileText size={64} className="text-slate-400 mx-auto mb-4" />
                                <p className="text-slate-600 mb-4">Preview não disponível para este tipo de arquivo</p>
                                <button
                                    onClick={handleDownload}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    Download
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Footer - Navegação PDF */}
                    {isPDF && numPages > 0 && (
                        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
                            <button
                                onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                                disabled={pageNumber <= 1}
                                className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Anterior
                            </button>
                            <span className="text-sm text-slate-600">
                                Página {pageNumber} de {numPages}
                            </span>
                            <button
                                onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
                                disabled={pageNumber >= numPages}
                                className="px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Próxima
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default DocumentPreviewModal;
