import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { ordersRoute } from './app/pages/orders/orders.route';

export const appRoutes: Routes = [
        {
        path: '',
        component: AppLayout,
        children: [
            {
                path: 'order',
                children: ordersRoute
            }
        ]
    }
];
