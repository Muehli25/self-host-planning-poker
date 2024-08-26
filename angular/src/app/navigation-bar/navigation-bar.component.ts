import { Component } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { BaseHrefPipe } from "../shared/base-href.pipe";

@Component({
  standalone: true,
  selector: 'shpp-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  imports: [TranslocoDirective, BaseHrefPipe],
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent {

}
