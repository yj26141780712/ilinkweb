import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetMachineComponent } from './set-machine.component';

describe('SetMachineComponent', () => {
  let component: SetMachineComponent;
  let fixture: ComponentFixture<SetMachineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetMachineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetMachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
