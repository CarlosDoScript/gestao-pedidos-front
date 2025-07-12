import { OrderCreateItem } from "./IOrderCreateItem.interface";

export interface OrderCreate {
  customerId: number;
  items: OrderCreateItem[];
}
