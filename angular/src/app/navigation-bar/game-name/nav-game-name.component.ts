import { Component, OnDestroy, inject, ChangeDetectionStrategy } from '@angular/core';
import { CurrentGameService } from '../../ongoing-game/current-game.service';
import { GameInfo } from '../../model/events';
import { Subscription } from 'rxjs';
import { ToastService } from '../../shared/toast/toast.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { TranslocoDirective, TranslocoService } from '@ngneat/transloco';
import { NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

import { QrCodeModalContentComponent } from "./qr-code-modal-content/qr-code-modal-content.component";

@Component({
    selector: 'shpp-game-name',
    templateUrl: './nav-game-name.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [TranslocoDirective, NgbTooltip]
})
export class NavGameNameComponent implements OnDestroy {
  private currentGameService = inject(CurrentGameService);
  private toastService = inject(ToastService);
  private clipboard = inject(Clipboard);
  private modalService = inject(NgbModal);
  private transloco = inject(TranslocoService);


  currentGameInfo: GameInfo | null | undefined;
  private gameInfoSubscription: Subscription;

  constructor() {
    this.gameInfoSubscription = this.currentGameService.gameInfo$
    .subscribe((gameInfo) => this.currentGameInfo = gameInfo);
  }

  ngOnDestroy(): void {
    this.gameInfoSubscription.unsubscribe();
  }

  copyLink(): void {
    this.clipboard.copy(this.getUrl());
    this.toastService.show(
      this.transloco.translate('navbar.gameName.copy-toast')
    )
  }

  displayQrCode(): void {
    const modalRef = this.modalService.open(QrCodeModalContentComponent);
    modalRef.componentInstance.url = this.getUrl();
  }

  private getUrl(): string {
    return window.location.toString();
  }
}
