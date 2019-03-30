import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RecordData } from '../../classes/record-data';
import { WebSocketService } from '../../services/websocket.service';
import { UserService } from '../../services/user.service';
import { RepositioningData } from '../../classes/repositioning-data';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.css']
})
export class MonitoringComponent implements OnInit, OnDestroy, AfterViewInit {
  // fxFlex fxFlex.xs="100" fxFlex.sm="70" fxFlex.sm="70" fxFlex.gt-sm="45"

  @ViewChild('responsiveCardContainer') responsive_card_container: ElementRef;
  browserRefresh = false;
  /**
   * Records que se obtienen vía websocket
   */
  records: RecordData[];

  recordsSubcription: Subscription;
  browserRefreshSubscription: Subscription;
  // changePositionSubscription: Subscription;

  responsive_card: number;
  responsive_min_width: string;

  constructor(public wsService: WebSocketService, private userService: UserService, private router: Router) {
    this.browserRefreshSubscription = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.browserRefresh = !router.navigated;
      }
    });
    window.onresize = e => {
      this.setFxFlexValue(window.innerWidth);
    };
  }


  setFxFlexValue(width) {
    if (width < 600) {
      this.responsive_min_width = '390px';
    } else {
      this.responsive_min_width = '600px';
    }
  }

  ngOnInit() {
    this.userService.userObs.subscribe(msg => {
      if (msg !== null) {
        this.obtainSubscriptions();
        this.wsService.send({
          'msg_type': 'request',
          'request': 'get_records',
          'details': {
            'user': this.userService.userSubject.getValue().id
          }
        });
      }
    });
  }

  ngAfterViewInit() {
    // this.setFxFlexValue(window.innerWidth);
  }

  obtainSubscriptions() {
    this.wsService.connect().subscribe(msg => {      });
    this.recordsSubcription = this.wsService.recordsObs.subscribe((msg: RecordData[]) => {
      if (JSON.stringify(this.records) !== JSON.stringify(msg)) {
        this.records = msg;
        this.setFxFlexValue(window.innerWidth);
      }
      console.log(this.records);
    });
    // this.changePositionSubscription = this.wsService.changePositionObs.subscribe( (msg) => {
    //   if (msg !== null && msg === true) {
    //     this.wsService.changePositionBehaviorSubject.next(false);
    //     this.wsService.send({
    //       'msg_type': 'request',
    //       'request': 'get_records',
    //       'details': {
    //         'user': this.userService.userSubject.getValue().id
    //       }
    //     });
    //   }
    // });
  }

  ngOnDestroy() {
    this.recordsSubcription.unsubscribe();
    this.browserRefreshSubscription.unsubscribe();
    // this.changePositionSubscription.unsubscribe();
    // this.wsService.recordsBehaviorSubject.complete();
  }

}
