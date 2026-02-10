import { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'
import { User } from '@supabase/supabase-js'

export function useAuth() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!supabase) {
            setLoading(false)
            return
        }

        // Verificar sessão atual
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            setLoading(false)
        })

        // Escutar mudanças de autenticação
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    const signIn = async (email: string, password: string) => {
        if (!supabase) throw new Error('Supabase not configured')
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        return { data, error }
    }

    const signUp = async (email: string, password: string) => {
        if (!supabase) throw new Error('Supabase not configured')
        const { data, error } = await supabase.auth.signUp({ email, password })
        return { data, error }
    }

    const signOut = async () => {
        if (!supabase) throw new Error('Supabase not configured')
        const { error } = await supabase.auth.signOut()
        return { error }
    }

    return { user, loading, signIn, signUp, signOut }
}
