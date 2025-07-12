import { Component, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AppTopbar } from './app.topbar';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [CommonModule, AppTopbar, RouterModule],
    template: `
    <div class="layout-wrapper">
        <app-topbar></app-topbar>        
        <router-outlet></router-outlet>                    
        <div class="layout-mask animate-fadein"></div>
    </div> `
})

export class AppLayout implements OnDestroy {
    @ViewChild(AppTopbar) appTopBar!: AppTopbar;

    private routerSubscription: Subscription;

    constructor(public router: Router) {
        this.routerSubscription = this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe(() => {
            });
    }

    ngOnDestroy(): void {
        if (this.routerSubscription) {
            this.routerSubscription.unsubscribe();
        }
    }
}