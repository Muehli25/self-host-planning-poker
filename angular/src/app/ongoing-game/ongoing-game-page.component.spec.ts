import { ComponentFixture, TestBed } from '@angular/core/testing';
import OngoingGamePageComponent from './ongoing-game-page.component';
import { CurrentGameService } from './current-game.service';
import { Title } from '@angular/platform-browser';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { BehaviorSubject, of } from 'rxjs';
import { GameInfo, GameState } from '../model/events';
import { PathLocationStrategy } from '@angular/common';

describe('OngoingGamePageComponent', () => {
  let component: OngoingGamePageComponent;
  let fixture: ComponentFixture<OngoingGamePageComponent>;
  let currentGameService: jasmine.SpyObj<CurrentGameService>;
  let titleService: jasmine.SpyObj<Title>;

  let gameInfoSubject: BehaviorSubject<GameInfo | null>;
  let revealedSubject: BehaviorSubject<boolean>;
  let stateSubject: BehaviorSubject<GameState>;

  beforeEach(async () => {
    gameInfoSubject = new BehaviorSubject<GameInfo | null>({
      name: 'Poker Room',
      deck: 'FIBONACCI',
      revealed: false
    });
    revealedSubject = new BehaviorSubject<boolean>(false);
    stateSubject = new BehaviorSubject<GameState>({});

    currentGameService = jasmine.createSpyObj('CurrentGameService', ['leave'], {
      gameInfo$: gameInfoSubject.asObservable(),
      revealed$: revealedSubject.asObservable(),
      state$: stateSubject.asObservable(),
      deck$: of({ name: 'FIBONACCI', textValues: false, values: [] }),
      newGame$: of(void 0)
    });

    titleService = jasmine.createSpyObj('Title', ['setTitle']);

    await TestBed.configureTestingModule({
      imports: [
        OngoingGamePageComponent,
        TranslocoTestingModule.forRoot({
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
          langs: { en: { 'ongoingGame.page-title': 'Poker Room Title' } }
        })
      ],
      providers: [
        { provide: CurrentGameService, useValue: currentGameService },
        { provide: Title, useValue: titleService },
        {
          provide: PathLocationStrategy,
          useValue: jasmine.createSpyObj('PathLocationStrategy', ['getBaseHref'])
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OngoingGamePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and set page title', () => {
    expect(component).toBeTruthy();
    expect(titleService.setTitle).toHaveBeenCalledWith('Poker Room Title');
    expect(component.showSummary).toBeFalse();
  });

  it('should update showSummary when revealed emits', () => {
    revealedSubject.next(true);
    expect(component.showSummary).toBeTrue();
  });

  it('should call leave on CurrentGameService upon destruction', () => {
    component.ngOnDestroy();
    expect(currentGameService.leave).toHaveBeenCalled();
  });
});
