import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Add2Component } from './add2.component';

describe('Add2Component', () => {
  let component: Add2Component;
  let fixture: ComponentFixture<Add2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Add2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Add2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
