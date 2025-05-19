import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Order, mockOrders } from '@/mocks/users';

interface OrderState {
  orders: Order[];
  addOrder: (order: Order) => void;
  getUserOrders: (userId: string) => Order[];
  cancelOrder: (orderId: string) => void;
  trackOrder: (orderId: string) => Order | null;
  clearOrders: () => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: mockOrders,

      addOrder: (order: Order) => {
        set({ orders: [...get().orders, order] });
      },

      getUserOrders: (userId: string) => {
        return get().orders.filter(order => order.userId === userId);
      },
      
      cancelOrder: (orderId: string) => {
        const { orders } = get();
        set({
          orders: orders.map(order => 
            order.id === orderId 
              ? { ...order, status: 'Cancelled' } 
              : order
          )
        });
      },
      
      trackOrder: (orderId: string) => {
        const { orders } = get();
        const order = orders.find(order => order.id === orderId);
        return order || null;
      },

      clearOrders: () => {
        set({ orders: [] });
      },
    }),
    {
      name: 'order-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);