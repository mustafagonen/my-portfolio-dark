// src/app/skills-section/skills-section.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Subject, takeUntil } from 'rxjs';

interface Skill {
    name: string;
    category: 'frontend' | 'backend' | 'databases' | 'devops' | 'tools';
    iconClass?: string; // Font Awesome ikonu sınıfı (opsiyonel)
}


@Component({
    selector: 'mg-technologies',
    templateUrl: './technologies.component.html',
    styleUrl: './technologies.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule
    ],

})
export class MgTechnologiesComponent implements OnInit, OnDestroy {
    groupedSkills: any;
    categoryTitles: { [key: string]: string } = {}; // Kategori başlıkları için çeviriler

    private destroy$ = new Subject<void>();

    constructor(private translate: TranslateService) { }

    ngOnInit(): void {
        this.loadSkills();

        // Dil değiştiğinde yetenekleri tekrar yükle
        this.translate.onLangChange
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.loadSkills();
            });
    }

    loadSkills(): void {
        // Kategori başlıklarını çevirileriyle birlikte yükle
        this.translate.get([
            'SKILLS_SECTION.FRONTEND_TITLE',
            'SKILLS_SECTION.BACKEND_TITLE',
            'SKILLS_SECTION.DATABASES_TITLE',
            'SKILLS_SECTION.DEVOPS_TITLE',
            'SKILLS_SECTION.TOOLS_TITLE'
        ])
            .pipe(takeUntil(this.destroy$))
            .subscribe(translations => {
                this.categoryTitles = {
                    'frontend': translations['SKILLS_SECTION.FRONTEND_TITLE'],
                    'backend': translations['SKILLS_SECTION.BACKEND_TITLE'],
                    'databases': translations['SKILLS_SECTION.DATABASES_TITLE'],
                    'devops': translations['SKILLS_SECTION.DEVOPS_TITLE'],
                    'tools': translations['SKILLS_SECTION.TOOLS_TITLE']
                };

                // Yetenekleri yükle ve kategoriye göre grupla
                this.translate.get('SKILLS_SECTION.SKILL_ITEMS')
                    .pipe(takeUntil(this.destroy$))
                    .subscribe((data: Skill[]) => {
                        if (data) {
                            this.groupedSkills = this.groupSkillsByCategory(data);
                        } else {
                            console.warn('Yetenek verileri bulunamadı veya boş.');
                            this.groupedSkills = {};
                        }
                    });
            });
    }

    private groupSkillsByCategory(skills: Skill[]): any {
        return skills.reduce((acc, skill) => {
            if (!acc[skill.category]) {
                acc[skill.category] = [];
            }
            acc[skill.category].push(skill);
            return acc;
        }, {} as any);
    }

    getCategoryKeys(): string[] {
        return Object.keys(this.groupedSkills);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}