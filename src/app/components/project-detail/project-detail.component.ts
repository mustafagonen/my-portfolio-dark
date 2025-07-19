// src/app/project-detail/project-detail.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; // Router da eklendi
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';
import { map, switchMap } from 'rxjs/operators'; // map ve switchMap import edildi

interface Project {
    id: string;
    image: string | null;
    titleKey: string;
    descriptionKey: string;
    technologies: string[];
    demoLink?: string | null;
    demoLinkLabel: string;
    demoAdminLink: string | null;
    demoAdminLinkLabel: string;
    githubLink: string | null;
    type?: string;
    contributionsTitleKey: string;
    contributionsKeys: string[];
}

@Component({
    selector: 'mg-project-detail',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        RouterModule // RouterLink için
    ],
    templateUrl: './project-detail.component.html',
    styleUrl: './project-detail.component.scss'
})
export class MgProjectDetailComponent implements OnInit, OnDestroy {
    project: Project | undefined; // Seçilen proje
    private destroy$ = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private router: Router, // Geri butonu için
        private translate: TranslateService
    ) { }

    ngOnInit(): void {
        this.route.paramMap.pipe(
            switchMap(params => {
                const projectId = params.get('id');
                // Dil değiştiğinde veya proje ID'si değiştiğinde veriyi tekrar çek
                return this.translate.get('PROJECTS_SECTION.PROJECT_ITEMS').pipe(
                    map((projects: Project[]) => projects.find(p => p.id === projectId))
                );
            }),
            takeUntil(this.destroy$)
        ).subscribe(project => {
            if (project) {
                this.project = project;
            } else {
                // Proje bulunamazsa ana projeler sayfasına veya 404 sayfasına yönlendir
                this.router.navigate(['/projects']);
            }
        });

        // Dil değiştiğinde de projenin yeniden yüklenmesini sağla
        this.translate.onLangChange
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                // Mevcut route parametrelerini tekrar kullanarak projeyi yükle
                const projectId = this.route.snapshot.paramMap.get('id');
                if (projectId) {
                    this.translate.get('PROJECTS_SECTION.PROJECT_ITEMS').pipe(
                        map((projects: Project[]) => projects.find(p => p.id === projectId)),
                        takeUntil(this.destroy$)
                    ).subscribe(project => {
                        if (project) {
                            this.project = project;
                        } else {
                            this.router.navigate(['/projects']);
                        }
                    });
                }
            });
    }

    goBack(): void {
        this.router.navigate(['/projects']); // Veya window.history.back() kullanabilirsiniz
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}