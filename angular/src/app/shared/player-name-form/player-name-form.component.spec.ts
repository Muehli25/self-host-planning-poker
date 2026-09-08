import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { PlayerNameFormComponent } from './player-name-form.component';
import { UserInformationService } from '../user-info/user-information.service';
import { TranslocoTestingModule } from '@ngneat/transloco';

describe('PlayerNameFormComponent', () => {
  let component: PlayerNameFormComponent;
  let fixture: ComponentFixture<PlayerNameFormComponent>;
  let userInformationService: jasmine.SpyObj<UserInformationService>;

  beforeEach(async () => {
    userInformationService = jasmine.createSpyObj('UserInformationService', ['getName', 'setName']);
    userInformationService.getName.and.returnValue('Alice');

    await TestBed.configureTestingModule({
      imports: [
        PlayerNameFormComponent,
        TranslocoTestingModule.forRoot({
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
          langs: { en: {} }
        })
      ],
      providers: [
        { provide: UserInformationService, useValue: userInformationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerNameFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and populate initial name', () => {
    expect(component).toBeTruthy();
    expect(component.formGroup.get('username')?.value).toBe('Alice');
  });

  it('should update user name and emit validated after debounce time', fakeAsync(() => {
    spyOn(component.validated, 'emit');
    component.formGroup.get('username')?.setValue('Bob');

    component.setUsername();
    tick(500);
    expect(userInformationService.setName).not.toHaveBeenCalled();

    tick(500);
    expect(userInformationService.setName).toHaveBeenCalledWith('Bob');
    expect(component.validated.emit).toHaveBeenCalled();
  }));
});
