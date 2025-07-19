import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'mg-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    imports: [
        SharedModule,
        TranslateModule
    ],
    standalone: true
})
export class MgNavbarComponent implements OnInit {

    @ViewChild('mobileMenu') mobileMenu!: ElementRef;
    isMenuOpen: boolean = false; // Hamburger menü durumu

    constructor(
        public translateService: TranslateService
    ) { }

    ngOnInit(): void {
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
    }

    switchLanguage(lang: string) {
        this.translateService.use(lang);
        localStorage.setItem('selectedLang', lang);
        this.closeMenu();
    }

    closeMenu() {
        this.isMenuOpen = false; // Menü bağlantısına tıklanınca menüyü kapat
    }

}
