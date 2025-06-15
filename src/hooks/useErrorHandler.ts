
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ErrorHandlerOptions {
  showToast?: boolean;
  fallbackMessage?: string;
  onError?: (error: Error) => void;
}

export const useErrorHandler = () => {
  const { toast } = useToast();

  const handleError = useCallback((
    error: unknown,
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showToast = true,
      fallbackMessage = 'An unexpected error occurred',
      onError
    } = options;

    console.error('Error handled:', error);

    const errorMessage = error instanceof Error ? error.message : fallbackMessage;

    if (showToast) {
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }

    if (onError && error instanceof Error) {
      onError(error);
    }

    return errorMessage;
  }, [toast]);

  const withErrorHandling = useCallback(<T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    options?: ErrorHandlerOptions
  ) => {
    return async (...args: T): Promise<R | null> => {
      try {
        return await fn(...args);
      } catch (error) {
        handleError(error, options);
        return null;
      }
    };
  }, [handleError]);

  return { handleError, withErrorHandling };
};
