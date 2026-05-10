'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi, type StockMovement, type Product } from '@/lib/api';

export function useMovements(productId?: string) {
  return useQuery<StockMovement[]>({
    queryKey: ['movements', productId],
    queryFn: async () => {
      const res = await inventoryApi.getMovements(productId);
      return res.data;
    },
  });
}

export function useLowStock() {
  return useQuery<Product[]>({
    queryKey: ['inventory', 'low-stock'],
    queryFn: async () => {
      const res = await inventoryApi.getLowStock();
      return res.data;
    },
  });
}

export function useAdjustStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => inventoryApi.adjust(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['movements'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}
