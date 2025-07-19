// src/app/not-found-page/not-found-page.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterLink } from '@angular/router'; // routerLink için import edildi

@Component({
    selector: 'mg-error-page',
    templateUrl: './error-page.component.html',
    styleUrl: './error-page.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
    ],

})
export class MgErrorPageComponent {
    constructor(private translate: TranslateService) { } // TranslateService'i kullanmak isterseniz
}