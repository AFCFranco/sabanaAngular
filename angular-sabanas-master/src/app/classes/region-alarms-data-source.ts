import { DataSource } from '@angular/cdk/table';
import { RegionAlarmData } from './region-alarm-data';
import { BehaviorSubject, Subscription, Observable, of } from 'rxjs';
import { WebSocketService } from '../services/websocket.service';
import { CollectionViewer } from '@angular/cdk/collections';
import { catchError, finalize } from 'rxjs/operators';

export class RegionAlarmsDataSource implements DataSource<RegionAlarmData> {


  // private loadingSubject = new BehaviorSubject<boolean>(false);
  // public loading$ = this.loadingSubject.asObservable();

  public regionAlarmsBehaviorSubject = new BehaviorSubject<RegionAlarmData[]>(null);
  public regionAlarmsObs = this.regionAlarmsBehaviorSubject.asObservable();

  private regionAlarmsSubscription: Subscription;

  constructor(private wsService: WebSocketService, private repositioning_id: number) {}

  connect(collectionViewer: CollectionViewer): Observable<RegionAlarmData[]> {
    return this.regionAlarmsObs;
  }

  disconnect() {
    // this.loadingSubject.complete();
    this.regionAlarmsSubscription.unsubscribe();
    // this.regionAlarmsBehaviorSubject.complete();
  }

  loadRegionAlarmsRecords() {
    // this.loadingSubject.next(true);
    this.wsService.send({
      'msg_type': 'request',
      'request': 'get_region_alarms',
      'details': {
        'repositioning': this.repositioning_id
      }
    });
    if (this.regionAlarmsSubscription === undefined) {
      this.regionAlarmsSubscription = this.wsService.regionAlarmsObs
        .pipe(
          catchError(() => of([])),
          // finalize(() => this.loadingSubject.next(false))
        ).subscribe((msg: RegionAlarmData[]) => {
          if (msg != null && msg[0].repositioning === this.repositioning_id) {
            if (this.regionAlarmsBehaviorSubject.value === null ||
              JSON.stringify(this.regionAlarmsBehaviorSubject.value) !== JSON.stringify(msg)) {
              this.regionAlarmsBehaviorSubject.next(msg);
              console.log(msg);
            }
          }
          // this.loadingSubject.next(false);
          return msg;
        });
    }
  }
}
