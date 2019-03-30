import { Component, OnInit, Input } from '@angular/core';
import { RecordData } from '../classes/record-data';
import { RepositioningData } from '../classes/repositioning-data';
import { Subscription } from 'rxjs';
import { WebSocketService } from '../services/websocket.service';

@Component({
  selector: 'app-repositioning-silhouette',
  templateUrl: './repositioning-silhouette.component.html',
  styleUrls: ['./repositioning-silhouette.component.css']
})
export class RepositioningSilhouetteComponent implements OnInit {

  // @Input() silhouette: string;
  @Input() record: RecordData;
  lastRepositioning: RepositioningData;
  repositioningSubscription: Subscription;

  postionChoices = {
  'DS': 'Decubito supino',
  'DP': 'Decubito prono',
  'DLI': 'Decubito Lat izq',
  'DLD': 'Decubito lat der',
  };

  constructor(private wsService: WebSocketService) { }

  ngOnInit() {
    this.obtainSubscriptions();
  }

  obtainSubscriptions() {
    this.repositioningSubscription = this.wsService.repositioningObs.subscribe( (msg: RepositioningData) => {
      if (JSON.stringify(this.lastRepositioning) !== JSON.stringify(msg)) {
        if (msg !== null && msg.record === this.record.id) {
          this.lastRepositioning = msg;
        }
      }
    });
    this.wsService.send({
      'msg_type': 'request',
      'request': 'get_repositioning',
      'details': {
        'record': this.record.id
      }
    });
  }

}
