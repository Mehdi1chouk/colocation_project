import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltredHousesComponent } from './filtred-houses.component';

describe('FiltredHousesComponent', () => {
  let component: FiltredHousesComponent;
  let fixture: ComponentFixture<FiltredHousesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiltredHousesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltredHousesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
