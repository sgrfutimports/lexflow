export enum CaseStatus {
  ACTIVE = 'Ativo',
  ARCHIVED = 'Arquivado',
  PENDING = 'Pendente',
  SUSPENDED = 'Suspenso'
}

export interface Case {
  id: string;
  number: string;
  title: string;
  client: string;
  court: string;
  status: CaseStatus;
  nextDeadline: string;
  value: number;
}

export interface Client {
  id: string;
  name: string;
  type: 'PF' | 'PJ';
  document: string; // CPF or CNPJ
  email: string;
  phone: string;
  activeCases: number;
}

export interface LegalDocument {
  id: string;
  title: string;
  type: string;
  lastModified: string;
  status: 'Draft' | 'Final' | 'Signed';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface Task {
  id: string;
  caseId: string;
  description: string;
  deadline: string;
  assignee: string;
  completed: boolean;
  priority: 'Alta' | 'Média' | 'Baixa';
  billable?: boolean;
  value?: number;
}

export interface FinancialTransaction {
  id: string;
  type: 'Receita' | 'Despesa';
  category: 'Honorários Contratuais' | 'Honorários Sucumbenciais' | 'Custas' | 'Operacional' | 'Software';
  description: string;
  amount: number;
  date: string;
  status: 'Pago' | 'Pendente' | 'Atrasado';
  caseId?: string; // Optional link to a case
}