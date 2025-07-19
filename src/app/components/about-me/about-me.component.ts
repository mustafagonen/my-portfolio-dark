import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { TranslateModule } from '@ngx-translate/core';

interface TimelineItem {
    date: string;
    title: string;
    description: string;
}

@Component({
    selector: 'mg-about-me',
    templateUrl: './about-me.component.html',
    styleUrls: ['./about-me.component.scss'],
    imports: [
        SharedModule,
        TranslateModule
    ],
    standalone: true
})
export class MgAboutMeComponent implements OnInit {

    // Zaman çizelgesi verileri
    timelineItems: TimelineItem[] = [
        {
            date: 'ABOUT_SECTION.TIMELINE_ITEM_1_DATE',
            title: 'ABOUT_SECTION.TIMELINE_ITEM_1_TITLE',
            description: 'ABOUT_SECTION.TIMELINE_ITEM_1_DESC',
        },
        {
            date: 'ABOUT_SECTION.TIMELINE_ITEM_2_DATE',
            title: 'ABOUT_SECTION.TIMELINE_ITEM_2_TITLE',
            description: 'ABOUT_SECTION.TIMELINE_ITEM_2_DESC',
        },
        {
            date: 'ABOUT_SECTION.TIMELINE_ITEM_3_DATE',
            title: 'ABOUT_SECTION.TIMELINE_ITEM_3_TITLE',
            description: 'ABOUT_SECTION.TIMELINE_ITEM_3_DESC',
        },
        {
            date: 'ABOUT_SECTION.TIMELINE_ITEM_4_DATE',
            title: 'ABOUT_SECTION.TIMELINE_ITEM_4_TITLE',
            description: 'ABOUT_SECTION.TIMELINE_ITEM_4_DESC',
        },
        {
            date: 'ABOUT_SECTION.TIMELINE_ITEM_5_DATE',
            title: 'ABOUT_SECTION.TIMELINE_ITEM_5_TITLE',
            description: 'ABOUT_SECTION.TIMELINE_ITEM_5_DESC',
        },
        {
            date: 'ABOUT_SECTION.TIMELINE_ITEM_6_DATE',
            title: 'ABOUT_SECTION.TIMELINE_ITEM_6_TITLE',
            description: 'ABOUT_SECTION.TIMELINE_ITEM_6_DESC',
        },
    ];

    constructor() { }

    ngOnInit(): void {
    }

}