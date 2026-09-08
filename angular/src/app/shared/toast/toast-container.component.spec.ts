import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastsContainerComponent } from './toast-container.component';
import { ToastService } from './toast.service';

describe('ToastsContainerComponent', () => {
  let component: ToastsContainerComponent;
  let fixture: ComponentFixture<ToastsContainerComponent>;
  let toastService: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastsContainerComponent],
      providers: [ToastService]
    }).compileComponents();

    fixture = TestBed.createComponent(ToastsContainerComponent);
    component = fixture.componentInstance;
    toastService = TestBed.inject(ToastService);
  });

  it('should create component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should apply default host class and style attributes', () => {
    fixture.detectChanges();
    expect(component.classAttr).toContain('toast-container position-fixed');
    expect(component.styleAttr).toContain('z-index: 1200');
  });

  it('should render toasts provided by ToastService', () => {
    toastService.show('Hello Toast', { className: 'bg-primary' });
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    expect(element.textContent).toContain('Hello Toast');
  });
});
