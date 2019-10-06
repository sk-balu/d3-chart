import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ChartWrapperComponent } from './components/chart-wrapper/chart-wrapper.component';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { CommonUtil } from './utils/common-util';

@NgModule({
  declarations: [
    AppComponent,
    ChartWrapperComponent,
    LineChartComponent,
    BarChartComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [ CommonUtil ],
  bootstrap: [AppComponent]
})
export class AppModule { }
