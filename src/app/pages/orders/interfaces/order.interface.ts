import { OrderItem } from "./orderItem.interface";

export interface Order {
  id: number;
  customerId: number;
  customerName: string;
  orderDate: string;
  totalAmount: string;
  status: string;
  items: OrderItem[];
}
