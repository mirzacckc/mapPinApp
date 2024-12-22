import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPopupComponent } from './main-popup.component';

describe('MainPopupComponent', () => {
  let component: MainPopupComponent;
  let fixture: ComponentFixture<MainPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
