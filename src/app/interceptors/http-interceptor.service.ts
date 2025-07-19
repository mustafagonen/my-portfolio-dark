import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpResponse,
    HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router'; // Router'ı ekledik

@Injectable()
export class HttpErrorLoggingInterCeptor implements HttpInterceptor {
    private isRefreshingToken = false; // Token yenileme döngüsünü önlemek için
    // Hangi URL'leri atlayacağımızı belirten regex (veya array of strings)
    private readonly bypassUrls = [
        /assets\/(?:i18n\/.*\.json|images\/.*|icons\/.*)/, // i18n JSON, resimler, ikonlar
        /\.(?:css|js|png|jpg|jpeg|gif|svg|webp|ico)$/i, // Genel statik dosya uzantıları
        /Auths\/Login$/ // Eğer login isteği de token gerektirmiyorsa veya özel işlem görüyorsa
    ];

    constructor(
        private _toastrService: ToastrService, // ToastrService enjekte edildi
        private router: Router // Router enjekte edildi
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        // 1. skipInterceptor başlığını kontrol et (var olan mantığınız)
        if (request.headers.has('skipInterceptor')) {
            const headers = request.headers.delete('skipInterceptor');
            const clonedRequest = request.clone({ headers });
            return next.handle(clonedRequest);
        }

        // 2. Belirli URL'leri (örneğin assets) atla
        // Bu kontrolü, accessToken kontrolünden önce yapmalıyız ki,
        // assets istekleri için gereksiz yere token kontrolü yapılmasın.
        const shouldBypass = this.bypassUrls.some(pattern =>
            pattern instanceof RegExp ? pattern.test(request.url) : request.url.includes(pattern)
        );

        if (shouldBypass) {
            return next.handle(request); // Interceptor'ın geri kalanını atla
        }

        // 3. accessToken kontrolü ve Authorization başlığı ekleme
        const accessToken = localStorage.getItem('accessToken');

        if (accessToken) {
            request = request.clone({
                setHeaders: { Authorization: `Bearer ${accessToken}` }
            });
        } else {
            // AccessToken yok ve istek Login sayfası değilse
            // Login sayfasına yönlendirme yap.
            // Bu kısım sayfa yenileme döngüsüne neden olabilir, dikkatli kullanılmalı.
            // Genellikle login sayfası token gerektirmez ve redirect loop olmamalıdır.
            // Eğer burada bir döngü oluşuyorsa, login sayfasının kendisi de token istemiyor olmalı.
            if (!request.url.includes('Auths/Login') && !this.router.url.includes('/auths/login')) {
                // Eğer kullanıcı login sayfasında değilse ve token yoksa, login sayfasına yönlendir.
                // window.location.href yerine router.navigate kullanmak Angular Router'ın avantajlarından faydalanır.
                this._toastrService.warning('Oturumunuz sona ermiştir veya yetkiniz yoktur. Lütfen tekrar giriş yapın.');
                this.router.navigate(['/auths/login']); // Varsayılan login rota adınız
                // İsteği sonlandır, backend'e gitmesine gerek yok
                return throwError(() => new Error('Yetkilendirme Gerekli: AccessToken bulunamadı.'));
            }
        }

        // 4. CORS başlıkları istemci tarafında ayarlanmamalıdır.
        // Bu başlıklar sunucu tarafında ayarlanmalıdır. Bu satırları kaldırıyoruz.
        // request.headers.append("Access-Control-Allow-Origin", "*");
        // request.headers.append("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
        // request.headers.append("Access-Control-Allow-Headers", "Origin, Content-Type, X-Auth-Token");

        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => this.handleError(error))
        );
    }

    private handleError(error: HttpErrorResponse): Observable<any> {
        if (error.status === 500) {
            console.error(`Backend returned code ${error.status}, body was: `, error.error?.detail);
            this._toastrService.error(error.error?.detail || 'Bir sunucu hatası oluştu.');
        } else if (error.status === 401) { // Unauthorized Error
            console.warn('401 Unauthorized hatası alındı. Oturum sona ermiş olabilir.', error);

            // Sadece bir kez yönlendirme yapmak için kontrol
            if (!this.isRefreshingToken) { // Bu değişkeni token yenileme için kullanmak yerine basit bir bayrak olarak kullanabiliriz
                this.isRefreshingToken = true; // Yönlendirme başladı
                this._toastrService.error('Oturumunuz sona erdi. Lütfen tekrar giriş yapın.', 'Yetkisiz Erişim');
                localStorage.removeItem('accessToken'); // Geçersiz token'ı kaldır
                localStorage.removeItem('refreshToken'); // Refresh token da varsa onu da kaldırın
                this.router.navigate(['/auths/login']); // Login sayfasına yönlendir

                // Yönlendirmeden sonra isRefreshingToken'ı sıfırlamak için küçük bir gecikme
                // Bu, hızlı ardışık 401'leri önleyebilir.
                setTimeout(() => this.isRefreshingToken = false, 1000);
            }
            return throwError(() => new Error('Oturum sona erdi veya yetkisiz erişim.'));
        } else { // Client-side, network error, or other HTTP errors
            console.error('Bir hata oluştu:', error.error?.detail || error.message);
            this._toastrService.error(error.error?.detail || error.message || 'Bilinmeyen bir hata oluştu.');
        }

        // Hatanın akışını dışarıya iletmeye devam et
        return throwError(() => new Error(error.error?.Errors ? error.error.Errors[0].Errors[0] : error.error?.detail || 'Bilinmeyen bir hata oluştu.'));
    }
}