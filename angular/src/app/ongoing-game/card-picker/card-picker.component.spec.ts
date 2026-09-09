import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardPickerComponent } from './card-picker.component';
import { CurrentGameService } from '../current-game.service';
import { UserInformationService } from '../../shared/user-info/user-information.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { CardValue, Deck, decksDict } from '../../model/deck';

describe('CardPickerComponent', () => {
  let component: CardPickerComponent;
  let fixture: ComponentFixture<CardPickerComponent>;
  let currentGameService: jasmine.SpyObj<CurrentGameService>;
  let userInformationService: jasmine.SpyObj<UserInformationService>;

  let deckSubject: BehaviorSubject<Deck>;
  let newGameSubject: Subject<void>;
  let revealedSubject: BehaviorSubject<boolean>;
  let spectatorSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    deckSubject = new BehaviorSubject<Deck>(decksDict['FIBONACCI']);
    newGameSubject = new Subject<void>();
    revealedSubject = new BehaviorSubject<boolean>(false);
    spectatorSubject = new BehaviorSubject<boolean>(false);

    currentGameService = jasmine.createSpyObj('CurrentGameService', ['pickCard'], {
      deck$: deckSubject.asObservable(),
      newGame$: newGameSubject.asObservable(),
      revealed$: revealedSubject.asObservable()
    });

    userInformationService = jasmine.createSpyObj('UserInformationService', ['spectatorObservable'], {
    });
    userInformationService.spectatorObservable.and.returnValue(spectatorSubject.asObservable());

    await TestBed.configureTestingModule({
      imports: [CardPickerComponent],
      providers: [
        { provide: CurrentGameService, useValue: currentGameService },
        { provide: UserInformationService, useValue: userInformationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CardPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and receive deck', () => {
    expect(component).toBeTruthy();
    expect(component.deck).toEqual(decksDict['FIBONACCI']);
  });

  it('should select card and call pickCard on CurrentGameService', () => {
    const card: CardValue = { value: 5, display: 5 };

    component.selectCard(card);

    expect(component.selectedCard).toEqual(card);
    expect(currentGameService.pickCard).toHaveBeenCalledWith(5);
  });

  it('should deselect card when clicking the same selected card', () => {
    const card: CardValue = { value: 5, display: 5 };

    component.selectCard(card);
    expect(component.selectedCard).toEqual(card);

    component.selectCard(card);
    expect(component.selectedCard).toBeUndefined();
    expect(currentGameService.pickCard).toHaveBeenCalledWith(null);
  });

  it('should prevent picking cards if spectator', () => {
    spectatorSubject.next(true);
    const card: CardValue = { value: 3, display: 3 };

    component.selectCard(card);

    expect(component.selectedCard).toBeUndefined();
    expect(currentGameService.pickCard).not.toHaveBeenCalled();
  });

  it('should prevent picking cards if game is revealed', () => {
    revealedSubject.next(true);
    const card: CardValue = { value: 3, display: 3 };

    component.selectCard(card);

    expect(component.selectedCard).toBeUndefined();
    expect(currentGameService.pickCard).not.toHaveBeenCalled();
  });

  it('should reset selected card on new game event', () => {
    const card: CardValue = { value: 5, display: 5 };
    component.selectCard(card);

    newGameSubject.next();

    expect(component.selectedCard).toBeUndefined();
  });
});
