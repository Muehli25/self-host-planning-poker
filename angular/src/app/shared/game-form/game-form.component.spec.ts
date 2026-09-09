import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameFormComponent } from './game-form.component';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { decksDict } from '../../model/deck';

describe('GameFormComponent', () => {
  let component: GameFormComponent;
  let fixture: ComponentFixture<GameFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        GameFormComponent,
        TranslocoTestingModule.forRoot({
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
          langs: { en: {} }
        })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GameFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values for new game', () => {
    expect(component.isNewGame()).toBeTrue();
    expect(component.formGroup.get('name')?.value).toBe('');
    expect(component.formGroup.get('deck')?.value).toEqual(decksDict['FIBONACCI']);
  });

  it('should patch values on ngOnInit when inputs provided', () => {
    component.name = 'Sprint Planning';
    component.deck = 'T_SHIRTS';
    component.ngOnInit();

    expect(component.isNewGame()).toBeFalse();
    expect(component.formGroup.get('name')?.value).toBe('Sprint Planning');
    expect(component.formGroup.get('deck')?.value).toEqual(decksDict['T_SHIRTS']);
  });

  it('should emit gameOutput when validate is called', () => {
    spyOn(component.gameOutput, 'emit');
    component.formGroup.setValue({
      name: 'Refinement',
      deck: decksDict['MODIFIED_FIBONACCI']
    });

    component.validate();

    expect(component.gameOutput.emit).toHaveBeenCalledWith({
      name: 'Refinement',
      deck: decksDict['MODIFIED_FIBONACCI']
    });
  });
});
