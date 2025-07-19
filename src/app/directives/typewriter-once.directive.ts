import { Directive, ElementRef, Input, OnInit, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
    selector: '[appTypewriterOnce]'
})
export class TypewriterOnceDirective implements OnInit, OnDestroy {
    @Input() textsToCycle: string[] = [];
    @Input() typingSpeed: number = 100;
    @Input() erasingSpeed: number = 70;
    @Input() pauseAfterType: number = 1000;
    @Input() pauseAfterErase: number = 500;
    @Input() startDelay: number = 0;
    @Input() loop: boolean = true;

    private currentTextIndex: number = 0;
    private charIndex: number = 0;
    private isDeleting: boolean = false;
    private typingInterval: any;
    private caretElement?: HTMLElement;

    constructor(private el: ElementRef, private renderer: Renderer2) { }

    ngOnInit() {
        if (!this.textsToCycle || this.textsToCycle.length === 0) {
            console.warn('TypewriterOnceDirective: textsToCycle is empty. No animation will run.');
            return;
        }

        this.renderer.setProperty(this.el.nativeElement, 'textContent', '');

        this.caretElement = this.renderer.createElement('span');
        this.renderer.addClass(this.caretElement, 'typewriter-caret');
        // this.renderer.appendChild(this.caretElement, this.renderer.createText('|'));
        this.renderer.appendChild(this.el.nativeElement, this.caretElement);

        setTimeout(() => {
            this.typeText();
        }, this.startDelay);
    }

    private typeText() {
        const fullText = this.textsToCycle[this.currentTextIndex];

        this.typingInterval = setInterval(() => {
            if (!this.isDeleting) {
                // --- YAZMA MODU ---
                this.charIndex++;
                const displayedText = fullText.substring(0, this.charIndex);
                this.renderer.setProperty(this.el.nativeElement, 'textContent', displayedText);
                this.renderer.appendChild(this.el.nativeElement, this.caretElement);

                // Metnin tamamı yazıldıysa
                if (this.charIndex === fullText.length) {
                    clearInterval(this.typingInterval); // Yazma interval'ini durdur

                    // YENİ KONTROL: Eğer loop false ise ve tüm metinler yazıldıysa burada sonlandır
                    // VE ekranda yazılı kalsın
                    if (!this.loop && this.currentTextIndex === this.textsToCycle.length - 1) {
                        // Animasyonu sonlandır, imleci kaldır ama metni silme
                        if (this.caretElement && this.el.nativeElement.contains(this.caretElement)) {
                            this.renderer.removeChild(this.el.nativeElement, this.caretElement); // İmleci kaldır
                        }
                        // Burada başka bir animasyon başlatabilirsiniz (örneğin imlecin hafifçe kaybolması)
                        return; // Fonksiyondan çık
                    }

                    // Aksi takdirde silme moduna geç ve döngüye devam et
                    this.isDeleting = true;
                    this.renderer.addClass(this.caretElement, 'blink-caret-v2');
                    setTimeout(() => this.typeText(), this.pauseAfterType);
                }
            } else {
                // --- SİLME MODU ---
                this.charIndex--;
                const displayedText = fullText.substring(0, this.charIndex);
                this.renderer.setProperty(this.el.nativeElement, 'textContent', displayedText);
                this.renderer.appendChild(this.el.nativeElement, this.caretElement);

                // Metnin tamamı silindiyse
                if (this.charIndex === 0) {
                    clearInterval(this.typingInterval); // Silme interval'ini durdur
                    this.isDeleting = false;
                    this.currentTextIndex = (this.currentTextIndex + 1) % this.textsToCycle.length; // Bir sonraki metne geç (döngü için)
                    this.renderer.removeClass(this.caretElement, 'blink-caret-v2');
                    setTimeout(() => this.typeText(), this.pauseAfterErase);
                }
            }
        }, this.isDeleting ? this.erasingSpeed : this.typingSpeed);
    }

    ngOnDestroy() {
        // Bileşen yok edildiğinde tüm zamanlayıcıları temizle
        if (this.typingInterval) {
            clearInterval(this.typingInterval);
        }
        // İmleci de DOM'dan kaldır (eğer yukarıda zaten kaldırılmadıysa)
        if (this.caretElement && this.el.nativeElement.contains(this.caretElement)) {
            this.renderer.removeChild(this.el.nativeElement, this.caretElement);
        }
    }
}