import { Component, OnInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { SharedModule } from '../../shared.module';

interface ProjectItem {
    id: string;
    image: string;
    titleKey: string;
    descriptionKey: string;
    technologies: string[];
    demoLink: string;
    demoLinkLabel: string;
    demoAdminLink: string;
    demoAdminLinkLabel: string;
    githubLink: string;
}

@Component({
    selector: 'mg-work-list',
    templateUrl: './work-list.component.html',
    styleUrls: ['./work-list.component.scss'],
    imports: [
        SharedModule,
        TranslateModule
    ],
    standalone: true
})
export class MgWorkListComponent implements OnInit {
    works: ProjectItem[] = []; // Proje verilerini tutacak dizi
    private destroy$ = new Subject<void>(); // Abonelik yönetimi için

    constructor(private _translateService: TranslateService) { }

    ngOnInit(): void {
        // Dil değiştiğinde veya bileşen ilk yüklendiğinde proje verilerini yükle
        this._translateService.onLangChange
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.loadProjects();
            });

        // İlk yüklemede de verileri yükle
        this.loadProjects();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadProjects(): void {
        // PROJECTS_SECTION.PROJECT_ITEMS anahtarını kullanarak JSON'dan diziyi çekiyoruz
        this._translateService.get('WORKS_SECTION.WORK_ITEMS')
            .pipe(takeUntil(this.destroy$)) // pipe eklemeyi unutmayın
            .subscribe((items: ProjectItem[]) => {
                this.works = items;
            });
    }
}