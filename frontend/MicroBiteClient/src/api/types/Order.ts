export type Order = {
  id: number;
  status: OrderStatus;
  accountId: string;
  address: string;
  orderTime: string;
  deliveryTime?: string;
  additionalNotes?: string;
  orderItems: OrderItem[];
};

export type OrderItem = {
  id: number;
  product?: Product;
  totalPrice: number;
  count: number;
};

export type OrderStatus = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  category: ProductCategory;
  name: string;
  price: number;
  description: string;
  image?: string;
};

export type ProductCategory = {
  id: number;
  name: string;
};