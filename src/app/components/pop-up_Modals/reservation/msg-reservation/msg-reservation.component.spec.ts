import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsgReservationComponent } from './msg-reservation.component';

describe('MsgReservationComponent', () => {
  let component: MsgReservationComponent;
  let fixture: ComponentFixture<MsgReservationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsgReservationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MsgReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
