import { Component } from '@angular/core';
import { getBrowserCultureLang, getBrowserLang, TranslocoService } from '@jsverse/transloco';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { RouterOutlet } from '@angular/router';
import { ToastsContainerComponent } from './shared/toast/toast-container.component';

@Component({
    selector: 'shpp-root',
    templateUrl: './app.component.html',
    styles: [],
    standalone: true,
    imports: [RouterOutlet, ToastsContainerComponent]
})
export class AppComponent {

  constructor(private transloco: TranslocoService,
              private translocoLocale: TranslocoLocaleService) {
    transloco.setActiveLang(getBrowserLang() || 'en');
    translocoLocale.setLocale(getBrowserCultureLang())
  }
}
