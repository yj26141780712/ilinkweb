/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { IlinkMapComponent } from './ilink-map.component';

describe('IlinkMapComponent', () => {
  let component: IlinkMapComponent;
  let fixture: ComponentFixture<IlinkMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IlinkMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IlinkMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
