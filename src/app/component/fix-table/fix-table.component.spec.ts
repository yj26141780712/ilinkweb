import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixTableComponent } from './fix-table.component';

describe('FixTableComponent', () => {
  let component: FixTableComponent;
  let fixture: ComponentFixture<FixTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
