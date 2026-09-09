import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { getBrowserCultureLang, getBrowserLang, TranslocoService } from '@ngneat/transloco';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';
import { RouterOutlet } from '@angular/router';
import { ToastsContainerComponent } from './shared/toast/toast-container.component';

@Component({
    selector: 'shpp-root',
    templateUrl: './app.component.html',
    styles: [],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [RouterOutlet, ToastsContainerComponent]
})
export class AppComponent {
  private transloco = inject(TranslocoService);
  private translocoLocale = inject(TranslocoLocaleService);


  constructor() {
    const transloco = this.transloco;
    const translocoLocale = this.translocoLocale;

    transloco.setActiveLang(getBrowserLang() || 'en');
    translocoLocale.setLocale(getBrowserCultureLang())
  }
}
