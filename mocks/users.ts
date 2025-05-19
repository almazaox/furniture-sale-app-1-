export interface User {
  id: string;
  email: string;
  name: string;
  notificationsEnabled?: boolean;
  role?: 'admin' | 'moderator' | 'visitor';
}

export interface OrderItem {
  productId: string;
  quantity: number;
  name?: string;
  price?: number;
}

export interface Order {
  id: string;
  userId: string;
  date: string;
  items: OrderItem[];
  total: number;
  status: string;
  address?: string;
  trackingInfo?: {
    trackingNumber: string;
    estimatedDelivery: string;
    currentLocation: string;
    progress: number;
  };
}

export const mockUsers: User[] = [
  {
    id: "1",
    email: "user@example.com",
    name: "John Doe",
    notificationsEnabled: true,
    role: "visitor"
  },
  {
    id: "2",
    email: "admin@example.com",
    name: "Admin User",
    notificationsEnabled: true,
    role: "admin"
  },
  {
    id: "3",
    email: "moderator@example.com",
    name: "Moderator User",
    notificationsEnabled: false,
    role: "moderator"
  }
];

export const mockOrders: Order[] = [
  {
    id: "order1",
    userId: "1",
    date: new Date(2023, 5, 15).toISOString(),
    items: [
      { productId: "3", quantity: 1, name: "Modern Sofa", price: 59999 },
      { productId: "7", quantity: 2, name: "Coffee Table", price: 12350 }
    ],
    total: 84700,
    status: "Delivered",
    address: "ул. Ленина 123, кв. 45, Москва, 123456"
  },
  {
    id: "order2",
    userId: "1",
    date: new Date(2023, 6, 22).toISOString(),
    items: [
      { productId: "5", quantity: 1, name: "Dining Chair", price: 29900 },
      { productId: "9", quantity: 2, name: "Floor Lamp", price: 8990 }
    ],
    total: 47880,
    status: "Processing",
    address: "ул. Пушкина 45, кв. 12, Москва, 123457"
  },
  {
    id: "order3",
    userId: "1",
    date: new Date(2023, 7, 10).toISOString(),
    items: [
      { productId: "2", quantity: 1, name: "Wooden Bed Frame", price: 79999 },
      { productId: "8", quantity: 1, name: "Bedside Table", price: 14999 }
    ],
    total: 94998,
    status: "Shipped",
    address: "ул. Гагарина 78, кв. 34, Москва, 123458",
    trackingInfo: {
      trackingNumber: "TRK789456",
      estimatedDelivery: new Date(2023, 7, 15).toISOString(),
      currentLocation: "Sorting Center",
      progress: 60
    }
  },
  {
    id: "order4",
    userId: "1",
    date: new Date(2023, 8, 5).toISOString(),
    items: [
      { productId: "1", quantity: 2, name: "Leather Armchair", price: 49999 },
      { productId: "4", quantity: 1, name: "Bookshelf", price: 34999 }
    ],
    total: 134997,
    status: "Cancelled",
    address: "ул. Чехова 90, кв. 56, Москва, 123459"
  },
  {
    id: "order5",
    userId: "1",
    date: new Date(2023, 9, 18).toISOString(),
    items: [
      { productId: "6", quantity: 4, name: "Throw Pillow", price: 2999 },
      { productId: "10", quantity: 1, name: "Area Rug", price: 19999 }
    ],
    total: 31995,
    status: "Processing",
    address: "ул. Толстого 112, кв. 78, Москва, 123460"
  }
];