import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer">
        Chat BI -
        <a href="https://github.com/CarlosDoScript" target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline">Github</a>
    </div>`
})
export class AppFooter {}