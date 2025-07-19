import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'mg-hero',
    templateUrl: './hero.component.html',
    styleUrls: ['./hero.component.scss'],
    imports: [
        SharedModule,
        TranslateModule
    ],
    standalone: true
})
export class MgHeroComponent implements OnInit {
    constructor(
        public translateService: TranslateService
    ) { }

    ngOnInit(): void { }
}
