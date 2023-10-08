import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonAuthentifieComponent } from './non-authentifie.component';

describe('NonAuthentifieComponent', () => {
  let component: NonAuthentifieComponent;
  let fixture: ComponentFixture<NonAuthentifieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonAuthentifieComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NonAuthentifieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
