import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpErrorLoggingInterCeptor } from './interceptors/http-interceptor.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

function initializeApp(translate: TranslateService) {
  return () => {
    const storedLang = localStorage.getItem('selectedLang');
    const defaultLang = 'tr'; // Uygulamanızın varsayılan dili

    if (storedLang && ['tr', 'en'].includes(storedLang)) { // Sadece geçerli dilleri kabul et
      translate.setDefaultLang(defaultLang); // Varsayılanı ayarla (loader için önemli)
      translate.use(storedLang); // Kullanıcının seçtiği dili kullan
    } else {
      translate.setDefaultLang(defaultLang);
      translate.use(defaultLang); // Varsayılan dili kullan
      localStorage.setItem('selectedLang', defaultLang); // Varsayılanı kaydet
    }
    return Promise.resolve();
  };
}


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideToastr(), // Toastr providers
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: LOCALE_ID, useValue: 'en-US' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorLoggingInterCeptor,
      multi: true,
      deps: [MatSnackBar]
    },
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        },
        defaultLanguage: 'tr' // Varsayılan dilinizi belirleyin
      })
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [TranslateService], // initializeApp fonksiyonuna TranslateService'i enjekte et
      multi: true // Birden fazla APP_INITIALIZER olabilir
    }
  ]
};
