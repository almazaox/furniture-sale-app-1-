import { create } from 'zustand';
import { products, promotions, Product } from '@/mocks/products';

interface ProductState {
  products: Product[];
  promotions: Product[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  fetchPromotions: () => Promise<void>;
  searchProducts: (query: string) => Product[];
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  promotions: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set({ products, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch products", isLoading: false });
    }
  },

  fetchPromotions: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      set({ promotions, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch promotions", isLoading: false });
    }
  },

  searchProducts: (query: string) => {
    const { products } = get();
    if (!query.trim()) return products;
    
    const lowerCaseQuery = query.toLowerCase();
    return products.filter(
      product => 
        product.name.toLowerCase().includes(lowerCaseQuery) ||
        product.type.toLowerCase().includes(lowerCaseQuery) ||
        product.description.toLowerCase().includes(lowerCaseQuery)
    );
  },
}));