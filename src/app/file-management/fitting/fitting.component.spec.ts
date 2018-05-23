import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FittingComponent } from './fitting.component';

describe('FittingComponent', () => {
  let component: FittingComponent;
  let fixture: ComponentFixture<FittingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FittingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FittingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
