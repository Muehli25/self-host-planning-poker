import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    service = new ToastService();
  });

  it('should add a toast with options', () => {
    service.show('Test Message', { className: 'bg-success' });
    expect(service.toasts.length).toBe(1);
    expect(service.toasts[0].text).toBe('Test Message');
    expect(service.toasts[0].className).toBe('bg-success');
  });

  it('should remove a specific toast', () => {
    service.show('Toast 1');
    service.show('Toast 2');
    const toast1 = service.toasts[0];
    service.remove(toast1);

    expect(service.toasts.length).toBe(1);
    expect(service.toasts[0].text).toBe('Toast 2');
  });

  it('should clear all toasts', () => {
    service.show('Toast 1');
    service.show('Toast 2');
    service.clear();

    expect(service.toasts.length).toBe(0);
  });
});
