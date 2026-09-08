import { TestBed } from '@angular/core/testing';
import { Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { UsernameSetService, usernameSetGuard } from './username-set.service';
import { UserInformationService } from './user-information.service';

describe('UsernameSetService', () => {
  let service: UsernameSetService;
  let userInformation: jasmine.SpyObj<UserInformationService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    userInformation = jasmine.createSpyObj('UserInformationService', ['getName']);
    router = jasmine.createSpyObj('Router', ['parseUrl']);

    TestBed.configureTestingModule({
      providers: [
        UsernameSetService,
        { provide: UserInformationService, useValue: userInformation },
        { provide: Router, useValue: router }
      ]
    });

    service = TestBed.inject(UsernameSetService);
  });

  it('should allow navigation if user name is set', () => {
    userInformation.getName.and.returnValue('Alice');
    const mockState = { url: '/game/game123' } as RouterStateSnapshot;

    const result = service.canActivate(userInformation, router, mockState);
    expect(result).toBeTrue();
  });

  it('should redirect to /set-username if user name is empty', () => {
    userInformation.getName.and.returnValue('');
    const dummyUrlTree = {} as UrlTree;
    router.parseUrl.and.returnValue(dummyUrlTree);
    const mockState = { url: '/game/game123' } as RouterStateSnapshot;

    const result = service.canActivate(userInformation, router, mockState);
    expect(router.parseUrl).toHaveBeenCalledWith('/set-username?gameId=game123');
    expect(result).toBe(dummyUrlTree);
  });

  it('should trigger guard function successfully', () => {
    userInformation.getName.and.returnValue('Bob');
    const mockState = { url: '/game/abc' } as RouterStateSnapshot;

    const guardResult = TestBed.runInInjectionContext(() =>
      usernameSetGuard({} as any, mockState)
    );
    expect(guardResult).toBeTrue();
  });
});
