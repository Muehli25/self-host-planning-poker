import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QrCodeModalContentComponent } from './qr-code-modal-content.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslocoTestingModule } from '@ngneat/transloco';
import QRCode from 'qrcode';

describe('QrCodeModalContentComponent', () => {
  let component: QrCodeModalContentComponent;
  let fixture: ComponentFixture<QrCodeModalContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        QrCodeModalContentComponent,
        TranslocoTestingModule.forRoot({
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
          langs: { en: {} }
        })
      ],
      providers: [
        { provide: NgbActiveModal, useValue: jasmine.createSpyObj('NgbActiveModal', ['close', 'dismiss']) }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QrCodeModalContentComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call QRCode.toCanvas on ngAfterViewInit if url is present', () => {
    spyOn(QRCode, 'toCanvas');
    (component as any).url = 'http://localhost/game/123';
    fixture.detectChanges();
    component.ngAfterViewInit();

    expect(QRCode.toCanvas).toHaveBeenCalled();
  });
});
