import { Component } from '@angular/core';
import { MONTHLY_DATA, DAILY_DATA } from './constants/data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  dailyData = DAILY_DATA;
  monthlyData = MONTHLY_DATA;
}
