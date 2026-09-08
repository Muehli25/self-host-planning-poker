import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavGameNameComponent } from './nav-game-name.component';
import { CurrentGameService } from '../../ongoing-game/current-game.service';
import { ToastService } from '../../shared/toast/toast.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { BehaviorSubject } from 'rxjs';
import { GameInfo } from '../../model/events';
import { QrCodeModalContentComponent } from './qr-code-modal-content/qr-code-modal-content.component';

describe('NavGameNameComponent', () => {
  let component: NavGameNameComponent;
  let fixture: ComponentFixture<NavGameNameComponent>;
  let currentGameService: jasmine.SpyObj<CurrentGameService>;
  let toastService: jasmine.SpyObj<ToastService>;
  let clipboard: jasmine.SpyObj<Clipboard>;
  let modalService: jasmine.SpyObj<NgbModal>;
  let gameInfoSubject: BehaviorSubject<GameInfo | null>;

  beforeEach(async () => {
    gameInfoSubject = new BehaviorSubject<GameInfo | null>({
      name: 'Test Room',
      deck: 'FIBONACCI',
      revealed: false
    });

    currentGameService = jasmine.createSpyObj('CurrentGameService', [], {
      gameInfo$: gameInfoSubject.asObservable()
    });

    toastService = jasmine.createSpyObj('ToastService', ['show']);
    clipboard = jasmine.createSpyObj('Clipboard', ['copy']);
    modalService = jasmine.createSpyObj('NgbModal', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        NavGameNameComponent,
        TranslocoTestingModule.forRoot({
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
          langs: { en: { 'navbar.gameName.copy-toast': 'Copied link!' } }
        })
      ],
      providers: [
        { provide: CurrentGameService, useValue: currentGameService },
        { provide: ToastService, useValue: toastService },
        { provide: Clipboard, useValue: clipboard },
        { provide: NgbModal, useValue: modalService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavGameNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and receive game info', () => {
    expect(component).toBeTruthy();
    expect(component.currentGameInfo).toEqual({
      name: 'Test Room',
      deck: 'FIBONACCI',
      revealed: false
    });
  });

  it('should copy current URL to clipboard and show toast', () => {
    component.copyLink();

    expect(clipboard.copy).toHaveBeenCalled();
    expect(toastService.show).toHaveBeenCalledWith('Copied link!');
  });

  it('should open QR code modal with current URL', () => {
    const mockComponentInstance = { url: '' };
    modalService.open.and.returnValue({ componentInstance: mockComponentInstance } as any);

    component.displayQrCode();

    expect(modalService.open).toHaveBeenCalledWith(QrCodeModalContentComponent);
    expect(mockComponentInstance.url).toBe(window.location.toString());
  });
});
