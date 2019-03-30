import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { WebSocketService } from '../../services/websocket.service';
import { RegionAlarmsDataSource } from '../../classes/region-alarms-data-source';
import { Subscription, interval } from 'rxjs';
import { startWith } from 'rxjs/operators';

@Component({
  selector: 'app-region-alerts-table',
  templateUrl: './region-alerts-table.component.html',
  styleUrls: ['./region-alerts-table.component.css']
})
export class RegionAlertsTableComponent implements OnInit, OnDestroy {

  @Input() record_id: number;
  @Input() repositioning_id: number;
  dataSource: RegionAlarmsDataSource;
  regionAlarmsItervalSubscription: Subscription;
  // changePositionSubscription: Subscription;
  displayedColumns = [
    'region',
    'sensibility',
    'status',
    // 'edit',
  ];

  statusChoices = {
    'I': 'No se ha detectado exceso de presión',
    'A': 'Se presentan zonas con exceso de presión',
    'D': 'Se ha excedido el tiempo de exposición permitido',
  };

  sensibilityChoices = {
    0 : 'looks_one',
    1 : 'looks_two',
    2 : 'looks_3',
    3 : 'looks_4',
    4 : 'looks_5',
  };

  cronometerChoices = {
    5 : '00:05:00',
    15 : '00:15:00',
    30 : '00:30:00',
    45 : '00:45:00',
    60 : '01:00:00',
    75 : '01:15:00',
  };

  public colors = [
    '#084695',
    '#70f1cc',
    '#6eed38',
    '#f2d842',
    '#e41a1c'
  ];

  matIconName = {
    'I': 'filter_tilt_shift',
    'A': 'track_changes',
    'D': 'notification_important',
  };

  userSoundSubscription: Subscription;

  constructor(private wsService: WebSocketService) { }

  ngOnInit() {
    this.obtainSubscriptions();
    this.createIntervals();
  }

  obtainSubscriptions() {
    // this.userSoundSubscription = this.wsService.userSoundObs.subscribe( (msg) => {
    //   if (msg)
    // });
    // this.changePositionSubscription = this.wsService.changePositionObs.subscribe( (msg) => {
    //   if (msg !== null && msg === true) {
    //     this.loadRegionAlarms();
    //   }
    // });
    this.dataSource = new RegionAlarmsDataSource(this.wsService, this.repositioning_id);
    this.loadRegionAlarms();
  }

  loadRegionAlarms() {
    if (this.dataSource) {
      this.dataSource.loadRegionAlarmsRecords();
    }
  }

  createIntervals() {
    this.regionAlarmsItervalSubscription = interval(3000)
      .pipe(startWith(100)).subscribe(res => {
        this.loadRegionAlarms();
      });
  }

  ngOnDestroy() {
    if (this.regionAlarmsItervalSubscription !== undefined) {
      this.regionAlarmsItervalSubscription.unsubscribe();
    }
    // if (this.changePositionSubscription !== undefined) {
    //   this.changePositionSubscription.unsubscribe();
    // }
  }

}
