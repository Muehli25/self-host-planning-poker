import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerHandComponent } from './player-hand.component';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { decksDict } from '../../../model/deck';

describe('PlayerHandComponent', () => {
  let component: PlayerHandComponent;
  let fixture: ComponentFixture<PlayerHandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PlayerHandComponent,
        TranslocoTestingModule.forRoot({
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
          langs: { en: {} }
        })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerHandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display card value using displayCardValue helper', () => {
    const deck = decksDict['FIBONACCI'];
    component.deck = deck;
    component.playerState = { name: 'Alice', spectator: false, hasPicked: true, hand: 8 };

    expect(component.displayCardValue(deck, 8)).toBe(8);
  });
});
