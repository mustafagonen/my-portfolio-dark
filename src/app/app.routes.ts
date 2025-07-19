import { Routes } from '@angular/router';
import { MgHomePageComponent } from './components/home-page/home-page.component';
import { MgProjectDetailComponent } from './components/project-detail/project-detail.component';
import { MgProjectListComponent } from './components/project-list/project-list.component';
import { MgContactComponent } from './components/contact/contact.component';
import { MgHeroComponent } from './components/hero/hero.component';
import { MgAboutMeComponent } from './components/about-me/about-me.component';
import { MgTechnologiesComponent } from './components/technologies/technologies.component';
import { MgWorkListComponent } from './components/work-list/work-list.component';
import { MgErrorPageComponent } from './error-page/error-page.component';

export const routes: Routes = [


  { path: '', title: "MG Portfolio", component: MgHeroComponent },

  { path: 'about-me', title: "About Me", component: MgAboutMeComponent },

  { path: 'projects', title: "Projects", component: MgProjectListComponent },
  { path: 'projects/:id', title: "Projects", component: MgProjectDetailComponent },

  { path: 'works', title: "Works", component: MgWorkListComponent },

  { path: 'skills', title: "About Me", component: MgTechnologiesComponent },

  { path: 'contact', title: "Contact Me", component: MgContactComponent },

  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: MgErrorPageComponent }
];
