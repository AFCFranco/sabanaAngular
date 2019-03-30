import { Component, OnInit, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { startWith } from 'rxjs/operators';
import * as moment from 'moment';
import { RecordData } from '../../classes/record-data';
import { RegionAlarmsDataSource } from '../../classes/region-alarms-data-source';
import { RepositioningTimerData } from '../../classes/repositioning-timer-data';
import { RepositioningData } from '../../classes/repositioning-data';
import { WebSocketService } from '../../services/websocket.service';
import { MatDialog } from '@angular/material';
import { DialogRepositioningComponent } from '../../dialog-repositioning/dialog-repositioning.component';
import { Router } from '@angular/router';
import { RegionAlarmData } from '../../classes/region-alarm-data';
import { AlarmSetpoint } from '../../alarm-setpoint';


@Component({
  selector: 'app-repositioning',
  templateUrl: './repositioning.component.html',
  styleUrls: ['./repositioning.component.css']
})
export class RepositioningComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() record: RecordData;

  repositioningTimerSubscription: Subscription;
  repositioningSubscription: Subscription;
  changePositionSubscription: Subscription;
  regionAlarmsSubscription: Subscription;

  repositioningTimer: RepositioningTimerData = {
    'hour': 0,
    'min': 0,
    'sec': 0
  };

  lastRepositioning: RepositioningData;
  lastRegionAlarms: RegionAlarmData[];
  overflowed = false;

  constructor(private wsService: WebSocketService, public dialogRepositioning: MatDialog, private router: Router) { }

  ngOnInit() {
    this.obtainSubscriptions();
    this.createIntervals();
  }

  ngAfterViewInit() {
  }


  obtainSubscriptions() {
    this.repositioningSubscription = this.wsService.repositioningObs.subscribe( (msg: RepositioningData) => {
      if (JSON.stringify(this.lastRepositioning) !== JSON.stringify(msg)) {
        if (msg !== null && msg.record === this.record.id) {
          this.lastRepositioning = msg;
          // if (this.regionAlarmsSubscription === undefined) {
          //   this.wsService.send({
          //     'msg_type': 'request',
          //     'request': 'get_region_alarms',
          //     'details': {
          //       'repositioning': this.lastRepositioning.id,
          //     }
          //   });
          // }
        }
      }
    });
    this.regionAlarmsSubscription = this.wsService.regionAlarmsObs.subscribe((msg: RegionAlarmData[]) => {
      if (msg !== null && this.lastRepositioning !== undefined && this.lastRegionAlarms === undefined &&
        this.lastRepositioning.id === msg[0].repositioning) {
        // console.log(`lastRegionAlarms ${JSON.stringify(msg)}`);
        this.lastRegionAlarms = msg;
      }
    });
    this.changePositionSubscription = this.wsService.changePositionObs.subscribe( (msg) => {
      if (msg !== null && msg === true) {
        this.wsService.changePositionBehaviorSubject.next(false);
        // this.router.navigate(['home/monitoring?refresh=1']);
        location.reload();
      }
    });
  }

  repositioning(event) {
    const dialogRef = this.dialogRepositioning.open(DialogRepositioningComponent, {
      width: '400px',
      data: {
        'record': this.record.id,
        'silhouette': this.lastRepositioning.silhouette,
        'alarms_setpoints': <AlarmSetpoint[]>this.lastRegionAlarms,
        'isEnableCondition': false,
        'condition': this.record.condition.condition
      }
    });
    dialogRef.componentInstance.title = 'Cambio de posición del paciente';
    dialogRef.componentInstance.subtitle = 'Seleccione la siguiente posición del paciente';

    dialogRef.afterClosed().subscribe( result => {
      if (result === undefined) {
        console.log('valor ingresado incorrecto');
      } else {
        console.log(result);
        this.wsService.send({
          'msg_type': 'request',
          'request': 'change_position',
          'details': {
            'record': this.record.id,
            'silhouette': result.silhouette,
            'alarms_setpoints': result.alarms_setpoints
          }
        });
      }
    });
  }



  public createIntervals() {
    this.repositioningTimerSubscription = interval(1000)
      .pipe(startWith(500)).subscribe(res => {
        if (this.lastRepositioning) {
            const currentDate = new Date(Date.now());
            const startDate = new Date(this.lastRepositioning.created_at);
            const diff = (currentDate.getTime() - startDate.getTime()) / 1000;
            this.repositioningTimer.hour =  Math.floor(diff / 3600);
            this.repositioningTimer.min =  Math.floor(diff % 3600 / 60);
            this.repositioningTimer.sec = Math.floor(diff % 3600 % 60);
            // console.log(`Duración ${this.lastRepositioning.duration_minutes * 60}`);
            if (diff > this.lastRepositioning.duration_minutes * 60) {
              this.overflowed = true;
            }
            // console.log(`Fecha de inicio reposicionamiento: ${this.lastRepositioning.created_at}`);
        }
      });
      // console.log('------------------------------------------------');
      // console.log(this.record);
       this.wsService.send({
          'msg_type': 'request',
          'request': 'get_repositioning',
          'details': {
            'record': this.record.id
          }
        });
  }

  ngOnDestroy() {
    if (this.repositioningTimerSubscription !== undefined) {
      this.repositioningTimerSubscription.unsubscribe();
    }
    if (this.repositioningSubscription !== undefined) {
      this.repositioningSubscription.unsubscribe();
    }
    if (this.regionAlarmsSubscription !== undefined) {
      this.regionAlarmsSubscription.unsubscribe();
    }
  }
}
