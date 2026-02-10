import { useState, useEffect } from 'react';

/**
 * Hook customizado para persistir dados no localStorage
 * @param key - Chave única para armazenar no localStorage
 * @param initialValue - Valor inicial se não houver dados salvos
 * @returns [value, setValue] - Estado e função para atualizar
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
    // Inicializar estado com valor do localStorage ou valor inicial
    const [value, setValue] = useState<T>(() => {
        try {
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : initialValue;
        } catch (error) {
            console.error(`Error loading ${key} from localStorage:`, error);
            return initialValue;
        }
    });

    // Salvar no localStorage sempre que o valor mudar
    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error saving ${key} to localStorage:`, error);
        }
    }, [key, value]);

    return [value, setValue];
}
