import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { startWith } from 'rxjs/operators';

@Component({
  selector: 'app-cronometer',
  templateUrl: './cronometer.component.html',
  styleUrls: ['./cronometer.component.css']
})
export class CronometerComponent implements OnInit, OnDestroy {

  @Input() start_date: string;
  cronometerSubscription: Subscription;
  cronometer_timer = {
    'hour': 0,
    'min': 0,
    'sec': 0
  };

  constructor() { }

  ngOnInit() {
    this.createIntervals();
  }

  ngOnDestroy() {
    if (this.cronometerSubscription !== undefined) {
      this.cronometerSubscription.unsubscribe();
    }
  }

  createIntervals() {
    this.cronometerSubscription = interval(1000)
    .pipe(startWith(500)).subscribe(res => {
      if (this.start_date) {
        const currentDate = new Date(Date.now());
        const startDate = new Date(this.start_date);
        const diff = (currentDate.getTime() - startDate.getTime()) / 1000;
        this.cronometer_timer.hour =  Math.floor(diff / 3600);
        this.cronometer_timer.min =  Math.floor(diff % 3600 / 60);
        this.cronometer_timer.sec = Math.floor(diff % 3600 % 60);
      }
    });
  }

}
