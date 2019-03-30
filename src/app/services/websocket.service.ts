import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { SabanaData } from '../classes/sabana-data';
import { RecordData } from '../classes/record-data';
import { SilhouetteData } from '../classes/silhouette-data';
import { SabanaAndRecordData } from '../classes/sabana-and-record-data';
import { RegionAlertData } from '../classes/region-alert-data';
import { AlarmData } from '../classes/alarm-data';
import { ColorMapData } from '../classes/color-map-data';
import { AuthService } from '../auth/auth.service';
import { map, share, retryWhen, delay } from 'rxjs/operators';
import { WebSocketSubject } from 'rxjs/webSocket';
import { BedOrientationData } from '../classes/bed-orientation-data';
import { RepositioningData } from '../classes/repositioning-data';
import { RegionAlarmData } from '../classes/region-alarm-data';
import { RegionsAlertsData } from '../regions-alerts-data';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  /**
   * URL del servidor WebSocket
   */
  readonly CONSUMER_URL = 'ws://localhost:8000/ws/monitoring/browsers/';
  readonly reload_time = 3000;

  public messages: Observable<any>;
  private ws: Subject<any>;
  public onclose = new Subject();
  public onopen = new Subject();



  public sabanasAndRecordsBehaviorSubject = new BehaviorSubject<SabanaAndRecordData[]>(null);
  public sabanasAndRecordsObs = this.sabanasAndRecordsBehaviorSubject.asObservable();


  public regionAlarmsBehaviorSubject = new BehaviorSubject<RegionAlarmData[]>(null);
  public regionAlarmsObs = this.regionAlarmsBehaviorSubject.asObservable();

  public sabanasBehaviorSubject = new BehaviorSubject<SabanaData[]>(null);
  public sabanasObs = this.sabanasBehaviorSubject.asObservable();
  
  public activeSilhouetteBehaviorSubject = new BehaviorSubject<SilhouetteData[]>(null);
  public activeSilhouetteObs = this.activeSilhouetteBehaviorSubject.asObservable();

  public recordsBehaviorSubject = new BehaviorSubject<RecordData[]>(null);
  public recordsObs = this.recordsBehaviorSubject.asObservable();

  public regionAlertsBehaviorSubject = new BehaviorSubject<RegionsAlertsData>(null);
  public regionAlertsObs = this.regionAlertsBehaviorSubject.asObservable();


  // public recordsDataBehaviorSubject = new BehaviorSubject<RecordsDataData[]>(null);
  // public recordsDataObs = this.recordsDataBehaviorSubject.asObservable();


  public userSoundBehaviorSubject = new BehaviorSubject<boolean>(false);
  public userSoundObs = this.userSoundBehaviorSubject.asObservable();

  public changePositionBehaviorSubject = new BehaviorSubject<boolean>(false);
  public changePositionObs = this.changePositionBehaviorSubject.asObservable();
  
  public createRecordBehaviorSubject = new BehaviorSubject<boolean>(false);
  public createRecordObs = this.createRecordBehaviorSubject.asObservable();

  public deleteRecordBehaviorSubject = new BehaviorSubject<boolean>(false);
  public deleteRecordObs = this.deleteRecordBehaviorSubject.asObservable();

  public finishRecordBehaviorSubject = new BehaviorSubject<boolean>(false);
  public finishRecordObs = this.finishRecordBehaviorSubject.asObservable();

  public stopRecordBehaviorSubject = new BehaviorSubject<boolean>(false);
  public stopRecordObs = this.stopRecordBehaviorSubject.asObservable();


  public startRecordBehaviorSubject = new BehaviorSubject<boolean>(false);
  public startRecordObs = this.startRecordBehaviorSubject.asObservable();


  public alarmBehaviorSubject = new BehaviorSubject<AlarmData[]>(null);
  public alarmObs = this.alarmBehaviorSubject.asObservable();
  
  public colorMapBehaviorSubject = new BehaviorSubject<ColorMapData>(null);
  public colorMapObs = this.colorMapBehaviorSubject.asObservable();

  public bedOrientationBehaviorSubject = new BehaviorSubject<BedOrientationData>(null);
  public bedOrientationObs = this.bedOrientationBehaviorSubject.asObservable();


  public repositioningBehaviorSubject = new BehaviorSubject<RepositioningData>(null);
  public repositioningObs = this.repositioningBehaviorSubject.asObservable();


  public createAlarmBehaviorSubject = new BehaviorSubject<boolean>(false);
  public createAlarmObs = this.createAlarmBehaviorSubject.asObservable();

  constructor(private authService: AuthService) { }

  public connect(): Observable<any> {
    if (this.messages) {
      return this.messages.pipe(share());
    }
    const token = this.authService.getToken();
    this.ws = new WebSocketSubject({
      url: this.CONSUMER_URL + token + '/',
      closeObserver: this.onclose,
      openObserver: this.onopen
    });
    return this.messages = this.ws
    .pipe(
      retryWhen(errors => errors.pipe(delay(this.reload_time))),
      map((msg: any) => {
        this.msgStateMachine(msg);
        return msg;
      }),
      share()
    );
  }


  send(msg: any) {
    this.ws.next(JSON.stringify(msg));
  }


  public close() {
    this.ws.complete();
  }

  private msgStateMachine(msg: any) {
    if (msg.hasOwnProperty('msg_type')) {
      const msg_type = msg['msg_type'];
      if (msg_type === 'response') {
        if (msg.hasOwnProperty('response')) {
          const response = msg['response'];
          if (response === 'get_sabanas') {
            if (msg.hasOwnProperty('details')) {
              const details = msg['details'];
              if (details.hasOwnProperty('data')) {
                const data = details['data'];
                this.sabanasBehaviorSubject.next(<SabanaData[]>data);
              }
            }
          } else if (response === 'get_region_alarms') {
            if (msg.hasOwnProperty('details')) {
              const details = msg['details'];
              if (details.hasOwnProperty('data')) {
                const data = details['data'];
                this.regionAlarmsBehaviorSubject.next(<RegionAlarmData[]>data);
              }
            }
          } else if (response === 'get_records') {
            if (msg.hasOwnProperty('details')) {
              const details = msg['details'];
              if (details.hasOwnProperty('data')) {
                const data = details['data'];
                this.recordsBehaviorSubject.next(<RecordData[]>data);
              }
            }
          } else if (response === 'user_sound') {
            if (msg.hasOwnProperty('details')) {
              const details = msg['details'];
              if (details.hasOwnProperty('sound')) {
                const sound = details['sound'];
                this.userSoundBehaviorSubject.next(<boolean>sound);
              }
            }
          } else if (response === 'get_active_silhouettes') {
            if (msg.hasOwnProperty('details')) {
              const details = msg['details'];
              if (details.hasOwnProperty('data')) {
                const data = details['data'];
                this.activeSilhouetteBehaviorSubject.next(<SilhouetteData[]>data);
              }
            }
          } else if (response === 'get_region_alerts') {
            if (msg.hasOwnProperty('details')) {
              const details = msg['details'];
              if (details.hasOwnProperty('data')) {
                const data = details['data'];
                this.regionAlertsBehaviorSubject.next(<RegionsAlertsData>data);
              }
            }
          } else if (response === 'get_sabanas_and_records') {
            if (msg.hasOwnProperty('details')) {
              const details = msg['details'];
              if (details.hasOwnProperty('data')) {
                const data = details['data'];
                this.sabanasAndRecordsBehaviorSubject.next(<SabanaAndRecordData[]>data);
              }
            }
          } else if (response === 'get_last_color_map') {
            if (msg.hasOwnProperty('details')) {
              const details = msg['details'];
              if (details.hasOwnProperty('data')) {
                const data = details['data'];
                this.colorMapBehaviorSubject.next(<ColorMapData>data);
              }
            }
          } else if (response === 'get_last_bed_orientation') {
            if (msg.hasOwnProperty('details')) {
              const details = msg['details'];
              if (details.hasOwnProperty('data')) {
                const data = details['data'];
                this.bedOrientationBehaviorSubject.next(<BedOrientationData>data);
              }
            }
          } else if (response === 'get_repositioning') {
            if (msg.hasOwnProperty('details')) {
              const details = msg['details'];
              if (details.hasOwnProperty('data')) {
                const data = details['data'];
                this.repositioningBehaviorSubject.next(<RepositioningData>data);
              }
            }
          } else if (response === 'get_bed_orientation') {
            if (msg.hasOwnProperty('details')) {
              const details = msg['details'];
              if (details.hasOwnProperty('data')) {
                const data = details['data'];
                this.bedOrientationBehaviorSubject.next(<BedOrientationData>data);
              }
            }
          } else if (response === 'change_position') {
            if (msg.hasOwnProperty('details')) {
              const details = msg['details'];
              if (details.hasOwnProperty('data')) {
                const data = details['data'];
                if (data.hasOwnProperty('isOk')) {
                  const isOK = data['isOk'];
                  this.changePositionBehaviorSubject.next(true);
                }
              }
            }
          } else if (response === 'create_record') {
            if (msg.hasOwnProperty('details')) {
              const details = msg['details'];
              if (details.hasOwnProperty('data')) {
                const data = details['data'];
                if (data.hasOwnProperty('isOk')) {
                  const isOK = data['isOk'];
                  this.createRecordBehaviorSubject.next(true);
                }
                // this.sabanasAndRecordsBehaviorSubject.next(<SabanaAndRecordData[]>data);
              }
            }
          } else if (response === 'finish_record') {
            if (msg.hasOwnProperty('details')) {
              const details = msg['details'];
              if (details.hasOwnProperty('data')) {
                const data = details['data'];
                if (data.hasOwnProperty('isOk')) {
                  const isOK = data['isOk'];
                  this.finishRecordBehaviorSubject.next(true);
                }
                // this.sabanasAndRecordsBehaviorSubject.next(<SabanaAndRecordData[]>data);
              }
            }
          } else if (response === 'delete_record') {
            if (msg.hasOwnProperty('details')) {
              const details = msg['details'];
              if (details.hasOwnProperty('data')) {
                const data = details['data'];
                if (data.hasOwnProperty('isOk')) {
                  const isOk = data['isOk'];
                  this.deleteRecordBehaviorSubject.next(true);
                }
                // this.sabanasAndRecordsBehaviorSubject.next(<SabanaAndRecordData[]>data);
              }
            }
          } else if (response === 'finish_record') {
            if (msg.hasOwnProperty('details')) {
              const details = msg['details'];
              if (details.hasOwnProperty('data')) {
                const data = details['data'];
                if (data.hasOwnProperty('isOk')) {
                  const isOk = data['isOk'];
                  this.finishRecordBehaviorSubject.next(true);
                }
                // this.sabanasAndRecordsBehaviorSubject.next(<SabanaAndRecordData[]>data);
              }
            }
          } else if (response === 'stop_record') {
            if (msg.hasOwnProperty('details')) {
              const details = msg['details'];
              if (details.hasOwnProperty('data')) {
                const data = details['data'];
                if (data.hasOwnProperty('isOk')) {
                  const isOk = data['isOk'];
                  this.stopRecordBehaviorSubject.next(true);
                }
                // this.sabanasAndRecordsBehaviorSubject.next(<SabanaAndRecordData[]>data);
              }
            }
          } else if (response === 'start_record') {
            if (msg.hasOwnProperty('details')) {
              const details = msg['details'];
              if (details.hasOwnProperty('data')) {
                const data = details['data'];
                if (data.hasOwnProperty('isOk')) {
                  const isOk = data['isOk'];
                  this.startRecordBehaviorSubject.next(true);
                }
                // this.sabanasAndRecordsBehaviorSubject.next(<SabanaAndRecordData[]>data);
              }
            }
          } else if (response === 'get_alarms') {
            if (msg.hasOwnProperty('details')) {
              const details = msg['details'];
              if (details.hasOwnProperty('data')) {
                const data = details['data'];
                this.alarmBehaviorSubject.next(<AlarmData[]>data);
              }
            }
          } else if (response === 'create_alarms') {
            if (msg.hasOwnProperty('details')) {
              const details = msg['details'];
              if (details.hasOwnProperty('data')) {
                const data = details['data'];
                if (data.hasOwnProperty('isOk')) {
                  const isOk = data['isOk'];
                  this.createAlarmBehaviorSubject.next(true);
                }
                // this.sabanasAndRecordsBehaviorSubject.next(<SabanaAndRecordData[]>data);
              }
            }
          }
        }
      }
    }
  }

}
