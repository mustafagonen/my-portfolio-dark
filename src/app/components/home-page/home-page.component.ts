import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { MgTechnologiesComponent } from "../technologies/technologies.component";

@Component({
    selector: 'mg-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss'],
    imports: [
        SharedModule,
        MgTechnologiesComponent,
    ],
    standalone: true
})
export class MgHomePageComponent implements OnInit {
    constructor() { }

    ngOnInit(): void { }
}
