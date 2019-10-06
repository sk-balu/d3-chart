import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';

import { ChartWrapperComponent } from './chart-wrapper.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ChartWrapperComponent', () => {
  let component: ChartWrapperComponent;
  let fixture: ComponentFixture<ChartWrapperComponent>;

  configureTestSuite((() => {
    TestBed.configureTestingModule({
      declarations: [ ChartWrapperComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('CHART-WRAPPER-COMPONENT-1 - Initialization', () => {
    expect(component).toBeTruthy();
  });
});
