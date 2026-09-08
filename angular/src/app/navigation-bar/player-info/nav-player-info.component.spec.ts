import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavPlayerInfoComponent } from './nav-player-info.component';
import { UserInformationService } from '../../shared/user-info/user-information.service';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { TranslocoTestingModule } from '@ngneat/transloco';

describe('NavPlayerInfoComponent', () => {
  let component: NavPlayerInfoComponent;
  let fixture: ComponentFixture<NavPlayerInfoComponent>;
  let userInformationService: jasmine.SpyObj<UserInformationService>;
  let offcanvasService: jasmine.SpyObj<NgbOffcanvas>;

  beforeEach(async () => {
    userInformationService = jasmine.createSpyObj('UserInformationService', ['isSpectator', 'setSpectator', 'getName']);
    userInformationService.isSpectator.and.returnValue(false);
    userInformationService.getName.and.returnValue('Alice');

    offcanvasService = jasmine.createSpyObj('NgbOffcanvas', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        NavPlayerInfoComponent,
        TranslocoTestingModule.forRoot({
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
          langs: { en: {} }
        })
      ],
      providers: [
        { provide: UserInformationService, useValue: userInformationService },
        { provide: NgbOffcanvas, useValue: offcanvasService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavPlayerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle spectator status when toggleSpectator is called', () => {
    userInformationService.isSpectator.and.returnValue(false);
    component.toggleSpectator();
    expect(userInformationService.setSpectator).toHaveBeenCalledWith(true);
  });

  it('should open offcanvas edit modal', () => {
    component.openEdit('content');
    expect(offcanvasService.open).toHaveBeenCalledWith('content', { ariaLabelledBy: 'offcanvas-basic-title', position: 'end' });
  });
});
