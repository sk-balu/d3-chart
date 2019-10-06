import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { configureTestSuite } from 'ng-bullet';
import { NO_ERRORS_SCHEMA } from '@angular/core';


describe('AppComponent', () => {
  configureTestSuite((() => {
    TestBed.configureTestingModule({
      declarations: [ AppComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    });
  }));

  it('APP-COMPONENT-1 - Initialization', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
