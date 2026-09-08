import { UserInformationService } from './user-information.service';

describe('UserInformationService', () => {
  let service: UserInformationService;

  beforeEach(() => {
    localStorage.clear();
    service = new UserInformationService();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should initialize with null/falsy default values if local storage is empty', () => {
    expect(service.getName()).toBeNull();
    expect(service.isSpectator()).toBeFalse();
    expect(service.getPlayerId()).toBeUndefined();
  });

  it('should load name and spectator state from local storage on initialization', () => {
    localStorage.setItem('name', 'Alice');
    localStorage.setItem('isSpectator', 'true');

    const newService = new UserInformationService();
    expect(newService.getName()).toBe('Alice');
    expect(newService.isSpectator()).toBeTrue();
  });

  it('should set name and save to local storage', () => {
    service.setName('Bob');
    expect(service.getName()).toBe('Bob');
    expect(localStorage.getItem('name')).toBe('Bob');
  });

  it('should set spectator status and save to local storage', () => {
    service.setSpectator(true);
    expect(service.isSpectator()).toBeTrue();
    expect(localStorage.getItem('isSpectator')).toBe('true');
  });

  it('should set player ID subject and update getPlayerId', () => {
    service.setPlayerIdSubject('player-123');
    expect(service.getPlayerId()).toBe('player-123');
  });

  it('should emit name via nameObservable', (done) => {
    service.nameObservable().subscribe((name) => {
      if (name === 'Charlie') {
        expect(name).toBe('Charlie');
        done();
      }
    });
    service.setName('Charlie');
  });

  it('should emit spectator via spectatorObservable', (done) => {
    service.spectatorObservable().subscribe((isSpectator) => {
      if (isSpectator) {
        expect(isSpectator).toBeTrue();
        done();
      }
    });
    service.setSpectator(true);
  });

  it('should handle localStorage throwing errors gracefully', () => {
    spyOn(localStorage, 'getItem').and.throwError('SecurityError');
    spyOn(localStorage, 'setItem').and.throwError('SecurityError');

    const errService = new UserInformationService();
    expect(errService.getName()).toBeNull();

    expect(() => errService.setName('Test')).not.toThrow();
  });
});
