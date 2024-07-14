import { create } from "zustand";
import { toast } from "react-hot-toast";
import { persist, createJSONStorage } from "zustand/middleware";

import { Product } from "@/types";

interface FavoriteStore {
  items: Product[];
  addItem: (data: Product) => void;
  removeItem: (id: string) => void;
  removeAll: () => void;
  hasItem: (id: string) => boolean;
}

const useFavorite = create(
  persist<FavoriteStore>(
    (set, get) => ({
      items: [],
      addItem: (data: Product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === data.id);

        if (existingItem) {
          return toast("Item already in favorite.");
        }

        set({ items: [...get().items, data] });
        toast.success("Item added to favorite.");
      },
      removeItem: (id: string) => {
        set({ items: [...get().items.filter((item) => item.id !== id)] });
        toast.success("Item removed from favorite.");
      },
      removeAll: () => set({ items: [] }),
      hasItem: (id: string) => {
        return get().items.some((item) => item.id === id);
      },
    }),
    {
      name: "favorite-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useFavorite;
