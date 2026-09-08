import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TurnSummaryComponent } from './turn-summary.component';
import { CurrentGameService } from '../current-game.service';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { provideTranslocoLocale } from '@ngneat/transloco-locale';
import { BehaviorSubject } from 'rxjs';
import { GameInfo, GameState } from '../../model/events';

describe('TurnSummaryComponent', () => {
  let component: TurnSummaryComponent;
  let fixture: ComponentFixture<TurnSummaryComponent>;
  let currentGameService: jasmine.SpyObj<CurrentGameService>;

  let stateSubject: BehaviorSubject<GameState>;
  let gameInfoSubject: BehaviorSubject<GameInfo | null>;

  beforeEach(async () => {
    stateSubject = new BehaviorSubject<GameState>({
      'p1': { name: 'Alice', spectator: false, hasPicked: true, hand: 5 },
      'p2': { name: 'Bob', spectator: false, hasPicked: true, hand: 5 },
      'p3': { name: 'Charlie', spectator: false, hasPicked: true, hand: 8 }
    });

    gameInfoSubject = new BehaviorSubject<GameInfo | null>({
      name: 'Game 1',
      deck: 'FIBONACCI',
      revealed: true
    });

    currentGameService = jasmine.createSpyObj('CurrentGameService', [], {
      state$: stateSubject.asObservable(),
      gameInfo$: gameInfoSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      imports: [
        TurnSummaryComponent,
        TranslocoTestingModule.forRoot({
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
          langs: { en: {} }
        })
      ],
      providers: [
        provideTranslocoLocale(),
        { provide: CurrentGameService, useValue: currentGameService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TurnSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and calculate average and agreement', () => {
    expect(component).toBeTruthy();
    // hands: 5, 5, 8 -> average = (5+5+8)/3 = 6
    expect(component.average).toBeCloseTo(6, 1);
    // max frequency is 2 (5 occurs 2 times out of 3 players) -> agreement = 2/3 = 0.6666...
    expect(component.agreement).toBeCloseTo(2 / 3, 2);
  });

  it('should return correct agreementClass for various values', () => {
    component.agreement = 0;
    expect(component.agreementClass()).toBe('');

    component.agreement = 0.4;
    expect(component.agreementClass()).toBe('text-danger');

    component.agreement = 0.6;
    expect(component.agreementClass()).toBe('text-warning');

    component.agreement = 0.8;
    expect(component.agreementClass()).toBe('text-success');
  });

  it('should sort values in descending order using valueDescOrder', () => {
    const itemA = { key: '5', value: 2 };
    const itemB = { key: '8', value: 1 };

    expect(component.valueDescOrder(itemA, itemB)).toBe(-1);
    expect(component.valueDescOrder(itemB, itemA)).toBe(1);
    expect(component.valueDescOrder(itemA, itemA)).toBe(0);
  });
});
