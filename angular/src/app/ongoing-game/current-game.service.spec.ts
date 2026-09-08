import { TestBed } from '@angular/core/testing';
import { CurrentGameService, canActivateGame } from './current-game.service';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { UserInformationService } from '../shared/user-info/user-information.service';
import { ToastService } from '../shared/toast/toast.service';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { PathLocationStrategy } from '@angular/common';
import { BehaviorSubject, of } from 'rxjs';
import { decksDict } from '../model/deck';

describe('CurrentGameService', () => {
  let service: CurrentGameService;
  let router: jasmine.SpyObj<Router>;
  let userInformation: jasmine.SpyObj<UserInformationService>;
  let toastService: jasmine.SpyObj<ToastService>;
  let pls: jasmine.SpyObj<PathLocationStrategy>;

  let mockSocket: any;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['parseUrl']);
    userInformation = jasmine.createSpyObj('UserInformationService', [
      'nameObservable',
      'spectatorObservable',
      'getName',
      'isSpectator',
      'setPlayerIdSubject'
    ]);
    userInformation.nameObservable.and.returnValue(of('Alice'));
    userInformation.spectatorObservable.and.returnValue(of(false));
    userInformation.getName.and.returnValue('Alice');
    userInformation.isSpectator.and.returnValue(false);

    toastService = jasmine.createSpyObj('ToastService', ['show']);

    pls = jasmine.createSpyObj('PathLocationStrategy', ['getBaseHref']);
    pls.getBaseHref.and.returnValue('/');

    mockSocket = {
      connected: false,
      on: jasmine.createSpy('on'),
      emit: jasmine.createSpy('emit'),
      connect: jasmine.createSpy('connect').and.returnValue({
        emitWithAck: jasmine.createSpy('emitWithAck')
      }),
      disconnect: jasmine.createSpy('disconnect')
    };

    TestBed.configureTestingModule({
      imports: [
        TranslocoTestingModule.forRoot({
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
          langs: { en: {} }
        })
      ],
      providers: [
        CurrentGameService,
        { provide: Router, useValue: router },
        { provide: UserInformationService, useValue: userInformation },
        { provide: ToastService, useValue: toastService },
        { provide: PathLocationStrategy, useValue: pls }
      ]
    });

    service = TestBed.inject(CurrentGameService);
    // Replace internal socket with mockSocket for targeted socket interaction testing
    (service as any).socket = mockSocket;
  });

  it('should be created and setup socket listener mappings', () => {
    expect(service).toBeTruthy();
  });

  it('should disconnect socket and reset subjects on leave()', () => {
    service.leave();
    expect(mockSocket.disconnect).toHaveBeenCalled();
  });

  it('should emit socket events for game actions', () => {
    service.renameGame('New Name');
    expect(mockSocket.emit).toHaveBeenCalledWith('rename_game', { name: 'New Name' }, jasmine.any(Function));

    service.setDeck(decksDict['T_SHIRTS']);
    expect(mockSocket.emit).toHaveBeenCalledWith('set_deck', { deck: 'T_SHIRTS' }, jasmine.any(Function));

    service.pickCard(5);
    expect(mockSocket.emit).toHaveBeenCalledWith('pick_card', { card: 5 }, jasmine.any(Function));

    service.revealCards();
    expect(mockSocket.emit).toHaveBeenCalledWith('reveal_cards', jasmine.any(Function));

    service.endTurn();
    expect(mockSocket.emit).toHaveBeenCalledWith('end_turn', jasmine.any(Function));
  });

  it('should execute canActivate successfully when join succeeds', async () => {
    const mockRoute = { params: { gameId: 'room1' } } as unknown as ActivatedRouteSnapshot;
    const emitWithAckSpy = jasmine.createSpy('emitWithAck').and.returnValue(
      Promise.resolve({ name: 'Room 1', deck: 'FIBONACCI', revealed: false, playerId: 'p1' })
    );
    mockSocket.connect.and.returnValue({ emitWithAck: emitWithAckSpy });

    const result = await service.canActivate(mockRoute);

    expect(result).toBeTrue();
    expect(userInformation.setPlayerIdSubject).toHaveBeenCalledWith('p1');
  });

  it('should handle join error in canActivate and redirect to home', async () => {
    const mockRoute = { params: { gameId: 'room1' } } as unknown as ActivatedRouteSnapshot;
    const emitWithAckSpy = jasmine.createSpy('emitWithAck').and.returnValue(
      Promise.resolve({ error: true, message: 'Game not found', code: 404 })
    );
    mockSocket.connect.and.returnValue({ emitWithAck: emitWithAckSpy });
    router.parseUrl.and.returnValue('/' as any);

    const result = await service.canActivate(mockRoute);

    expect(mockSocket.disconnect).toHaveBeenCalled();
    expect(router.parseUrl).toHaveBeenCalledWith('/');
    expect(result).toBe('/' as any);
  });

  it('should invoke canActivateGame guard function', async () => {
    const mockRoute = { params: { gameId: 'room1' } } as unknown as ActivatedRouteSnapshot;
    const emitWithAckSpy = jasmine.createSpy('emitWithAck').and.returnValue(
      Promise.resolve({ name: 'Room 1', deck: 'FIBONACCI', revealed: false, playerId: 'p1' })
    );
    mockSocket.connect.and.returnValue({ emitWithAck: emitWithAckSpy });

    const guardResult = await TestBed.runInInjectionContext(() =>
      canActivateGame(mockRoute, {} as any)
    );
    expect(guardResult).toBeTrue();
  });
});
