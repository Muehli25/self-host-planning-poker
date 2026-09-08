import { Component, OnDestroy, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslocoService } from '@ngneat/transloco';
import { Subscription, switchMap } from 'rxjs';
import { CurrentGameService } from './current-game.service';
import { CardPickerComponent } from './card-picker/card-picker.component';
import { TurnSummaryComponent } from './turn-summary/turn-summary.component';

import { CardTableComponent } from './card-table/card-table.component';
import { NavPlayerInfoComponent } from '../navigation-bar/player-info/nav-player-info.component';
import { NavGameInfoComponent } from '../navigation-bar/game-info/nav-game-info.component';
import { NavGameNameComponent } from '../navigation-bar/game-name/nav-game-name.component';
import { ContainerComponent } from '../shared/container/container.component';

@Component({
    selector: 'shpp-ongoing-game-page',
    templateUrl: './ongoing-game-page.component.html',
    styleUrls: ['./ongoing-game-page.component.scss'],
    imports: [
    ContainerComponent,
    NavGameNameComponent,
    NavGameInfoComponent,
    NavPlayerInfoComponent,
    CardTableComponent,
    TurnSummaryComponent,
    CardPickerComponent
]
})
export default class OngoingGamePageComponent implements OnDestroy {
  private currentGameService = inject(CurrentGameService);
  private titleService = inject(Title);
  private transloco = inject(TranslocoService);

  private gameInfoSubscription: Subscription;
  private revealedSubscription: Subscription;

  showSummary = false;

  constructor() {
    this.gameInfoSubscription = this.currentGameService.gameInfo$
    .pipe(
      switchMap((gameInfo) => this.transloco.selectTranslate('ongoingGame.page-title', { gameName: gameInfo?.name })))
    .subscribe((translatedPageTitle) => this.titleService.setTitle(translatedPageTitle));
    this.revealedSubscription = this.currentGameService.revealed$.subscribe((revealed) => this.showSummary = revealed);
  }

  ngOnDestroy(): void {
    this.gameInfoSubscription.unsubscribe();
    this.revealedSubscription.unsubscribe();
    this.currentGameService.leave();
  }

}
