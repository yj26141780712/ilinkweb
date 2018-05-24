import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetFactoryComponent } from './set-factory.component';

describe('SetFactoryComponent', () => {
  let component: SetFactoryComponent;
  let fixture: ComponentFixture<SetFactoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetFactoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetFactoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
