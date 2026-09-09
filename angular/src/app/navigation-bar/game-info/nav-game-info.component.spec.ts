import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavGameInfoComponent } from './nav-game-info.component';
import { CurrentGameService } from '../../ongoing-game/current-game.service';
import { NgbOffcanvas, NgbOffcanvasRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { BehaviorSubject } from 'rxjs';
import { GameInfo } from '../../model/events';
import { decksDict } from '../../model/deck';

describe('NavGameInfoComponent', () => {
  let component: NavGameInfoComponent;
  let fixture: ComponentFixture<NavGameInfoComponent>;
  let currentGameService: jasmine.SpyObj<CurrentGameService>;
  let offcanvasService: jasmine.SpyObj<NgbOffcanvas>;
  let gameInfoSubject: BehaviorSubject<GameInfo | null>;

  beforeEach(async () => {
    gameInfoSubject = new BehaviorSubject<GameInfo | null>({
      name: 'Game A',
      deck: 'FIBONACCI',
      revealed: false
    });

    currentGameService = jasmine.createSpyObj('CurrentGameService', ['setDeck', 'renameGame'], {
      gameInfo$: gameInfoSubject.asObservable()
    });

    offcanvasService = jasmine.createSpyObj('NgbOffcanvas', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        NavGameInfoComponent,
        TranslocoTestingModule.forRoot({
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
          langs: { en: {} }
        })
      ],
      providers: [
        { provide: CurrentGameService, useValue: currentGameService },
        { provide: NgbOffcanvas, useValue: offcanvasService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavGameInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and receive current game info', () => {
    expect(component).toBeTruthy();
    expect(component.currentGameInfo).toEqual({
      name: 'Game A',
      deck: 'FIBONACCI',
      revealed: false
    });
  });

  it('should open edit offcanvas and update game on promise resolve', async () => {
    const mockRef = {
      result: Promise.resolve({ name: 'Renamed Game', deck: decksDict['T_SHIRTS'] })
    } as NgbOffcanvasRef;

    offcanvasService.open.and.returnValue(mockRef);

    component.openEdit('template-content');
    expect(offcanvasService.open).toHaveBeenCalledWith('template-content', { ariaLabelledBy: 'offcanvas-basic-title' });

    await mockRef.result;

    expect(currentGameService.setDeck).toHaveBeenCalledWith(decksDict['T_SHIRTS']);
    expect(currentGameService.renameGame).toHaveBeenCalledWith('Renamed Game');
  });
});
