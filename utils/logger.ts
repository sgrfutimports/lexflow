import * as Sentry from '@sentry/react';

interface LogContext {
    [key: string]: any;
}

/**
 * Sistema de logging centralizado usando Sentry
 * Em desenvolvimento: logs no console
 * Em produção: envia para Sentry
 */
export const logger = {
    /**
     * Log de informação
     */
    info: (message: string, context?: LogContext) => {
        if (import.meta.env.DEV) {
            console.log(`[INFO] ${message}`, context || '');
        }

        if (import.meta.env.PROD) {
            Sentry.captureMessage(message, {
                level: 'info',
                extra: context
            });
        }
    },

    /**
     * Log de erro
     */
    error: (message: string, error?: Error | unknown, context?: LogContext) => {
        if (import.meta.env.DEV) {
            console.error(`[ERROR] ${message}`, error, context || '');
        }

        if (import.meta.env.PROD) {
            if (error instanceof Error) {
                Sentry.captureException(error, {
                    extra: { message, ...context }
                });
            } else {
                Sentry.captureMessage(message, {
                    level: 'error',
                    extra: { error, ...context }
                });
            }
        }
    },

    /**
     * Log de aviso
     */
    warn: (message: string, context?: LogContext) => {
        if (import.meta.env.DEV) {
            console.warn(`[WARN] ${message}`, context || '');
        }

        if (import.meta.env.PROD) {
            Sentry.captureMessage(message, {
                level: 'warning',
                extra: context
            });
        }
    },

    /**
     * Log de debug (apenas em desenvolvimento)
     */
    debug: (message: string, context?: LogContext) => {
        if (import.meta.env.DEV) {
            console.debug(`[DEBUG] ${message}`, context || '');
        }
    }
};

/**
 * Inicializar Sentry
 * Chamar no index.tsx antes de renderizar o app
 */
export const initLogger = () => {
    if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
        Sentry.init({
            dsn: import.meta.env.VITE_SENTRY_DSN,
            integrations: [
                Sentry.browserTracingIntegration(),
                Sentry.replayIntegration(),
            ],
            // Performance Monitoring
            tracesSampleRate: 1.0,
            // Session Replay
            replaysSessionSampleRate: 0.1,
            replaysOnErrorSampleRate: 1.0,
            environment: import.meta.env.MODE,
        });
    }
};
