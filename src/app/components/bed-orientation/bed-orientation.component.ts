import { Component, OnInit, Input, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Subscription, interval, BehaviorSubject } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { BedOrientationData } from '../../classes/bed-orientation-data';
import { WebSocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-bed-orientation',
  templateUrl: './bed-orientation.component.html',
  styleUrls: ['./bed-orientation.component.css']
})
export class BedOrientationComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() record_id: number;
  @ViewChild('svgContainer') svg_container;
  @ViewChild('bed-l1') bed_l1;
  @ViewChild('bed-l2') bed_l2;

  bedOrientationSubcription: Subscription;
  bedOrientationIntervalSubcription: Subscription;

  public lastBedOrientationBehaviorSubject = new BehaviorSubject<BedOrientationData>(null);
  public lastBedOrientationObs = this.lastBedOrientationBehaviorSubject.asObservable();

  bCoord = {
    'e1': {
      'x1': 100,
      'y1': 100,
      'x2': 50,
      'y2': 50
    }
  };

  constructor(public wsService: WebSocketService) {
    // window.onresize = e => {
    //   this.drawBed(this.lastBedOrientationBehaviorSubject.value.o1, this.lastBedOrientationBehaviorSubject.value.o2);
    // };
  }

  ngOnInit() {
    // console.log('*****************');
    // console.log(this.record_id);
    this.obtainSubscriptions();
    this.createIntervals();
  }

  ngAfterViewInit() {
    // if (this.lastBedOrientationBehaviorSubject.value !== null) {
    //   this.drawBed(this.lastBedOrientationBehaviorSubject.value.o1, this.lastBedOrientationBehaviorSubject.value.o2);
    // }
  }



  public obtainSubscriptions() {
    this.bedOrientationSubcription = this.wsService.bedOrientationObs.subscribe((msg: BedOrientationData) => {
      if (JSON.stringify(this.lastBedOrientationBehaviorSubject.value) !== JSON.stringify(msg)) {
        if (msg !== null && msg.record === this.record_id) {
          // console.log(`lastBed: ${this.lastBedOrientationBehaviorSubject.value}
          // record_id: ${this.record_id}
          // msg.record: ${msg.record}`);
          // this.lastBedOrientation = msg;
          this.lastBedOrientationBehaviorSubject.next(msg);
          this.drawBed(msg.o1, msg.o2);
          // console.log(msg);
        }
      }
    });
  }

  public createIntervals() {
    this.bedOrientationIntervalSubcription = interval(5000)
      .pipe(startWith(100)).subscribe(res => {
        if (!this.record_id) {
          return;
        }
        this.wsService.send({
          'msg_type': 'request',
          'request': 'get_last_bed_orientation',
          'details': {
            'record': this.record_id
          }
        });
      });
  }

  public drawBed(o1, o2) {
    // const width = document.getElementById('svg-container').getBoundingClientRect().width;
    // const height = document.getElementById('svg-container').getBoundingClientRect().height;
    const bed_l1 = this.svg_container.nativeElement.getElementById('bed-l1');
    const bed_l3 = this.svg_container.nativeElement.getElementById('bed-l3');
    bed_l1.setAttribute('transform', 'rotate(' + (o1) + ' 35 30)');
    bed_l3.setAttribute('transform', 'rotate(' + (360 - Number(o2)) + ' 105 30)');

    //  const grap1 = this.svg_container.nativeElement.getElementById('grap1');
    //  grap1.setAttribute('transform', 'rotate(' + (o1) + ' 70 50)');
    // const g2 = this.svg_container.nativeElement.getElementById('g8601');
    // g1.setAttribute('transform', 'rotate(10 50 50)');
  }


  ngOnDestroy() {
    if (this.bedOrientationSubcription !== undefined) {
      this.bedOrientationSubcription.unsubscribe();
    }
    if (this.bedOrientationIntervalSubcription !== undefined) {
      this.bedOrientationIntervalSubcription.unsubscribe();
    }

  }

}
