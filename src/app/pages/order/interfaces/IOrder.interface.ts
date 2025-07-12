import { OrderItem } from "./IOrderItem.interface";

export interface Order {
  id: number;
  customerId: number;
  customerName: string;
  orderDate: string;
  totalAmount: string;
  status: string;
  items: OrderItem[];
}
