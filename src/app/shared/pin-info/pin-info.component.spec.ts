import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PinInfoComponent } from './pin-info.component';

describe('PinInfoComponent', () => {
  let component: PinInfoComponent;
  let fixture: ComponentFixture<PinInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PinInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PinInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
