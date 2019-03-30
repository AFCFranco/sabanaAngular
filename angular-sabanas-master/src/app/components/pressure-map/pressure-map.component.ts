import { Component, OnInit, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription, Observable, Subject, BehaviorSubject } from 'rxjs';
import { interval } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { ColorMapData } from '../../classes/color-map-data';
import { WebSocketService } from '../../services/websocket.service';
import { RepositioningData } from '../../classes/repositioning-data';
import { RegionsAlertsData } from '../../regions-alerts-data';

@Component({
  selector: 'app-pressure-map',
  templateUrl: './pressure-map.component.html',
  styleUrls: ['./pressure-map.component.css']
})
export class PressureMapComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() record_id: number;

  public r1BehaviorSubject = new BehaviorSubject<string>('');
  public r1Obs = this.r1BehaviorSubject.asObservable();

  public r2BehaviorSubject = new BehaviorSubject<string>('');
  public r2Obs = this.r2BehaviorSubject.asObservable();

  public r3BehaviorSubject = new BehaviorSubject<string>('');
  public r3Obs = this.r3BehaviorSubject.asObservable();

  public r4BehaviorSubject = new BehaviorSubject<string>('');
  public r4Obs = this.r4BehaviorSubject.asObservable();

  public r5BehaviorSubject = new BehaviorSubject<string>('');
  public r5Obs = this.r5BehaviorSubject.asObservable();

  /**
 * Subscripción para enviar cada segundo la solicitud del mapa de colores
 */
  public lastColorMapIntervalSubscription: Subscription;

  /**
 * Subscripción para recibir el mapa de colores
 */
  public lastColorMapSubscription: Subscription;
  lastColorMap: ColorMapData;

  repositioningSubscription: Subscription;
  lastRepositioning: RepositioningData;
  regionsAlertsSubcription: Subscription;
  lastRegionsAlerts: RegionsAlertsData;

  constructor(public wsService: WebSocketService) { }

  ngOnInit() {
    this.obtainSubscriptions();
    this.createIntervals();
  }

  ngAfterViewInit() {
    
  }

  public obtainSubscriptions() {
    // this.repositioningSubscription = this.wsService.repositioningObs.subscribe( (msg: RepositioningData) => {
    //   if (JSON.stringify(this.lastRepositioning) !== JSON.stringify(msg)) {
    //     if (msg !== null && msg.record === this.record_id) {
    //       this.lastRepositioning = msg;
    //     }
    //   }
    // });
    this.regionsAlertsSubcription = this.wsService.regionAlertsObs.subscribe((msg: RegionsAlertsData) => {
      if (JSON.stringify(msg) !== JSON.stringify(this.lastRegionsAlerts)) {
        if (msg !== null && msg.record === this.record_id) {
          this.lastRegionsAlerts = msg;
          console.log(`******* ultimas alertas *******
          ${JSON.stringify(msg)}`);
        }
      }
    });
    this.lastColorMapSubscription = this.wsService.colorMapObs.subscribe((msg: ColorMapData) => {
      // console.log(msg);
      if (JSON.stringify(this.lastColorMap) !== JSON.stringify(msg)) {
        if (msg !== null && msg.record === this.record_id) {
          this.lastColorMap = msg;
          if (this.lastColorMap !== null) {
            this.r1BehaviorSubject.next('' + this.lastColorMap.r1.split('\'')[1]);
            this.r2BehaviorSubject.next('' + this.lastColorMap.r2.split('\'')[1]);
            this.r3BehaviorSubject.next('' + this.lastColorMap.r3.split('\'')[1]);
            this.r4BehaviorSubject.next('' + this.lastColorMap.r4.split('\'')[1]);
            this.r5BehaviorSubject.next('' + this.lastColorMap.r5.split('\'')[1]);
          }
        }
        // this.lastColorMap = msg;
        // // console.log(this.lastColorMap);
        // if (this.lastColorMap !== null) {
        //   if (this.lastColorMap.record === this.record_id) {
        //     this.imagePathBehaviorSubject.next('' + this.lastColorMap.pressure_image.split('\'')[1]);
        //   }
        //   // this.imagePath = atob(this.lastColorMap.pressure_image.split('\'')[1]);
        //   // this.imagePath = 'data:image/jpg;base64,' + ;
        // }
      }
    });
  }


  public base64ToJPG(data) {
    const binary = atob(data.split(',')[1]);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {
      type: 'image/jpg'
    });
  }

  public createIntervals() {
    this.lastColorMapIntervalSubscription = interval(3000)
      .pipe(startWith(100)).subscribe(res => {
        if (!this.record_id) {
          return;
        }
        this.wsService.send({
          'msg_type': 'request',
          'request': 'get_last_color_map',
          'details': {
            'record': this.record_id
          }
        });
        this.wsService.send({
          'msg_type': 'request',
          'request': 'get_region_alerts',
          'details': {
            'record': this.record_id
          }
        });
      });
      // // // // // // // // // // // // // this.wsService.send({
      // // // // // // // // // // // // //   'msg_type': 'request',
      // // // // // // // // // // // // //   'request': 'get_repositioning',
      // // // // // // // // // // // // //   'details': {
      // // // // // // // // // // // // //     'record': this.record_id
      // // // // // // // // // // // // //   }
      // // // // // // // // // // // // // });
    // .startWith(0).subscribe(res => {
    //   if (!this.record_id) {
    //     console.log('dfsdfasdf');
    //     return;
    //   }
    //   this.wsService.send({
    //     'msg_type': 'request',
    //     'request': 'get_last_color_map',
    //     'details': {
    //       'record': this.record_id
    //     }
    //   });
    // });
  }

  ngOnDestroy() {
    if (this.lastColorMapIntervalSubscription !== undefined) {
      this.lastColorMapIntervalSubscription.unsubscribe();
    }
    if (this.lastColorMapSubscription !== undefined) {
      this.lastColorMapSubscription.unsubscribe();
    }
    if (this.regionsAlertsSubcription !== undefined) {
      this.regionsAlertsSubcription.unsubscribe();
    }
  }


}
