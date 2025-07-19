// src/app/contact-page/contact-page.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // ReactiveFormsModule eklendi
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'mg-contact',
    templateUrl: './contact.component.html',
    styleUrl: './contact.component.scss',
    standalone: true,
    imports: [
        CommonModule,
        TranslateModule,
        ReactiveFormsModule
    ],

})
export class MgContactComponent implements OnInit, OnDestroy {
    contactForm!: FormGroup; // Form grubunu tanımlıyoruz
    isSubmitting: boolean = false;
    submissionSuccess: boolean | null = null; // null: beklemede, true: başarılı, false: hata

    private destroy$ = new Subject<void>();

    constructor(private fb: FormBuilder, private translate: TranslateService) { } // FormBuilder eklendi

    ngOnInit(): void {
        this.initForm();
    }

    initForm(): void {
        this.contactForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            subject: ['', Validators.required],
            message: ['', Validators.required]
        });
    }

    // Form alanının geçerli olup olmadığını kontrol etmek için yardımcı metod
    isInvalid(controlName: string): boolean {
        const control = this.contactForm.get(controlName);
        return control ? control.invalid && (control.dirty || control.touched) : false;
    }

    // Form gönderim metod
    onSubmit(): void {
        if (this.contactForm.valid) {
            this.isSubmitting = true;
            this.submissionSuccess = null; // Gönderim başladığında durumu sıfırla

            const formData = this.contactForm.value;
            console.log('Form verileri gönderiliyor:', formData);

            // Burası gerçek bir API çağrısı veya e-posta servis entegrasyonu olacak
            // Örnek olarak, 2 saniye gecikmeli bir simülasyon yapalım:
            setTimeout(() => {
                // Simülasyon: Başarılı veya başarısız bir gönderim
                const success = Math.random() > 0.3; // %70 başarı oranı

                if (success) {
                    this.submissionSuccess = true;
                    this.contactForm.reset(); // Formu sıfırla
                    // Başarı mesajını bir süre sonra gizle
                    setTimeout(() => this.submissionSuccess = null, 5000);
                } else {
                    this.submissionSuccess = false;
                }
                this.isSubmitting = false;
            }, 2000);

        } else {
            // Form geçersizse tüm alanları dokunulmuş olarak işaretle
            this.contactForm.markAllAsTouched();
            console.warn('Form geçersiz, lütfen tüm alanları doğru doldurun.');
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}