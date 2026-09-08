import { PathLocationStrategy } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { BaseHrefPipe } from './base-href.pipe';

describe('BaseHrefPipe', () => {
  let pipe: BaseHrefPipe;
  let mockPathLocationStrategy: jasmine.SpyObj<PathLocationStrategy>;

  beforeEach(() => {
    mockPathLocationStrategy = jasmine.createSpyObj('PathLocationStrategy', ['getBaseHref']);
    mockPathLocationStrategy.getBaseHref.and.returnValue('/my-app/');

    TestBed.configureTestingModule({
      providers: [
        BaseHrefPipe,
        { provide: PathLocationStrategy, useValue: mockPathLocationStrategy }
      ]
    });

    pipe = TestBed.inject(BaseHrefPipe);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should append value to base href', () => {
    const result = pipe.transform('assets/logo.png');
    expect(result).toBe('/my-app/assets/logo.png');
  });
});
