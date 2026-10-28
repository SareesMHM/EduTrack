import { QueryKey, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../context/ToastContext';
import { ApiError } from '../types/api';

/** Query with the project defaults. Pass `enabled: false` to wait for params. */
export function useApi<T>(key: QueryKey, fn: () => Promise<T>, opts: { enabled?: boolean; staleTime?: number } = {}) {
  return useQuery<T, ApiError>({ queryKey: key, queryFn: fn, ...opts });
}

/** Mutation that toasts success/errors and invalidates the given query keys. */
export function useAction<V = void, R = unknown>(
  fn: (v: V) => Promise<R>,
  o: { success?: string; invalidate?: QueryKey[]; onSuccess?: (r: R) => void } = {},
) {
  const qc = useQueryClient();
  const toast = useToast();
  return useMutation<R, ApiError, V>({
    mutationFn: fn,
    onSuccess: (r) => {
      if (o.success) toast.success(o.success);
      o.invalidate?.forEach((k) => qc.invalidateQueries({ queryKey: k }));
      o.onSuccess?.(r);
    },
    onError: (e) => toast.error(e.message),
  });
}
