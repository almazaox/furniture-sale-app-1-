export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  type: string;
  rating: number;
  imageURL: string;
  purchaseCount: number;
  description: string;
  inStock: boolean;
}

export const productTypes = [
  "Sofas",
  "Chairs",
  "Tables",
  "Beds",
  "Cabinets",
  "Desks",
  "Bookshelves",
  "Wardrobes",
  "Lighting",
  "Decor"
];

export const products: Product[] = [
  {
    id: "1",
    name: "Modern Leather Sofa",
    price: 89990,
    type: "Sofas",
    rating: 4.8,
    imageURL: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    purchaseCount: 124,
    description: "Современный кожаный диван, сочетающий комфорт и стиль с использованием премиальных материалов. Идеально подходит для современных гостиных и офисов.",
    inStock: true
  },
  {
    id: "2",
    name: "Scandinavian Dining Table",
    price: 59990,
    oldPrice: 69990,
    type: "Tables",
    rating: 4.6,
    imageURL: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    purchaseCount: 87,
    description: "Минималистичный обеденный стол в скандинавском стиле из массива дуба. Вмещает до 6 человек с комфортом.",
    inStock: true
  },
  {
    id: "3",
    name: "Ergonomic Office Chair",
    price: 24990,
    oldPrice: 29990,
    type: "Chairs",
    rating: 4.7,
    imageURL: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    purchaseCount: 215,
    description: "Эргономичное офисное кресло с регулируемой высотой, поддержкой поясницы и дышащей сетчатой спинкой. Разработано для длительного комфортного сидения.",
    inStock: true
  },
  {
    id: "4",
    name: "King Size Platform Bed",
    price: 62990,
    type: "Beds",
    rating: 4.5,
    imageURL: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    purchaseCount: 63,
    description: "Современная двуспальная кровать-платформа с деревянным каркасом и мягким изголовьем. Не требует пружинного блока.",
    inStock: true
  },
  {
    id: "5",
    name: "Minimalist Bookshelf",
    price: 19990,
    oldPrice: 24990,
    type: "Bookshelves",
    rating: 4.3,
    imageURL: "https://images.unsplash.com/photo-1594620302200-9a762244a156?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1769&q=80",
    purchaseCount: 92,
    description: "Минималистичный 5-ярусный книжный шкаф с металлическим каркасом и деревянными полками. Идеально подходит для демонстрации книг и декоративных предметов.",
    inStock: true
  },
  {
    id: "6",
    name: "Velvet Accent Chair",
    price: 31990,
    type: "Chairs",
    rating: 4.4,
    imageURL: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    purchaseCount: 78,
    description: "Роскошное бархатное акцентное кресло с ножками с золотистой отделкой. Добавляет нотку элегантности любому жилому пространству.",
    inStock: true
  },
  {
    id: "7",
    name: "Glass Coffee Table",
    price: 17990,
    oldPrice: 21990,
    type: "Tables",
    rating: 4.2,
    imageURL: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    purchaseCount: 105,
    description: "Современный журнальный столик с закаленной стеклянной столешницей и металлическим каркасом. Имеет нижнюю полку для дополнительного хранения.",
    inStock: true
  },
  {
    id: "8",
    name: "Wooden Wardrobe",
    price: 54990,
    type: "Wardrobes",
    rating: 4.6,
    imageURL: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    purchaseCount: 42,
    description: "Просторный деревянный шкаф с пространством для вешалок, полками и ящиками. Изготовлен из экологичного дуба с натуральной отделкой.",
    inStock: true
  },
  {
    id: "9",
    name: "Pendant Ceiling Light",
    price: 8990,
    oldPrice: 11990,
    type: "Lighting",
    rating: 4.5,
    imageURL: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    purchaseCount: 137,
    description: "Современный подвесной потолочный светильник с регулируемой высотой. Идеально подходит для обеденных зон и кухонных островов.",
    inStock: true
  },
  {
    id: "10",
    name: "Standing Desk",
    price: 37990,
    type: "Desks",
    rating: 4.7,
    imageURL: "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    purchaseCount: 89,
    description: "Электрический стоячий стол с регулировкой высоты. Плавный и тихий мотор с настройками памяти для разных высот.",
    inStock: true
  },
  {
    id: "11",
    name: "Storage Cabinet",
    price: 27990,
    oldPrice: 32990,
    type: "Cabinets",
    rating: 4.3,
    imageURL: "https://images.unsplash.com/photo-1601760561441-16420502c7e0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80",
    purchaseCount: 67,
    description: "Универсальный шкаф для хранения с регулируемыми полками и дверцами. Идеально подходит для гостиных, офисов или спален.",
    inStock: true
  },
  {
    id: "12",
    name: "Wall Mirror",
    price: 12990,
    type: "Decor",
    rating: 4.4,
    imageURL: "https://images.unsplash.com/photo-1618220252344-8ec99ec624b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    purchaseCount: 112,
    description: "Круглое настенное зеркало с тонкой металлической рамой. Добавляет света и пространства в любую комнату.",
    inStock: true
  }
];

export const promotions = products.filter(product => product.oldPrice !== undefined);