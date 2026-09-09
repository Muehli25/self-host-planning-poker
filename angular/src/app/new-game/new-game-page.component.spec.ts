import { ComponentFixture, TestBed } from '@angular/core/testing';
import NewGamePageComponent from './new-game-page.component';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { PathLocationStrategy } from '@angular/common';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { decksDict } from '../model/deck';
import { provideHttpClient } from '@angular/common/http';

describe('NewGamePageComponent', () => {
  let component: NewGamePageComponent;
  let fixture: ComponentFixture<NewGamePageComponent>;
  let httpMock: HttpTestingController;
  let router: jasmine.SpyObj<Router>;
  let pls: jasmine.SpyObj<PathLocationStrategy>;

  beforeEach(async () => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    pls = jasmine.createSpyObj('PathLocationStrategy', ['getBaseHref']);
    pls.getBaseHref.and.returnValue('/');

    await TestBed.configureTestingModule({
      imports: [
        NewGamePageComponent,
        TranslocoTestingModule.forRoot({
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
          langs: { en: {} }
        })
      ],
      providers: [
        { provide: Router, useValue: router },
        { provide: PathLocationStrategy, useValue: pls },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NewGamePageComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should post new game data and navigate on response', () => {
    component.onNewGame({
      name: 'Sprint Poker',
      deck: decksDict['FIBONACCI']
    });

    const req = httpMock.expectOne((request) => request.url.endsWith('create'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      name: 'Sprint Poker',
      deck: 'FIBONACCI'
    });

    req.flush('game-12345');
    expect(router.navigate).toHaveBeenCalledWith(['game', 'game-12345']);
  });
});
