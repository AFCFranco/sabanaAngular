import { DataSource } from '@angular/cdk/table';
import { SabanaAndRecordData } from './sabana-and-record-data';
import { BehaviorSubject, Subscription, Observable, of } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { WebSocketService } from '../services/websocket.service';
import { UserService } from '../services/user.service';
import { catchError, finalize } from 'rxjs/operators';

export class SabanasAndRecordDataSource implements DataSource<SabanaAndRecordData> {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private sabanasAndRecordSubscription: Subscription;
  public loading$ = this.loadingSubject.asObservable();

  constructor(private wsService: WebSocketService, private userService: UserService) { }

  connect(collectionViewer: CollectionViewer): Observable<SabanaAndRecordData[]> {
    return this.wsService.sabanasAndRecordsObs;
  }

  disconnect() {
    this.loadingSubject.complete();
    this.sabanasAndRecordSubscription.unsubscribe();
  }

  loadSabanasAndRecords() {
    this.loadingSubject.next(true);
    this.wsService.send({
      'msg_type': 'request',
      'request': 'get_sabanas_and_records',
      'details': {
        'user': this.userService.userSubject.getValue().id
      }
    });
    if (this.sabanasAndRecordSubscription === undefined) {
      this.sabanasAndRecordSubscription = this.wsService.sabanasAndRecordsObs
        .pipe(
          catchError(() => of([])),
          finalize(() => this.loadingSubject.next(false))
        ).subscribe(msg => {
          console.log(msg);
          this.loadingSubject.next(false);
          return msg;
        });
    }
  }

}
