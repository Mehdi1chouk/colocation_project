import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteNotifComponent } from './delete-notif.component';

describe('DeleteNotifComponent', () => {
  let component: DeleteNotifComponent;
  let fixture: ComponentFixture<DeleteNotifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteNotifComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteNotifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
