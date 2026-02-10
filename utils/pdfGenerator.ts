import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Transaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    status: string;
    category?: string;
    client?: string;
}

interface ReportOptions {
    title?: string;
    period?: string;
    includeCharts?: boolean;
}

/**
 * Gerar relatório financeiro em PDF
 */
export const generateFinancialReport = (
    transactions: Transaction[],
    options: ReportOptions = {}
): void => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Configurações
    const title = options.title || 'Relatório Financeiro';
    const period = options.period || 'Período Completo';

    // Header
    doc.setFillColor(79, 70, 229); // Indigo 600
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 14, 20);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(period, 14, 30);

    // Data de geração
    doc.setFontSize(10);
    const today = new Date().toLocaleDateString('pt-BR');
    doc.text(`Gerado em: ${today}`, pageWidth - 14, 30, { align: 'right' });

    // Resumo Financeiro
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumo Financeiro', 14, 55);

    const totalReceitas = transactions
        .filter(t => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);

    const totalDespesas = transactions
        .filter(t => t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const saldo = totalReceitas - totalDespesas;

    // Cards de resumo
    const cardY = 65;
    const cardHeight = 25;
    const cardWidth = (pageWidth - 42) / 3;

    // Card Receitas
    doc.setFillColor(16, 185, 129); // Green
    doc.roundedRect(14, cardY, cardWidth, cardHeight, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('Receitas', 14 + cardWidth / 2, cardY + 8, { align: 'center' });
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`R$ ${totalReceitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        14 + cardWidth / 2, cardY + 18, { align: 'center' });

    // Card Despesas
    doc.setFillColor(239, 68, 68); // Red
    doc.roundedRect(14 + cardWidth + 7, cardY, cardWidth, cardHeight, 3, 3, 'F');
    doc.text('Despesas', 14 + cardWidth + 7 + cardWidth / 2, cardY + 8, { align: 'center' });
    doc.setFontSize(14);
    doc.text(`R$ ${totalDespesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        14 + cardWidth + 7 + cardWidth / 2, cardY + 18, { align: 'center' });

    // Card Saldo
    const saldoColor: [number, number, number] = saldo >= 0 ? [79, 70, 229] : [239, 68, 68]; // Indigo ou Red
    doc.setFillColor(...saldoColor);
    doc.roundedRect(14 + (cardWidth + 7) * 2, cardY, cardWidth, cardHeight, 3, 3, 'F');
    doc.text('Saldo', 14 + (cardWidth + 7) * 2 + cardWidth / 2, cardY + 8, { align: 'center' });
    doc.setFontSize(14);
    doc.text(`R$ ${saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        14 + (cardWidth + 7) * 2 + cardWidth / 2, cardY + 18, { align: 'center' });

    // Tabela de transações
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Transações', 14, 105);

    autoTable(doc, {
        startY: 115,
        head: [['Data', 'Descrição', 'Cliente', 'Categoria', 'Valor', 'Status']],
        body: transactions.map(t => [
            t.date,
            t.description,
            t.client || '-',
            t.category || '-',
            `R$ ${Math.abs(t.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
            t.status
        ]),
        headStyles: {
            fillColor: [79, 70, 229],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 10
        },
        bodyStyles: {
            fontSize: 9
        },
        alternateRowStyles: {
            fillColor: [248, 250, 252]
        },
        columnStyles: {
            0: { cellWidth: 25 },
            1: { cellWidth: 'auto' },
            2: { cellWidth: 30 },
            3: { cellWidth: 25 },
            4: { cellWidth: 30, halign: 'right' },
            5: { cellWidth: 25 }
        },
        didParseCell: (data) => {
            // Colorir valores
            if (data.column.index === 4 && data.section === 'body') {
                const amount = transactions[data.row.index].amount;
                data.cell.styles.textColor = amount >= 0 ? [16, 185, 129] : [239, 68, 68];
                data.cell.styles.fontStyle = 'bold';
            }
        }
    });

    // Footer
    const finalY = (doc as any).lastAutoTable.finalY || 115;
    if (finalY < pageHeight - 30) {
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text('LexFlow SaaS - Sistema de Gestão Jurídica', pageWidth / 2, pageHeight - 15, { align: 'center' });
        doc.text(`Página 1 de 1`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }

    // Salvar PDF
    const fileName = `relatorio_financeiro_${Date.now()}.pdf`;
    doc.save(fileName);
};

/**
 * Gerar relatório de processos
 */
export const generateCasesReport = (cases: any[]): void => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Relatório de Processos', 14, 25);

    // Tabela
    autoTable(doc, {
        startY: 50,
        head: [['Número', 'Título', 'Cliente', 'Status', 'Tipo', 'Valor']],
        body: cases.map(c => [
            c.number,
            c.title,
            c.client,
            c.status,
            c.type,
            `R$ ${c.value.toLocaleString('pt-BR')}`
        ]),
        headStyles: {
            fillColor: [79, 70, 229],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
        },
        alternateRowStyles: {
            fillColor: [248, 250, 252]
        }
    });

    doc.save(`relatorio_processos_${Date.now()}.pdf`);
};

/**
 * Gerar relatório de clientes
 */
export const generateClientsReport = (clients: any[]): void => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Relatório de Clientes', 14, 25);

    // Tabela
    autoTable(doc, {
        startY: 50,
        head: [['Nome', 'Documento', 'Email', 'Telefone', 'Processos Ativos']],
        body: clients.map(c => [
            c.name,
            c.document,
            c.email,
            c.phone,
            c.activeCases.toString()
        ]),
        headStyles: {
            fillColor: [79, 70, 229],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
        },
        alternateRowStyles: {
            fillColor: [248, 250, 252]
        }
    });

    doc.save(`relatorio_clientes_${Date.now()}.pdf`);
};
