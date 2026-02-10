export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    email: string
                    full_name: string | null
                    avatar_url: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    full_name?: string | null
                    avatar_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string | null
                    avatar_url?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            cases: {
                Row: {
                    id: string
                    user_id: string
                    number: string
                    title: string
                    client: string
                    court: string | null
                    status: string
                    next_deadline: string | null
                    value: number | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    number: string
                    title: string
                    client: string
                    court?: string | null
                    status: string
                    next_deadline?: string | null
                    value?: number | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    number?: string
                    title?: string
                    client?: string
                    court?: string | null
                    status?: string
                    next_deadline?: string | null
                    value?: number | null
                    created_at?: string
                    updated_at?: string
                }
            }
            tasks: {
                Row: {
                    id: string
                    case_id: string
                    user_id: string
                    description: string
                    deadline: string
                    assignee: string | null
                    completed: boolean
                    priority: string | null
                    billable: boolean
                    value: number | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    case_id: string
                    user_id: string
                    description: string
                    deadline: string
                    assignee?: string | null
                    completed?: boolean
                    priority?: string | null
                    billable?: boolean
                    value?: number | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    case_id?: string
                    user_id?: string
                    description?: string
                    deadline?: string
                    assignee?: string | null
                    completed?: boolean
                    priority?: string | null
                    billable?: boolean
                    value?: number | null
                    created_at?: string
                    updated_at?: string
                }
            }
            clients: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    type: 'PF' | 'PJ'
                    document: string
                    email: string | null
                    phone: string | null
                    active_cases: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    name: string
                    type: 'PF' | 'PJ'
                    document: string
                    email?: string | null
                    phone?: string | null
                    active_cases?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    type?: 'PF' | 'PJ'
                    document?: string
                    email?: string | null
                    phone?: string | null
                    active_cases?: number
                    created_at?: string
                    updated_at?: string
                }
            }
            transactions: {
                Row: {
                    id: string
                    user_id: string
                    case_id: string | null
                    type: 'Receita' | 'Despesa'
                    category: string
                    description: string
                    amount: number
                    date: string
                    status: 'Pago' | 'Pendente' | 'Atrasado'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    case_id?: string | null
                    type: 'Receita' | 'Despesa'
                    category: string
                    description: string
                    amount: number
                    date: string
                    status: 'Pago' | 'Pendente' | 'Atrasado'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    case_id?: string | null
                    type?: 'Receita' | 'Despesa'
                    category?: string
                    description?: string
                    amount?: number
                    date?: string
                    status?: 'Pago' | 'Pendente' | 'Atrasado'
                    created_at?: string
                    updated_at?: string
                }
            }
            documents: {
                Row: {
                    id: string
                    user_id: string
                    case_id: string | null
                    title: string
                    type: string
                    content: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    case_id?: string | null
                    title: string
                    type: string
                    content: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    case_id?: string | null
                    title?: string
                    type?: string
                    content?: string
                    created_at?: string
                    updated_at?: string
                }
            }
        }
    }
}
