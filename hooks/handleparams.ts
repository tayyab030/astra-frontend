import { useCallback } from "react";

import { useRouter, useSearchParams } from "next/navigation";

interface UseActiveItemProps {
  activeItem: string;
  // eslint-disable-next-line no-unused-vars
  setActiveItem: (newActiveId: string) => void;
  clearActiveItem: () => void;
}

export function useActiveItem(activeItem: string): UseActiveItemProps {
  const router = useRouter();
  const searchParams = useSearchParams();

  // set active item
  const item = searchParams.get(activeItem) || "";

  const setActiveItem = useCallback(
    (newActiveId: string) => {
      if (activeItem) {
        const params = new URLSearchParams(searchParams.toString());
        params.set(activeItem, newActiveId);

        // Update URL without full page reload
        router.push(`?${params.toString()}`, { scroll: false });
      }
    },
    [activeItem, router, searchParams]
  );

  const clearActiveItem = useCallback(() => {
    if (activeItem) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(activeItem);

      router.push(`?${params.toString()}`, { scroll: false });
    }
  }, [activeItem, router, searchParams]);

  return {
    activeItem: item,
    setActiveItem,
    clearActiveItem,
  };
}
