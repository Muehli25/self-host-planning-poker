import {Component, inject, OnDestroy} from '@angular/core';
import {GameState} from '../../model/events';
import {Subscription} from 'rxjs';
import {Deck} from '../../model/deck';
import {CurrentGameService} from '../current-game.service';
import {PlayerHandComponent} from './player-hand/player-hand.component';
import {KeyValuePipe, NgFor} from '@angular/common';
import {TranslocoDirective} from '@jsverse/transloco';
import {UserInformationService} from "../../shared/user-info/user-information.service";

@Component({
  selector: 'shpp-card-table',
  templateUrl: './card-table.component.html',
  styleUrls: ['./card-table.component.scss'],
  imports: [TranslocoDirective, NgFor, PlayerHandComponent, KeyValuePipe]
})
export class CardTableComponent implements OnDestroy {
  state: GameState = {}
  canReveal = true;
  deck?: Deck;
  isSpectator = false;
  turnEnded = false;

  private stateSubscription: Subscription;
  private revealedSubscription: Subscription;
  private deckSubscription: Subscription;
  private userSpectatorSubscription: Subscription;
  private gameInfoSubscription: Subscription;

  private currentGameService = inject(CurrentGameService);
  private currentUserService = inject(UserInformationService);

  constructor() {
    this.stateSubscription = this.currentGameService.state$
      .subscribe((state: GameState) => {
        this.state = state;
      });

    this.gameInfoSubscription = this.currentGameService.gameInfo$
      .subscribe(value => this.turnEnded = value ? value.revealed : false);

    this.deckSubscription = this.currentGameService.deck$
      .subscribe((deck: Deck) => this.deck = deck);

    this.revealedSubscription = this.currentGameService.revealed$
      .subscribe((revealed: boolean) => this.canReveal = !revealed)

    this.userSpectatorSubscription = this.currentUserService.spectatorObservable()
      .subscribe(isSpectator => this.isSpectator = isSpectator)
  }

  revealCards(): void {
    this.currentGameService.revealCards();
  }

  endTurn(): void {
    this.currentGameService.endTurn();
  }

  ngOnDestroy(): void {
    this.stateSubscription.unsubscribe();
    this.revealedSubscription.unsubscribe();
    this.deckSubscription.unsubscribe();
    this.userSpectatorSubscription.unsubscribe();
    this.gameInfoSubscription.unsubscribe();
  }

  getId(item: any): string {
    return item.key;
  }

  party() {
    this.currentGameService.party();
  }
}
