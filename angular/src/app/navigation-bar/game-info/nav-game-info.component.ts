import { Component, OnDestroy, inject } from '@angular/core';
import { GameInfo } from '../../model/events';
import { CurrentGameService } from '../../ongoing-game/current-game.service';
import { Deck } from '../../model/deck';
import { NgbOffcanvas, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { GameFormComponent } from '../../shared/game-form/game-form.component';

import { TranslocoDirective } from '@ngneat/transloco';

@Component({
    selector: 'shpp-game-info',
    templateUrl: './nav-game-info.component.html',
    imports: [TranslocoDirective, NgbTooltip, GameFormComponent]
})
export class NavGameInfoComponent implements OnDestroy {
  private currentGameService = inject(CurrentGameService);
  private offcanvaseService = inject(NgbOffcanvas);


  currentGameInfo?: GameInfo | null;
  private subscription: Subscription;

  constructor() {
    this.subscription = this.currentGameService.gameInfo$
    .subscribe((gameInfo) => this.currentGameInfo = gameInfo);
  }

  openEdit(content: any): void {
    this.offcanvaseService.open(content, {ariaLabelledBy: 'offcanvas-basic-title'})
      .result
      .then((result: {name: string, deck: Deck}) => {
        this.currentGameService.setDeck(result.deck);
        this.currentGameService.renameGame(result.name);
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
