import { useState, useEffect, useCallback } from 'react';
import type { ApiError } from '../types/api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError) => void;
}

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<T>,
  options: UseApiOptions = {}
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const { immediate = false, onSuccess, onError } = options;

  const execute = useCallback(
    async (...args: any[]) => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const data = await apiFunction(...args);
        setState({ data, loading: false, error: null });
        
        if (onSuccess) {
          onSuccess(data);
        }
        
        return data;
      } catch (error) {
        const apiError = error as ApiError;
        setState({ data: null, loading: false, error: apiError });
        
        if (onError) {
          onError(apiError);
        }
        
        throw apiError;
      }
    },
    [apiFunction, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    ...state,
    execute,
    reset,
  };
}

// Hook for paginated data
interface UsePaginatedApiState<T> extends UseApiState<T[]> {
  pagination: {
    page: number;
    hasNext: boolean;
    hasPrevious: boolean;
    totalCount: number;
  };
}

export function usePaginatedApi<T>(
  apiFunction: (page: number, ...args: any[]) => Promise<{ results: T[]; count: number; next: string | null; previous: string | null }>,
  options: UseApiOptions & { pageSize?: number } = {}
) {
  const [state, setState] = useState<UsePaginatedApiState<T>>({
    data: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      hasNext: false,
      hasPrevious: false,
      totalCount: 0,
    },
  });

  const { immediate = false, onSuccess, onError } = options;

  const loadPage = useCallback(
    async (page: number, ...args: any[]) => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const response = await apiFunction(page, ...args);
        const { results, count, next, previous } = response;
        
        setState(prev => ({
          data: page === 1 ? results : [...(prev.data || []), ...results],
          loading: false,
          error: null,
          pagination: {
            page,
            hasNext: !!next,
            hasPrevious: !!previous,
            totalCount: count,
          },
        }));
        
        if (onSuccess) {
          onSuccess(results);
        }
        
        return results;
      } catch (error) {
        const apiError = error as ApiError;
        setState(prev => ({ ...prev, loading: false, error: apiError }));
        
        if (onError) {
          onError(apiError);
        }
        
        throw apiError;
      }
    },
    [apiFunction, onSuccess, onError]
  );

  const loadNextPage = useCallback(() => {
    if (state.pagination.hasNext && !state.loading) {
      return loadPage(state.pagination.page + 1);
    }
  }, [state.pagination.hasNext, state.pagination.page, state.loading, loadPage]);

  const loadPreviousPage = useCallback(() => {
    if (state.pagination.hasPrevious && !state.loading) {
      return loadPage(state.pagination.page - 1);
    }
  }, [state.pagination.hasPrevious, state.pagination.page, state.loading, loadPage]);

  const reset = useCallback(() => {
    setState({
      data: [],
      loading: false,
      error: null,
      pagination: {
        page: 1,
        hasNext: false,
        hasPrevious: false,
        totalCount: 0,
      },
    });
  }, []);

  useEffect(() => {
    if (immediate) {
      loadPage(1);
    }
  }, [immediate, loadPage]);

  return {
    ...state,
    loadPage,
    loadNextPage,
    loadPreviousPage,
    reset,
  };
}

