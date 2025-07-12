import { Routes } from "@angular/router";

const orderListComponent = () => import('./components/order-list/order-list/order-list.component').then(m => m.OrderListComponent);


export const ordersRoute: Routes = [
    {
        path: "",
        loadComponent: orderListComponent
    }
]