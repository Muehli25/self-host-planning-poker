import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardTableComponent } from './card-table.component';
import { CurrentGameService } from '../current-game.service';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { BehaviorSubject } from 'rxjs';
import { GameState } from '../../model/events';
import { Deck, decksDict } from '../../model/deck';

describe('CardTableComponent', () => {
  let component: CardTableComponent;
  let fixture: ComponentFixture<CardTableComponent>;
  let currentGameService: jasmine.SpyObj<CurrentGameService>;

  let stateSubject: BehaviorSubject<GameState>;
  let deckSubject: BehaviorSubject<Deck>;
  let revealedSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    stateSubject = new BehaviorSubject<GameState>({
      'p1': { name: 'Alice', spectator: false, hasPicked: true, hand: 5 }
    });
    deckSubject = new BehaviorSubject<Deck>(decksDict['FIBONACCI']);
    revealedSubject = new BehaviorSubject<boolean>(false);

    currentGameService = jasmine.createSpyObj('CurrentGameService', ['revealCards', 'endTurn'], {
      state$: stateSubject.asObservable(),
      deck$: deckSubject.asObservable(),
      revealed$: revealedSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      imports: [
        CardTableComponent,
        TranslocoTestingModule.forRoot({
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
          langs: { en: {} }
        })
      ],
      providers: [
        { provide: CurrentGameService, useValue: currentGameService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CardTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and receive game state and deck', () => {
    expect(component).toBeTruthy();
    expect(component.state).toEqual({
      'p1': { name: 'Alice', spectator: false, hasPicked: true, hand: 5 }
    });
    expect(component.deck).toEqual(decksDict['FIBONACCI']);
    expect(component.canReveal).toBeTrue();
  });

  it('should update canReveal when revealedSubject changes', () => {
    revealedSubject.next(true);
    expect(component.canReveal).toBeFalse();
  });

  it('should call revealCards on CurrentGameService', () => {
    component.revealCards();
    expect(currentGameService.revealCards).toHaveBeenCalled();
  });

  it('should call endTurn on CurrentGameService', () => {
    component.endTurn();
    expect(currentGameService.endTurn).toHaveBeenCalled();
  });

  it('should return key from getId', () => {
    expect(component.getId({ key: 'p1', value: {} })).toBe('p1');
  });
});
