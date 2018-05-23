import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FactoryInfoComponent } from './factory-info.component';

describe('FactoryInfoComponent', () => {
  let component: FactoryInfoComponent;
  let fixture: ComponentFixture<FactoryInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FactoryInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FactoryInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
