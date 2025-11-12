import { useQuery } from "@tanstack/react-query";
import type { ShopStatus } from "@shared/schema";

export function useShopStatus() {
  return useQuery<ShopStatus>({
    queryKey: ["/api/shop/status"],
    refetchInterval: 60000, // Refetch every 60 seconds to check for status changes
    staleTime: 30000, // Consider data stale after 30 seconds
  });
}
