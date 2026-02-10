import { supabase } from '../services/supabaseClient';

/**
 * Upload de arquivo para o Supabase Storage
 */
export const uploadFile = async (
    file: File,
    userId: string,
    folder: string = 'documents'
): Promise<{ path: string; url: string }> => {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { data, error } = await supabase.storage
            .from('documents')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) throw error;

        // Obter URL pública
        const { data: { publicUrl } } = supabase.storage
            .from('documents')
            .getPublicUrl(fileName);

        return {
            path: data.path,
            url: publicUrl
        };
    } catch (error) {
        console.error('Erro ao fazer upload:', error);
        throw error;
    }
};

/**
 * Download de arquivo do Supabase Storage
 */
export const downloadFile = async (path: string): Promise<Blob> => {
    try {
        const { data, error } = await supabase.storage
            .from('documents')
            .download(path);

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Erro ao fazer download:', error);
        throw error;
    }
};

/**
 * Deletar arquivo do Supabase Storage
 */
export const deleteFile = async (path: string): Promise<void> => {
    try {
        const { error } = await supabase.storage
            .from('documents')
            .remove([path]);

        if (error) throw error;
    } catch (error) {
        console.error('Erro ao deletar arquivo:', error);
        throw error;
    }
};

/**
 * Listar arquivos de um usuário
 */
export const listFiles = async (
    userId: string,
    folder: string = 'documents'
): Promise<any[]> => {
    try {
        const { data, error } = await supabase.storage
            .from('documents')
            .list(`${userId}/${folder}`, {
                limit: 100,
                offset: 0,
                sortBy: { column: 'created_at', order: 'desc' }
            });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Erro ao listar arquivos:', error);
        throw error;
    }
};

/**
 * Obter URL pública de um arquivo
 */
export const getPublicUrl = (path: string): string => {
    const { data } = supabase.storage
        .from('documents')
        .getPublicUrl(path);

    return data.publicUrl;
};

/**
 * Validar tipo de arquivo
 */
export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
    const fileType = file.type;
    return allowedTypes.some(type => {
        if (type.endsWith('/*')) {
            return fileType.startsWith(type.replace('/*', ''));
        }
        return fileType === type;
    });
};

/**
 * Validar tamanho de arquivo (em MB)
 */
export const validateFileSize = (file: File, maxSizeMB: number): boolean => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
};

/**
 * Formatar tamanho de arquivo para exibição
 */
export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};
