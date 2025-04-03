export type Order = {
  id: number;
  accountId: string;
  status: string;
  address: string;
  orderTime: Date;
  deliveryTime?: Date;
  additionalNotes?: string;
  orderItems: OrderItem[];
};

export type OrderItem = {
  productId: number;
  quantity: number;
  totalPrice: number;
};
