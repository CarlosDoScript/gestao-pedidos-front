import { Routes } from "@angular/router";

const orderListComponent = () => import('./components/order/order.component').then(m => m.OrderListComponent);


export const ordersRoute: Routes = [
    {
        path: "",
        loadComponent: orderListComponent
    }
]