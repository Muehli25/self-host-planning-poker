import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PickableCardComponent } from './pickable-card.component';

describe('PickableCardComponent', () => {
  let component: PickableCardComponent;
  let fixture: ComponentFixture<PickableCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PickableCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PickableCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create with default inputs', () => {
    expect(component).toBeTruthy();
    expect(component.selected).toBeFalse();
    expect(component.disabled).toBeFalse();
  });

  it('should accept inputs', () => {
    component.cardValue = { value: 5, display: 5 };
    component.selected = true;
    component.disabled = true;

    expect(component.cardValue).toEqual({ value: 5, display: 5 });
    expect(component.selected).toBeTrue();
    expect(component.disabled).toBeTrue();
  });
});
