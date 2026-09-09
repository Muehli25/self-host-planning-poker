import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavAppTitleComponent } from './nav-app-title.component';
import { TranslocoTestingModule } from '@ngneat/transloco';

describe('NavAppTitleComponent', () => {
  let component: NavAppTitleComponent;
  let fixture: ComponentFixture<NavAppTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NavAppTitleComponent,
        TranslocoTestingModule.forRoot({
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
          langs: { en: {} }
        })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavAppTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
