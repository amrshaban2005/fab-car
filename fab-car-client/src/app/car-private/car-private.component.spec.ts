import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarPrivateComponent } from './car-private.component';

describe('CarPrivateComponent', () => {
  let component: CarPrivateComponent;
  let fixture: ComponentFixture<CarPrivateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarPrivateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarPrivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
