import { OrderItem } from "./orderItem.interface";

export interface OrderDetail {
  id: number;
  customerId: number;
  customerName: string;
  orderDate: string;
  totalAmount: string;
  status: string;
  items: OrderItem[];
}