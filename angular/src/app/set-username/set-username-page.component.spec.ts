import { ComponentFixture, TestBed } from '@angular/core/testing';
import SetUsernamePageComponent from './set-username-page.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { of } from 'rxjs';
import { UserInformationService } from '../shared/user-info/user-information.service';

describe('SetUsernamePageComponent', () => {
  let component: SetUsernamePageComponent;
  let fixture: ComponentFixture<SetUsernamePageComponent>;
  let router: jasmine.SpyObj<Router>;
  let userInformationService: jasmine.SpyObj<UserInformationService>;

  beforeEach(async () => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    userInformationService = jasmine.createSpyObj('UserInformationService', ['getName', 'setName']);
    userInformationService.getName.and.returnValue('DefaultName');

    await TestBed.configureTestingModule({
      imports: [
        SetUsernamePageComponent,
        TranslocoTestingModule.forRoot({
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
          langs: { en: {} }
        })
      ],
      providers: [
        { provide: Router, useValue: router },
        { provide: UserInformationService, useValue: userInformationService },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ gameId: 'room-xyz' })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SetUsernamePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and extract gameId from query params', () => {
    expect(component).toBeTruthy();
    expect(component.gameId).toBe('room-xyz');
  });

  it('should navigate to game page when join is called', () => {
    component.join();
    expect(router.navigate).toHaveBeenCalledWith(['game', 'room-xyz']);
  });
});
