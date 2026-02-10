import { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'
import { Database } from '../types/database.types'

type Tables = keyof Database['public']['Tables']

export function useSupabaseQuery<T extends Tables>(
    table: T,
    options?: {
        select?: string
        filter?: (query: any) => any
    }
) {
    type Row = Database['public']['Tables'][T]['Row']

    const [data, setData] = useState<Row[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            if (!supabase) {
                setLoading(false)
                return
            }

            try {
                let query = supabase
                    .from(table)
                    .select(options?.select || '*')

                if (options?.filter) {
                    query = options.filter(query)
                }

                const { data, error } = await query

                if (error) throw error
                setData((data as unknown as Row[]) || [])
            } catch (err) {
                setError(err as Error)
                console.error(`Error fetching ${table}:`, err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()

        // Subscrever a mudanças em tempo real
        if (supabase) {
            const subscription = supabase
                .channel(`${table}_changes`)
                .on('postgres_changes', { event: '*', schema: 'public', table }, () => {
                    fetchData()
                })
                .subscribe()

            return () => {
                subscription.unsubscribe()
            }
        }
    }, [table, options?.select])

    return { data, loading, error, refetch: () => setLoading(true) }
}

export function useSupabaseMutation<T extends Tables>(table: T) {
    type Row = Database['public']['Tables'][T]['Row']
    type Insert = Database['public']['Tables'][T]['Insert']
    type Update = Database['public']['Tables'][T]['Update']

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    const insert = async (data: Insert): Promise<Row | null> => {
        if (!supabase) throw new Error('Supabase not configured')

        setLoading(true)
        setError(null)

        try {
            const { data: result, error } = await supabase
                .from(table)
                .insert(data)
                .select()
                .single()

            if (error) throw error
            return result as Row
        } catch (err) {
            setError(err as Error)
            console.error(`Error inserting into ${table}:`, err)
            return null
        } finally {
            setLoading(false)
        }
    }

    const update = async (id: string, data: Update): Promise<Row | null> => {
        if (!supabase) throw new Error('Supabase not configured')

        setLoading(true)
        setError(null)

        try {
            const { data: result, error } = await supabase
                .from(table)
                .update(data)
                .eq('id', id)
                .select()
                .single()

            if (error) throw error
            return result as Row
        } catch (err) {
            setError(err as Error)
            console.error(`Error updating ${table}:`, err)
            return null
        } finally {
            setLoading(false)
        }
    }

    const remove = async (id: string): Promise<boolean> => {
        if (!supabase) throw new Error('Supabase not configured')

        setLoading(true)
        setError(null)

        try {
            const { error } = await supabase
                .from(table)
                .delete()
                .eq('id', id)

            if (error) throw error
            return true
        } catch (err) {
            setError(err as Error)
            console.error(`Error deleting from ${table}:`, err)
            return false
        } finally {
            setLoading(false)
        }
    }

    return { insert, update, remove, loading, error }
}
